import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DollarSign } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ExchangePreferencesProps {
  exchangePreference: string;
  setExchangePreference: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  isNegotiable: boolean;
  setIsNegotiable: (value: boolean) => void;
}

const ExchangePreferences = ({
  exchangePreference,
  setExchangePreference,
  price,
  setPrice,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  isNegotiable,
  setIsNegotiable
}: ExchangePreferencesProps) => {
  const handlePriceInput = (value: string, setter: (value: string) => void) => {
    // Only allow numbers and a single decimal point
    if (/^(\d*\.?\d{0,2})$/.test(value) || value === '') {
      setter(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Preferences</CardTitle>
        <CardDescription>
          Choose how you want to trade your item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>What would you accept for this item?</Label>
            <RadioGroup
              value={exchangePreference}
              onValueChange={setExchangePreference}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className={`border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors flex flex-col items-center justify-center text-center gap-2 ${exchangePreference === 'barter' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="barter" id="barter" className="sr-only" />
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14-8-8"></path><path d="M9 14h6v-6"></path></svg>
                <Label htmlFor="barter" className="font-medium cursor-pointer">
                  Barter Only
                </Label>
                <p className="text-sm text-muted-foreground">
                  Accept only item exchanges
                </p>
              </div>
              
              <div className={`border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors flex flex-col items-center justify-center text-center gap-2 ${exchangePreference === 'cash' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="cash" id="cash" className="sr-only" />
                <DollarSign className="h-8 w-8" />
                <Label htmlFor="cash" className="font-medium cursor-pointer">
                  Cash Only
                </Label>
                <p className="text-sm text-muted-foreground">
                  Accept only cash offers
                </p>
              </div>
              
              <div className={`border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors flex flex-col items-center justify-center text-center gap-2 ${exchangePreference === 'both' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="both" id="both" className="sr-only" />
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                <Label htmlFor="both" className="font-medium cursor-pointer">
                  Both Options
                </Label>
                <p className="text-sm text-muted-foreground">
                  Accept either barter or cash
                </p>
              </div>
            </RadioGroup>
          </div>
          
          {(exchangePreference === "cash" || exchangePreference === "both") && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Pricing Information <span className="text-destructive">*</span>
                </Label>
                
                {/* Price Range Option */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-price">
                      Minimum Price (PKR)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">PKR</span>
                      <Input
                        id="min-price"
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        className="pl-12"
                        value={minPrice}
                        onChange={(e) => handlePriceInput(e.target.value, setMinPrice)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-price">
                      Maximum Price (PKR)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">PKR</span>
                      <Input
                        id="max-price"
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        className="pl-12"
                        value={maxPrice}
                        onChange={(e) => handlePriceInput(e.target.value, setMaxPrice)}
                      />
                    </div>
                  </div>
                </div>

                {/* Single Price Option (fallback) */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Or set a fixed price (PKR)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">PKR</span>
                    <Input
                      id="price"
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      className="pl-12"
                      value={price}
                      onChange={(e) => handlePriceInput(e.target.value, setPrice)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty if you specified a price range above
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="negotiable">Price is negotiable</Label>
                  <p className="text-sm text-muted-foreground">Allow buyers to make offers</p>
                </div>
                <Switch
                  id="negotiable"
                  checked={isNegotiable}
                  onCheckedChange={setIsNegotiable}
                />
              </div>
            </div>
          )}
          
          {(exchangePreference === "barter" || exchangePreference === "both") && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="preferred-items">What items would you prefer in exchange? (Optional)</Label>
              <Textarea
                id="preferred-items"
                placeholder="e.g. Gaming console, camera equipment, bicycle, etc."
                className="min-h-[80px]"
              />
              <p className="text-sm text-muted-foreground">
                This helps potential traders know what you're looking for
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangePreferences;
