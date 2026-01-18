import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  WHITE_BACKGROUND,
  windowWidth,
} from '../../utils/const';
import Input from '../../components/form/Input';
import {product_dompet} from '../../data/product_dompet';
import BottomButton from '../../components/BottomButton';
import ProductList from '../../components/ProductList';

export default function TopupDompet({route}) {
  const {item} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const [customer_no, setCustomerNo] = useState('');
  const [selectItem, setSelectItem] = useState(null);

  const resetInput = () => {
    setCustomerNo('');
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            marginBottom: 15,
          }}>
          <Text
            style={{
              fontFamily: MEDIUM_FONT,
              fontSize: 16,
              color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
            }}>
            {item}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Input
            value={customer_no}
            placeholder="Masukan nomor tujuan"
            onchange={text => setCustomerNo(text)}
            ondelete={resetInput}
            type="numeric"
            lebar={windowWidth * 0.9}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 25,
            marginTop: 20,
            columnGap: 5,
          }}>
          {product_dompet.map(p => {
            return (
              <ProductList
                selectItem={selectItem?.id}
                data={p}
                action={() => setSelectItem(p)}
              />
            );
          })}
        </View>
      </View>
      {selectItem && (
        <BottomButton
          label="Lanjutkan"
          action={() => console.log(selectItem)}
          isLoading={false}
        />
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
  productWrapper: isDarkMode => ({
    borderWidth: 1,
    borderColor: GREY_COLOR,
    borderRadius: 10,
    padding: 20,
    width: '47%',
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
});
