import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BOLD_FONT,
  REGULAR_FONT,
  MEDIUM_FONT,
  DARK_BACKGROUND,
  WHITE_COLOR,
  DARK_COLOR,
  LIGHT_COLOR,
  SLATE_COLOR,
  GRADIENTS,
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
  HORIZONTAL_MARGIN,
} from '../../utils/const';

export default function PromoScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={GRADIENTS.primary}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <Text style={styles.headerTitle}>Promo</Text>
        <Text style={styles.headerSubtitle}>
          Penawaran spesial untuk Anda
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.emptyCard(isDarkMode)}>
          <Text style={styles.emptyEmoji}>🎁</Text>
          <Text style={styles.emptyTitle(isDarkMode)}>Segera Hadir!</Text>
          <Text style={styles.emptyDesc(isDarkMode)}>
            Promo menarik sedang disiapkan untuk Anda. Nantikan penawaran
            spesial kami!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: isDarkMode => ({
    flex: 1,
    backgroundColor: isDarkMode ? DARK_BACKGROUND : '#f6f6f8',
  }),
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + SPACING.xl : 56,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: HORIZONTAL_MARGIN,
  },
  headerTitle: {
    fontFamily: BOLD_FONT,
    fontSize: 24,
    color: WHITE_COLOR,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontFamily: REGULAR_FONT,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingTop: SPACING.xl,
    paddingBottom: 100,
  },
  emptyCard: isDarkMode => ({
    backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xxxl,
    alignItems: 'center',
    ...SHADOWS.medium,
  }),
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.xl,
  },
  emptyTitle: isDarkMode => ({
    fontFamily: BOLD_FONT,
    fontSize: 20,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    marginBottom: SPACING.md,
  }),
  emptyDesc: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: 14,
    color: isDarkMode ? SLATE_COLOR : '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  }),
});
