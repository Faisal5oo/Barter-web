import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductImageUpload from '@/components/upload/ProductImageUpload';
import ProfileImageUpload from '@/components/upload/ProfileImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Upload, Camera, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const ImageUploadDemoPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');

  const handleProfileImageUpdate = (newImageUrl: string) => {
    setProfileImage(newImageUrl);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" className="mb-4" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Image Upload Demo</h1>
            <p className="text-muted-foreground mt-2">
              Test the direct Cloudflare R2 image upload using signed URLs
            </p>
          </div>

          {/* Status Banner */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Direct R2 Upload Enabled</h3>
                  <p className="text-sm text-green-700">
                    Images upload directly to Cloudflare R2 using signed URLs. No backend file handling required!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Product Image Upload Demo */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Product Image Upload
                  </CardTitle>
                  <CardDescription>
                    🚀 <strong>New:</strong> Direct R2 upload with signed URLs.
                    Images are uploaded immediately and URLs are available instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductImageUpload
                    imageUrls={productImages}
                    onImagesChange={setProductImages}
                    maxImages={10}
                  />
                </CardContent>
              </Card>

              {/* Upload Flow Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">1</Badge>
                      <div className="flex-1">
                        <p className="font-medium">Select Images</p>
                        <p className="text-sm text-muted-foreground">Drag & drop or click to browse files</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">2</Badge>
                      <div className="flex-1">
                        <p className="font-medium">Generate Signed URLs</p>
                        <p className="text-sm text-muted-foreground">Backend creates secure upload URLs for R2</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">3</Badge>
                      <div className="flex-1">
                        <p className="font-medium">Direct Upload</p>
                        <p className="text-sm text-muted-foreground">Files upload directly to Cloudflare R2</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">4</Badge>
                      <div className="flex-1">
                        <p className="font-medium">URLs Ready</p>
                        <p className="text-sm text-muted-foreground">Public URLs immediately available for product creation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results display */}
              {productImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Uploaded Product Images ({productImages.length})
                    </CardTitle>
                    <CardDescription>
                      These R2 URLs are ready to be used in product creation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {productImages.map((url, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Image {index + 1}</Badge>
                            <Badge variant="outline" className="text-green-600">Ready for Product</Badge>
                          </div>
                          <div className="text-sm font-mono break-all text-muted-foreground">
                            {url}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        ✅ These URLs can now be sent to <code>POST /api/products</code> in the <code>images</code> array field.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Profile Image Upload Demo */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Image Upload
                  </CardTitle>
                  <CardDescription>
                    Upload and update your profile picture using the same R2 direct upload system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileImageUpload
                    currentImageUrl={user?.profileImage || profileImage}
                    userName={user?.name || 'Demo User'}
                    onImageUpdate={handleProfileImageUpdate}
                  />
                </CardContent>
              </Card>

              {/* Current profile image URL */}
              {(user?.profileImage || profileImage) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Profile Image URL</CardTitle>
                    <CardDescription>
                      This R2 URL is stored in your user profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-muted rounded-lg text-sm font-mono break-all">
                      {user?.profileImage || profileImage}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* API Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle>Backend Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="text-sm">/api/images/signed-urls</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate signed URLs for direct R2 upload
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">PUT</Badge>
                        <code className="text-sm">R2 Signed URL</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Direct upload to Cloudflare R2 (no backend involved)
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">POST</Badge>
                        <code className="text-sm">/api/products</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Create product with R2 image URLs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Benefits */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">Technical Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• <strong>No backend file handling</strong> - Files go directly to R2</li>
                    <li>• <strong>Immediate URLs</strong> - Available as soon as upload completes</li>
                    <li>• <strong>Better performance</strong> - No server bandwidth used for uploads</li>
                    <li>• <strong>Scalable</strong> - R2 handles unlimited concurrent uploads</li>
                    <li>• <strong>Secure</strong> - Signed URLs expire and are single-use</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ImageUploadDemoPage; 