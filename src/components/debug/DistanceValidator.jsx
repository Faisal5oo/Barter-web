import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, AlertTriangle } from 'lucide-react';

const DistanceValidator = ({ userLocation, products }) => {
  const [testRadius, setTestRadius] = useState(10);
  
  // Calculate distance between two points (same formula as backend should use)
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

  const getProductCoordinates = (product) => {
    if (product.latitude && product.longitude) {
      return { lat: product.latitude, lng: product.longitude };
    }
    
    if (product.coordinates) {
      if (product.coordinates.coordinates && Array.isArray(product.coordinates.coordinates)) {
        return { 
          lat: product.coordinates.coordinates[1], 
          lng: product.coordinates.coordinates[0] 
        };
      }
      
      if (product.coordinates.latitude && product.coordinates.longitude) {
        return { 
          lat: product.coordinates.latitude, 
          lng: product.coordinates.longitude 
        };
      }
      
      if (product.coordinates.lat && product.coordinates.lng) {
        return { 
          lat: product.coordinates.lat, 
          lng: product.coordinates.lng 
        };
      }
    }
    
    if (product.location && typeof product.location === 'string') {
      const coordMatch = product.location.match(/Coordinates:\s*(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
      if (coordMatch) {
        return { 
          lat: parseFloat(coordMatch[1]), 
          lng: parseFloat(coordMatch[2])
        };
      }
    }
    
    return null;
  };

  if (!userLocation || !products || products.length === 0) {
    return (
      <Card className="mb-4 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Distance Validator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700">Need user location and products to validate distances</p>
        </CardContent>
      </Card>
    );
  }

  const validationResults = products.map(product => {
    const coords = getProductCoordinates(product);
    if (!coords) return null;

    const frontendDistance = calculateDistance(
      userLocation.latitude, 
      userLocation.longitude, 
      coords.lat, 
      coords.lng
    );

    const backendDistance = product.distance;
    const withinRadius = frontendDistance <= testRadius;
    const shouldBeFiltered = !withinRadius;
    const distanceMismatch = backendDistance && Math.abs(frontendDistance - parseFloat(backendDistance)) > 0.5;

    return {
      product,
      coords,
      frontendDistance,
      backendDistance,
      withinRadius,
      shouldBeFiltered,
      distanceMismatch
    };
  }).filter(Boolean);

  const issuesFound = validationResults.some(r => 
    r.shouldBeFiltered || r.distanceMismatch
  );

  return (
    <Card className="mb-4 border-red-200">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Distance Validator
          {issuesFound && <AlertTriangle className="h-5 w-5 text-red-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="font-semibold">Test Radius:</label>
          <Input
            type="number"
            value={testRadius}
            onChange={(e) => setTestRadius(parseFloat(e.target.value) || 10)}
            className="w-24"
            min="1"
            max="100"
          />
          <span className="text-sm text-gray-600">miles</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">Validation Results:</h4>
            <Badge variant={issuesFound ? "destructive" : "default"}>
              {issuesFound ? "Issues Found" : "All Good"}
            </Badge>
          </div>

          {validationResults.map((result, index) => (
            <div key={index} className="border-l-4 border-l-gray-300 pl-3">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-medium text-sm">{result.product.title}</h5>
                <Badge variant={result.shouldBeFiltered ? "destructive" : "default"}>
                  {result.shouldBeFiltered ? "Should be filtered" : "Within radius"}
                </Badge>
                {result.distanceMismatch && (
                  <Badge variant="secondary">Distance mismatch</Badge>
                )}
              </div>

              <div className="text-xs space-y-1">
                <p><strong>Product Location:</strong> {result.coords.lat}, {result.coords.lng}</p>
                <p><strong>Frontend Calculated Distance:</strong> {result.frontendDistance} miles</p>
                <p><strong>Backend Reported Distance:</strong> {result.backendDistance || 'Not provided'} miles</p>
                <p><strong>Test Radius:</strong> {testRadius} miles</p>
                
                {result.distanceMismatch && (
                  <div className="bg-yellow-50 p-2 rounded mt-2">
                    <p className="text-yellow-800 font-semibold">⚠️ Distance Calculation Mismatch</p>
                    <p className="text-yellow-700">Frontend and backend distances don't match!</p>
                  </div>
                )}

                {result.shouldBeFiltered && (
                  <div className="bg-red-50 p-2 rounded mt-2">
                    <p className="text-red-800 font-semibold">❌ Backend Filtering Issue</p>
                    <p className="text-red-700">
                      This product is {result.frontendDistance} miles away, which is beyond the {testRadius} mile radius. 
                      It should NOT appear in the results!
                    </p>
                  </div>
                )}

                {result.withinRadius && (
                  <div className="bg-green-50 p-2 rounded mt-2">
                    <p className="text-green-800 font-semibold">✅ Correctly Included</p>
                    <p className="text-green-700">
                      This product is {result.frontendDistance} miles away, within the {testRadius} mile radius.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {issuesFound && (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h4 className="font-semibold text-red-800 mb-2">🚨 Backend Issues Detected:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {validationResults.some(r => r.shouldBeFiltered) && (
                <li>• Backend is not properly filtering products by radius</li>
              )}
              {validationResults.some(r => r.distanceMismatch) && (
                <li>• Backend distance calculation differs from frontend calculation</li>
              )}
            </ul>
            <p className="text-red-700 text-sm mt-2">
              <strong>Fix needed:</strong> Check your backend distance calculation and radius filtering logic.
            </p>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm text-blue-800">
            <strong>💡 How this works:</strong> This validates that your backend correctly filters products by distance. 
            Products beyond the test radius should NOT appear in the API response.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistanceValidator; 