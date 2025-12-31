import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Badge } from '../../components/ui/Badge';
import { COLORS, mapStyle, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useDeliveryStore } from '../../services/store';
import { calculateDistance, calculateETA, formatDistance } from '../../utils/gpsUtils';

const CATEGORIES = [
  { id: '1', name: 'Pizza', icon: 'pizza-outline' },
  { id: '2', name: 'Burgers', icon: 'fast-food-outline' },
  { id: '3', name: 'Sushi', icon: 'fish-outline' },
  { id: '4', name: 'Drinks', icon: 'beer-outline' },
  { id: '5', name: 'Desserts', icon: 'ice-cream-outline' },
];

export default function CustomerHome() {
  const router = useRouter();
  const { user, products, createOrder, orders, subscribeToDriver, cart, addToCart, logout } = useDeliveryStore();
  const [activeDriverLoc, setActiveDriverLoc] = React.useState(null);
  const [customerLoc, setCustomerLoc] = React.useState(null);
  const [eta, setEta] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const activeOrder = orders.find(o => o.customerId === user?.uid && o.status !== 'DELIVERED');

  React.useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setCustomerLoc({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      }
    };
    getLocation();
  }, []);

  React.useEffect(() => {
    let unsubscribe;
    if (activeOrder?.driverId) {
      unsubscribe = subscribeToDriver(activeOrder.driverId, (coords) => {
        setActiveDriverLoc(coords);
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [activeOrder?.driverId]);

  React.useEffect(() => {
    if (activeDriverLoc && customerLoc) {
      const distance = calculateDistance(
        activeDriverLoc.latitude,
        activeDriverLoc.longitude,
        customerLoc.latitude,
        customerLoc.longitude
      );
      setEta({
        distance: formatDistance(distance),
        time: calculateETA(distance)
      });
    }
  }, [activeDriverLoc, customerLoc]);

  const handleOrder = async (product) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart(product);
    // Maybe show a toast
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <View>
      {/* Header Info */}
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Deliver to</Text>
          <View style={styles.locationSelector}>
            <Text style={styles.locationText}>Home • 123 Premium St</Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.accent} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.7} onPress={() => router.push('/customer/history')}>
            <Ionicons name="time" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.7} onPress={() => router.push('/customer/cart')}>
            {cart.length > 0 && (
               <View style={styles.cartBadge}>
                 <Text style={styles.cartBadgeText}>{cart.length}</Text>
               </View>
            )}
            <Ionicons name="cart" size={24} color={COLORS.text} style={{ padding: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileButton} 
            activeOpacity={0.7} 
            onPress={() => {
              logout();
              router.replace('/');
            }}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color={COLORS.textDim} style={styles.searchIcon} />
          <TextInput
            placeholder="Search your favorite food..."
            placeholderTextColor={COLORS.textDim}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Active Order Status */}
      {activeOrder && (
        <Animated.View entering={FadeInDown} style={styles.statusContainer}>
          <LinearGradient
            colors={['#1e293b', '#0f172a']}
            style={styles.statusCard}
          >
            <View style={styles.statusHeader}>
              <View style={styles.statusInfoWrapper}>
                <Ionicons 
                  name={activeOrder.status === 'ACCEPTED' ? 'bicycle' : 'time-outline'} 
                  size={24} 
                  color={COLORS.accent} 
                />
                <View style={styles.statusTextWrapper}>
                  <Text style={styles.statusLabel}>Current Order</Text>
                  <Text style={styles.statusTitle}>
                    {activeOrder.status === 'PENDING' ? 'Waiting for assignment' : 
                     activeOrder.status === 'ASSIGNED' ? 'Driver on the way' : 
                     activeOrder.status === 'ACCEPTED' ? 'Order is out!' : 'Processing'}
                  </Text>
                </View>
              </View>
              <Badge label={activeOrder.status} color={COLORS.accent} />
            </View>
            
            {(activeOrder.status === 'ASSIGNED' || activeOrder.status === 'ACCEPTED') && activeDriverLoc && (
              <View style={styles.mapPin}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: (activeDriverLoc.latitude + (customerLoc?.latitude || activeDriverLoc.latitude)) / 2,
                    longitude: (activeDriverLoc.longitude + (customerLoc?.longitude || activeDriverLoc.longitude)) / 2,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  customMapStyle={mapStyle}
                >
                  <Marker coordinate={activeDriverLoc}>
                    <View style={styles.driverMarker}>
                      <Ionicons name="bicycle" size={16} color="white" />
                    </View>
                  </Marker>
                  {customerLoc && (
                    <Marker coordinate={customerLoc}>
                      <View style={styles.customerMarker}>
                        <Ionicons name="home" size={16} color="white" />
                      </View>
                    </Marker>
                  )}
                </MapView>
              </View>
            )}
            
            {activeOrder.status === 'ACCEPTED' && activeDriverLoc && eta && (
               <View style={styles.etaContainer}>
                  <View style={styles.etaBarOuter}>
                    <View style={[styles.etaBarInner, { width: '70%' }]} />
                  </View>
                  <View style={styles.etaStats}>
                    <Text style={styles.etaTime}>{eta.time}</Text>
                    <Text style={styles.etaDistance}>{eta.distance} left</Text>
                  </View>
               </View>
            )}
          </LinearGradient>
        </Animated.View>
      )}

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={[COLORS.accent, '#1d4ed8']}
          start={{x:0, y:0}} end={{x:1, y:1}}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>PROMO</Text>
            </View>
            <Text style={styles.bannerTitle}>30% OFF</Text>
            <Text style={styles.bannerSubtitle}>Use code: FIRST30</Text>
          </View>
          <View style={styles.bannerImageContainer}>
             <Ionicons name="fast-food" size={80} color="rgba(255,255,255,0.2)" />
          </View>
        </LinearGradient>
      </View>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.categoriesList}
      >
        {CATEGORIES.map((cat, index) => (
          <Animated.View key={cat.id} entering={FadeInRight.delay(index * 100)}>
            <TouchableOpacity 
              style={[
                styles.categoryItem,
                selectedCategory === cat.id && styles.categoryItemSelected
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(cat.id === selectedCategory ? null : cat.id);
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === cat.id && styles.categoryIconCircleSelected
              ]}>
                <Ionicons 
                  name={cat.icon} 
                  size={24} 
                  color={selectedCategory === cat.id ? 'white' : COLORS.textDim} 
                />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === cat.id && styles.categoryNameSelected
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { marginLeft: SPACING.l, marginTop: SPACING.l }]}>
        Popular Near You
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[COLORS.primary, '#020617']} style={StyleSheet.absoluteFill} />
      
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.ratingRow}>
                     <Ionicons name="star" size={12} color={COLORS.warning} />
                     <Text style={styles.ratingText}>4.8 (120+)</Text>
                     <Text style={styles.dot}>•</Text>
                     <Text style={styles.deliveryInfo}>25-35 min</Text>
                  </View>
                </View>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
              
              <View style={styles.productFooter}>
                <View style={styles.tagRow}>
                   <Badge label="Free Delivery" variant="outline" color={COLORS.success} />
                </View>
                <TouchableOpacity 
                  onPress={() => handleOrder(item)}
                  style={styles.addButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPin: {
    height: 180,
    borderRadius: RADIUS.l,
    overflow: 'hidden',
    marginTop: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingTop: 60,
    paddingBottom: SPACING.m,
  },
  greeting: {
    color: COLORS.textDim,
    fontSize: 14,
    fontWeight: '500',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  searchInputWrapper: {
    flex: 1,
    height: 54,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.m,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  filterButton: {
    width: 54,
    height: 54,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  statusContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.l,
  },
  statusCard: {
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTextWrapper: {
    gap: 2,
  },
  statusLabel: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  etaContainer: {
    marginTop: SPACING.m,
  },
  etaBarOuter: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  etaBarInner: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 3,
  },
  etaStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  etaTime: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
  etaDistance: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  bannerContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.l,
  },
  banner: {
    padding: SPACING.l,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  bannerContent: {
    flex: 1,
    gap: 4,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bannerBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerImageContainer: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  seeAll: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIconCircleSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    ...SHADOWS.button,
  },
  categoryName: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryNameSelected: {
    color: COLORS.text,
    fontWeight: '800',
  },
  productCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.l,
    borderRadius: RADIUS.l,
    marginBottom: SPACING.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.secondary,
  },
  productInfo: {
    padding: SPACING.m,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  productName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  dot: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  deliveryInfo: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  productPrice: {
    color: COLORS.success,
    fontSize: 20,
    fontWeight: '900',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: COLORS.accent,
  },
  miniMap: {
    ...StyleSheet.absoluteFillObject,
  },
  driverMarker: {
    backgroundColor: COLORS.success,
    padding: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  customerMarker: {
    backgroundColor: COLORS.accent,
    padding: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  }
});
