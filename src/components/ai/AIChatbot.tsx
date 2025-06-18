import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Trash2, 
  Minimize2,
  Sparkles
} from 'lucide-react';
import { useChatConversation, useAIStatus } from '@/hooks/useAI';
import { cn } from '@/lib/utils';

interface AIChatbotProps {
  className?: string;
  defaultMinimized?: boolean;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ 
  className, 
  defaultMinimized = false 
}) => {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: aiStatus } = useAIStatus();
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    clearConversation,
    isLoading 
  } = useChatConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    
    await sendMessage(message, user?.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const suggestedQuestions = [
    "What free items are available?",
    "How does bartering work?", 
    "Show me electronics for trade",
    "How do I list an item?",
    "Is it safe to trade here?",
    "How to find nearby items?",
    "What's the best way to negotiate?",
    "How do ratings work?"
  ];

  const predefinedAnswers = {
    "how do i list an item": "To list an item: 1) Click 'List Item' 2) Upload photos 3) Add description 4) Set category 5) Choose exchange preferences. Food items expire in 24 hours!",
    "how does bartering work": "Bartering is simple: 1) Browse items 2) Make offers with your items/cash 3) Negotiate 4) Meet safely 5) Exchange & rate. Always meet in public!",
    "is it safe to trade here": "Yes! CirculaX has user ratings, identity verification, safe meetup suggestions, and reporting features. Always meet in public places!",
    "how to find nearby items": "Use the 'Nearby' page, enable location access, adjust distance filters (5-50 miles), and use category filters to find local items.",
    "what's the best way to negotiate": "Be fair, communicate clearly, consider both items' value, be flexible with add-ons like cash, and always be respectful.",
    "how do ratings work": "After each trade, both users rate each other (1-5 stars). Good ratings build trust and help you get better trade offers!"
  };

  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsMinimized(false)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-float hover:animate-none transition-all duration-300 hover:scale-110 animate-glow"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <Card className="w-96 h-[600px] shadow-2xl border-2 animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">CirculaX AI Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">
                {aiStatus?.available !== false ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[520px]">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-medium mb-2">Welcome to CirculaX AI!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    I can help you find products and understand bartering.
                  </p>
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs mx-1 mb-2"
                      onClick={() => setInputMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex space-x-2",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex space-x-2 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CirculaX..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChatbot; 