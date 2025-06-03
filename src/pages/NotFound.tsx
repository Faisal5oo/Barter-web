import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold mt-4">Oops! Page not found</h2>
          <p className="text-muted-foreground mt-2 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button size="lg" onClick={() => navigate('/')}>
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
