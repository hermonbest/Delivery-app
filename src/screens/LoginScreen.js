import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../constants/theme';
import { useDeliveryStore } from '../services/store';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, user, seedDemoUsers } = useDeliveryStore();
  const router = useRouter();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      // store.login updates the user state. 
      // We need to check useDeliveryStore().user to see the role, 
      // but since state update might be async/batched, useDeliveryStore.getState() is safer 
      // OR rely on the fact that login throws if failed.
      
      const updatedUser = useDeliveryStore.getState().user;
      
      if (updatedUser) {
        if (updatedUser.role === 'CUSTOMER') router.replace('/customer/home');
        else if (updatedUser.role === 'DRIVER') router.replace('/driver/dashboard');
        else if (updatedUser.role === 'ADMIN') router.replace('/admin/dashboard');
        else router.replace('/(tabs)');
      }
    } catch (e) {
      // Alert handled in store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, '#020617']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="cube" size={48} color={COLORS.accent} />
          </View>
          <Text style={styles.title}>UniDeliver</Text>
          <Text style={styles.subtitle}>Unified Delivery Ecosystem</Text>
        </View>

        <View style={styles.form}>
           <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textDim} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.textDim}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textDim} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textDim}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
               colors={[COLORS.accent, COLORS.accentGradientEnd]}
               style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.footerText}>New here? <Text style={styles.linkText}>Create Account</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.seedButton} onPress={seedDemoUsers}>
            <Text style={styles.seedButtonText}>Seed Demo Accounts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoContainer: {
    marginBottom: SPACING.m,
    padding: SPACING.m,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1,
    marginBottom: SPACING.s,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  form: {
    gap: SPACING.m,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: SPACING.m,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.s,
    color: COLORS.text,
    fontSize: 16,
  },
  loginButton: {
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: SPACING.m,
    ...SHADOWS.button,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.l,
  },
  linkText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  seedButton: {
    marginTop: SPACING.xl,
    padding: SPACING.s,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
  },
  seedButtonText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '600',
  }
});
