import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {api} from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DARK_BACKGROUND,
  DARK_COLOR,
  LIGHT_BACKGROUND,
  LIGHT_COLOR,
  WHITE_COLOR,
  GREY_COLOR,
  SLATE_COLOR,
} from '../../utils/const';

const Transaksi = () => {
  const isDarkMode = useColorScheme() === 'dark';
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
        const parsedData = JSON.parse(cachedData);
        // Ensure parsedData is an array
        if (Array.isArray(parsedData)) {
          setTransactions(parsedData);
        } else {
          setTransactions([]);
        }
      } else {
        setTransactions([]);
      }
      // Fetch fresh data after loading cache
      fetchTransactions();
    } catch (error) {
      console.error('Error loading cached transactions:', error);
      setTransactions([]);
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
        // Handle the new API response structure
        let fetchedTransactions = response.data.data || [];

        // Ensure fetchedTransactions is an array
        if (!Array.isArray(fetchedTransactions)) {
          fetchedTransactions = [];
        }

        // Validate each transaction object to ensure required fields exist
        const validatedTransactions = fetchedTransactions.map(transaction => ({
          ref: transaction.ref || '-',
          tujuan: transaction.tujuan || '-',
          sku: transaction.sku || '-',
          status: transaction.status || '-',
          message: transaction.message || '-',
          price:
            transaction.price !== undefined && transaction.price !== null
              ? typeof transaction.price === 'number'
                ? transaction.price
                : typeof transaction.price === 'string'
                ? parseFloat(transaction.price) || 0
                : 0
              : 0,
          sn: transaction.sn || '-',
          type: transaction.type || '-',
          created_at: transaction.created_at || '-',
        }));

        setTransactions(validatedTransactions);

        // Cache the transactions
        await AsyncStorage.setItem(
          'user_transactions',
          JSON.stringify(validatedTransactions),
        );
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to fetch transactions',
        );
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Handle different error types
      if (error.response?.status === 405) {
        Alert.alert('Error', 'Gangguan jaringan. Silakan coba lagi nanti.');
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Unauthorized access. Please login again.');
      } else if (error.response?.status === 404) {
        Alert.alert(
          'Error',
          'Endpoint not found. Please check API configuration.',
        );
      } else if (error.response?.status === 0) {
        Alert.alert(
          'Error',
          'Gangguan koneksi jaringan. Silakan periksa koneksi internet Anda.',
        );
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message ||
            'Gangguan sistem. Silakan coba lagi nanti.',
        );
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const formatDate = dateString => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = status => {
    if (!status) return '#94A3B8'; // Gray for undefined/null

    switch (status.toLowerCase()) {
      case 'berhasil':
      case 'sukses':
      case 'success':
        return '#01C1A2'; // Green
      case 'gagal':
      case 'failed':
      case 'error':
      case 'none':
        return '#EF4444'; // Red
      case 'pending':
      case 'diproses':
      case 'processing':
        return '#F59E0B'; // Yellow
      default:
        return '#94A3B8'; // Gray
    }
  };

  const renderTransactionItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.transactionItem,
        {backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_COLOR},
      ]}
      onPress={() => {
        // Jika tipe transaksi adalah merchant_request dan statusnya pending, arahkan ke halaman pembayaran
        if (item.type === 'merchant_request' && item.status === 'pending') {
          // Buat objek payment request untuk dikirim ke halaman pembayaran
          // Gunakan ID internal dari payment request jika tersedia, jika tidak gunakan ref
          const paymentRequest = {
            id: item.internal_id || item.ref, // Gunakan ID internal jika tersedia, jika tidak gunakan ref
            name: item.message.includes('Payment request from ')
              ? item.message.replace('Payment request from ', '')
              : item.sku,
            destination: item.tujuan,
            price: item.price,
            email: item.tujuan, // Gunakan tujuan sebagai email
          };

          navigation.navigate('PaymentPage', {
            paymentRequest: paymentRequest,
          });
        } else {
          // Untuk transaksi biasa, arahkan ke halaman notifikasi sukses
          navigation.navigate('SuccessNotif', {
            // Map the new API response structure to match SuccessNotif expectations
            item: {
              ref: item.ref || '-',
              tujuan: item.tujuan || '-',
              sku: item.sku || '-',
              status: item.status || '-',
              message: item.message || '-',
              price: item.price || 0,
              sn: item.sn || '-',
              type: item.type || '-',
              created_at: item.created_at || '-',
              // Backward compatibility fields
              customer_no: item.tujuan || '-',
              ref_id: item.ref || '-',
              data: {
                ref: item.ref || '-',
                tujuan: item.tujuan || '-',
                sku: item.sku || '-',
                status: item.status || '-',
                message: item.message || '-',
                price: item.price || 0,
                sn: item.sn || '-',
                type: item.type || '-',
                created_at: item.created_at || '-',
              },
            },
            product: {
              product_name: item.sku || 'Transaksi',
              name: item.sku || 'Transaksi',
              label: item.sku || 'Transaksi',
              product_seller_price: item.price
                ? `Rp ${item.price.toLocaleString('id-ID')}`
                : 'Rp 0',
              price: item.price
                ? `Rp ${item.price.toLocaleString('id-ID')}`
                : 'Rp 0',
            },
          });
        }
      }}>
      <View style={styles.leftSection}>
        <Text
          style={[
            styles.transactionType,
            {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
          ]}>
          {item.produk || 'Transaksi'}
        </Text>
        <Text
          style={[
            styles.transactionNumber,
            {color: isDarkMode ? DARK_COLOR : SLATE_COLOR},
          ]}>
          {item.tujuan || '-'}
        </Text>
        <Text
          style={[
            styles.transactionDate,
            {color: isDarkMode ? DARK_COLOR : SLATE_COLOR},
          ]}>
          {formatDate(item.created_at)} •{' '}
          {item.created_at
            ? new Date(item.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
          ]}>
          Rp. {item.price.toLocaleString('id-ID')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND},
        ]}>
        <ActivityIndicator size="large" color="#138EE9" />
        <Text
          style={[
            styles.loadingText,
            {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
          ]}>
          Memuat transaksi...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND},
      ]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle(isDarkMode)}>Riwayat Transaksi</Text>
        <Text style={styles.headerSubtitle(isDarkMode)}>
          Daftar transaksi Anda
        </Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) =>
          `${item.type}_${item.ref ? item.ref : index}`.toString()
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                {color: isDarkMode ? DARK_COLOR : SLATE_COLOR},
              ]}>
              Belum pernah transaksi
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: isDarkMode => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  headerSubtitle: isDarkMode => ({
    fontSize: 14,
    marginTop: 4,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  listContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
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
  transactionType: isDarkMode => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  transactionNumber: isDarkMode => ({
    fontSize: 14,
    marginTop: 4,
    color: isDarkMode ? DARK_COLOR : SLATE_COLOR,
  }),
  transactionDate: isDarkMode => ({
    fontSize: 12,
    marginTop: 2,
    color: isDarkMode ? DARK_COLOR : SLATE_COLOR,
  }),
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
  transactionAmount: isDarkMode => ({
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: isDarkMode ? LIGHT_COLOR : DARK_COLOR,
  }),
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: isDarkMode => ({
    fontSize: 16,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
});

export default Transaksi;
