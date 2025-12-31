import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';

import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { create } from 'zustand';
import { auth, db } from './firebaseConfig';


// --- Types ---
// OrderStatus: 'PENDING' | 'ASSIGNED' | 'ACCEPTED' | 'DELIVERED'

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Burger Combo', price: 15.0, image: 'https://images.unsplash.com/photo-1571091723214-1b8c9ee65a6f?w=500' },
  { id: 'p2', name: 'Pizza Party', price: 25.0, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
  { id: 'p3', name: 'Sushi Set', price: 30.0, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500' },
  { id: 'p4', name: 'Ice Cream', price: 5.0, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400' },
];

export const useDeliveryStore = create((set, get) => ({
  // --- State ---
  user: null, 
  orders: [], 
  products: MOCK_PRODUCTS,
  drivers: [], // Real connected drivers
  isLoading: false,
  cart: [],
  
  // --- Actions ---

  // Auth: Email/Password Login + Role Fetch
  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user role from Firestore
      const userDocRef = doc(db, 'users', cred.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let role = 'CUSTOMER';
      let name = email.split('@')[0];

      if (userDoc.exists()) {
        const data = userDoc.data();
        role = data.role || 'CUSTOMER';
        name = data.name || name;
      }

      set({ 
        user: { 
          uid: cred.user.uid, 
          email, 
          name, 
          role 
        },
        isLoading: false 
      });
      console.log(`User logged in as ${role}`);
      
      // Initialize listeners
      get().subscribeToOrders();
      if (role === 'DRIVER') {
          // ensure driver doc exists ? or just update status
          // maybe fetch existing driver status
      }
      
    } catch (e) {
      console.error("Login Error:", e);
      set({ isLoading: false });
      alert(e.message);
      throw e; // Rethrow so UI knows it failed
    }
  },

  register: async (email, password, name, role) => {
    try {
      set({ isLoading: true });
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userId = cred.user.uid;

      // Save user profile to Firestore
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        uid: userId,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });

      set({ 
        user: { uid: userId, email, name, role },
        isLoading: false 
      });

      if (role === 'DRIVER') {
        const driverRef = doc(db, 'drivers', userId);
        await setDoc(driverRef, {
          driverId: userId,
          driverName: name,
          status: 'IDLE',
        }, { merge: true });
      }

      get().subscribeToOrders();
      return true;
    } catch (e) {
      console.error("Register Error:", e);
      set({ isLoading: false });
      alert(e.message);
      return false;
    }
  },

  logout: async () => {
    await auth.signOut();
    set({ user: null, cart: [] });
  },

  // Real-time: Orders
  subscribeToOrders: () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        set({ orders });
      });
    } catch (e) {
      console.error("Subscribe Orders Error:", e);
    }
  },

  // Real-time: Drivers
  subscribeToDrivers: () => {
    try {
      const q = query(collection(db, 'drivers'));
      return onSnapshot(q, (snapshot) => {
        const driversList = snapshot.docs.map(d => ({ 
          id: d.id, 
          name: d.data().driverName || d.data().name || 'Anonymous Driver',
          status: d.data().status || 'IDLE',
          ...d.data() 
        }));
        set({ drivers: driversList });
      });
    } catch (e) {
      console.error("Subscribe Drivers Error:", e);
    }
  },

  // Customer: Create Order
  createOrder: async (items, total, address) => {
    try {
      const { user } = get();
      if (!user) {
        alert("Please log in first!");
        return false;
      }
      
      await addDoc(collection(db, 'orders'), {
        customerId: user.uid,
        customerName: user.name,
        items,
        total,
        address,
        status: 'PENDING',
        driverId: null,
        createdAt: new Date().toISOString(),
      });
      console.log("Order placed in Firestore!");
      return true;
    } catch (e) {
      console.error("Create Order Error:", e);
      alert("Failed to place order. " + e.message);
      return false;
    }
  },

  // Admin: Assign Driver
  assignDriver: async (orderId, driverId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'ASSIGNED',
        driverId
      });
      console.log(`Order ${orderId} Assigned to ${driverId}`);
    } catch (e) {
      console.error("Assign Driver Error:", e);
    }
  },

  // Driver: Accept Order
  acceptOrder: async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'ACCEPTED' });
    } catch (e) {
      console.error("Accept Order Error:", e);
    }
  },

  // Driver: Complete Order
  completeOrder: async (orderId) => {
     try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'DELIVERED' });
    } catch (e) {
      console.error("Complete Order Error:", e);
    }
  },

  // GPS Tracking: Update Driver Location in Firestore
  updateDriverLocation: async (location) => {
    try {
      const { user } = get();
      if (!user || user.role !== 'DRIVER') return;
      // Real GPS Update
      const driverRef = doc(db, 'drivers', user.uid);
      await setDoc(driverRef, {
        coords: location,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("GPS Update Error:", e);
    }
  },

  // GPS Tracking: Subscribe to specific driver (for Customer View)
  subscribeToDriver: (driverId, callback) => {
    if (!driverId) return;
    const driverRef = doc(db, 'drivers', driverId);
    console.log("[GPS] Subscribing to Driver:", driverId);
    return onSnapshot(driverRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.coords) {
          console.log("[GPS] Received Update:", data.coords);
          callback(data.coords);
        }
      }
    });
  },

  // --- Cart Actions ---
  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      set({ cart: cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    set({ cart: cart.filter(i => i.id !== productId) });
  },

  clearCart: () => set({ cart: [] }),

  seedDemoUsers: async () => {
    const demos = [
      { email: 'admin@demo.com', pass: 'password123', name: 'Demo Admin', role: 'ADMIN' },
      { email: 'driver1@demo.com', pass: 'password123', name: 'John Driver', role: 'DRIVER' },
      { email: 'driver2@demo.com', pass: 'password123', name: 'Alex Driver', role: 'DRIVER' },
      { email: 'customer1@demo.com', pass: 'password123', name: 'Jane Customer', role: 'CUSTOMER' },
      { email: 'customer2@demo.com', pass: 'password123', name: 'Bob Customer', role: 'CUSTOMER' },
    ];
    
    set({ isLoading: true });
    for (const d of demos) {
      try {
        await get().register(d.email, d.pass, d.name, d.role);
        await auth.signOut(); // Important to allow next registration
      } catch (e) {
        console.log(`User ${d.email} already exists or failed.`);
      }
    }
    set({ isLoading: false, user: null });
    alert("Seed completed! Use password123 for all demo accounts.");
  },
}));
