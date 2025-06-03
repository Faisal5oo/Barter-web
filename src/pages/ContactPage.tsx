import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  HelpCircle,
  Bug,
  Shield,
  Star
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      detail: "Available 24/7",
      action: "Start Chat",
      primary: true
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      detail: "support@barterx.com",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      detail: "(555) 123-4567",
      action: "Call Now"
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: "Main Office",
      details: [
        "123 Commerce Street",
        "Tech District, CA 94105",
        "United States"
      ]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM PST",
        "Saturday: 10:00 AM - 4:00 PM PST",
        "Sunday: Closed"
      ]
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "General: support@barterx.com",
        "Business: business@barterx.com",
        "Press: press@barterx.com"
      ]
    }
  ];

  const categories = [
    { value: "general", label: "General Inquiry", icon: HelpCircle },
    { value: "technical", label: "Technical Support", icon: Bug },
    { value: "safety", label: "Safety & Security", icon: Shield },
    { value: "feedback", label: "Feedback & Suggestions", icon: Star }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-muted/50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Message Sent Successfully!</CardTitle>
              <CardDescription>
                Thank you for contacting us. We'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  A confirmation email has been sent to {formData.email}
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    category: "",
                    message: ""
                  });
                }}
                className="w-full"
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-marketplace-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl opacity-90 mb-8">
            We're here to help! Reach out to us with any questions, concerns, or feedback.
          </p>
        </div>
      </section>

      <main className="flex-grow py-16">
        <div className="container max-w-6xl mx-auto px-4">
          
          {/* Contact Methods */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Choose How to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <Card key={index} className={`text-center ${method.primary ? 'ring-2 ring-primary' : ''} hover:shadow-hover transition-all duration-300`}>
                    <CardContent className="p-8">
                      <div className={`h-16 w-16 ${method.primary ? 'bg-primary' : 'bg-primary/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <IconComponent className={`h-8 w-8 ${method.primary ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                      <p className="text-muted-foreground mb-2">{method.description}</p>
                      <p className="text-sm font-medium mb-4">{method.detail}</p>
                      <Button className={method.primary ? '' : 'variant-outline'} size="sm">
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <category.icon className="h-4 w-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Message"}
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Office Information */}
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Office Information</h2>
                <div className="space-y-6">
                  {officeInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">{info.title}</h3>
                              <div className="space-y-1">
                                {info.details.map((detail, detailIndex) => (
                                  <p key={detailIndex} className="text-sm text-muted-foreground">
                                    {detail}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* FAQ Link */}
              <Card className="bg-muted">
                <CardContent className="p-6">
                  <div className="text-center">
                    <HelpCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Looking for Quick Answers?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Check out our help center for instant answers to common questions
                    </p>
                    <Button variant="outline" size="sm">
                      Visit Help Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage; 