import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIChatbot from '@/components/ai/AIChatbot';
import AIRecommendations from '@/components/ai/AIRecommendations';
import UserInsights from '@/components/ai/UserInsights';
import DailyRecommendations from '@/components/ai/DailyRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Bot, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AIDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Bot className="h-16 w-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-4">AI Features</h2>
                <p className="text-muted-foreground mb-6">
                  Please log in to access personalized AI recommendations, insights, and chat assistance.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/">Browse Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Dashboard</h1>
                <p className="text-muted-foreground">
                  Personalized insights and recommendations powered by AI
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="daily">
                <TrendingUp className="h-4 w-4 mr-2" />
                Daily Picks
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <Sparkles className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Brain className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <DailyRecommendations limit={9} showTitle={false} />
            </TabsContent>

            <TabsContent value="recommendations">
              <AIRecommendations limit={9} />
            </TabsContent>

            <TabsContent value="insights">
              <UserInsights />
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">AI Chat Assistant</h3>
                  <p className="text-muted-foreground mb-4">
                    Click the chat button in the bottom right to start chatting with our AI assistant.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AIChatbot defaultMinimized={true} />
      <Footer />
    </div>
  );
};

export default AIDashboard; 