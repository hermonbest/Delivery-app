import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/theme';
import { useDeliveryStore } from '../../services/store';

export default function OrderHistory() {
  const router = useRouter();
  const { user, orders } = useDeliveryStore();

  // Filter orders based on role
  const history = orders.filter(o => {
    if (user?.role === 'CUSTOMER') return o.customerId === user.uid && o.status === 'DELIVERED';
    if (user?.role === 'DRIVER') return o.driverId === user.uid && o.status === 'DELIVERED';
    return false;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.total.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.itemsContainer}>
        {item.items.map((i, idx) => (
          <Text key={idx} style={styles.itemText}>
            {i.quantity}x {i.name}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.statusRow}>
           <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
           <Text style={styles.statusText}>Delivered</Text>
        </View>
        <Text style={styles.orderId}>#{item.id.slice(-4)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, '#020617']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
           {user?.role === 'DRIVER' ? 'Earnings History' : 'My Orders'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color={COLORS.textDim} />
            <Text style={styles.emptyText}>No history yet</Text>
          </View>
        }
      />
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
    paddingBottom: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    padding: SPACING.l,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  priceBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.m,
  },
  itemsContainer: {
    gap: 4,
    marginBottom: SPACING.m,
  },
  itemText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
  },
  orderId: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    gap: SPACING.m,
  },
  emptyText: {
    color: COLORS.textDim,
    fontSize: 16,
  }
});
