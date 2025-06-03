import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Package, Handshake, Mail, Star, Clock, CheckCircle2, XCircle, AlertCircle, Filter, Search, Send, Image as ImageIcon, Paperclip, Smile, Loader2, Smartphone, Monitor, Car, Sofa, ShoppingBag } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChats, useChatMessages, useSendMessage, useMarkMessageAsRead } from '@/hooks/useChats';
import { useAcceptOffer, useRejectOffer } from '@/hooks/useOffers';

const ChatsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const { data: chatsData, isLoading: chatsLoading } = useChats();
  const { data: messagesData, isLoading: messagesLoading } = useChatMessages(selectedChatId || '');
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessageAsRead();
  const acceptOfferMutation = useAcceptOffer();
  const rejectOfferMutation = useRejectOffer();

  const chats = chatsData?.chats || [];
  const messages = messagesData?.messages || [];
  const selectedChat = chats.find(chat => chat._id === selectedChatId);

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0]._id);
    }
  }, [chats, selectedChatId]);

  const getCategoryIcon = (category: string, size = 'small') => {
    const categoryLower = category?.toLowerCase() || '';
    const iconSize = size === 'small' ? 'h-4 w-4' : 'h-6 w-6';
    
    if (categoryLower.includes('electronics') || categoryLower.includes('phone') || categoryLower.includes('mobile')) {
      return <Smartphone className={`${iconSize} text-muted-foreground`} />;
    }
    if (categoryLower.includes('computer') || categoryLower.includes('laptop') || categoryLower.includes('monitor')) {
      return <Monitor className={`${iconSize} text-muted-foreground`} />;
    }
    if (categoryLower.includes('vehicle') || categoryLower.includes('car') || categoryLower.includes('bike')) {
      return <Car className={`${iconSize} text-muted-foreground`} />;
    }
    if (categoryLower.includes('furniture') || categoryLower.includes('chair') || categoryLower.includes('table')) {
      return <Sofa className={`${iconSize} text-muted-foreground`} />;
    }
    return <ShoppingBag className={`${iconSize} text-muted-foreground`} />;
  };

  const ProductImageInMessage = ({ product }: { product: any }) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = product?.images?.[0];
    
    if (!imageUrl || imageError) {
      return (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
          {getCategoryIcon(product?.category)}
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={product?.title || 'Product'}
        className="w-12 h-12 rounded-lg object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    try {
      await sendMessageMutation.mutateAsync({
        chatId: selectedChatId,
        messageData: {
          content: messageInput.trim(),
          type: 'text'
        }
      });
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await acceptOfferMutation.mutateAsync(offerId);
    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      await rejectOfferMutation.mutateAsync(offerId);
    } catch (error) {
      console.error('Failed to reject offer:', error);
    }
  };

  const renderOfferMessage = (message: any) => {
    if (!message.offer) return null;

    const offer = message.offer;
    const isMyMessage = message.sender._id === user?.id;

    return (
      <Card className="bg-muted/50 mt-2">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Barter Offer</p>
              <Badge variant={
                offer.status === 'accepted' ? 'default' :
                offer.status === 'rejected' ? 'destructive' :
                offer.status === 'cancelled' ? 'secondary' : 'outline'
              }>
                {offer.status}
              </Badge>
            </div>
            
            {offer.offeredProduct && (
              <div>
                <p className="text-sm font-medium mb-2">Offered Item:</p>
                <div className="flex items-center gap-3">
                  <ProductImageInMessage product={offer.offeredProduct} />
                  <div>
                    <p className="text-sm font-medium">{offer.offeredProduct.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.offeredProduct.condition} • {offer.offeredProduct.category}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {offer.requestedProduct && (
              <div>
                <p className="text-sm font-medium mb-2">For Item:</p>
                <div className="flex items-center gap-3">
                  <ProductImageInMessage product={offer.requestedProduct} />
                  <div>
                    <p className="text-sm font-medium">{offer.requestedProduct.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.requestedProduct.condition} • {offer.requestedProduct.category}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Exchange Type Display */}
            {offer.exchangeType && (
              <div>
                <Badge variant="outline" className="text-xs">
                  {offer.exchangeType === 'barter' && 'Product Exchange'}
                  {offer.exchangeType === 'barter_plus_cash' && 'Product + Cash'}
                  {offer.exchangeType === 'cash_only' && 'Cash Only'}
                </Badge>
                {offer.cashAmount && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {offer.exchangeType === 'cash_only' ? '' : '+ '}PKR {offer.cashAmount.toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {offer.message && (
              <div>
                <p className="text-sm font-medium mb-1">Message:</p>
                <p className="text-sm text-muted-foreground">{offer.message}</p>
              </div>
            )}

            {!isMyMessage && offer.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleAcceptOffer(offer._id)}
                  disabled={acceptOfferMutation.isPending}
                >
                  {acceptOfferMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept'}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => handleRejectOffer(offer._id)}
                  disabled={rejectOfferMutation.isPending}
                >
                  {rejectOfferMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const otherParticipant = chat.participants.find(p => p._id !== user?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (chatsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading chats...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground mt-2">
              Manage your conversations and barter negotiations
            </p>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="messages" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </TabsTrigger>
                <TabsTrigger value="listings" onClick={() => navigate('/my-listing')}>
                  <Package className="h-4 w-4 mr-2" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="offers" onClick={() => navigate('/offers')}>
                  <Handshake className="h-4 w-4 mr-2" />
                  My Offers
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <Mail className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {chats.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start making offers on products to begin conversations with other users.
                </p>
                <Button onClick={() => navigate('/browse')}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </CardContent>
                </Card>

                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {filteredChats.map((chat) => {
                      const otherParticipant = chat.participants.find(p => p._id !== user?.id);
                      const unreadCount = 0;

                      return (
                        <Card
                          key={chat._id}
                          className={`cursor-pointer transition-colors ${
                            selectedChatId === chat._id ? 'bg-muted' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedChatId(chat._id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback>{otherParticipant?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{otherParticipant?.name || 'Unknown User'}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {chat.lastActivity ? new Date(chat.lastActivity).toLocaleTimeString() : ''}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {chat.offer?.status && (
                                    <Badge variant="outline" className="text-xs">
                                      {chat.offer.status}
                                    </Badge>
                                  )}
                                  <p className="text-sm text-muted-foreground truncate">
                                    {chat.lastMessage?.content || 'No messages yet'}
                                  </p>
                                </div>
                              </div>
                              {unreadCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="lg:col-span-3">
                {selectedChat ? (
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="border-b">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {selectedChat.participants.find(p => p._id !== user?.id)?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {selectedChat.participants.find(p => p._id !== user?.id)?.name || 'Unknown User'}
                            </h3>
                          </div>
                          {selectedChat.offer?.status && (
                            <Badge variant="outline" className="text-xs">
                              Offer: {selectedChat.offer.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <ScrollArea className="flex-1 p-4">
                      {messagesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="ml-2 text-muted-foreground">Loading messages...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message._id}
                              className={`flex ${
                                message.sender._id === user?.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div className={`max-w-[80%] ${
                                message.sender._id === user?.id 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              } rounded-lg p-4`}>
                                <p>{message.content}</p>
                                {message.type === 'offer' && renderOfferMessage(message)}
                                <p className="text-xs opacity-70 mt-2">
                                  {new Date(message.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1"
                          disabled={sendMessageMutation.isPending}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim() || sendMessageMutation.isPending}
                        >
                          {sendMessageMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">
                        Choose a chat from the list to start messaging
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatsPage; 