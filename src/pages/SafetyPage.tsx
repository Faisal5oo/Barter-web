import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Shield, 
  MapPin, 
  Users, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Camera,
  MessageSquare,
  Phone,
  Flag,
  Lock,
  UserCheck,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const SafetyPage = () => {
  const safetyTips = [
    {
      icon: MapPin,
      title: "Meet in Public Places",
      description: "Always meet in well-lit, public locations with lots of people around",
      tips: [
        "Shopping centers or malls",
        "Coffee shops or restaurants",
        "Police station parking lots",
        "Busy parks during daylight"
      ]
    },
    {
      icon: Clock,
      title: "Trade During Daylight",
      description: "Schedule meetups during daylight hours when visibility is best",
      tips: [
        "Avoid late night meetings",
        "Weekend afternoons are ideal",
        "Allow plenty of time for inspection",
        "Don't rush the exchange"
      ]
    },
    {
      icon: Users,
      title: "Bring a Friend",
      description: "Having someone with you increases safety and provides a witness",
      tips: [
        "Let someone know where you're going",
        "Share your location with trusted contacts",
        "Bring a friend to the meetup",
        "Stay in groups when possible"
      ]
    },
    {
      icon: Eye,
      title: "Inspect Before Trading",
      description: "Thoroughly examine items before completing the exchange",
      tips: [
        "Test electronic devices",
        "Check for damage or wear",
        "Verify authenticity",
        "Ask questions about the item's history"
      ]
    }
  ];

  const redFlags = [
    {
      icon: AlertTriangle,
      title: "Pressure to Act Quickly",
      description: "Legitimate traders won't rush you into making decisions"
    },
    {
      icon: MessageSquare,
      title: "Requests to Move Off-Platform",
      description: "Keep all communication within CirculaX for your protection"
    },
    {
      icon: MapPin,
      title: "Unusual Meeting Locations",
      description: "Be wary of requests to meet in isolated or private locations"
    },
    {
      icon: Camera,
      title: "Reluctance to Share Photos",
      description: "Honest sellers will provide clear, detailed photos of their items"
    },
    {
      icon: Phone,
      title: "Requests for Personal Information",
      description: "Never share sensitive personal or financial information"
    },
    {
      icon: Lock,
      title: "Upfront Payment Requests",
      description: "Be cautious of requests for payment before meeting in person"
    }
  ];

  const verificationFeatures = [
    {
      icon: UserCheck,
      title: "Verified Profiles",
      description: "Look for users with verified phone numbers and email addresses"
    },
    {
      icon: Shield,
      title: "User Ratings",
      description: "Check ratings and reviews from previous trades"
    },
    {
      icon: MessageSquare,
      title: "In-App Messaging",
      description: "All conversations are logged for your protection"
    },
    {
      icon: Flag,
      title: "Report System",
      description: "Easily report suspicious behavior or users"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-marketplace-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Safety is Our Priority
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Learn how to trade safely and securely on CirculaX with our comprehensive safety guidelines
          </p>
          <Button size="lg" className="bg-marketplace-amber hover:bg-amber-500 text-marketplace-blue">
            <Flag className="h-5 w-5 mr-2" />
            Report an Issue
          </Button>
        </div>
      </section>

      <main className="flex-grow py-16">
        <div className="container max-w-6xl mx-auto px-4">
          
          {/* Safety Alert */}
          <Alert className="mb-12 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> If something feels wrong or unsafe, trust your instincts and don't proceed with the trade. 
              Your safety is more important than any item.
            </AlertDescription>
          </Alert>

          {/* Essential Safety Tips */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Essential Safety Tips</h2>
              <p className="text-muted-foreground text-lg">
                Follow these guidelines to ensure safe and successful trades
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {safetyTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <Card key={index} className="shadow-soft hover:shadow-hover transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{tip.title}</CardTitle>
                          <CardDescription>{tip.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tip.tips.map((tipItem, tipIndex) => (
                          <li key={tipIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {tipItem}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Red Flags */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Warning Signs to Watch For</h2>
              <p className="text-muted-foreground text-lg">
                Be aware of these red flags that may indicate potential scams or unsafe situations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redFlags.map((flag, index) => {
                const IconComponent = flag.icon;
                return (
                  <Card key={index} className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-red-900 mb-2">{flag.title}</h3>
                          <p className="text-sm text-red-700">{flag.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Platform Safety Features */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How CirculaX Keeps You Safe</h2>
              <p className="text-muted-foreground text-lg">
                We've built multiple layers of protection into our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {verificationFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Emergency Guidelines */}
          <section className="mb-16">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Guidelines
                </CardTitle>
                <CardDescription className="text-orange-700">
                  What to do if you feel unsafe or encounter suspicious behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">If You Feel Unsafe:</h4>
                    <ul className="space-y-1 text-sm text-orange-800">
                      <li>• Trust your instincts and leave immediately</li>
                      <li>• Go to a public place with other people</li>
                      <li>• Contact local authorities if necessary</li>
                      <li>• Report the incident to CirculaX support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">If You Suspect a Scam:</h4>
                    <ul className="space-y-1 text-sm text-orange-800">
                      <li>• Don't proceed with the trade</li>
                      <li>• Document all communications</li>
                      <li>• Report the user immediately</li>
                      <li>• Block the user from contacting you</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-muted rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Need to Report Something?</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Our support team is here to help keep the CirculaX community safe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Report a User
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SafetyPage; 