import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Avatar, Badge, Card, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography } from '../../theme';

interface ChatItem {
  id: string;
  participant: {
    name: string;
    avatar?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  product?: {
    title: string;
    image: string;
  };
  unreadCount: number;
  isOnline: boolean;
}

const MessagesScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  const [chats] = useState<ChatItem[]>([
    {
      id: '1',
      participant: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      },
      lastMessage: {
        text: 'Hi! Is the iPhone still available?',
        timestamp: '2 min ago',
        isRead: false,
      },
      product: {
        title: 'iPhone 13 Pro',
        image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=100',
      },
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      participant: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      lastMessage: {
        text: 'Thanks for the trade! Great doing business with you.',
        timestamp: '1 hour ago',
        isRead: true,
      },
      product: {
        title: 'MacBook Air M2',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100',
      },
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '3',
      participant: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      },
      lastMessage: {
        text: 'Would you be interested in trading for my gaming chair?',
        timestamp: '3 hours ago',
        isRead: false,
      },
      product: {
        title: 'Gaming Setup',
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=100',
      },
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: '4',
      participant: {
        name: 'David Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
      lastMessage: {
        text: 'Can we meet tomorrow at 3 PM?',
        timestamp: '1 day ago',
        isRead: true,
      },
      product: {
        title: 'Vintage Guitar',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100',
      },
      unreadCount: 0,
      isOnline: false,
    },
  ]);

  const filteredChats = chats.filter(chat =>
    chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.product?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleChatPress = (chatId: string) => {
    // Navigate to individual chat screen
    console.log('Navigate to chat:', chatId);
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity onPress={() => handleChatPress(item.id)}>
      <Card style={styles.chatCard}>
        <View style={styles.chatContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={50}
              source={{ uri: item.participant.avatar }}
              style={styles.avatar}
            />
            {item.isOnline && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.participantName} numberOfLines={1}>
                {item.participant.name}
              </Text>
              <View style={styles.timestampContainer}>
                <Text style={styles.timestamp}>
                  {formatTimestamp(item.lastMessage.timestamp)}
                </Text>
                {item.unreadCount > 0 && (
                  <Badge size={20} style={styles.unreadBadge}>
                    {item.unreadCount}
                  </Badge>
                )}
              </View>
            </View>

            <Text
              style={[
                styles.lastMessage,
                !item.lastMessage.isRead && styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage.text}
            </Text>

            {item.product && (
              <View style={styles.productInfo}>
                <Image
                  source={{ uri: item.product.image }}
                  style={styles.productImage}
                />
                <Text style={styles.productTitle} numberOfLines={1}>
                  {item.product.title}
                </Text>
              </View>
            )}
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.outline}
            style={styles.chevron}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.outline} />
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptyDescription}>
        Start trading to begin conversations with other users
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search conversations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Start new conversation')}
        label="New Chat"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: theme.colors.onSurface,
  },
  headerAction: {
    padding: spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchBar: {
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  chatCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: spacing.sm,
    elevation: 1,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  participantName: {
    ...typography.body,
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: spacing.sm,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    ...typography.caption,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginRight: spacing.xs,
  },
  unreadBadge: {
    backgroundColor: theme.colors.error,
  },
  lastMessage: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: spacing.sm,
  },
  unreadMessage: {
    fontWeight: '600',
    opacity: 1,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: spacing.sm,
    borderRadius: 8,
  },
  productImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  productTitle: {
    ...typography.caption,
    color: theme.colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: theme.colors.onSurface,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default MessagesScreen; 