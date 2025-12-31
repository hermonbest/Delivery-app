import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export function Badge({ 
  label, 
  color = COLORS.accent, 
  variant = 'solid', // 'solid', 'outline', 'ghost'
  style 
}) {
  const isSolid = variant === 'solid';
  const isOutline = variant === 'outline';
  
  return (
    <View style={[
      styles.container, 
      isOutline && { borderColor: color, borderWidth: 1 },
      !isSolid && { backgroundColor: 'transparent' },
      isSolid && { backgroundColor: color },
      style
    ]}>
      <Text style={[
        styles.text,
        !isSolid && { color: color }
      ]}>
        {label?.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: RADIUS.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  }
});
