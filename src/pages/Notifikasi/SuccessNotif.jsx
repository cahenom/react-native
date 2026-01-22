import {StyleSheet, Text, View, useColorScheme, ScrollView} from 'react-native';
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

  // Extract data from the API response structure
  const responseData = item?.data || item;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}>
          {item?.status === 'Gagal' ||
          responseData?.status === 'Gagal' ||
          item?.status === 'Error' ||
          responseData?.status === 'Error' ||
          item?.status === 'none' ? (
            <LottieView
              source={require('../../assets/lottie/gagal-animation.json')}
              autoPlay
              loop
            />
          ) : item?.status === 'Pending' ||
            responseData?.status === 'Pending' ? (
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
            marginBottom: 100,
          }}>
          {/* Reference ID */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Ref ID</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {responseData?.ref || responseData?.ref_id || item?.ref_id || '-'}
            </Text>
          </View>

          {/* Target Number */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Nomor Tujuan</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {responseData?.tujuan ||
                item?.customer_no ||
                item?.data?.customer_no ||
                '-'}
            </Text>
          </View>

          {/* SKU */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>SKU</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {responseData?.sku || '-'}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Status</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {responseData?.status || item?.status || 'Berhasil'}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Harga</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {typeof responseData?.price === 'number'
                ? `Rp ${responseData?.price?.toLocaleString('id-ID')}`
                : responseData?.price ||
                  product?.product_seller_price ||
                  product?.price ||
                  '-'}
            </Text>
          </View>

          {/* Serial Number */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>SN</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {responseData?.sn ||
                item?.sn ||
                item?.data?.sn ||
                item?.serial_number ||
                '-'}
            </Text>
          </View>

          {/* Message */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Message</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {responseData?.message ||
                item?.message ||
                item?.data?.message ||
                '-'}
            </Text>
          </View>

          {/* Product Name (if available) */}
          <View style={styles.modalData(isDarkMode)}>
            <Text style={styles.labelModalData(isDarkMode)}>Produk</Text>
            <Text style={styles.valueModalData(isDarkMode)}>
              {product?.product_name || product?.name || product?.label || '-'}
            </Text>
          </View>
        </View>
      </ScrollView>
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
