import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useColorScheme} from 'react-native';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  GREY_COLOR,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
  WHITE_COLOR,
} from '../utils/const';
import {numberWithCommas} from '../utils/formatter';

const TransactionDetail = ({
  destination,
  product,
  description,
  price,
  onConfirm,
  onCancel,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View>
      <View style={styles.modalData(isDarkMode)}>
        <Text style={styles.labelModalData(isDarkMode)}>Nomor Tujuan</Text>
        <Text style={styles.valueModalData(isDarkMode)}>{destination}</Text>
      </View>
      <View style={styles.modalData(isDarkMode)}>
        <Text style={styles.labelModalData(isDarkMode)}>Produk</Text>
        <Text style={styles.valueModalData(isDarkMode)}>{product}</Text>
      </View>
      {description && (
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>Deskripsi</Text>
          <Text style={styles.valueModalData(isDarkMode)}>{description}</Text>
        </View>
      )}
      <View style={styles.modalData(isDarkMode)}>
        <Text style={styles.labelModalData(isDarkMode)}>Harga </Text>
        <Text style={styles.valueModalData(isDarkMode)}>
          Rp.{numberWithCommas(price)}
        </Text>
      </View>
      <View style={styles.bottom(isDarkMode)}>
        <TouchableOpacity style={styles.bottomButton} onPress={onConfirm}>
          <Text style={styles.buttonLabel}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: isDarkMode => ({
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
    padding: 10,
  }),
  bottomButton: {
    backgroundColor: BLUE_COLOR,
    padding: 10,
    borderRadius: 5,
  },
  modalData: isDarkMode => ({
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    paddingVertical: 5,
    rowGap: 5,
  }),
  labelModalData: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_SEDANG,
    color: isDarkMode ? LIGHT_COLOR : LIGHT_COLOR, // Changed to ensure contrast
  }),
  valueModalData: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? LIGHT_COLOR : LIGHT_COLOR, // Changed to ensure contrast
  }),
  buttonLabel: {
    fontFamily: REGULAR_FONT,
    color: WHITE_COLOR,
    textAlign: 'center',
  },
});

export default TransactionDetail;
