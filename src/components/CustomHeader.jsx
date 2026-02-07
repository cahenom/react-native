import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BOLD_FONT,
  REGULAR_FONT,
  WHITE_COLOR,
  GRADIENTS,
  BORDER_RADIUS,
  SPACING,
  HORIZONTAL_MARGIN,
} from '../utils/const';

export default function CustomHeader({
  title,
  gradient = GRADIENTS.primary,
  showBackButton = true,
  leftComponent = null,
  rightComponent = null,
}) {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          ) : (
            leftComponent
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightContainer}>
          {rightComponent || <View style={styles.spacer} />}
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xxxl * 2,
    paddingBottom: SPACING.lg,
    paddingHorizontal: HORIZONTAL_MARGIN,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: WHITE_COLOR,
    fontFamily: BOLD_FONT,
  },
  title: {
    fontFamily: BOLD_FONT,
    fontSize: 18,
    color: WHITE_COLOR,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  spacer: {
    width: 40,
  },
});
