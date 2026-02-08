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
/**
 * Generic function to fetch provider lists with Smart Daily Cache strategy:
 * 1. Instant Load from cache if it's from the same day.
 * 2. Background sync to keep data fresh.
 * 3. Force fresh fetch if it's a new day.
 */
export const fetchProviderList = async (cacheKey, apiEndpoint, dataField, forceRefresh = false) => {
  let cachedData = null;
  const storageKey = `${cacheKey}_cache`;

  // 1. Load from AsyncStorage immediately
  const cachedString = await AsyncStorage.getItem(storageKey);
  if (cachedString) {
    try {
      const parsed = JSON.parse(cachedString);
      const cachedDate = new Date(parsed.timestamp).toDateString();
      const currentDate = new Date().toDateString();

      // If same day and not forcing refresh, use it immediately
      if (cachedDate === currentDate && !forceRefresh) {
        cachedData = parsed.providers;
        
        // Trigger background refresh silently
        setTimeout(() => {
          backgroundSyncProviders(cacheKey, apiEndpoint, dataField);
        }, 100);

        return {
          providers: cachedData,
          error: null
        };
      }
    } catch (e) {
      console.warn('Error parsing cache:', e);
    }
  }

  // 2. If no valid same-day cache or forceRefresh, fetch from API immediately (Online-first)
  return await backgroundSyncProviders(cacheKey, apiEndpoint, dataField);
};

/**
 * Perform actual network fetch and update cache
 */
const backgroundSyncProviders = async (cacheKey, apiEndpoint, dataField) => {
  try {
    const response = await api.post(apiEndpoint);

    if (response.data && response.data.data && response.data.data[dataField]) {
      const allProducts = response.data.data[dataField];
      const uniqueProviders = [...new Set(allProducts.map(item => item.provider))];
      const cacheData = {
        providers: uniqueProviders,
        timestamp: Date.now()
      };

      // Cache for persistence
      await AsyncStorage.setItem(`${cacheKey}_cache`, JSON.stringify(cacheData));

      return {
        providers: uniqueProviders,
        error: null
      };
    } else {
      return {
        providers: [],
        error: 'Struktur data tidak sesuai.'
      };
    }
  } catch (error) {
    console.error(`Background sync failed for ${cacheKey}:`, error.message);
    
    // On error, try to return whatever we have in cache even if it's old
    const cachedString = await AsyncStorage.getItem(`${cacheKey}_cache`);
    if (cachedString) {
      const parsed = JSON.parse(cachedString);
      return {
        providers: parsed.providers,
        error: null // Silently use old cache if network fails
      };
    }

    return {
      providers: [],
      error: 'Terjadi kesalahan jaringan. Coba lagi nanti.'
    };
  }
};