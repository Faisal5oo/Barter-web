import { Bell, LogOut, Menu, Moon, ShoppingBag, Sun, User, Mail, Brain, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLogout } from "@/hooks/useAuthQuery";
import NotificationCenter from "@/components/ai/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const logoutMutation = useLogout();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="h-6 w-6 text-secondary" />
            <h2>Circula<span className="text-[#20b2c5] text-2xl">X</span></h2>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {isAuthenticated && (
            <div className="relative">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages">
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}

          {isAuthenticated && <NotificationCenter />}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-listings">My Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/offers">My Offers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messages">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/ai" className="flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    <span>AI Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {isAuthenticated && (
            <Button className="hidden md:flex" asChild>
              <Link to="/add-product">List an Item</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden p-4 pt-0 bg-background border-b animate-slide-up">
          <nav className="flex flex-col gap-2">
            <Link to="/" className="p-2 hover:bg-muted rounded-md">
              Home
            </Link>
            <Link to="/browse" className="p-2 hover:bg-muted rounded-md">
              Browse
            </Link>
            <Link to="/how-it-works" className="p-2 hover:bg-muted rounded-md">
              How It Works
            </Link>
            <Button className="mt-2" asChild>
              <Link to="/add-product">List an Item</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
