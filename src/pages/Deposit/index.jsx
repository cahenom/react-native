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
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {depositService} from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DepositPage = () => {
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Deposit Saldo</Text>

        <Text style={styles.label}>Nominal Deposit</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Masukkan nominal deposit"
          keyboardType="numeric"
        />

        <Text style={styles.quickAmountLabel}>Pilihan Nominal Cepat:</Text>
        <View style={styles.quickAmountContainer}>
          {quickAmounts.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickAmountButton,
                amount === value.toString() && styles.selectedQuickAmount,
              ]}
              onPress={() => handleQuickAmountSelect(value)}>
              <Text style={styles.quickAmountText}>
                {value.toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.depositButton, loading && styles.disabledButton]}
          onPress={handleDeposit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Memproses...' : 'Buat Invoice'}
          </Text>
        </TouchableOpacity>

        {invoiceData && (
          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>Invoice Detail</Text>
            <Text style={styles.invoiceText}>
              ID Invoice: {invoiceData.invoice_id}
            </Text>
            <Text style={styles.invoiceText}>
              Nominal: Rp {parseInt(invoiceData.amount).toLocaleString('id-ID')}
            </Text>
            <Text style={styles.invoiceText}>Status: {invoiceData.status}</Text>
            <Text style={styles.invoiceText}>
              Berlaku hingga:{' '}
              {new Date(invoiceData.expiry_date).toLocaleString()}
            </Text>
            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
              <Text style={styles.buttonText}>Bayar Sekarang</Text>
            </TouchableOpacity>
            <Text style={styles.bankTitle}>Cara pembayaran:</Text>
            <Text style={styles.invoiceText}>
              1. Klik tombol "Bayar Sekarang" untuk membuka halaman pembayaran.
            </Text>
            <Text style={styles.invoiceText}>
              2. Lakukan pembayaran sesuai dengan instruksi yang diberikan.
            </Text>
            <Text style={styles.invoiceText}>
              3. Setelah pembayaran berhasil, saldo akan otomatis terkonfirmasi.
            </Text>
            <Text style={styles.invoiceText}>
              4. Pastikan Anda telah melakukan pembayaran dengan benar.
            </Text>
            <Text style={styles.invoiceText}>
              5. Jika ada pertanyaan lebih lanjut, silakan hubungi customer
              service kami.
            </Text>
          </View>
        )}

        {/* Transaction History Section */}
        {transactions.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Riwayat Deposit</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  quickAmountLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectedQuickAmount: {
    backgroundColor: '#007AFF',
  },
  quickAmountText: {
    fontSize: 14,
  },
  depositButton: {
    backgroundColor: '#007AFF',
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
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  invoiceSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  invoiceText: {
    fontSize: 14,
    marginBottom: 5,
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  banksContainer: {
    marginTop: 10,
  },
  bankItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  bankAccount: {
    fontSize: 14,
    marginBottom: 3,
  },
  bankAmount: {
    fontSize: 14,
    marginBottom: 3,
  },
  bankNumber: {
    fontSize: 14,
    color: '#666',
  },
  historySection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionService: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#666',
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
