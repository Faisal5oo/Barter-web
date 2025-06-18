# CirculaX Mobile App


## 🚀 Features

### Core Functionality
- **User Authentication**: Login, registration, and secure token management
- **Product Browsing**: Search, filter, and browse available items
- **Product Management**: Add, edit, and manage your listings
- **Messaging**: Chat with other users about trades
- **Favorites**: Save items you're interested in
- **Profile Management**: View and edit your profile information

### Advanced Features
- **AI Integration**: Smart recommendations and chatbot assistance
- **Real-time Messaging**: Instant communication with other traders
- **Image Upload**: Camera and gallery integration for product photos
- **Location Services**: Location-based product discovery
- **Push Notifications**: Stay updated on messages and offers
- **Dark Mode Support**: Toggle between light and dark themes

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **UI Components**: React Native Paper
- **Forms**: React Hook Form with Zod validation
- **Storage**: Expo SecureStore
- **Image Handling**: Expo Image Picker
- **Icons**: Expo Vector Icons
- **Animations**: React Native Reanimated

## 📱 Screenshots

[Add screenshots of your app here]

## 🏗 Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProductCard.tsx
│   │   └── CategoryFilter.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── main/          # Main app screens
│   │   └── product/       # Product-related screens
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── favoritesService.ts
│   │   └── aiService.ts
│   ├── store/             # Redux store
│   │   ├── index.ts
│   │   └── slices/
│   └── theme/             # Theme configuration
│       └── index.ts
├── App.tsx                # Root component
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-url.com
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

### API Configuration

The app is configured to work with mock data in development mode. To connect to a real backend:

1. Update the `API_BASE_URL` in `src/services/api.ts`
2. Remove or modify the mock data fallbacks in service files
3. Ensure your backend API matches the expected endpoints

## 📱 Screens Overview

### Authentication
- **LoginScreen**: User login with email/password
- **RegisterScreen**: New user registration
- **ForgotPasswordScreen**: Password reset functionality

### Main App
- **HomeScreen**: Dashboard with recent listings and categories
- **BrowseScreen**: Search and filter products
- **AddProductScreen**: Create new product listings
- **MessagesScreen**: View all conversations
- **ProfileScreen**: User profile and settings

### Product Management
- **ProductDetailScreen**: Detailed product view
- **FavoritesScreen**: Saved products
- **EditProductScreen**: Edit existing listings

## 🎨 Theming

The app uses a consistent design system with:

- **Colors**: Primary blue (#0ea5e9), secondary amber (#f59e0b), tertiary teal (#14b8a6)
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Components**: Material Design 3 components via React Native Paper

### Dark Mode

Dark mode is supported and can be toggled in the profile settings. The theme automatically adapts all colors and components.

## 🔐 Authentication

The app uses JWT-based authentication with:

- Secure token storage using Expo SecureStore
- Automatic token refresh
- Logout on token expiration
- Mock authentication for development

## 📡 API Integration

### Services Architecture

Each service handles a specific domain:

- **authService**: Authentication and user management
- **productService**: Product CRUD operations
- **favoritesService**: Favorites management
- **aiService**: AI features and recommendations

### Mock Data

In development mode, all services fall back to mock data when API calls fail, allowing for offline development and testing.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Building for Production

### iOS

1. **Configure app.json**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.yourcompany.barterx"
       }
     }
   }
   ```

2. **Build**
   ```bash
   expo build:ios
   ```

### Android

1. **Configure app.json**
   ```json
   {
     "expo": {
       "android": {
         "package": "com.yourcompany.barterx"
       }
     }
   }
   ```

2. **Build**
   ```bash
   expo build:android
   ```

## 🚀 Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build and Submit**
   ```bash
   # Build
   eas build --platform all
   
   # Submit to stores
   eas submit --platform ios
   eas submit --platform android
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core trading functionality
- **v1.1.0** - Added AI features and recommendations
- **v1.2.0** - Enhanced messaging and notifications

## 🙏 Acknowledgments

- React Native community
- Expo team
- Material Design team
- All contributors and testers

---

**Happy Trading! 🔄📱** 