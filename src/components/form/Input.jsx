import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  DARK_BACKGROUND,
  GREY_COLOR,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
  windowWidth,
} from '../../utils/const';
import {XClose} from '../../assets';

export default function Input({
  value,
  placeholder,
  onchange,
  type,
  ondelete,
  lebar,
}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 5,
        borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
        fontFamily: REGULAR_FONT,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={GREY_COLOR}
        keyboardType={type ? type : 'default'}
        value={value}
        onChangeText={onchange}
        style={{width: lebar ? lebar : ''}}
      />
      {value && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
          }}
          onPress={ondelete}>
          <XClose width={15} height={15} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
