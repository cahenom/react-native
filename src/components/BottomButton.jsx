import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  REGULAR_FONT,
  WHITE_BACKGROUND,
  WHITE_COLOR,
} from '../utils/const';

export default function BottomButton({label, action, isLoading}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <>
      {isLoading ? (
        <View style={styles.bottom(isDarkMode)}>
          <View
            style={{
              backgroundColor: BLUE_COLOR,
              padding: 10,
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              columnGap: 10,
            }}
            onPress={action}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.buttonText}>Loading...</Text>
          </View>
        </View>
      ) : (
        <View style={styles.bottom(isDarkMode)}>
          <TouchableOpacity style={styles.bottomButton} onPress={action}>
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  buttonText: {
    color: WHITE_COLOR,
    fontFamily: REGULAR_FONT,
    textAlign: 'center',
  },
});
