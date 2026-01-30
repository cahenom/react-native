import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {CheckProduct} from '../assets';
import {
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  GREEN_COLOR,
  GREY_COLOR,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
} from '../utils/const';
import {numberWithCommas} from '../utils/formatter';

const ProductCard = ({ 
  product, 
  isSelected = false, 
  onSelect,
  style 
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.productWrapper(isDarkMode),
        isSelected && {
          borderColor: GREEN_COLOR,
        },
        style
      ]}
      onPress={() => onSelect && onSelect(product)}>
      <Text style={styles.productLabel(isDarkMode)}>
        {product.name || product.product_name || product.label}
      </Text>
      <Text style={styles.productPrice(isDarkMode)}>
        Rp.{numberWithCommas(product.price || product.product_seller_price)}
      </Text>
      {product.desc && (
        <Text style={styles.productDesc(isDarkMode)}>
          {product.desc || product.product_desc}
        </Text>
      )}
      {isSelected && (
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
};

const styles = StyleSheet.create({
  productWrapper: isDarkMode => ({
    borderWidth: 1,
    borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    borderRadius: 10,
    padding: 20,
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
  productDesc: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: 10,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    marginTop: 5,
  }),
});

export default ProductCard;