import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  SafeAreaView,
  FlatList,
  useColorScheme,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {depositService} from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BOLD_FONT,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  REGULAR_FONT,
  WHITE_BACKGROUND,
  BLUE_COLOR,
  WHITE_COLOR,
  GREY_COLOR,
  SLATE_COLOR,
} from '../../utils/const';

const DepositPage = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const {token} = useAuth();

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  // Load transaction history
  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('user_transactions');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          // Filter for deposit transactions only
          const depositTransactions = parsedData
            .filter(
              transaction =>
                transaction.sku &&
                (transaction.sku.toLowerCase().includes('deposit') ||
                  transaction.sku.toLowerCase().includes('top up') ||
                  transaction.type === 'credit'),
            )
            .slice(0, 5); // Show only last 5 transactions

          setTransactions(depositTransactions);
        }
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
    }
  };

  const handleQuickAmountSelect = selectedAmount => {
    setAmount(selectedAmount.toString());
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      Alert.alert('Error', 'Silakan masukkan nominal deposit yang valid');
      return;
    }

    setLoading(true);
    try {
      const response = await depositService.createDeposit(token, {
        amount: parseInt(amount),
      });

      if (response && response.status === true) {
        setInvoiceData(response.data);
        // Reset amount after successful creation
        setAmount('');
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Gagal membuat invoice deposit',
        );
      }
    } catch (error) {
      console.error('Deposit error:', error);
      let errorMessage = 'Terjadi kesalahan saat membuat invoice deposit';

      if (error.response) {
        // Server responded with error status
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Error ${error.response.status}: Gagal membuat invoice`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage =
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    if (invoiceData?.payment_url) {
      Linking.openURL(invoiceData.payment_url);
    }
  };

  const renderTransactionItem = ({item}) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionService}>
          {item.sku || item.product_name || 'Deposit'}
        </Text>
        <Text style={styles.transactionTime}>
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString('id-ID')
            : 'Tanggal tidak tersedia'}
        </Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={styles.transactionAmount}>
          +Rp {item.price ? parseInt(item.price).toLocaleString('id-ID') : '0'}
        </Text>
        <Text
          style={[
            styles.transactionStatus,
            {
              color:
                item.status === 'Success' || item.status === 'BERHASIL'
                  ? '#10b981'
                  : '#f59e0b',
            },
          ]}>
          {item.status || 'Pending'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={getStyles(isDarkMode).container}>
      <ScrollView contentContainerStyle={getStyles(isDarkMode).content}>
        <Text style={getStyles(isDarkMode).title}>Deposit Saldo</Text>

        <Text style={getStyles(isDarkMode).label}>Nominal Deposit</Text>
        <TextInput
          style={getStyles(isDarkMode).input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Masukkan nominal deposit"
          keyboardType="numeric"
          placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
        />

        <Text style={getStyles(isDarkMode).quickAmountLabel}>Pilihan Nominal Cepat:</Text>
        <View style={getStyles(isDarkMode).quickAmountContainer}>
          {quickAmounts.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                getStyles(isDarkMode).quickAmountButton,
                amount === value.toString() && getStyles(isDarkMode).selectedQuickAmount,
              ]}
              onPress={() => handleQuickAmountSelect(value)}>
              <Text style={getStyles(isDarkMode).quickAmountText}>
                {value.toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[getStyles(isDarkMode).depositButton, loading && getStyles(isDarkMode).disabledButton]}
          onPress={handleDeposit}
          disabled={loading}>
          <Text style={getStyles(isDarkMode).buttonText}>
            {loading ? 'Memproses...' : 'Buat Invoice'}
          </Text>
        </TouchableOpacity>

        {invoiceData && (
          <View style={getStyles(isDarkMode).invoiceSection}>
            <Text style={getStyles(isDarkMode).invoiceTitle}>Invoice Detail</Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              ID Invoice: {invoiceData.invoice_id}
            </Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              Nominal: Rp {parseInt(invoiceData.amount).toLocaleString('id-ID')}
            </Text>
            <Text style={getStyles(isDarkMode).invoiceText}>Status: {invoiceData.status}</Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              Berlaku hingga:{' '}
              {new Date(invoiceData.expiry_date).toLocaleString()}
            </Text>
            <TouchableOpacity style={getStyles(isDarkMode).payButton} onPress={handlePayNow}>
              <Text style={getStyles(isDarkMode).buttonText}>Bayar Sekarang</Text>
            </TouchableOpacity>
            <Text style={getStyles(isDarkMode).bankTitle}>Cara pembayaran:</Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              1. Klik tombol "Bayar Sekarang" untuk membuka halaman pembayaran.
            </Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              2. Lakukan pembayaran sesuai dengan instruksi yang diberikan.
            </Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              3. Setelah pembayaran berhasil, saldo akan otomatis terkonfirmasi.
            </Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              4. Pastikan Anda telah melakukan pembayaran dengan benar.
            </Text>
            <Text style={getStyles(isDarkMode).invoiceText}>
              5. Jika ada pertanyaan lebih lanjut, silakan hubungi customer
              service kami.
            </Text>
          </View>
        )}

        {/* Transaction History Section */}
        {transactions.length > 0 && (
          <View style={getStyles(isDarkMode).historySection}>
            <Text style={getStyles(isDarkMode).historyTitle}>Riwayat Deposit</Text>
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? DARK_BACKGROUND : '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? SLATE_COLOR : '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: isDarkMode ? DARK_BACKGROUND : '#fff',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    marginBottom: 20,
  },
  quickAmountLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: isDarkMode ? '#555' : '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectedQuickAmount: {
    backgroundColor: BLUE_COLOR,
  },
  quickAmountText: {
    fontSize: 14,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  depositButton: {
    backgroundColor: BLUE_COLOR,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: isDarkMode ? '#777' : '#ccc',
  },
  buttonText: {
    color: WHITE_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
  invoiceSection: {
    backgroundColor: isDarkMode ? DARK_BACKGROUND : '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? SLATE_COLOR : '#ddd',
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  invoiceText: {
    fontSize: 14,
    marginBottom: 5,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  banksContainer: {
    marginTop: 10,
  },
  bankItem: {
    backgroundColor: isDarkMode ? '#444' : '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#eee',
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLUE_COLOR,
    marginBottom: 5,
  },
  bankAccount: {
    fontSize: 14,
    marginBottom: 3,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  bankAmount: {
    fontSize: 14,
    marginBottom: 3,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  bankNumber: {
    fontSize: 14,
    color: isDarkMode ? SLATE_COLOR : '#666',
  },
  historySection: {
    backgroundColor: isDarkMode ? DARK_BACKGROUND : '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? SLATE_COLOR : '#ddd',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#444' : '#eee',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionService: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  },
  transactionTime: {
    fontSize: 12,
    color: isDarkMode ? SLATE_COLOR : '#666',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DepositPage;
