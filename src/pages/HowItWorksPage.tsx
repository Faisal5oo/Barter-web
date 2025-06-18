import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  UserPlus, 
  Package, 
  Search, 
  MessageSquare, 
  Handshake, 
  CheckCircle,
  CreditCard,
  Brain,
  MapPin,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Create an Account",
      description: "Join for free by registering with your email and location."
    },
    {
      number: 2,
      icon: Package,
      title: "List Your Item",
      description: "Post what you're offering — whether you're looking to sell or trade it. Include pictures, details, and your preferred offer type."
    },
    {
      number: 3,
      icon: Search,
      title: "Browse Listings",
      description: "Explore items posted by others. Filter by category, location, or barter/sale type."
    },
    {
      number: 4,
      icon: MessageSquare,
      title: "Send a Barter or Purchase Request",
      description: "Interested in something? Propose a trade using your listed item or offer to buy it directly."
    },
    {
      number: 5,
      icon: MessageCircle,
      title: "Negotiate & Chat",
      description: "Use our built-in chat system to discuss the deal. Work out details in real time."
    },
    {
      number: 6,
      icon: CheckCircle,
      title: "Finalize the Exchange",
      description: "Once both parties agree, meet up and exchange the items. Leave a review to help grow our trusted community!"
    }
  ];

  const benefits = [
    {
      icon: CreditCard,
      title: "Cashless Trading",
      description: "No money needed — trade what you have for what you need."
    },
    {
      icon: Brain,
      title: "Smart Matching",
      description: "AI-powered suggestions connect you to the best barter opportunities."
    },
    {
      icon: MapPin,
      title: "Location Aware",
      description: "See listings closest to you for easier, safer meetups."
    },
    {
      icon: MessageCircle,
      title: "Built-in Messaging",
      description: "Chat instantly to negotiate, clarify, and close the deal."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-marketplace-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              How CirculaX Works
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Barter, Buy, and Sell — Simply and Safely
            </p>
            <p className="text-lg opacity-80 max-w-4xl mx-auto">
              CirculaX is your all-in-one platform for exchanging goods directly with people near you. 
              Whether you're trading a guitar for a bicycle or selling your old phone for cash, 
              here's how to make it happen.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Step-by-Step Process</h2>
            <p className="text-muted-foreground text-lg">
              Get started with CirculaX in just 6 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.number} className="relative overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose CirculaX */}
      <section className="py-16 bg-muted">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CirculaX?</h2>
            <p className="text-muted-foreground text-lg">
              Discover the advantages that make CirculaX the best choice for trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="bg-background shadow-soft hover:shadow-hover transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-marketplace-blue to-blue-900 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90">
              Join CirculaX today and discover the power of community exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                size="lg" 
                className="bg-marketplace-amber hover:bg-amber-500 text-marketplace-blue font-semibold"
              >
                <Link to="/register" className="flex items-center gap-2">
                  Sign Up — It's Free!
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-white/30 hover:bg-white/10 text-white"
              >
                <Link to="/browse">
                  Browse Marketplace
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage; 