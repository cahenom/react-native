import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TransactionDetailModal = ({ selectedProduct, onLanjut, onBatal }) => {
  if (!selectedProduct) return null;

  return (
    <View style={styles.transactionModalContent}>
      <Text style={styles.modalTitle}>Detail Transaksi</Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Nomor Tujuan:</Text>
        <Text style={styles.detailValue}>{selectedProduct.destination}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Paket:</Text>
        <Text style={styles.detailValue}>{selectedProduct.title}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Durasi:</Text>
        <Text style={styles.detailValue}>{selectedProduct.duration}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Harga:</Text>
        <Text style={styles.detailValue}>{selectedProduct.price}</Text>
      </View>
      
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.batalButton} onPress={onBatal}>
          <Text style={styles.batalButtonText}>Batal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.lanjutButton} onPress={onLanjut}>
          <Text style={styles.lanjutButtonText}>Lanjut</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionModalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  batalButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 5,
    alignItems: 'center',
  },
  lanjutButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: 'center',
  },
  batalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lanjutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionDetailModal;