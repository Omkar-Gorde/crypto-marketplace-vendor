
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/marketplace";
import { formatDistance, parseISO } from "date-fns";

interface ProductDetailProps {
  product: Product;
  isOwner: boolean;
  isLoading?: boolean;
  onPurchase?: () => void;
  purchaseInProgress?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  isOwner,
  isLoading = false,
  onPurchase,
  purchaseInProgress = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
          {product.purchased && (
            <Badge variant="secondary" className="bg-white text-purple-700">
              Sold
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Description</h3>
          <p className="mt-2 text-gray-600">{product.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Price</h4>
            <p className="mt-1 text-xl font-semibold text-indigo-600">{product.price} ETH</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Owner</h4>
            <p className="mt-1 text-gray-900 break-all">
              {isOwner ? (
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    You
                  </Badge>
                  {product.owner.substring(0, 10)}...
                </span>
              ) : (
                `${product.owner.substring(0, 18)}...`
              )}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!product.purchased && !isOwner && (
          <Button 
            onClick={onPurchase} 
            disabled={isLoading || purchaseInProgress}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            {purchaseInProgress ? "Processing..." : "Buy Now"}
          </Button>
        )}
        {isOwner && <Badge>You own this item</Badge>}
      </CardFooter>
    </Card>
  );
};

export default ProductDetail;
