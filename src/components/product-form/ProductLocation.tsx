import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductLocationProps {
  location: string;
  setLocation: (value: string) => void;
  latitude: number | null;
  setLatitude: (value: number | null) => void;
  longitude: number | null;
  setLongitude: (value: number | null) => void;
}

const ProductLocation = ({ 
  location, 
  setLocation, 
  latitude, 
  setLatitude, 
  longitude, 
  setLongitude 
}: ProductLocationProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [hideExactLocation, setHideExactLocation] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Location Error',
        description: 'Geolocation is not supported by this browser',
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        
        // If no location text provided, suggest user to enter a description
        if (!location.trim()) {
          setLocation('Current Location');
        }
        
        setIsGettingLocation(false);
        toast({
          title: 'Location Detected',
          description: 'Your location has been detected successfully for nearby search',
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        
        toast({
          title: 'Location Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const hasValidCoordinates = latitude !== null && longitude !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
        <CardDescription>
          Specify where your item is located for nearby product discovery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">
              Location Description <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="e.g. Downtown San Francisco, Near Mall"
                className="flex-grow"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <Button 
                variant="outline" 
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : hasValidCoordinates ? (
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                {isGettingLocation ? 'Finding...' : hasValidCoordinates ? 'Located' : 'Use Current'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Describe your location (e.g., "Downtown area", "Near university") - coordinates will be detected automatically
            </p>
          </div>

          {/* Location Status */}
          {hasValidCoordinates ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Location Ready</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your item location has been set and will appear in nearby searches
              </p>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Location Required</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Click "Use Current" to detect your location for nearby product discovery
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Privacy Options</Label>
            <div className="flex items-start gap-2">
              <Checkbox 
                id="hide-exact-location" 
                checked={hideExactLocation}
                onCheckedChange={(checked) => setHideExactLocation(!!checked)}
              />
              <div>
                <Label htmlFor="hide-exact-location">Hide exact location</Label>
                <p className="text-sm text-muted-foreground">
                  Only show approximate area rather than exact address to other users
                </p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Your location helps nearby users discover your item. 
              We use this for distance calculation but won't display your exact coordinates to others.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductLocation;
