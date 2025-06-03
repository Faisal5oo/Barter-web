import { useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronLeft,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  Star,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductCardProps } from "./ProductCard";

// Sample user products for barter offers
const userProducts = [
  {
    id: "u1",
    title: "MacBook Air M1 2020",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1470&auto=format&fit=crop",
    checked: false,
  },
  {
    id: "u2",
    title: "iPad Pro 12.9 2021",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1470&auto=format&fit=crop",
    checked: false,
  },
  {
    id: "u3",
    title: "Sony WH-1000XM4 Headphones",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1476&auto=format&fit=crop",
    checked: false,
  },
];

// Sample product data - in a real app this would come from an API
const sampleProducts: Record<string, ProductCardProps> = {
  "1": {
    id: "1",
    title: "Samsung Galaxy S21 Ultra - Excellent Condition",
    image:
      "https://images.unsplash.com/photo-1626753545095-88f7717d5de2?q=80&w=1528&auto=format&fit=crop",
    condition: "Excellent",
    category: "Smartphones",
    ownerName: "Ayesha Khan",
    ownerRating: 4.8,
    location: "Lahore, Pakistan",
    allowsCash: true,
    allowsBarter: false,
  },
  "2": {
    id: "2",
    title: "Vintage Wooden Bookshelf",
    image:
      "https://images.unsplash.com/photo-1581260619122-6350ad41d18c?q=80&w=1528&auto=format&fit=crop",
    condition: "Good",
    category: "Furniture",
    ownerName: "Bilal Ali",
    ownerRating: 4.5,
    location: "Lahore, Pakistan",
    allowsCash: false,
    allowsBarter: true,
  },
  "3": {
    id: "3",
    title: "MacBook Air M1 - Like New",
    image:
      "https://images.unsplash.com/photo-1621346148875-743b1707003b?q=80&w=1528&auto=format&fit=crop",
    condition: "Like New",
    category: "Electronics",
    ownerName: "Sana Mehmood",
    ownerRating: 4.9,
    location: "Lahore, Pakistan",
    allowsCash: true,
    allowsBarter: false,
  },
  "4": {
    id: "4",
    title: "Sony WH-1000XM4 Headphones",
    image:
      "https://images.unsplash.com/photo-1599647944843-963ed76fe474?q=80&w=1528&auto=format&fit=crop",
    condition: "Excellent",
    category: "Electronics",
    ownerName: "Faizan Shah",
    ownerRating: 4.7,
    location: "Lahore, Pakistan",
    allowsCash: true,
    allowsBarter: true,
  },
  "5": {
    id: "5",
    title: "New Balance Running Shoes - Size 10",
    image:
      "https://images.unsplash.com/photo-1599913702128-bc6d054b6172?q=80&w=1528&auto=format&fit=crop",
    condition: "Good",
    category: "Sportswear",
    ownerName: "Muneeb Tariq",
    ownerRating: 4.6,
    location: "Lahore, Pakistan",
    allowsCash: false,
    allowsBarter: true,
  },
  "6": {
    id: "6",
    title: "HP Pavilion 15 Laptop - Excellent Condition",
    image:
      "https://images.unsplash.com/photo-1602155374780-d93d86590c80?q=80&w=1528&auto=format&fit=crop",
    condition: "Excellent",
    category: "Laptops",
    ownerName: "Tariq Mehmood",
    ownerRating: 4.7,
    location: "Lahore, Pakistan",
    allowsCash: true,
    allowsBarter: true,
  },
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? sampleProducts[id] : null;

  const [offerType, setOfferType] = useState("barter");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSent, setOfferSent] = useState(false);

  if (!product) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="text-primary hover:underline">
          Return to homepage
        </Link>
      </div>
    );
  }

  const handleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleOfferSubmit = () => {
    // In a real app, this would send the offer to the API
    console.log({
      type: offerType,
      selectedProducts,
      message: offerMessage,
      productId: product.id,
    });

    // Show confirmation
    setOfferSent(true);

    // Reset form after delay
    setTimeout(() => {
      setOfferSent(false);
      setSelectedProducts([]);
      setOfferMessage("");
    }, 3000);
  };

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-wrap mb-6 items-center">
        <Link
          to="/"
          className="flex items-center text-muted-foreground hover:text-foreground mb-4 md:mb-0"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to listings</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden mb-4 border">
            <img
              src={product.image}
              alt={product.title}
              className="w-full aspect-video object-cover"
            />
          </div>

          {/* Additional images would go here */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md overflow-hidden border bg-muted/70"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-auto">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-normal">
                    {product.category}
                  </Badge>
                  <Badge
                    variant={
                      product.condition === "New" ? "default" : "secondary"
                    }
                  >
                    {product.condition}
                  </Badge>
                </div>

                <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>

                <div className="flex items-center gap-1 mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {product.location}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">
                  This is a top condition device with minimal signs of use. It
                  comes with the original box, charger, and a complimentary
                  case. Battery health is at 95%. Screen has always been
                  protected with a tempered glass screen protector. Looking to
                  exchange for a newer model with some cash adjustment or
                  another tech item of similar value.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Exchange Options</h3>
                <div className="flex gap-3">
                  {product.allowsBarter && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>Barter</span>
                    </div>
                  )}

                  {product.allowsCash && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>Cash + Barter</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Owner</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">{product.ownerName}</p>
                    <div className="flex items-center text-sm">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent mr-1" />
                      <span>{product.ownerRating} • Member since 2021</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                  Make an Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                {offerSent ? (
                  <div className="py-10 text-center">
                    <div className="mb-4 flex justify-center">
                      <CheckCircle className="h-12 w-12 text-secondary" />
                    </div>
                    <h2 className="text-xl font-medium mb-2">Offer Sent!</h2>
                    <p className="text-muted-foreground">
                      The owner will review your offer and get back to you soon.
                    </p>
                  </div>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Make an Offer</DialogTitle>
                      <DialogDescription>
                        Send an offer to exchange or purchase this item.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <RadioGroup
                        defaultValue="barter"
                        className="flex gap-4 mb-4"
                        onValueChange={(value) => setOfferType(value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="barter" id="barter" />
                          <Label htmlFor="barter">Barter</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash">Cash + Barter</Label>
                        </div>
                      </RadioGroup>

                      {offerType === "barter" && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">
                            Select items to exchange:
                          </h3>
                          <ScrollArea className="h-[160px]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {userProducts.map((item) => (
                                <div
                                  key={item.id}
                                  className={`border rounded-md p-2 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                                    selectedProducts.includes(item.id)
                                      ? "border-primary bg-primary/5"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleProductSelection(item.id)
                                  }
                                >
                                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="text-sm font-medium line-clamp-2">
                                    {item.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}

                      {offerType === "cash" && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">
                            Proposed cash amount:
                          </h3>
                          <div className="flex items-center border rounded-md">
                            <div className="px-3 py-2 bg-muted text-muted-foreground border-r">
                              $
                            </div>
                            <input
                              type="number"
                              className="w-full p-2 bg-transparent focus:outline-none"
                              placeholder="Enter amount"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Plus selected item(s) for exchange
                          </p>

                          <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">
                              Select items to exchange (optional):
                            </h3>
                            <ScrollArea className="h-[120px]">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {userProducts.map((item) => (
                                  <div
                                    key={item.id}
                                    className={`border rounded-md p-2 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                                      selectedProducts.includes(item.id)
                                        ? "border-primary bg-primary/5"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleProductSelection(item.id)
                                    }
                                  >
                                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-sm font-medium line-clamp-2">
                                      {item.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Message to seller:
                        </h3>
                        <Textarea
                          placeholder="Introduce yourself and explain why you're interested in this item"
                          className="resize-none"
                          rows={3}
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                        />
                      </div>

                      <Button
                        className="w-full mt-4"
                        onClick={handleOfferSubmit}
                        disabled={
                          (offerType === "barter" &&
                            selectedProducts.length === 0) ||
                          offerMessage.trim() === ""
                        }
                      >
                        Send Offer
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="lg" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Seller
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <div className="mt-10">
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="details">Details & Specs</TabsTrigger>
            <TabsTrigger value="exchange">Exchange Preferences</TabsTrigger>
            <TabsTrigger value="shipping">Location & Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="p-6 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">Apple</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium">iPhone 13 Pro Max</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">256GB</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Color</span>
                    <span className="font-medium">Sierra Blue</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">
                      Battery Health
                    </span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Condition Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">1.5 years</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Warranty</span>
                    <span className="font-medium">No</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">
                      Box & Accessories
                    </span>
                    <span className="font-medium">
                      Original box and charger included
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">
                      Screen Condition
                    </span>
                    <span className="font-medium">No scratches</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">
                      Case Condition
                    </span>
                    <span className="font-medium">Minor wear on corners</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exchange" className="p-6 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Preferred Exchange Items
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>iPhone 14 or newer (with cash from me)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>MacBook Air M1 or M2</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>iPad Pro 12.9 (2021 or newer)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>High-end gaming laptop</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Not Interested In</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Older model phones</li>
                  <li>Non-Apple tablets</li>
                  <li>PC desktop computers</li>
                  <li>Home appliances</li>
                </ul>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Cash Preference</h3>
                  <p className="text-muted-foreground">
                    Willing to accept partial cash offers if combined with item
                    exchange.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="p-6 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Location</h3>
                <p className="text-muted-foreground mb-4">
                  This item is located in San Francisco, CA.
                </p>

                <div className="rounded-lg overflow-hidden h-48 bg-muted">
                  {/* Map would go here */}
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Map Preview (Google Maps)
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Exchange Options</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>In-person meet-up in San Francisco</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Willing to meet within 20 miles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Can ship within US (buyer pays shipping)</span>
                  </li>
                </ul>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Preferred Meet-Up Locations
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Coffee shops in Downtown SF</li>
                    <li>Shopping malls with security</li>
                    <li>Police station safe exchange zones</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Similar Listings */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-6">Similar Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* We would use ProductCard components here */}
          <Card className="h-64 bg-muted flex items-center justify-center text-muted-foreground">
            Similar Item 1
          </Card>
          <Card className="h-64 bg-muted flex items-center justify-center text-muted-foreground">
            Similar Item 2
          </Card>
          <Card className="h-64 bg-muted flex items-center justify-center text-muted-foreground">
            Similar Item 3
          </Card>
          <Card className="h-64 bg-muted flex items-center justify-center text-muted-foreground">
            Similar Item 4
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
