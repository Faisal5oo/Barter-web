
import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, X, Upload, Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductPhotosProps {
  photoUrls: string[];
  photoFiles: File[];
  setPhotoUrls: (urls: string[]) => void;
  setPhotoFiles: (files: File[]) => void;
}

const ProductPhotos = ({ 
  photoUrls, 
  photoFiles, 
  setPhotoUrls, 
  setPhotoFiles 
}: ProductPhotosProps) => {

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 5 - photoUrls.length);
    
    newFiles.forEach(file => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const url = fileReader.result as string;
        // Fixed TypeScript error with correct typing
        setPhotoUrls([...photoUrls, url]);
        setPhotoFiles([...photoFiles, file]);
      };
      fileReader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newUrls = [...photoUrls];
    const newFiles = [...photoFiles];
    newUrls.splice(index, 1);
    newFiles.splice(index, 1);
    setPhotoUrls(newUrls);
    setPhotoFiles(newFiles);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Photos</CardTitle>
        <CardDescription>
          Upload up to 5 high-quality photos of your item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Drag photos here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: JPG, PNG. Max 5MB each.
              </p>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Label htmlFor="photo-upload" asChild>
                <Button type="button" variant="outline">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
              </Label>
            </div>
          </div>

          {photoUrls.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-3">
                Uploaded Photos ({photoUrls.length}/5)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product photo ${index + 1}`}
                      className="rounded-md h-24 w-full object-cover border"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Tips for great product photos:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Use good lighting to show your item clearly</li>
              <li>Take photos from multiple angles</li>
              <li>Include close-ups of any important details or flaws</li>
              <li>Use a neutral background if possible</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPhotos;
