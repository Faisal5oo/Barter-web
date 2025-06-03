import React, { useRef, useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import { MapPin, Star, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxMap = ({ 
  products = [], 
  userLocation, 
  onProductClick,
  searchRadius = 10,
  className = ""
}) => {
  const mapRef = useRef();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: userLocation?.longitude || -122.4194,
    latitude: userLocation?.latitude || 37.7749,
    zoom: 12
  });

  // Update map view when user location changes
  useEffect(() => {
    if (userLocation) {
      setViewState(prev => ({
        ...prev,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        zoom: Math.max(12, 14 - (searchRadius / 5)) // Zoom based on search radius
      }));
    }
  }, [userLocation, searchRadius]);

  // Custom marker component
  const ProductMarker = ({ product, onClick }) => (
    <Marker
      longitude={product.longitude || product.coordinates?.coordinates?.[0]}
      latitude={product.latitude || product.coordinates?.coordinates?.[1]}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(product);
      }}
    >
      <div className="relative cursor-pointer transform hover:scale-110 transition-transform">
        {/* Marker pin */}
        <div className="bg-blue-600 border-2 border-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        
        {/* Distance badge */}
        {product.distance && (
          <Badge 
            variant="secondary" 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap"
          >
            {product.distance} mi
          </Badge>
        )}
      </div>
    </Marker>
  );

  // User location marker
  const UserLocationMarker = () => (
    userLocation && (
      <Marker
        longitude={userLocation.longitude}
        latitude={userLocation.latitude}
        anchor="center"
      >
        <div className="relative">
          {/* Pulsing circle effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75 w-6 h-6"></div>
          <div className="relative bg-blue-600 border-2 border-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </Marker>
    )
  );

  // Product popup
  const ProductPopup = ({ product, onClose }) => (
    <Popup
      longitude={product.longitude || product.coordinates?.coordinates?.[0]}
      latitude={product.latitude || product.coordinates?.coordinates?.[1]}
      anchor="top"
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      className="max-w-xs"
    >
      <Card className="border-0 shadow-none">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Product image */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                  {product.title}
                </h3>
                {product.distance && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {product.distance} mi
                  </Badge>
                )}
              </div>

              <p className="text-xs text-gray-600 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {product.condition}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{product.location}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.listedBy?.rating || 'N/A'}</span>
                  <span className="text-gray-400">• {product.listedBy?.name}</span>
                </div>
              </div>

              <Button 
                size="sm" 
                className="w-full mt-2" 
                asChild
              >
                <Link to={`/product/${product._id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Popup>
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Map Setup Required</h3>
          <p className="text-gray-600 mb-4">
            Add your Mapbox access token to environment variables
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
            <p className="text-sm font-mono text-gray-700">
              VITE_MAPBOX_ACCESS_TOKEN=your_token_here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Navigation controls */}
        <NavigationControl position="top-right" />
        
        {/* Geolocate control */}
        <GeolocateControl
          position="top-right"
          trackUserLocation={true}
          showUserHeading={true}
        />

        {/* User location marker */}
        <UserLocationMarker />

        {/* Product markers */}
        {products.map(product => (
          <ProductMarker
            key={product._id}
            product={product}
            onClick={setSelectedProduct}
          />
        ))}

        {/* Selected product popup */}
        {selectedProduct && (
          <ProductPopup
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* Search radius circle (optional) */}
        {userLocation && searchRadius && (
          <div style={{ display: 'none' }}>
            {/* You can add a circle overlay here if needed */}
          </div>
        )}
      </Map>

      {/* Map overlay info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{products.length} products nearby</span>
        </div>
        {searchRadius && (
          <p className="text-xs text-gray-500 mt-1">
            Within {searchRadius} miles of your location
          </p>
        )}
      </div>
    </div>
  );
};

export default MapboxMap; 