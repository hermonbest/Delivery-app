import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

export function Button({ 
  onPress, 
  title, 
  type = 'primary', 
  icon, 
  loading = false, 
  disabled = false,
  style,
  textStyle 
}) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const isPrimary = type === 'primary';
  const isSecondary = type === 'secondary';
  const isOutline = type === 'outline';

  return (
    <TouchableOpacity 
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.container, 
        isSecondary && styles.secondary,
        isOutline && styles.outline,
        disabled && styles.disabled,
        !isPrimary && SHADOWS.card,
        style
      ]}
      activeOpacity={0.8}
    >
      {isPrimary && !disabled && (
        <LinearGradient
          colors={[COLORS.accentGradientStart, COLORS.accentGradientEnd]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFill}
        />
      )}
      
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.accent : 'white'} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={isOutline ? COLORS.accent : 'white'} style={styles.icon} />}
          <Text style={[
            styles.text, 
            isOutline && styles.textOutline,
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: RADIUS.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: SPACING.l,
    ...SHADOWS.button,
  },
  secondary: {
    backgroundColor: COLORS.cardAlt,
    shadowColor: COLORS.shadow,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: COLORS.textDim,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textOutline: {
    color: COLORS.accent,
  },
  icon: {
    marginRight: SPACING.s,
  },
});
