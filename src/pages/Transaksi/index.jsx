import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Load cached transactions on component mount
  useEffect(() => {
    loadCachedTransactions();
  }, []);

  const loadCachedTransactions = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('user_transactions');
      if (cachedData) {
        setTransactions(JSON.parse(cachedData));
      }
      // Fetch fresh data after loading cache
      fetchTransactions();
    } catch (error) {
      console.error('Error loading cached transactions:', error);
      fetchTransactions(); // Still try to fetch fresh data
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // Using POST method as suggested
      const response = await api.post('/api/user/transaksi');

      if (response.data.status) {
        const fetchedTransactions = response.data.data;
        setTransactions(fetchedTransactions);

        // Cache the transactions
        await AsyncStorage.setItem('user_transactions', JSON.stringify(fetchedTransactions));
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Handle different error types
      if (error.response?.status === 405) {
        Alert.alert('Error', 'Gangguan jaringan. Silakan coba lagi nanti.');
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Unauthorized access. Please login again.');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'Endpoint not found. Please check API configuration.');
      } else if (error.response?.status === 0) {
        Alert.alert('Error', 'Gangguan koneksi jaringan. Silakan periksa koneksi internet Anda.');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Gangguan sistem. Silakan coba lagi nanti.');
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'berhasil':
      case 'sukses':
      case 'success':
        return '#01C1A2'; // Green
      case 'gagal':
      case 'failed':
      case 'error':
        return '#EF4444'; // Red
      case 'pending':
      case 'diproses':
      case 'processing':
        return '#F59E0B'; // Yellow
      default:
        return '#94A3B8'; // Gray
    }
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => navigation.navigate('SuccessNotif', {
        item: {
          id: item.id,
          transaction_code: item.transaction_code,
          transaction_date: item.transaction_date,
          transaction_time: item.transaction_time,
          transaction_type: item.transaction_type,
          transaction_provider: item.transaction_provider,
          transaction_number: item.transaction_number,
          transaction_sku: item.transaction_sku,
          transaction_cost: item.transaction_cost,
          transaction_profit: item.transaction_profit,
          transaction_total: item.transaction_total,
          transaction_message: item.transaction_message,
          transaction_status: item.transaction_status,
          transaction_user_id: item.transaction_user_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          // Map to SuccessNotif expected fields with proper status values
          status: item.transaction_status,
          data: { status: item.transaction_status }, // Also include in data object for SuccessNotif checks
          customer_no: item.transaction_number,
          message: item.transaction_message,
          sn: item.transaction_code, // Using transaction code as serial number
          ref_id: item.id // Using transaction ID as reference ID
        },
        product: {
          product_name: item.transaction_type,
          name: item.transaction_type,
          label: item.transaction_type,
          product_seller_price: `Rp ${item.transaction_total?.toLocaleString('id-ID')}`,
          price: `Rp ${item.transaction_total?.toLocaleString('id-ID')}`
        }
      })}
    >
      <View style={styles.leftSection}>
        <Text style={styles.transactionType}>{item.transaction_type}</Text>
        <Text style={styles.transactionNumber}>{item.transaction_number}</Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.transaction_date)} • {item.transaction_time}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.transaction_status) }]}>
          <Text style={styles.statusText}>{item.transaction_status}</Text>
        </View>
        <Text style={styles.transactionAmount}>Rp {item.transaction_total?.toLocaleString('id-ID')}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#138EE9" />
        <Text style={styles.loadingText}>Memuat transaksi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
        <Text style={styles.headerSubtitle}>Daftar transaksi Anda</Text>
      </View>
      
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum pernah transaksi</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#374957',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374957',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374957',
  },
  transactionNumber: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374957',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
  },
});

export default Transaksi;