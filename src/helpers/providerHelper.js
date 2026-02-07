import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

// Cache to store fetched products with timestamp
const productCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Generic function to fetch provider lists with caching and error handling
 * @param {string} cacheKey - The cache key for this provider type
 * @param {string} apiEndpoint - The API endpoint to fetch from
 * @param {string} dataField - The field in the response that contains the products
 * @returns {Promise<{providers: Array, error: string|null}>}
 */
export const fetchProviderList = async (cacheKey, apiEndpoint, dataField, forceRefresh = false) => {
  let cachedData = null;

  // Check if providers are already cached in memory
  if (productCache.has(cacheKey)) {
    const cachedEntry = productCache.get(cacheKey);
    const now = Date.now();
    if (now - cachedEntry.timestamp < CACHE_TTL && !forceRefresh) {
      console.log(`Using in-memory cache for ${cacheKey}`);
      return {
        providers: cachedEntry.providers,
        error: null
      };
    }
  }

  // Check if providers are cached in AsyncStorage
  if (!forceRefresh) {
    const cachedString = await AsyncStorage.getItem(`${cacheKey}_cache`);
    if (cachedString) {
      const cachedData = JSON.parse(cachedString);
      const now = Date.now();
      
      // If cache is valid (has providers and is not expired)
      if (cachedData && cachedData.providers && (now - cachedData.timestamp < CACHE_TTL)) {
        console.log(`Using AsyncStorage cache for ${cacheKey}`);
        // Store in memory cache as well
        productCache.set(cacheKey, cachedData);
        return {
          providers: cachedData.providers,
          error: null
        };
      }
    }
  }

  // If no cached data or forcing refresh, fetch from API
  try {
    const response = await api.post(apiEndpoint);

    if (response.data && response.data.data && response.data.data[dataField]) {
      const allProducts = response.data.data[dataField];
      const uniqueProviders = [...new Set(allProducts.map(item => item.provider))];
      const cacheData = {
        providers: uniqueProviders,
        timestamp: Date.now()
      };

      // Cache the providers in memory
      productCache.set(cacheKey, cacheData);

      // Cache the providers in AsyncStorage for persistence
      await AsyncStorage.setItem(`${cacheKey}_cache`, JSON.stringify(cacheData));

      return {
        providers: uniqueProviders,
        error: null
      };
    } else {
      // If API returns unexpected structure but we have cached data, return cached data
      if (cachedData) {
        return {
          providers: cachedData,
          error: null
        };
      }
      return {
        providers: [],
        error: 'Struktur data tidak sesuai. Silakan hubungi administrator.'
      };
    }
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });

    // If there's cached data available, return it without error regardless of fetch failure
    if (cachedData) {
      console.log(`Using cached data for ${cacheKey} due to fetch error`);
      return {
        providers: cachedData,
        error: null  // No error when using cached data
      };
    }

    // More specific error handling based on status code when no cached data exists
    let errorMessage = '';
    if (error.response?.status === 405) {
      errorMessage = 'Terjadi kesalahan teknis. Silakan coba beberapa saat lagi.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Layanan sementara tidak tersedia. Silakan coba beberapa saat lagi.';
    } else if (error.response?.status === 0 || !error.response) {
      errorMessage = 'Periksa koneksi internet Anda dan coba lagi.';
    } else {
      errorMessage = 'Gagal memuat daftar provider. Silakan coba beberapa saat lagi.';
    }

    return {
      providers: [],
      error: errorMessage
    };
  }
};