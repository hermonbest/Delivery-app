import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { useDeliveryStore } from '../../services/store';

export default function AdminDashboard() {
  const router = useRouter();
  const { orders, drivers, assignDriver, logout, subscribeToDrivers } = useDeliveryStore();

  React.useEffect(() => {
    const unsub = subscribeToDrivers();
    return () => unsub && unsub();
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const availableDrivers = drivers; // Show all connected drivers for now for easier testing

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, '#020617']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dispatch Center</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.refreshButton, { borderColor: COLORS.error }]} 
            onPress={() => {
              logout();
              router.replace('/');
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingOrders.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{availableDrivers.length}</Text>
          <Text style={[styles.statLabel, { color: COLORS.success }]}>Drivers</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Incoming Requests</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pendingOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderBadge}>
                <Ionicons name="time" size={14} color="#f59e0b" />
                <Text style={styles.orderBadgeText}>PENDING</Text>
              </View>
              <Text style={styles.orderPrice}>${order.total}</Text>
            </View>
            
            <Text style={styles.customerName}>{order.customerName || 'Unknown Customer'}</Text>
            <Text style={styles.address}>{order.address}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.assignTitle}>ASSIGN DRIVER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.driverScroll}>
              {availableDrivers.map(driver => (
                <TouchableOpacity 
                  key={driver.id}
                  onPress={() => assignDriver(order.id, driver.id)}
                  style={styles.driverChip}
                >
                  <View style={styles.driverAvatar}>
                    <Text style={styles.driverInitials}>{driver.name[0]}</Text>
                  </View>
                  <Text style={styles.driverName}>{driver.name}</Text>
                </TouchableOpacity>
              ))}
              {availableDrivers.length === 0 && (
                <Text style={{ color: COLORS.textDim }}>No drivers available</Text>
              )}
            </ScrollView>
          </View>
        ))}
        {pendingOrders.length === 0 && (
          <View style={styles.emptyState}>
             <Ionicons name="checkmark-circle-outline" size={64} color="rgba(255,255,255,0.1)" />
             <Text style={styles.emptyText}>All caught up!</Text>
          </View>
        )}
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
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: SPACING.l,
    marginBottom: SPACING.m,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xxl,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  orderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  orderBadgeText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderPrice: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  address: {
    color: COLORS.textDim,
    fontSize: 14,
    marginBottom: SPACING.m,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.m,
  },
  assignTitle: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
  },
  driverScroll: {
    marginHorizontal: -SPACING.s,
  },
  driverChip: {
    alignItems: 'center',
    marginHorizontal: SPACING.s,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 4,
  },
  driverInitials: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  driverName: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textDim,
    marginTop: SPACING.m,
  }
});
