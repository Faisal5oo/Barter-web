import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle,
  Package,
  Shield,
  CreditCard,
  Users,
  Settings,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: Package,
      title: "Getting Started",
      description: "Learn the basics of using BarterX",
      articles: 12
    },
    {
      icon: CreditCard,
      title: "Trading & Payments",
      description: "How to make offers and complete trades",
      articles: 8
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Stay safe while trading",
      articles: 6
    },
    {
      icon: Users,
      title: "Account Management",
      description: "Manage your profile and settings",
      articles: 5
    },
    {
      icon: Settings,
      title: "Technical Support",
      description: "Troubleshooting and technical issues",
      articles: 10
    }
  ];

  const faqs = [
    {
      category: "Getting Started",
      question: "How do I create an account on BarterX?",
      answer: "Creating an account is simple! Click the 'Sign Up' button, enter your email, create a password, and verify your location. You'll be ready to start trading in minutes."
    },
    {
      category: "Getting Started",
      question: "How do I list my first item?",
      answer: "Click 'List an Item' from anywhere on the site, upload photos of your item, add a description, set your preferred trade type (barter, cash, or both), and publish your listing."
    },
    {
      category: "Trading",
      question: "How does the bartering process work?",
      answer: "Browse items you're interested in, click 'Make Offer', select items from your listings to trade, add any cash if needed, and send your offer. The seller can accept, decline, or counter your offer."
    },
    {
      category: "Trading",
      question: "What happens after an offer is accepted?",
      answer: "Once an offer is accepted, you'll receive contact information to arrange the meetup. Use our built-in messaging system to coordinate the exchange location and time."
    },
    {
      category: "Safety",
      question: "How do I stay safe when meeting for trades?",
      answer: "Always meet in public places during daylight hours, bring a friend if possible, trust your instincts, and verify the item's condition before completing the trade."
    },
    {
      category: "Safety",
      question: "What should I do if someone tries to scam me?",
      answer: "Report the user immediately through our platform, don't proceed with the trade, and contact our support team. We take fraud seriously and will investigate all reports."
    },
    {
      category: "Account",
      question: "How do I edit my profile?",
      answer: "Go to your profile page, click 'Edit Profile', update your information, and save changes. You can update your photo, bio, location, and contact preferences."
    },
    {
      category: "Account",
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account from the Account Settings page. Note that this action is permanent and will remove all your listings and trade history."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-marketplace-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How can we help you?
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg bg-white text-black"
            />
          </div>
        </div>
      </section>

      <main className="flex-grow py-16">
        <div className="container max-w-6xl mx-auto px-4">
          
          {/* Help Categories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Browse Help Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="hover:shadow-hover transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{category.articles} articles</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-4 pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filteredFaqs.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords or browse our help categories above.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-muted rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
              <p className="text-muted-foreground text-lg">
                Our support team is here to help you with any questions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contact">Send Email</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call us Monday-Friday, 9AM-6PM EST
                  </p>
                  <Button variant="outline" className="w-full">
                    (555) 123-4567
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage; 