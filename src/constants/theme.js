export const COLORS = {
  // Backgrounds
  primary: '#0f172a', // Slate 900
  secondary: '#1e293b', // Slate 800
  card: '#1e293b', // Slate 800 (slightly lighter than primary)
  cardAlt: '#334155', // Slate 700
  
  // Accents
  accent: '#3b82f6', // Blue 500
  accentGradientStart: '#60a5fa', // Blue 400
  accentGradientEnd: '#2563eb', // Blue 600
  
  success: '#10b981', // Emerald 500
  warning: '#f59e0b', // Amber 500
  danger: '#ef4444', // Red 500

  // Text
  text: '#f8fafc', // Slate 50
  textSecondary: '#94a3b8', // Slate 400
  textDim: '#94a3b8', // Slate 400 (Improved contrast for dark bg)
  
  // UI Elements
  border: 'rgba(255, 255, 255, 0.08)',
  shadow: '#000000',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const RADIUS = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  button: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  }
};

export const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1e293b" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] }
];

