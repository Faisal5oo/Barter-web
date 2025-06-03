
import { ImagePlus, Calendar, Shield, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ListingTips = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Listing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ImagePlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Quality Photos</h4>
                <p className="text-sm text-muted-foreground">
                  Use good lighting and clear images from multiple angles
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Be Responsive</h4>
                <p className="text-sm text-muted-foreground">
                  Respond quickly to inquiries to increase your chances
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Safety First</h4>
                <p className="text-sm text-muted-foreground">
                  Always meet in public places for exchanges
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Fair Pricing</h4>
                <p className="text-sm text-muted-foreground">
                  Research similar items to set competitive prices
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you have questions or need assistance with your listing, our support team is here to help.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link to="#">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingTips;
