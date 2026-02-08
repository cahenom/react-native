import { useState, useEffect, useMemo, useRef } from 'react';
import { Alert } from 'react-native';
import { api } from '../utils/api';
import usePersistentState from './usePersistentState';

/**
 * Custom hook for managing topup products
 * @param {string} provider - The provider name
 * @param {string} title - The title to display
 * @param {string} endpoint - The API endpoint to fetch products from
 * @param {string} cacheKeyPrefix - The prefix for the cache key
 * @param {number} cacheDuration - Duration in milliseconds to cache data (default: 1 hour instead of 24 hours)
 * @returns {Object} - The state and functions for managing topup products
 */
export default function useTopupProducts(provider, title, endpoint, cacheKeyPrefix, cacheDuration = 60 * 60 * 1000) { // 1 hour instead of 24
  const [customer_no, setCustomerNo] = useState('');
  const [selectItem, setSelectItem] = useState(null);
  const [products, setProducts, isLoadingFromHook, , checkCacheExpired, checkNeedsBackgroundRefresh] = usePersistentState(`${cacheKeyPrefix}_${provider}_products`, [], cacheDuration);
  const [loading, setLoading] = useState(false);
  const [isCacheExpiredState, setIsCacheExpiredState] = useState(false);
  const hasFetchedRef = useRef({}); // Track if products have been fetched for each provider
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Memoized sorted products to avoid re-sorting on every render
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  // RESET LOGIC: Clear selected product if customer number changes
  // This prevents the "stale data" bug where a user selects a product for Number A,
  // then changes to Number B but accidentally clicks confirm with the old selection.
  useEffect(() => {
    if (selectItem) {
      console.log('Resetting selected product because customer number changed');
      setSelectItem(null);
    }
  }, [customer_no]);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted components

    const initializeProducts = async () => {
      const providerKey = `${cacheKeyPrefix}_${provider}`;
      const hasFetchedForThisProvider = hasFetchedRef.current[providerKey];

      console.log('initializeProducts called for provider:', provider, 'isLoadingFromHook:', isLoadingFromHook, 'hasFetchedForThisProvider:', hasFetchedForThisProvider);

      // Wait for persistent state to load
      if (!isLoadingFromHook) {
        // Check if cache is expired (including daily check)
        const cacheExpired = await checkCacheExpired();

        console.log('Cache status for provider:', provider, 'cacheExpired:', cacheExpired, 'products.length:', products.length);

        if (isMounted) {
          setIsCacheExpiredState(cacheExpired);

          // SMART DAILY CACHE STRATEGY:
          if (products.length === 0) {
            // 1. No data at all? Fetch immediately with loading state
            setLoading(true);
            console.log('No data, fetching fresh products for provider:', provider);
            hasFetchedRef.current[providerKey] = true;
            await fetchProductsByProvider();
          } else if (cacheExpired) {
            // 2. Data from different day? Show skeleton and fetch fresh
            setLoading(true);
            console.log('Cache from different day, forcing fresh fetch for provider:', provider);
            hasFetchedRef.current[providerKey] = true;
            await fetchProductsByProvider();
          } else {
            // 3. Valid cache? Use it instantly, then background refresh will handle sync
            console.log('Using valid daily cache for provider:', provider);
            setLoading(false);
            // Re-trigger background refresh if not already done in this session
            if (!hasFetchedForThisProvider) {
              hasFetchedRef.current[providerKey] = true;
              checkAndRefreshInBackground();
            }
          }
        }
      }
    };

    initializeProducts();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, [provider, isLoadingFromHook, checkCacheExpired, cacheKeyPrefix]); // Keep original dependencies to avoid infinite loops

  const fetchProductsByProvider = async () => {
    try {
      console.log(`Attempting to fetch products for provider: ${provider}`);

      const response = await api.post(endpoint);

      console.log('Response status:', response.status);
      console.log('Full response:', response);
      console.log('Response data:', response.data);

      if (response.data && response.data.data) {
        // Special handling for masa aktif which has different response structure
        let allProducts = [];
        if (endpoint.includes('/api/product/masaaktif')) {
          if (response.data.status === "success" && response.data.data && response.data.data.masa_aktif) {
            allProducts = response.data.data.masa_aktif || [];
          } else {
            console.log('Unexpected masa aktif response structure:', response.data);
            Alert.alert('Error', response.data.message || 'Struktur data tidak sesuai. Silakan hubungi administrator.');
            return;
          }
        } else if (endpoint.includes('/api/product/games')) {
          allProducts = response.data.data.games || [];
        } else if (endpoint.includes('/api/product/emoney')) {
          allProducts = response.data.data.emoney || [];
        } else if (endpoint.includes('/api/product/tv')) {
          allProducts = response.data.data.tv || [];
        } else if (endpoint.includes('/api/product/voucher')) {
          allProducts = response.data.data.voucher || [];
        } else {
          // For generic handling
          const dataKeys = Object.keys(response.data.data);
          if (dataKeys.length > 0) {
            allProducts = response.data.data[dataKeys[0]] || [];
          }
        }

        console.log('All products for provider:', allProducts);
        console.log('Selected provider:', provider);

        const filteredProducts = allProducts.filter(item => item.provider === provider);
        console.log('Filtered products:', filteredProducts);

        const transformedProducts = filteredProducts.map(item => ({
          id: item.id,
          label: item.name,
          price: item.price,
          desc: item.desc,
          category: item.category,
          sku: item.sku,
          multi: item.multi
        }));

        console.log('Transformed products:', transformedProducts);

        // Save products to persistent state
        await setProducts(transformedProducts);

        // If no products were found, reset the fetch flag to allow another attempt
        if (transformedProducts.length === 0) {
          const providerKey = `${cacheKeyPrefix}_${provider}`;
          hasFetchedRef.current[providerKey] = false;
        }
      } else {
        console.log('Unexpected response structure:', response.data);
        Alert.alert('Error', 'Struktur data tidak sesuai. Silakan hubungi administrator.');
        // Reset the fetch flag to allow another attempt
        const providerKey = `${cacheKeyPrefix}_${provider}`;
        hasFetchedRef.current[providerKey] = false;
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });

      // Check if it's a network error (offline/cannot connect)
      if (!error.response) {
        // This is likely a network error (offline, timeout, etc.)
        console.warn('Network error - device might be offline:', error.message);
        // Don't show an alert for network errors, just use cached data
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Autentikasi gagal. Token mungkin sudah kadaluarsa.');
      } else {
        // For other errors (404, 500, etc.), show a generic message
        Alert.alert('Error', 'Gagal menghubungi server. Pastikan koneksi internet stabil.');
      }

      // For network errors, don't reset the fetch flag to prevent continuous retries when offline
      if (error.response) {
        // Reset the fetch flag to allow another attempt (only for server errors, not network errors)
        const providerKey = `${cacheKeyPrefix}_${provider}`;
        hasFetchedRef.current[providerKey] = false;
      }
      // For network errors, keep the fetch flag as true to prevent continuous retries
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const checkAndRefreshInBackground = async () => {
    if (products.length > 0) {
      try {
        console.log(`Background revalidation for provider: ${provider}`);
        const response = await api.post(endpoint);
        if (response.data && response.data.data) {
          let allProducts = [];
          if (endpoint.includes('/api/product/masaaktif')) {
            if (response.data.status === "success" && response.data.data && response.data.data.masa_aktif) {
              allProducts = response.data.data.masa_aktif || [];
            }
          } else if (endpoint.includes('/api/product/games')) {
            allProducts = response.data.data.games || [];
          } else if (endpoint.includes('/api/product/emoney')) {
            allProducts = response.data.data.emoney || [];
          } else if (endpoint.includes('/api/product/tv')) {
            allProducts = response.data.data.tv || [];
          } else if (endpoint.includes('/api/product/voucher')) {
            allProducts = response.data.data.voucher || [];
          } else {
            const dataKeys = Object.keys(response.data.data);
            if (dataKeys.length > 0) {
              allProducts = response.data.data[dataKeys[0]] || [];
            }
          }

          const filteredProducts = allProducts.filter(item => item.provider === provider);
          const transformedProducts = filteredProducts.map(item => ({
            id: item.id,
            label: item.name,
            price: item.price,
            desc: item.desc,
            category: item.category,
            sku: item.sku,
            multi: item.multi
          }));

          // Update state silently
          await setProducts(transformedProducts);
        }
      } catch (error) {
        console.warn('Background sync failed:', error.message);
      }
    }
  };

  // Effect to handle background refresh if needed (always check on mount if products exist)
  useEffect(() => {
    if (!isLoadingFromHook) {
      checkAndRefreshInBackground();
    }
  }, [isLoadingFromHook, provider, endpoint]);

  const resetInput = () => {
    setCustomerNo('');
  };

  const validateInputs = () => {
    const errors = {};

    if (!customer_no) {
      errors.customer_no = true;
    }

    if (!selectItem) {
      errors.selectItem = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  return {
    customer_no,
    setCustomerNo,
    selectItem,
    setSelectItem,
    sortedProducts,
    loading,
    showConfirmation,
    setShowConfirmation,
    fetchProductsByProvider,
    resetInput,
    title,
    validationErrors,
    validateInputs,
    clearValidationErrors
  };
}