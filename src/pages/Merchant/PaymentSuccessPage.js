import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentSuccessPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { paymentDetails } = route.params || {};

  const handleDone = () => {
    // Navigate back to home or wherever appropriate
    navigation.navigate('MyTabs'); // Navigate back to the main tabs
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
        <Text style={styles.successMessage}>Transaksi Anda telah berhasil diproses.</Text>

        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nama:</Text>
            <Text style={styles.summaryValue}>{paymentDetails?.name || '-'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ID:</Text>
            <Text style={styles.summaryValue}>{paymentDetails?.id || '-'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tujuan:</Text>
            <Text style={styles.summaryValue}>{paymentDetails?.destination || '-'}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Harga:</Text>
            <Text style={styles.summaryValuePrice}>
              Rp {paymentDetails?.price ? parseFloat(paymentDetails.price).toLocaleString('id-ID') : '0'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkIcon: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  paymentSummary: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  summaryValuePrice: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentSuccessPage;