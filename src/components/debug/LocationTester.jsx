import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calculator } from 'lucide-react';

const LocationTester = ({ userLocation, onLocationChange }) => {
  const [testLat, setTestLat] = useState(userLocation?.latitude || '');
  const [testLng, setTestLng] = useState(userLocation?.longitude || '');

  // Sample product location (your Samsung S24)
  const sampleProductLocation = { lat: 31.4704, lng: 74.4161 };

  // Calculate distance between two points (same as backend)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  };

  const distance = userLocation ? 
    calculateDistance(
      userLocation.latitude, 
      userLocation.longitude, 
      sampleProductLocation.lat, 
      sampleProductLocation.lng
    ) : null;

  const handleSetTestLocation = () => {
    if (testLat && testLng && onLocationChange) {
      onLocationChange({
        latitude: parseFloat(testLat),
        longitude: parseFloat(testLng)
      });
    }
  };

  const setLahoreLocation = () => {
    const lahore = { lat: 31.5204, lng: 74.3587 };
    setTestLat(lahore.lat);
    setTestLng(lahore.lng);
    if (onLocationChange) {
      onLocationChange({
        latitude: lahore.lat,
        longitude: lahore.lng
      });
    }
  };

  return (
    <Card className="mb-4 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-800 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Your Current Location:</h4>
          {userLocation ? (
            <div className="bg-blue-50 p-3 rounded">
              <p>Lat: {userLocation.latitude}</p>
              <p>Lng: {userLocation.longitude}</p>
            </div>
          ) : (
            <p className="text-gray-500">No location detected</p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Sample Product Location (Samsung S24):</h4>
          <div className="bg-green-50 p-3 rounded">
            <p>Lat: {sampleProductLocation.lat} (Lahore, Pakistan)</p>
            <p>Lng: {sampleProductLocation.lng}</p>
          </div>
        </div>

        {distance !== null && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Distance Calculation:
            </h4>
            <div className="bg-orange-50 p-3 rounded">
              <p className="text-lg font-semibold">Distance: {distance} miles</p>
              <Badge variant={distance > 50 ? "destructive" : distance > 20 ? "secondary" : "default"}>
                {distance > 50 ? "Too Far (>50mi)" : distance > 20 ? "Far (>20mi)" : "Within Range"}
              </Badge>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Test Different Location:</h4>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input
              placeholder="Latitude"
              value={testLat}
              onChange={(e) => setTestLat(e.target.value)}
            />
            <Input
              placeholder="Longitude"
              value={testLng}
              onChange={(e) => setTestLng(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSetTestLocation} variant="outline">
              Set Test Location
            </Button>
            <Button onClick={setLahoreLocation} variant="default">
              Set Lahore Location
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Tip:</strong> If distance is &gt;50 miles, try clicking "Set Lahore Location" 
            to test if the product appears when you're nearby.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationTester; 