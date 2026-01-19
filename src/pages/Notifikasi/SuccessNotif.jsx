import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
} from '../../utils/const';

export default function SuccessNotif({route}) {
  const {item, product} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
      }}>
      <View
        style={{
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}>
        {(item?.status === 'Gagal' || item?.data?.status === 'Gagal' || item?.status === 'Error' || item?.data?.status === 'Error') ? (
          <LottieView
            source={require('../../assets/lottie/gagal-animation.json')}
            autoPlay
            loop
          />
        ) : item?.status === 'Pending' || item?.data?.status === 'Pending' ? (
          <LottieView
            source={require('../../assets/lottie/pending-animation.json')}
            autoPlay
            loop
          />
        ) : (
          <LottieView
            source={require('../../assets/lottie/success-animation.json')}
            autoPlay
            loop
          />
        )}
      </View>
      <View
        style={{
          marginHorizontal: HORIZONTAL_MARGIN,
        }}>
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>Nomor Tujuan</Text>
          <Text style={styles.valueModalData(isDarkMode)}>
            {item?.customer_no || item?.data?.customer_no || '-'}
          </Text>
        </View>
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>Produk</Text>
          <Text style={styles.valueModalData(isDarkMode)}>
            {product?.product_name || product?.name || product?.label || '-'}
          </Text>
        </View>
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>Harga </Text>
          <Text style={styles.valueModalData(isDarkMode)}>
            {product?.product_seller_price || product?.price || '-'}
          </Text>
        </View>
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>Status </Text>
          <Text style={styles.valueModalData(isDarkMode)}>
            {item?.status || item?.data?.status || 'Berhasil'}
          </Text>
        </View>
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>SN </Text>
          <Text style={styles.valueModalData(isDarkMode)}>
            {item?.sn || item?.data?.sn || item?.serial_number || item?.transaction_id || '-'}
          </Text>
        </View>
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>Ref ID </Text>
          <Text style={styles.valueModalData(isDarkMode)}>
            {item?.ref_id || item?.data?.ref_id || '-'}
          </Text>
        </View>
        <View style={styles.modalData(isDarkMode)}>
          <Text style={styles.labelModalData(isDarkMode)}>Message </Text>
          <Text style={styles.valueModalData(isDarkMode)}>
            {item?.message || item?.data?.message || '-'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalData: isDarkMode => ({
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    paddingVertical: 5,
    rowGap: 5,
  }),
  labelModalData: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_SEDANG,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  valueModalData: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
});
