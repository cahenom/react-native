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
  RED_COLOR,
  REGULAR_FONT,
  SLATE_COLOR,
  DARK_COLOR,
  LIGHT_COLOR,
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
  hasError = false,
}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderRadius: 5,
          borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
          backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
          fontFamily: REGULAR_FONT,
          flexDirection: 'row',
          alignItems: 'center',
        },
        hasError && {
          borderColor: RED_COLOR, // Red border when there's an error
        },
      ]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
        keyboardType={type ? type : 'default'}
        value={value}
        onChangeText={onchange}
        style={{
          width: lebar ? lebar : '',
          color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
        }}
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
      {hasError && (
        <View
          style={{
            position: 'absolute',
            right: 35, // Positioned to the left of the close button
          }}>
          <Text style={{color: RED_COLOR, fontWeight: 'bold'}}>!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
