import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryFilter from "@/components/ui/CategoryFilter";
import SearchBar from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake, Package, Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const categories = [
    { name: "Electronics", path: "/category/electronics" },
    { name: "Furniture", path: "/category/furniture" },
    { name: "Clothing", path: "/category/clothing" },
    { name: "Gaming", path: "/category/gaming" },
    { name: "Sports", path: "/category/sports" },
    { name: "Vehicles", path: "/category/vehicles" },
    { name: "Food & Grocery", path: "/category/food-grocery" },
    { name: "Free Stuff", path: "/category/free-stuff" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-marketplace-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                Trade What You Have, <br />
                Get What You Need
              </h1>
              <p className="text-lg opacity-90">
                BarterNexus is a modern marketplace that lets you barter your
                items for things you actually want. No more gathering dust,
                start creating value.
              </p>
              <div className="flex flex-wrap gap-4">
              <Link to="/add-product">
                <Button
                  size="lg"
                  className="bg-marketplace-amber hover:bg-amber-500 text-marketplace-blue"
                >
                  List Your Item
                </Button></Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 hover:bg-white/10 text-marketplace-blue"
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -left-8 top-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 w-60 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-md bg-marketplace-teal/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-marketplace-teal" />
                  </div>
                  <div>
                    <div className="font-medium">New Exchange</div>
                    <div className="text-xs opacity-70">iPhone 13 Pro</div>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/20 rounded-full mb-2"></div>
                <div className="text-xs opacity-70">Just now</div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop"
                alt="People bartering items"
                className="rounded-lg shadow-xl ml-8 object-cover h-[400px]"
              />

              <div
                className="absolute -right-6 bottom-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 w-60 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-md bg-marketplace-amber/20 flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-marketplace-amber" />
                  </div>
                  <div>
                    <div className="font-medium">Deal Complete</div>
                    <div className="text-xs opacity-70">
                      MacBook for iPad + cash
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/20 rounded-full mb-2"></div>
                <div className="text-xs opacity-70">5 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-muted">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {categories.map(({ name, path }) => (
              <Link
                to={path}
                key={name}
                className="bg-white rounded-lg p-6 text-center shadow-soft hover:shadow-hover transition-all duration-300 cursor-pointer"
              >
                <div className="text-lg font-medium">{name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-12">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Recent Listings</h2>
              <p className="text-muted-foreground">
                Find your next trade opportunity
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          <CategoryFilter
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />

          <ProductGrid category={selectedCategory} searchQuery={searchQuery} />

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="gap-2">
              View All Listings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold">How BarterX Works</h2>
            <p className="text-muted-foreground mt-2">
              Simple steps to start trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-8 text-center shadow-soft">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">List Your Items</h3>
              <p className="text-muted-foreground">
                Take a few photos, add a description, and specify if you're
                looking for barter, cash, or both.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 text-center shadow-soft">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Browse & Offer</h3>
              <p className="text-muted-foreground">
                Find items you want and make offers using your own items, cash,
                or a combination of both.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 text-center shadow-soft">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Exchange & Rate</h3>
              <p className="text-muted-foreground">
                Meet safely to exchange items, or arrange shipping. Rate your
                experience afterward.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/how-it-works">
              <Button size="lg">Learn More About the Process</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-16 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4">
                Trading Safely on BarterX
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Meet in public places</h3>
                    <p className="text-muted-foreground">
                      Always arrange exchanges in well-lit, public areas with
                      plenty of people around.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-medium">
                      Verify items before exchanging
                    </h3>
                    <p className="text-muted-foreground">
                      Take time to inspect items thoroughly before finalizing
                      any exchange.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Use secure payment methods</h3>
                    <p className="text-muted-foreground">
                      When cash is involved, use the BarterX secure payment
                      system.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="mt-6">
                Read All Safety Tips
              </Button>
            </div>

            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=1266&auto=format&fit=crop"
                alt="People meeting safely to exchange items"
                className="rounded-lg shadow-md w-full h-[300px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
