import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/theme';
import { useDeliveryStore } from '../../services/store';

export default function Register() {
  const router = useRouter();
  const { isLoading, register } = useDeliveryStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('CUSTOMER'); // Default

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert("Please fill all fields");
      return;
    }
    const success = await register(email, password, name, role);
    if (success) {
      if (role === 'CUSTOMER') router.replace('/customer/home');
      else if (role === 'DRIVER') router.replace('/driver/dashboard');
      else router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, '#020617']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the premium delivery network</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textDim} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.textDim}
              value={name}
              onChangeText={setName}
            />
          </View>

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

          <Text style={styles.label}>Register as:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'CUSTOMER' && styles.activeRole]} 
              onPress={() => setRole('CUSTOMER')}
            >
              <Text style={[styles.roleText, role === 'CUSTOMER' && styles.activeRoleText]}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'DRIVER' && styles.activeRole]} 
              onPress={() => setRole('DRIVER')}
            >
              <Text style={[styles.roleText, role === 'DRIVER' && styles.activeRoleText]}>Driver</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentGradientEnd]}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerText}>Already have an account? <Text style={styles.linkText}>Log In</Text></Text>
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
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  form: {
    gap: SPACING.m,
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
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: SPACING.s,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeRole: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  roleText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeRoleText: {
    color: COLORS.accent,
  },
  button: {
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
  }
});
