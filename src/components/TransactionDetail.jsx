import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useColorScheme} from 'react-native';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
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
  isLoading = false, // Add loading prop
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
      </View>
      <View style={styles.bottom(isDarkMode)}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={onConfirm}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <View style={styles.loadingButtonContent}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonLabel}>Memproses...</Text>
            </View>
          ) : (
            <Text style={styles.buttonLabel}>Bayar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Remove flex: 1 to make container fit content height
  },
  content: {
    // Remove flex: 1 to allow content to determine height
  },
  bottom: isDarkMode => ({
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
    padding: 10,
    paddingTop: 5,
    marginTop: 10, // Add some space between content and button
  }),
  bottomButton: {
    backgroundColor: BLUE_COLOR,
    padding: 12,
    borderRadius: 8,
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
  },
  modalData: isDarkMode => ({
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    paddingVertical: 3, // Reduced padding to make items closer together
    rowGap: 3, // Reduced gap to make items closer together
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
