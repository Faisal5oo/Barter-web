import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, RefreshCw } from 'lucide-react';
import { axiosInstanceWeb } from '@/lib/axiosInstance';

const ApiTester = ({ userLocation }) => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testNearbyAPI = async () => {
    if (!userLocation) {
      setError('No user location available');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing API with location:', userLocation);
      
      const params = new URLSearchParams({
        latitude: userLocation.latitude.toString(),
        longitude: userLocation.longitude.toString(),
        radius: '50', // Large radius to ensure we get the product
        limit: '20'
      });

      const url = `/product/nearby?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await axiosInstanceWeb.get(url);
      console.log('Raw API Response:', response.data);
      
      setApiResponse(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message || 'API call failed');
    } finally {
      setLoading(false);
    }
  };

  const testSingleProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test getting the specific product by ID
      const productId = '683b014e3814c41174ae7559'; // Your Samsung S24 ID
      const response = await axiosInstanceWeb.get(`/product/${productId}`);
      console.log('Single Product Response:', response.data);
      
      setApiResponse({ singleProduct: response.data });
    } catch (err) {
      console.error('Single Product API Error:', err);
      setError(err.response?.data?.message || err.message || 'Single product API call failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          API Response Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testNearbyAPI} 
            disabled={loading || !userLocation}
            variant="default"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
            Test Nearby API
          </Button>
          <Button 
            onClick={testSingleProduct} 
            disabled={loading}
            variant="outline"
          >
            Test Single Product
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded">
            <p className="text-red-800 font-semibold">API Error:</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {apiResponse && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Response Received</Badge>
              <span className="text-sm text-gray-600">
                {apiResponse.products?.length || 0} products returned
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-4 max-h-96 overflow-y-auto">
              <h4 className="font-semibold mb-2">Raw API Response:</h4>
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>

            {apiResponse.products && apiResponse.products.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <h4 className="font-semibold mb-2">First Product Details:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Title:</strong> {apiResponse.products[0].title}</p>
                  <p><strong>Location String:</strong> {JSON.stringify(apiResponse.products[0].location)}</p>
                  <p><strong>Coordinates Object:</strong> {JSON.stringify(apiResponse.products[0].coordinates)}</p>
                  <p><strong>Distance:</strong> {apiResponse.products[0].distance}</p>
                  <p><strong>Direct lat:</strong> {apiResponse.products[0].latitude || 'undefined'}</p>
                  <p><strong>Direct lng:</strong> {apiResponse.products[0].longitude || 'undefined'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-yellow-50 p-3 rounded">
          <p className="text-sm text-yellow-800">
            <strong>🔍 This will show the exact raw response from your backend API</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTester; 