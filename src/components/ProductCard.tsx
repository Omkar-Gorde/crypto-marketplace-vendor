
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/marketplace";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: Product;
  onPurchase: (id: number) => void;
  connected: boolean;
  isOwner: boolean;
};

const ProductCard = ({ product, onPurchase, connected, isOwner }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${product.id}`}>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            {product.purchased && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sold</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <div className="font-bold text-lg text-purple-700">
            {product.price} ETH
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Owner: {isOwner ? "You" : `${product.owner.substring(0, 6)}...${product.owner.substring(product.owner.length - 4)}`}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 bg-gray-50">
        <Button 
          onClick={() => onPurchase(product.id)} 
          disabled={!connected || product.purchased || isOwner}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {!connected 
            ? "Connect wallet to purchase" 
            : product.purchased 
              ? "Already purchased" 
              : isOwner 
                ? "You own this item" 
                : "Buy Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
