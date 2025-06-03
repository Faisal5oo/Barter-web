import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Star, Eye, Clock, Locate, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const LeafletMap = ({ 
  products = [], 
  userLocation, 
  onProductClick,
  searchRadius = 10,
  className = ""
}) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      // Dynamically import Leaflet to avoid SSR issues
      const L = (await import('leaflet')).default;
      
      // Fix for default markers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!leafletMapRef.current && mapRef.current) {
        // Initialize map
        leafletMapRef.current = L.map(mapRef.current).setView([
          userLocation?.latitude || 37.7749,
          userLocation?.longitude || -122.4194
        ], 12);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(leafletMapRef.current);

        // Add zoom controls
        leafletMapRef.current.zoomControl.setPosition('topright');
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (leafletMapRef.current && userLocation) {
      leafletMapRef.current.setView([userLocation.latitude, userLocation.longitude], 
        Math.max(12, 14 - (searchRadius / 5))
      );
    }
  }, [userLocation, searchRadius]);

  // Helper function to extract coordinates from product
  const getProductCoordinates = (product) => {
    // Try multiple coordinate formats
    if (product.latitude && product.longitude) {
      return { lat: product.latitude, lng: product.longitude };
    }
    
    if (product.coordinates) {
      // Handle GeoJSON format: coordinates.coordinates[longitude, latitude]
      if (product.coordinates.coordinates && Array.isArray(product.coordinates.coordinates)) {
        return { 
          lat: product.coordinates.coordinates[1], 
          lng: product.coordinates.coordinates[0] 
        };
      }
      
      // Handle direct lat/lng in coordinates object
      if (product.coordinates.latitude && product.coordinates.longitude) {
        return { 
          lat: product.coordinates.latitude, 
          lng: product.coordinates.longitude 
        };
      }
      
      // Handle lat/lng properties
      if (product.coordinates.lat && product.coordinates.lng) {
        return { 
          lat: product.coordinates.lat, 
          lng: product.coordinates.lng 
        };
      }
    }
    
    // Try to parse from location string if it contains coordinates
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

  // Update markers when products change
  useEffect(() => {
    const updateMarkers = async () => {
      if (!leafletMapRef.current) return;

      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => {
        leafletMapRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add user location marker
      if (userLocation) {
        const userIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75 w-6 h-6"></div>
              <div class="relative bg-blue-600 border-2 border-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          `,
          className: 'custom-user-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
          icon: userIcon
        }).addTo(leafletMapRef.current);
        
        markersRef.current.push(userMarker);
      }

      // Add product markers with improved coordinate extraction
      let validProductCount = 0;
      products.forEach(product => {
        const coords = getProductCoordinates(product);
        
        if (coords && coords.lat && coords.lng) {
          validProductCount++;
          console.log(`Product: ${product.title}, Coords: ${coords.lat}, ${coords.lng}`); // Debug log
          
          const productIcon = L.divIcon({
            html: `
              <div class="relative cursor-pointer transform hover:scale-110 transition-transform">
                <div class="bg-blue-600 border-2 border-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                ${product.distance ? `
                  <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    ${product.distance} mi
                  </div>
                ` : ''}
              </div>
            `,
            className: 'custom-product-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });

          const marker = L.marker([coords.lat, coords.lng], {
            icon: productIcon
          }).addTo(leafletMapRef.current);

          // Add click event
          marker.on('click', () => {
            setSelectedProduct(product);
            if (onProductClick) onProductClick(product._id);
          });

          markersRef.current.push(marker);
        } else {
          console.log(`Product ${product.title} has no valid coordinates:`, product); // Debug log
        }
      });

      console.log(`Total products: ${products.length}, Valid coordinates: ${validProductCount}`); // Debug log

      // Add search radius circle if user location exists
      if (userLocation && searchRadius) {
        const circle = L.circle([userLocation.latitude, userLocation.longitude], {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          radius: searchRadius * 1609.34 // Convert miles to meters
        }).addTo(leafletMapRef.current);
        
        markersRef.current.push(circle);
      }
    };

    updateMarkers();
  }, [products, userLocation, searchRadius, onProductClick]);

  const handleLocateUser = () => {
    if (navigator.geolocation && leafletMapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          leafletMapRef.current.setView([latitude, longitude], 15);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full shadow-md bg-white text-blue-600 hover:bg-blue-50"
          onClick={handleLocateUser}
        >
          <Locate className="h-5 w-5" />
          <span className="sr-only">Find my location</span>
        </Button>
      </div>

      {/* Map overlay info */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-[1000]">
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

      {/* Product popup */}
      {selectedProduct && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1001]">
          <Card className="border shadow-lg max-w-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Close button */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProduct(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>

                {/* Product image */}
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {selectedProduct.images?.[0] ? (
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.title}
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
                      {selectedProduct.title}
                    </h3>
                    {selectedProduct.distance && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {selectedProduct.distance} mi
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {selectedProduct.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {selectedProduct.condition}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">{selectedProduct.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{selectedProduct.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(selectedProduct.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{selectedProduct.listedBy?.rating || 'N/A'}</span>
                      <span className="text-gray-400">• {selectedProduct.listedBy?.name}</span>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full mt-2" 
                    asChild
                  >
                    <Link to={`/product/${selectedProduct._id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaflet CSS */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </div>
  );
};

export default LeafletMap; 