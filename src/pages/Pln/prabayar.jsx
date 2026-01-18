import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_KECIL,
  FONT_NORMAL,
  GREEN_COLOR,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
  WHITE_COLOR,
  windowWidth,
} from '../../utils/const';
import Input from '../../components/form/Input';
import {product_token} from '../../data/product_pln';
import {CheckProduct} from '../../assets';

export default function PLNPrabayar() {
  const isDarkMode = useColorScheme() === 'dark';

  const [customer_no, setCustomerNo] = useState('');
  const [selectItem, setSelectItem] = useState(null);

  const resetInput = () => {
    setCustomerNo('');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.formGroup}>
          <Input
            value={customer_no}
            placeholder="Masukan nomor meter"
            onchange={text => setCustomerNo(text)}
            ondelete={resetInput}
            type="numeric"
            lebar={windowWidth * 0.7}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cek</Text>
          </TouchableOpacity>
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
            <Text style={styles.label(isDarkMode)}>Daya / Segmen power</Text>
            <Text style={styles.value(isDarkMode)}>900Kwh</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 25,
            marginTop: 20,
          }}>
          {product_token.map(p => {
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.productWrapper(isDarkMode),
                  selectItem?.id === p.id
                    ? {
                        borderColor: GREEN_COLOR,
                      }
                    : '',
                ]}
                onPress={() => setSelectItem(p)}>
                <Text style={styles.productLabel(isDarkMode)}>{p.label}</Text>
                <Text style={styles.productPrice(isDarkMode)}>
                  Rp. {p.price}
                </Text>
                {selectItem?.id === p.id && (
                  <CheckProduct
                    width={20}
                    style={{
                      position: 'absolute',
                      right: 7,
                      top: 2,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {selectItem && (
        <View style={styles.bottom(isDarkMode)}>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.buttonText}>Lanjutkan</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 15,
  },
  formGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 5,
  },
  button: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 5,
    padding: 15,
    flex: 1,
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
    fontSize: FONT_KECIL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  value: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  productWrapper: isDarkMode => ({
    borderWidth: 1,
    borderColor: GREY_COLOR,
    borderRadius: 10,
    padding: 20,
    width: '45%',
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
  }),
  productLabel: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  productPrice: isDarkMode => ({
    fontFamily: REGULAR_FONT,
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
