import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaymentRequestService from '../../services/PaymentRequestService';

const PaymentPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { paymentRequest } = route.params || {};
  
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    name: paymentRequest?.name || '',
    id: paymentRequest?.id || '',
    destination: paymentRequest?.destination || '',
    price: paymentRequest?.price || 0,
    email: paymentRequest?.email || '',
  });

  const handleApprove = async () => {
    if (!paymentRequest?.id) {
      Alert.alert('Error', 'Payment request ID is missing');
      return;
    }

    setApproving(true);

    try {
      // Using the PaymentRequestService to approve the payment
      const response = await PaymentRequestService.approvePaymentRequest(paymentRequest.id);

      if (response.new_balance !== undefined) {
        // Show success message with new balance
        Alert.alert(
          'Success',
          `Payment approved successfully! New balance: Rp ${response.new_balance.toLocaleString('id-ID')}`,
          [
            { text: 'OK', onPress: () => {
              // Navigate to success page
              navigation.navigate('PaymentSuccessPage', {
                paymentDetails: paymentDetails,
              });
            }}
          ]
        );
      } else {
        // Navigate to success page
        navigation.navigate('PaymentSuccessPage', {
          paymentDetails: paymentDetails,
        });
      }
    } catch (error) {
      console.error('Error approving payment:', error);

      // Error will be handled by global interceptor
      // Note: We'll keep the specific insufficient balance error handling as it provides detailed info to the user
      if (error.response?.data?.data?.error === 'Saldo tidak cukup') {
        Alert.alert(
          'Saldo Tidak Cukup',
          `${error.response.data.data.indonesian_message}\nSaldo saat ini: Rp ${error.response.data.data.current_balance.toLocaleString('id-ID')}\nJumlah yang dibutuhkan: Rp ${error.response.data.data.required_amount.toLocaleString('id-ID')}`
        );
      }
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menolak pembayaran ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya',
          onPress: async () => {
            setRejecting(true);
            try {
              // Using the PaymentRequestService to reject the payment
              await PaymentRequestService.rejectPaymentRequest(paymentRequest.id);

              // Show success message for rejection
              Alert.alert(
                'Berhasil',
                'Pembayaran berhasil ditolak.',
                [
                  { text: 'OK', onPress: () => {
                    // Navigate back or to home screen
                    navigation.goBack();
                  }}
                ]
              );
            } catch (error) {
              console.error('Error rejecting payment:', error);
              // Error will be handled by global interceptor
            } finally {
              setRejecting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Detail Pembayaran</Text>
        </View>

        <View style={styles.paymentCard}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{paymentDetails.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{paymentDetails.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Tujuan:</Text>
            <Text style={styles.value}>{paymentDetails.destination}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Harga:</Text>
            <Text style={[styles.value, styles.price]}>
              Rp {parseFloat(paymentDetails.price).toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{paymentDetails.email}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, rejecting && styles.disabledButton]}
            onPress={handleReject}
            disabled={approving || rejecting}
          >
            {rejecting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.cancelButtonText}>Batal</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.approveButton, approving && styles.disabledButton]}
            onPress={handleApprove}
            disabled={approving || rejecting}
          >
            {approving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.approveButtonText}>Lanjut</Text>
            )}
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  price: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
});

export default PaymentPage;