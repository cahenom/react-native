import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

// Cache to store fetched products
const productCache = new Map();

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
    cachedData = productCache.get(cacheKey);
  } else {
    // Check if providers are cached in AsyncStorage
    const cachedString = await AsyncStorage.getItem(`${cacheKey}_cache`);
    if (cachedString) {
      cachedData = JSON.parse(cachedString);
      // Store in memory cache as well
      productCache.set(cacheKey, cachedData);
    }
  }

  // If we have cached data and not forcing refresh, return it immediately without fetching
  if (cachedData && !forceRefresh) {
    console.log(`Using cached data for ${cacheKey} without fetching`);
    return {
      providers: cachedData,
      error: null
    };
  }

  // If no cached data or forcing refresh, fetch from API
  try {
    const response = await api.post(apiEndpoint);

    if (response.data && response.data.data && response.data.data[dataField]) {
      const allProducts = response.data.data[dataField];
      const uniqueProviders = [...new Set(allProducts.map(item => item.provider))];

      // Cache the providers in memory
      productCache.set(cacheKey, uniqueProviders);

      // Cache the providers in AsyncStorage for persistence
      await AsyncStorage.setItem(`${cacheKey}_cache`, JSON.stringify(uniqueProviders));

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