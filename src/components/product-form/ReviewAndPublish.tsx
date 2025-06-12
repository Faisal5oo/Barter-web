
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ReviewAndPublishProps {
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  onSubmit: (e: React.MouseEvent) => void;
}

const ReviewAndPublish = ({ 
  acceptedTerms, 
  setAcceptedTerms,
  onSubmit 
}: ReviewAndPublishProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review and Publish</CardTitle>
        <CardDescription>
          Final steps before listing your item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-2">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
            />
            <div>
              <Label htmlFor="terms">
                I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Community Guidelines</Link>
              </Label>
              <p className="text-sm text-muted-foreground">
                By publishing, I confirm this item is available for exchange and the information provided is accurate.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" asChild>
          <Link to="/">Cancel</Link>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button onClick={onSubmit}>
              Publish Listing
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Listing published successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                Your item has been listed on BarterX and is now visible to potential traders.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link to="/">View Listings</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ReviewAndPublish;
