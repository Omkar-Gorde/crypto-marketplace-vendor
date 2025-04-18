
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/CardTitle";
import { Product } from "@/types/marketplace";
import { formatDistance } from "date-fns";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block no-underline">
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            {product.purchased && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                Sold
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 line-clamp-3">{product.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4">
          <div className="text-lg font-semibold">{product.price} ETH</div>
          <Button variant="outline" size="sm">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
