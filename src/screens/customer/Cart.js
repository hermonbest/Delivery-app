import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/theme';
import { useDeliveryStore } from '../../services/store';

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, createOrder } = useDeliveryStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // In a real app, we'd have an address picker here
    const success = await createOrder(cart, total, "123 Premium St"); // Mock address
    if (success) {
      clearCart();
      router.back();
      alert("Order Placed Successfully!");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, '#020617']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={clearCart}>
           <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={80} color={COLORS.textDim} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.browseButton}>
              <Text style={styles.browseText}>Browse Items</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cart.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>x{item.quantity}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
             style={styles.checkoutButton}
             onPress={handleCheckout}
          >
             <LinearGradient
               colors={[COLORS.accent, COLORS.accentGradientEnd]}
               style={styles.checkoutGradient}
             >
                <Text style={styles.checkoutText}>Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
             </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
  clearText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
    gap: SPACING.m,
  },
  emptyText: {
    color: COLORS.textDim,
    fontSize: 18,
  },
  browseButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  browseText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.s,
    borderRadius: 16,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  quantityContainer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: SPACING.m,
  },
  quantityText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.l,
    paddingBottom: 40,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  checkoutGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
