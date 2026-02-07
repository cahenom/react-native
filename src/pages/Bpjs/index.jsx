import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import ModernButton from '../../components/ModernButton';
import BottomButton from '../../components/BottomButton';
import React, {useState} from 'react';
import {
  BLUE_COLOR,
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
  WHITE_COLOR,
} from '../../utils/const';
import Input from '../../components/form/Input';

export default function BpjsKesehatan() {
  const isDarkMode = useColorScheme() === 'dark';
  const [customer_no, setCustomerNo] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND}}>
      <CustomHeader title="BPJS Kesehatan" />
      <View style={styles.container}>
        <View style={styles.formGroup}>
          <Input
            value={customer_no}
            placeholder="Masukan nomor VA Keluarga"
            onchange={text => setCustomerNo(text)}
            ondelete={() => setCustomerNo('')}
            type="numeric"
          />
          <ModernButton
            label="Cek"
            onPress={() => console.log('Cek BPJS')}
          />
        </View>

        <View style={styles.infoPelanggan(isDarkMode)}>
          <View style={styles.contentBlock(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>Nama</Text>
            <Text style={styles.value(isDarkMode)}>Lorem Ipsum</Text>
          </View>
          <View style={styles.contentBlock(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>ID Pelanggan</Text>
            <Text style={styles.value(isDarkMode)}>1234567890</Text>
          </View>
          <View style={styles.contentBlock(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>Jumlah peserta</Text>
            <Text style={styles.value(isDarkMode)}>2</Text>
          </View>
          <View style={styles.contentBlock(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>Lembar Tagihan</Text>
            <Text style={styles.value(isDarkMode)}>2 lbr</Text>
          </View>
          <View style={styles.contentBlock(isDarkMode)}>
            <Text style={styles.label(isDarkMode)}>Total Tagihan</Text>
            <Text style={styles.value(isDarkMode)}>Rp. 120.000</Text>
          </View>
        </View>
      </View>

      <BottomButton
        label="Bayar Tagihan"
        action={() => console.log('Bayar BPJS')}
        isLoading={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 15,
  },
  formGroup: {
    flexDirection: 'column',
    rowGap: 5,
  },
  button: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 5,
    padding: 15,
  },
  buttonText: {
    color: WHITE_COLOR,
    fontFamily: REGULAR_FONT,
    textAlign: 'center',
  },
  infoPelanggan: isDarkMode => ({
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    borderRadius: 10,
  }),
  contentBlock: isDarkMode => ({
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    marginTop: 10,
    rowGap: 5,
  }),
  label: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_SEDANG,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  value: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),

  bottom: isDarkMode => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
    padding: 10,
  }),
  bottomButton: {
    backgroundColor: BLUE_COLOR,
    padding: 10,
    borderRadius: 5,
  },
});
