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
export const fetchProviderList = async (cacheKey, apiEndpoint, dataField) => {
  try {
    // Check if providers are already cached in memory
    if (productCache.has(cacheKey)) {
      return {
        providers: productCache.get(cacheKey),
        error: null
      };
    }

    // Check if providers are cached in AsyncStorage
    const cachedData = await AsyncStorage.getItem(`${cacheKey}_cache`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      // Store in memory cache as well
      productCache.set(cacheKey, parsedData);
      return {
        providers: parsedData,
        error: null
      };
    }

    // Fetch from API
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

    // More specific error handling based on status code
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