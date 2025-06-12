import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  HelpCircle,
  Package,
  DollarSign,
  Shield,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  className?: string;
}

const quickQuestions = [
  {
    icon: <Package className="h-4 w-4" />,
    text: "How do I list an item?",
    category: "listing"
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    text: "How does bartering work?",
    category: "trading"
  },
  {
    icon: <Shield className="h-4 w-4" />,
    text: "Is it safe to trade here?",
    category: "safety"
  },
  {
    icon: <MapPin className="h-4 w-4" />,
    text: "How to find nearby items?",
    category: "location"
  }
];

const botResponses: { [key: string]: { message: string; suggestions?: string[] } } = {
  "how do i list an item": {
    message: "To list an item on BarterX:\n\n1. Click 'List Item' or go to Add Product page\n2. Upload clear photos of your item\n3. Add a detailed title and description\n4. Select the correct category\n5. Set your location and exchange preferences\n6. Choose if you accept cash, barter, or both\n\nFor food items, listings automatically expire after 24 hours!",
    suggestions: ["What photos should I include?", "How to price my item?", "Can I edit my listing?"]
  },
  "how does bartering work": {
    message: "Bartering on BarterX is simple:\n\n1. Browse items you're interested in\n2. Click 'Make Offer' on any listing\n3. Select items you want to trade\n4. Add cash if needed (if seller accepts)\n5. Wait for the owner to respond\n6. Arrange a safe meetup location\n7. Complete the exchange and rate each other\n\nAlways meet in public places for safety!",
    suggestions: ["What if my offer is rejected?", "How to negotiate?", "Safety tips for meetups"]
  },
  "is it safe to trade here": {
    message: "Yes! BarterX prioritizes your safety:\n\n✅ User ratings and reviews\n✅ Identity verification options\n✅ Safe meetup location suggestions\n✅ In-app messaging system\n✅ Report and block features\n✅ Safety guidelines and tips\n\nAlways meet in public places, bring a friend, and trust your instincts!",
    suggestions: ["Best meetup locations?", "How to report a user?", "Identity verification process"]
  },
  "how to find nearby items": {
    message: "Finding nearby items is easy:\n\n1. Use the 'Nearby' page to see items around you\n2. Allow location access for accurate results\n3. Adjust the distance filter (5-50 miles)\n4. Use category filters to narrow down results\n5. Sort by distance to see closest items first\n\nTip: Food items expire quickly, so check those first!",
    suggestions: ["Can't find my location?", "How to change search radius?", "Best categories to check"]
  },
  "default": {
    message: "Hi! I'm the BarterX assistant. I'm here to help you with:\n\n• Listing items for trade\n• Understanding how bartering works\n• Safety tips and guidelines\n• Finding nearby products\n• Account and technical issues\n\nWhat would you like to know?",
    suggestions: ["How do I list an item?", "How does bartering work?", "Is it safe to trade here?", "How to find nearby items?"]
  }
};

const Chatbot: React.FC<ChatbotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: botResponses.default.message,
      isBot: true,
      timestamp: new Date(),
      suggestions: botResponses.default.suggestions
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): { message: string; suggestions?: string[] } => {
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    // Check for exact matches first
    if (botResponses[normalizedMessage]) {
      return botResponses[normalizedMessage];
    }
    
    // Check for partial matches
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && (normalizedMessage.includes(key) || key.includes(normalizedMessage))) {
        return response;
      }
    }
    
    // Check for keywords
    if (normalizedMessage.includes('list') || normalizedMessage.includes('sell') || normalizedMessage.includes('upload')) {
      return botResponses["how do i list an item"];
    }
    
    if (normalizedMessage.includes('barter') || normalizedMessage.includes('trade') || normalizedMessage.includes('exchange')) {
      return botResponses["how does bartering work"];
    }
    
    if (normalizedMessage.includes('safe') || normalizedMessage.includes('security') || normalizedMessage.includes('trust')) {
      return botResponses["is it safe to trade here"];
    }
    
    if (normalizedMessage.includes('nearby') || normalizedMessage.includes('location') || normalizedMessage.includes('distance')) {
      return botResponses["how to find nearby items"];
    }
    
    // Default response
    return {
      message: "I understand you're asking about that topic. Here are some common questions I can help with:",
      suggestions: ["How do I list an item?", "How does bartering work?", "Is it safe to trade here?", "How to find nearby items?"]
    };
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.message,
        isBot: true,
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={toggleChatbot}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card className={cn(
        "w-80 sm:w-96 shadow-2xl transition-all duration-300",
        isMinimized ? "h-14" : "h-[500px]"
      )}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium">BarterX Assistant</h3>
              <p className="text-xs opacity-90">Online now</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={toggleMinimize}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={toggleChatbot}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.isBot ? "justify-start" : "justify-end"
                    )}
                  >
                    {message.isBot && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg p-3 text-sm",
                        message.isBot
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground ml-8"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto p-2 text-xs"
                              onClick={() => handleQuickQuestion(suggestion)}
                            >
                              <HelpCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    {!message.isBot && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Quick Questions */}
            <div className="p-4 border-t bg-muted/30">
              <div className="text-xs text-muted-foreground mb-2">Quick questions:</div>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 justify-start text-xs"
                    onClick={() => handleQuickQuestion(question.text)}
                  >
                    {question.icon}
                    <span className="ml-1 truncate">{question.text}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Chatbot; 