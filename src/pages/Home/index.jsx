import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {BellIkon} from '../../assets';
import {
  BOLD_FONT,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_COLOR,
  BLUE_COLOR,
  WHITE_BACKGROUND,
  GREY_COLOR,
} from '../../utils/const';
import {mainmenus} from '../../data/mainmenu';
import {useAuth} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // State for recent activities
  const [recentActivities, setRecentActivities] = useState([
    // Default/fallback data in case cache is empty
    {
      id: 1,
      service: 'Telkomsel 10GB',
      time: 'Today, 10:23 AM',
      amount: '-Rp 55.000',
      status: 'Success',
      icon: '📶',
      type: 'debit',
      color: '#ef4444',
    },
    {
      id: 2,
      service: 'PLN Token',
      time: 'Yesterday, 08:45 PM',
      amount: '-Rp 100.000',
      status: 'Pending',
      icon: '⚡',
      type: 'debit',
      color: '#f59e0b',
    },
    {
      id: 3,
      service: 'Top Up Balance',
      time: 'Sep 24, 02:15 PM',
      amount: '+Rp 500.000',
      status: 'Success',
      icon: '💳',
      type: 'credit',
      color: '#10b981',
    },
  ]);

  // Load recent activities from transaction cache
  useEffect(() => {
    const loadRecentActivities = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('user_transactions');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData)) {
            // Take only the 3 most recent transactions
            const recentTransactions = parsedData.slice(0, 3).map((transaction, index) => ({
              id: index + 1,
              service: transaction.sku || transaction.product_name || 'Transaksi',
              time: transaction.created_at
                ? new Date(transaction.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }) + ', ' +
                  new Date(transaction.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Unknown Time',
              amount: (transaction.price >= 0 ? '+' : '-') + 'Rp ' +
                Math.abs(transaction.price || 0).toLocaleString('id-ID'),
              status: transaction.status || 'Unknown',
              icon: getTransactionIcon(transaction.sku || ''),
              type: transaction.type || 'debit',
              color: transaction.status?.toLowerCase() === 'berhasil' ||
                     transaction.status?.toLowerCase() === 'sukses' ||
                     transaction.status?.toLowerCase() === 'success'
                     ? '#10b981' : '#ef4444',
            }));

            setRecentActivities(recentTransactions);
          }
        }
      } catch (error) {
        console.error('Error loading recent activities from cache:', error);
        // Keep default data if there's an error
      }
    };

    loadRecentActivities();
  }, []);

  // Helper function to get transaction icon
  const getTransactionIcon = (sku) => {
    if (sku.toLowerCase().includes('pulsa') || sku.toLowerCase().includes('data')) {
      return '📶';
    } else if (sku.toLowerCase().includes('pln')) {
      return '⚡';
    } else if (sku.toLowerCase().includes('pdam')) {
      return '💧';
    } else if (sku.toLowerCase().includes('wallet') || sku.toLowerCase().includes('dompet')) {
      return '💳';
    } else if (sku.toLowerCase().includes('game') || sku.toLowerCase().includes('games')) {
      return '🎮';
    } else if (sku.toLowerCase().includes('bpjs')) {
      return '🏥';
    } else {
      return '📦';
    }
  };

  // Services data based on mainmenus
  const services = mainmenus.map((item, index) => ({
    ...item,
    id: index,
  }));

  // Banner promotions
  const banners = [
    {
      id: 1,
      title: 'Get 50% Cashback for Data Pkg',
      subtitle: 'Special Offer',
      gradient: ['#a855f7', '#135bec'],
    },
    {
      id: 2,
      title: 'Pay Bills with 0% Admin Fee',
      subtitle: 'New Arrival',
      gradient: ['#f97316', '#ef4444'],
    },
  ];

  const getStatusColor = status => {
    if (status === 'Success') return isDarkMode ? '#4ade80' : '#16a34a';
    if (status === 'Pending') return isDarkMode ? '#fde047' : '#ca8a04';
    return isDarkMode ? '#9ca3af' : '#6b7280';
  };

  const getAmountColor = type => {
    return type === 'credit'
      ? isDarkMode
        ? '#4ade80'
        : '#16a34a'
      : isDarkMode
      ? '#f87171'
      : '#dc2626';
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#101622' : '#f6f6f8'},
      ]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {backgroundColor: isDarkMode ? '#1a2332' : '#ffffff'},
        ]}>
        <View style={styles.headerContent}>
          <View style={styles.userProfile}>
            <View
              style={[
                styles.avatar,
                {backgroundColor: isDarkMode ? '#2d3748' : '#e2e8f0'},
              ]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.greeting,
                  {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
                ]}>
                Good Morning,
              </Text>
              <Text
                style={[
                  styles.userName,
                  {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
                ]}>
                {user?.name || user?.email || 'User'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={{color: isDarkMode ? DARK_COLOR : LIGHT_COLOR, fontSize: 24}}>🔔</Text>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BLUE_COLOR]}
            tintColor={BLUE_COLOR}
          />
        }>
        {/* Balance Card */}
        <View style={[styles.balanceCard, {backgroundColor: BLUE_COLOR}]}>
          <View style={styles.balanceContent}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              Rp {user?.saldo ? parseFloat(user.saldo).toLocaleString() : '0'}
            </Text>
          </View>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: 'rgba(255,255,255,0.2)'},
              ]}>
              <Text style={styles.actionIcon}>💳</Text>
              <Text style={styles.actionText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: 'rgba(255,255,255,0.2)'},
              ]}>
              <Text style={styles.actionIcon}>🔍</Text>
              <Text style={styles.actionText}>Scan QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services Grid - Exclude PDAM, Internet, and BPJS Kesehatan, add Semua button */}
        <View style={styles.servicesSection}>
          <FlatList
            data={[
              ...services.filter(
                item =>
                  item.label.toLowerCase() !== 'pdam' &&
                  item.label.toLowerCase() !== 'internet' &&
                  item.label.toLowerCase() !== 'bpjs kesehatan',
              ),
              {id: 'semua', label: 'Semua', ikon: '🔍'}, // Add Semua as a service item
            ]}
            numColumns={4}
            renderItem={({item}) => {
              // Check if this is the 'Semua' item
              if (item.id === 'semua') {
                return (
                  <TouchableOpacity
                    style={styles.serviceItem}
                    onPress={() => navigation.navigate('LihatSemua')} // Navigate to "Lihat Semua" page
                  >
                    <View
                      style={[
                        styles.serviceIconContainer,
                        {backgroundColor: isDarkMode ? '#1a2332' : '#f1f5f9'},
                      ]}>
                      <View style={styles.serviceIcon}>
                        <Text style={{fontSize: 26}}>{item.ikon}</Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.serviceLabel,
                        {color: isDarkMode ? '#cbd5e1' : '#334155'},
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={styles.serviceItem}
                    onPress={() => navigation.navigate(item.path)}>
                    <View
                      style={[
                        styles.serviceIconContainer,
                        {backgroundColor: isDarkMode ? '#1a2332' : '#f1f5f9'},
                      ]}>
                      <Image source={item.ikon} style={styles.serviceIcon} />
                    </View>
                    <Text
                      style={[
                        styles.serviceLabel,
                        {color: isDarkMode ? '#cbd5e1' : '#334155'},
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Simple Slider with Dots */}
        <View style={styles.sliderSection}>
          <View
            style={[
              styles.simpleCard,
              {backgroundColor: isDarkMode ? '#1a2332' : WHITE_BACKGROUND},
            ]}>
            <Text
              style={[
                styles.cardTitle,
                {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
              ]}>
              Promo Spesial
            </Text>
            <View style={styles.sliderContainer}>
              <FlatList
                horizontal
                data={[
                  {id: 1, icon: '📱', title: 'Cashback 50%'},
                  {id: 2, icon: '🔌', title: 'Gratis Ongkir'},
                  {id: 3, icon: '💧', title: 'Diskon 30%'},
                ]}
                renderItem={({item}) => (
                  <View style={styles.sliderImage}>
                    <Text style={styles.imagePlaceholder}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.sliderText,
                        {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={event => {
                  const slideSize = 300; // Approximate slide width
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const index = Math.round(offsetX / slideSize);
                  setActiveSlideIndex(index);
                }}
                scrollEventThrottle={16}
              />
              <View style={styles.dotsContainer}>
                {[
                  {id: 1, icon: '📱', title: 'Cashback 50%'},
                  {id: 2, icon: '🔌', title: 'Gratis Ongkir'},
                  {id: 3, icon: '💧', title: 'Diskon 30%'},
                ].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      activeSlideIndex === index ? styles.activeDot : null,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
              ]}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transaksi')}>
              <Text style={[styles.seeAll, {color: BLUE_COLOR}]}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activitiesList}>
            {recentActivities.map(activity => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityItem,
                  {backgroundColor: isDarkMode ? '#1a2332' : WHITE_BACKGROUND},
                ]}
                onPress={() => navigation.navigate('SuccessNotif', {
                  item: {
                    ref: activity.id,
                    tujuan: activity.service,
                    sku: activity.service,
                    status: activity.status,
                    message: activity.status,
                    price: activity.amount.includes('+') ? parseInt(activity.amount.replace(/[^\d]/g, '')) : -parseInt(activity.amount.replace(/[^\d]/g, '')),
                    sn: activity.service,
                    type: activity.type,
                    created_at: activity.time,
                  },
                  product: {
                    product_name: activity.service,
                    name: activity.service,
                    label: activity.service,
                    product_seller_price: activity.amount,
                    price: activity.amount,
                  },
                })}>
                <View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor: isDarkMode
                        ? '#2d3748'
                        : `${activity.color}20`,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.activityIconText,
                      {color: isDarkMode ? activity.color : activity.color},
                    ]}>
                    {activity.icon}
                  </Text>
                </View>

                <View style={styles.activityDetails}>
                  <Text
                    style={[
                      styles.activityService,
                      {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
                    ]}>
                    {activity.service}
                  </Text>
                  <Text
                    style={[
                      styles.activityTime,
                      {color: isDarkMode ? '#94a3b8' : '#64748b'},
                    ]}>
                    {activity.time}
                  </Text>
                </View>

                <View style={styles.activityAmountContainer}>
                  <Text
                    style={[
                      styles.activityAmount,
                      {color: getAmountColor(activity.type)},
                    ]}>
                    {activity.amount}
                  </Text>
                  <Text
                    style={[
                      styles.activityStatus,
                      {color: getStatusColor(activity.status)},
                    ]}>
                    {activity.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: HORIZONTAL_MARGIN,
    zIndex: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  greeting: {
    fontSize: 12,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 9999,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 9999,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  balanceCard: {
    marginHorizontal: HORIZONTAL_MARGIN,
    borderRadius: 20,
    padding: 24,
    marginTop: 20, // Changed from -20 to 20 to prevent overlapping
    zIndex: 10,
    shadowColor: '#135bec',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceContent: {
    marginBottom: 24,
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WHITE_COLOR,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: WHITE_COLOR,
  },
  servicesSection: {
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 24,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    margin: 4,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  serviceIcon: {
    width: 26,
    height: 26,
  },
  serviceLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  sliderSection: {
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 24,
  },
  simpleCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  sliderImage: {
    width: 300,
    aspectRatio: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
    marginRight: 10,
  },
  imagePlaceholder: {
    fontSize: 24,
  },
  sliderText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: BLUE_COLOR,
    width: 12,
    height: 12,
  },
  activitiesSection: {
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 24,
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityDetails: {
    flex: 1,
  },
  activityService: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  activityAmountContainer: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
