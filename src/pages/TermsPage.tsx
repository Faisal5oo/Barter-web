import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  FileText, 
  Shield, 
  Users, 
  AlertTriangle,
  Scale,
  Clock,
  Mail,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using BarterX, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all visitors, users, and others who access or use the service."
      ]
    },
    {
      id: "description",
      title: "2. Service Description",
      content: [
        "BarterX is a platform that facilitates the exchange of goods and services between users.",
        "We provide a marketplace where users can list items, make offers, and communicate with other users.",
        "BarterX acts as an intermediary platform and is not a party to any transactions between users."
      ]
    },
    {
      id: "eligibility",
      title: "3. User Eligibility",
      content: [
        "You must be at least 18 years old to use BarterX.",
        "You must provide accurate and complete information when creating an account.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You may not create multiple accounts or share your account with others."
      ]
    },
    {
      id: "conduct",
      title: "4. User Conduct",
      content: [
        "You agree to use BarterX only for lawful purposes and in accordance with these Terms.",
        "You will not post false, misleading, or fraudulent listings.",
        "You will not engage in any form of harassment, abuse, or discrimination.",
        "You will not attempt to circumvent our safety and security measures.",
        "You will not use the platform for commercial purposes without our written consent."
      ]
    },
    {
      id: "listings",
      title: "5. Listings and Transactions",
      content: [
        "You are solely responsible for the accuracy of your listings and item descriptions.",
        "All transactions are between users; BarterX is not responsible for the quality, safety, or legality of items.",
        "Users must comply with all applicable laws regarding the sale or exchange of items.",
        "Prohibited items include but are not limited to: illegal substances, weapons, stolen goods, and hazardous materials."
      ]
    },
    {
      id: "safety",
      title: "6. Safety and Security",
      content: [
        "Users are responsible for their own safety when meeting for exchanges.",
        "We recommend meeting in public places and following our safety guidelines.",
        "BarterX is not liable for any incidents that occur during in-person meetings.",
        "Report any suspicious activity or safety concerns immediately."
      ]
    },
    {
      id: "intellectual",
      title: "7. Intellectual Property",
      content: [
        "BarterX and its original content, features, and functionality are owned by BarterX and are protected by copyright, trademark, and other laws.",
        "You retain ownership of content you post, but grant us a license to use it on our platform.",
        "You may not use our trademarks or copyrighted material without permission."
      ]
    },
    {
      id: "privacy",
      title: "8. Privacy Policy",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.",
        "We collect and use information as described in our Privacy Policy.",
        "By using BarterX, you consent to the collection and use of your information as outlined in our Privacy Policy."
      ]
    },
    {
      id: "termination",
      title: "9. Account Termination",
      content: [
        "We may terminate or suspend your account at any time for violations of these Terms.",
        "You may delete your account at any time through your account settings.",
        "Upon termination, your right to use the Service will cease immediately.",
        "We reserve the right to refuse service to anyone for any reason at any time."
      ]
    },
    {
      id: "liability",
      title: "10. Limitation of Liability",
      content: [
        "BarterX shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
        "Our total liability to you for any damages shall not exceed the amount you paid to us in the past 12 months.",
        "We do not guarantee the accuracy, completeness, or usefulness of any information on the Service.",
        "Use of the Service is at your own risk."
      ]
    },
    {
      id: "disputes",
      title: "11. Dispute Resolution",
      content: [
        "Any disputes arising from these Terms or your use of BarterX shall be resolved through binding arbitration.",
        "You agree to resolve disputes individually and waive any right to participate in class action lawsuits.",
        "Arbitration will be conducted in accordance with the rules of the American Arbitration Association."
      ]
    },
    {
      id: "changes",
      title: "12. Changes to Terms",
      content: [
        "We reserve the right to modify these Terms at any time.",
        "We will notify users of significant changes via email or platform notifications.",
        "Continued use of the Service after changes constitutes acceptance of the new Terms.",
        "It is your responsibility to review these Terms periodically."
      ]
    }
  ];

  const keyPoints = [
    {
      icon: Users,
      title: "User Responsibility",
      description: "Users are responsible for their own safety and the accuracy of their listings"
    },
    {
      icon: Shield,
      title: "Platform Safety",
      description: "We provide safety guidelines but users must exercise caution during exchanges"
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      description: "All users must comply with applicable laws and regulations"
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Items",
      description: "Certain items are prohibited from being listed on our platform"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-marketplace-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Terms of Service
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="bg-white/10 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  Last updated: {lastUpdated}
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-xl opacity-90">
            Please read these terms carefully before using BarterX. By using our service, you agree to these terms.
          </p>
        </div>
      </section>

      <main className="flex-grow py-16">
        <div className="container max-w-6xl mx-auto px-4">
          
          {/* Key Points Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Key Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyPoints.map((point, index) => {
                const IconComponent = point.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Table of Contents */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </CardContent>
              </Card>
            </aside>

            {/* Terms Content */}
            <main className="lg:col-span-3 space-y-8">
              {sections.map((section, index) => (
                <Card key={section.id} id={section.id} className="scroll-mt-8">
                  <CardHeader>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </CardContent>
                  {index < sections.length - 1 && <Separator className="mt-6" />}
                </Card>
              ))}

              {/* Contact Information */}
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Questions About These Terms?
                  </CardTitle>
                  <CardDescription>
                    If you have any questions about these Terms of Service, please contact us.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Email Support</h4>
                      <p className="text-sm text-muted-foreground">legal@barterx.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Mailing Address</h4>
                      <p className="text-sm text-muted-foreground">
                        BarterX Legal Department<br />
                        123 Commerce Street<br />
                        Tech District, CA 94105
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link to="/contact">Contact Support</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/help">Visit Help Center</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage; 