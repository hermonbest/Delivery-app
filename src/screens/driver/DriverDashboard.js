import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useDeliveryStore } from '../../services/store';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, orders, acceptOrder, completeOrder, updateDriverLocation, logout } = useDeliveryStore();

  const myJobs = orders.filter(o => o.status === 'ASSIGNED' || o.status === 'ACCEPTED');

  React.useEffect(() => {
    let watchId;
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced, 
          timeInterval: 5000, 
          distanceInterval: 10,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          updateDriverLocation({ latitude, longitude });
        }
      );
    };
    startTracking();
    return () => watchId && watchId.remove();
  }, []);

  const handleAccept = async (id) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await acceptOrder(id);
  };

  const handleComplete = async (id) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeOrder(id);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[COLORS.primary, '#020617']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>WELCOME BACK</Text>
          <Text style={styles.headerTitle}>Active Route</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.statusPill, { marginRight: 8 }]} 
            onPress={() => router.push('/driver/history')}
          >
             <Ionicons name="time" size={16} color={COLORS.accent} />
             <Text style={[styles.statusPillText, { color: COLORS.accent }]}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusPill} activeOpacity={0.7}>
             <View style={styles.statusDot} />
             <Text style={styles.statusPillText}>Online</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusPill, { marginLeft: 8, borderColor: COLORS.error, backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} 
            onPress={() => {
              logout();
              router.replace('/');
            }}
          >
             <Ionicons name="log-out-outline" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {myJobs.length === 0 && (
          <View style={styles.emptyState}>
             <View style={styles.emptyIconContainer}>
               <Ionicons name="car-sport" size={64} color={COLORS.accent} />
             </View>
             <Text style={styles.emptyText}>Looking for deliveries...</Text>
             <Text style={styles.emptySubText}>New orders will appear here automatically.</Text>
          </View>
        )}

        {myJobs.map((order, index) => {
           const isAssigned = order.status === 'ASSIGNED';
           const isActive = order.status === 'ACCEPTED';
           
           return (
            <Animated.View 
              key={order.id} 
              entering={FadeInDown.delay(index * 100)}
              layout={Layout.springify()}
              style={styles.jobCard}
            >
              <View style={styles.cardTop}>
                 <View>
                    <Text style={styles.jobId}>ORDER #{order.id.slice(-4).toUpperCase()}</Text>
                    <Text style={styles.addressTitle}>{order.address}</Text>
                 </View>
                 <Badge 
                    label={order.status} 
                    color={isActive ? COLORS.success : COLORS.accent} 
                    variant="outline"
                 />
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.detailsRow}>
                 <View style={styles.detailItem}>
                    <Ionicons name="cube-outline" size={16} color={COLORS.textDim} />
                    <Text style={styles.detailText}>{order.items.length} Items</Text>
                 </View>
                 <View style={styles.detailItem}>
                    <Ionicons name="cash-outline" size={16} color={COLORS.textDim} />
                    <Text style={styles.detailText}>COD: ${order.total}</Text>
                 </View>
              </View>

              {isActive && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: 37.78825, // Fallback
                      longitude: -122.4324, // Fallback
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    customMapStyle={mapStyle}
                  >
                    <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}>
                      <View style={styles.driverMarker}>
                        <Ionicons name="car" size={20} color="white" />
                      </View>
                    </Marker>
                  </MapView>
                </View>
              )}

              <View style={styles.actionRow}>
                {isAssigned ? (
                  <Button 
                    title="Accept Job" 
                    icon="chevron-forward"
                    onPress={() => handleAccept(order.id)}
                    style={{ flex: 1 }}
                  />
                ) : (
                  <View style={styles.activeActionsList}>
                    <TouchableOpacity 
                      style={styles.navCircButton}
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                      <Ionicons name="navigate" size={24} color={COLORS.accent} />
                    </TouchableOpacity>
                    <Button 
                      title="Complete" 
                      type="secondary"
                      onPress={() => handleComplete(order.id)}
                      style={{ flex: 1, backgroundColor: COLORS.success }}
                    />
                  </View>
                )}
              </View>
            </Animated.View>
           );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLabel: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusPillText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xxl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  emptyText: {
    color: COLORS.textDim,
    fontSize: 18,
  },
  jobCard: {
    borderRadius: 24,
    marginBottom: SPACING.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.l,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  jobId: {
    color: COLORS.textDim,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: COLORS.success,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.s,
  },
  address: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  itemsText: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.l,
    fontSize: 14,
  },
  actionArea: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: SPACING.m,
  },
  acceptButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  gradientButton: {
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeActions: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  completeButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverMarker: {
    backgroundColor: COLORS.accent,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  }
});
