import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductDebugInfo = ({ products, userLocation }) => {
  const getProductCoordinates = (product) => {
    // Same logic as LeafletMap
    if (product.latitude && product.longitude) {
      return { lat: product.latitude, lng: product.longitude, source: 'direct lat/lng' };
    }
    
    if (product.coordinates) {
      if (product.coordinates.coordinates && Array.isArray(product.coordinates.coordinates)) {
        return { 
          lat: product.coordinates.coordinates[1], 
          lng: product.coordinates.coordinates[0],
          source: 'GeoJSON format'
        };
      }
      
      if (product.coordinates.latitude && product.coordinates.longitude) {
        return { 
          lat: product.coordinates.latitude, 
          lng: product.coordinates.longitude,
          source: 'coordinates.lat/lng'
        };
      }
      
      if (product.coordinates.lat && product.coordinates.lng) {
        return { 
          lat: product.coordinates.lat, 
          lng: product.coordinates.lng,
          source: 'coordinates.lat/lng'
        };
      }
    }
    
    if (product.location && typeof product.location === 'string') {
      const coordMatch = product.location.match(/Coordinates:\s*(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
      if (coordMatch) {
        return { 
          lat: parseFloat(coordMatch[1]), 
          lng: parseFloat(coordMatch[2]),
          source: 'parsed from location string'
        };
      }
    }
    
    return null;
  };

  if (!products || products.length === 0) {
    return (
      <Card className="mb-4 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">🔍 Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700">No products received from API</p>
          {userLocation && (
            <div className="mt-2">
              <p className="text-sm">User Location: {userLocation.latitude}, {userLocation.longitude}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">🔍 Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Total Products: {products.length}</p>
            {userLocation && (
              <p className="text-sm text-gray-600">
                User Location: {userLocation.latitude}, {userLocation.longitude}
              </p>
            )}
          </div>

          {products.map((product, index) => {
            const coords = getProductCoordinates(product);
            return (
              <div key={product._id || index} className="border-l-4 border-l-blue-300 pl-3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{product.title}</h4>
                  <Badge variant={coords ? "default" : "destructive"}>
                    {coords ? "✓ Valid" : "✗ No Coords"}
                  </Badge>
                </div>
                
                <div className="text-xs space-y-1">
                  <p><strong>Location (Raw):</strong> {JSON.stringify(product.location)}</p>
                  <p><strong>Distance:</strong> {product.distance || 'N/A'}</p>
                  
                  {coords ? (
                    <div className="bg-green-50 p-2 rounded">
                      <p><strong>✓ Found Coordinates:</strong></p>
                      <p>Lat: {coords.lat}, Lng: {coords.lng}</p>
                      <p><em>Source: {coords.source}</em></p>
                      
                      {/* Show regex match details */}
                      {coords.source === 'parsed from location string' && (
                        <div className="mt-2 bg-blue-50 p-2 rounded">
                          <p><strong>Regex Parse Details:</strong></p>
                          <p>Input: {product.location}</p>
                          {(() => {
                            const match = product.location.match(/Coordinates:\s*(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
                            return match ? (
                              <div>
                                <p>Match[1] (lat): {match[1]}</p>
                                <p>Match[2] (lng): {match[2]}</p>
                                <p>Parsed lat: {parseFloat(match[1])}</p>
                                <p>Parsed lng: {parseFloat(match[2])}</p>
                              </div>
                            ) : <p>No regex match found</p>;
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-50 p-2 rounded">
                      <p><strong>✗ No Valid Coordinates Found</strong></p>
                      <p><strong>Raw coordinates object:</strong></p>
                      <pre className="text-xs bg-gray-100 p-1 rounded overflow-x-auto">
                        {JSON.stringify(product.coordinates, null, 2)}
                      </pre>
                      <p><strong>Direct lat/lng props:</strong></p>
                      <p>latitude: {product.latitude || 'undefined'}</p>
                      <p>longitude: {product.longitude || 'undefined'}</p>
                      <p><strong>Raw location type:</strong> {typeof product.location}</p>
                      <p><strong>Raw location value:</strong> {JSON.stringify(product.location)}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDebugInfo; 