# Delivery App

A unified delivery ecosystem built with React Native and Expo, enabling seamless ordering and delivery management across multiple locations.

## Overview

This mobile application serves as a centralized platform for customers, administrators, and drivers in a delivery service. Customers can browse a unified catalog of items from multiple locations, place orders with cash-on-delivery payment, and track their deliveries in real-time. Administrators manage inventory and assign orders to available drivers, while drivers handle delivery assignments and customer interactions.

## Features

### For Customers
- **Unified Catalog**: Browse items from multiple locations in a single interface
- **Search & Filter**: Easily find desired items
- **Shopping Cart**: Add/remove items and manage quantities
- **Location Services**: Pin delivery address on map or enter manually
- **Dynamic Pricing**: Automatic delivery fee calculation based on distance
- **Order Tracking**: Real-time status updates (Pending, Processing, Driver Assigned, Out for Delivery, Completed)
- **Cash on Delivery**: Secure payment method

### For Administrators
- **Inventory Management**: Add, edit, delete items with photos and pricing
- **Stock Control**: Mark items as available or out of stock
- **Order Management**: View incoming orders and customer locations on map
- **Driver Dispatch**: Assign orders to available drivers
- **Real-time Sync**: Changes reflect immediately across all user interfaces

### For Drivers
- **Duty Status**: Toggle availability (On Duty/Off Duty)
- **Assignment Notifications**: Receive push notifications for new orders
- **Order Acceptance**: Accept assignments to update order status
- **Customer Details**: Access delivery information, contact details, and totals
- **Navigation Integration**: One-tap Google Maps navigation
- **Delivery Completion**: Mark orders as delivered with a single button

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router with React Navigation
- **State Management**: Zustand
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Maps**: React Native Maps with Google Maps integration
- **UI Components**: Expo Vector Icons, Expo Blur, Linear Gradients
- **Development**: TypeScript, ESLint

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd delivery-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Cloud Functions
   - Add your Firebase configuration to the appropriate config files

4. **Configure Google Maps**:
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Add the API key to `app.json` under `android.config.googleMaps.apiKey`

5. **Start the development server**:
   ```bash
   npm start
   ```

## Usage

### Development
- **Start Expo server**: `npm start`
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`
- **Run on Web**: `npm run web`

### Building
- Use Expo Application Services (EAS) for building production apps
- Configure `eas.json` for build profiles

## Project Structure

```
delivery-app/
├── app/                 # Main application screens (Expo Router)
├── components/          # Reusable UI components
├── constants/           # App constants and configurations
├── hooks/              # Custom React hooks
├── src/                # Additional source files
├── assets/             # Images, icons, and other assets
├── scripts/            # Utility scripts
├── docs/               # Documentation and requirements
└── dist/               # Build output
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For questions or support, please contact the development team.

---

Built with ❤️ using React Native and Expo