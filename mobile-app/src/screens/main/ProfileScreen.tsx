import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  Card,
  Button,
  List,
  Divider,
  Switch,
  Badge,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { theme, spacing, typography } from '../../theme';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              dispatch(logout());
            } catch (error) {
              console.error('Logout error:', error);
              dispatch(logout()); // Force logout even if API fails
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available soon!');
  };

  const handleMyListings = () => {
    Alert.alert('Coming Soon', 'My listings page will be available soon!');
  };

  const handleFavorites = () => {
    Alert.alert('Coming Soon', 'Favorites page will be available soon!');
  };

  const handleOffers = () => {
    Alert.alert('Coming Soon', 'Offers page will be available soon!');
  };

  const handleSettings = () => {
    Alert.alert('Coming Soon', 'Settings page will be available soon!');
  };

  const handleHelp = () => {
    Alert.alert('Coming Soon', 'Help & Support will be available soon!');
  };

  const handleSafety = () => {
    Alert.alert('Coming Soon', 'Safety tips will be available soon!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About CirculaX',
      'CirculaX is a modern marketplace that lets you barter your items for things you actually want.\n\nVersion 1.0.0',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={user?.name?.charAt(0) || 'U'}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={theme.colors.secondary} />
                <Text style={styles.rating}>{user?.rating?.toFixed(1) || '5.0'} rating</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
              <Ionicons name="pencil-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Listed</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Trades</Text>
            </View>
          </View>
        </Card>

        {/* My Activity */}
        <Card style={styles.menuCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Activity</Text>
          </View>
          
          <List.Item
            title="My Listings"
            description="Manage your posted items"
            left={(props) => <List.Icon {...props} icon="package-variant-closed" />}
            right={(props) => (
              <View style={styles.listItemRight}>
                <Badge size={20} style={styles.badge}>3</Badge>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={handleMyListings}
            style={styles.listItem}
          />
          
          <Divider />
          
          <List.Item
            title="Favorites"
            description="Items you've saved"
            left={(props) => <List.Icon {...props} icon="heart-outline" />}
            right={(props) => (
              <View style={styles.listItemRight}>
                <Badge size={20} style={styles.badge}>7</Badge>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={handleFavorites}
            style={styles.listItem}
          />
          
          <Divider />
          
          <List.Item
            title="Offers"
            description="Sent and received offers"
            left={(props) => <List.Icon {...props} icon="handshake-outline" />}
            right={(props) => (
              <View style={styles.listItemRight}>
                <Badge size={20} style={styles.badge}>2</Badge>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={handleOffers}
            style={styles.listItem}
          />
        </Card>

        {/* Settings */}
        <Card style={styles.menuCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Settings</Text>
          </View>
          
          <List.Item
            title="Notifications"
            description="Push notifications and alerts"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
            style={styles.listItem}
          />
          
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Toggle dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
            style={styles.listItem}
          />
          
          <Divider />
          
          <List.Item
            title="Account Settings"
            description="Privacy, security, and more"
            left={(props) => <List.Icon {...props} icon="cog-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSettings}
            style={styles.listItem}
          />
        </Card>

        {/* Support */}
        <Card style={styles.menuCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Support</Text>
          </View>
          
          <List.Item
            title="Help & Support"
            description="FAQs and contact support"
            left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleHelp}
            style={styles.listItem}
          />
          
          <Divider />
          
          <List.Item
            title="Safety Tips"
            description="Stay safe while trading"
            left={(props) => <List.Icon {...props} icon="shield-check-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSafety}
            style={styles.listItem}
          />
          
          <Divider />
          
          <List.Item
            title="About CirculaX"
            description="App version and info"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAbout}
            style={styles.listItem}
          />
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonLabel}
          icon="logout"
        >
          Sign Out
        </Button>

        {/* Version Info */}
        <Text style={styles.versionText}>CirculaX v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    margin: spacing.md,
    marginBottom: spacing.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...typography.caption,
    color: theme.colors.onSurface,
    marginLeft: spacing.xs,
  },
  editButton: {
    padding: spacing.sm,
  },
  statsCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: spacing.md,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  cardTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
  },
  listItem: {
    paddingHorizontal: spacing.md,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.error,
    marginRight: spacing.sm,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
    borderColor: theme.colors.error,
  },
  logoutButtonLabel: {
    color: theme.colors.error,
  },
  versionText: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.5,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default ProfileScreen; 