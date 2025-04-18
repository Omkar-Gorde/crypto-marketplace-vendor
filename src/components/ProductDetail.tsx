
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/marketplace";
import { formatDistanceToNow } from "date-fns";
import { useWalletConnection } from "@/utils/web3";

type ProductDetailProps = {
  product: Product;
  onPurchase: (id: number) => void;
  loading?: boolean;
};

const ProductDetail = ({ product, onPurchase, loading = false }: ProductDetailProps) => {
  const { account } = useWalletConnection();
  const isOwner = account?.toLowerCase() === product.owner.toLowerCase();
  
  return (
    <Card className="overflow-hidden border-2 border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
          {product.purchased && (
            <Badge className="bg-white text-purple-700">Sold</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-900">{product.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1 text-2xl font-bold text-purple-700">{product.price} ETH</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Owner</h3>
              <p className="mt-1 text-gray-900 break-all">
                {isOwner ? (
                  <span className="flex items-center gap-1">
                    <Badge className="bg-green-50 text-green-700 border-green-200">You</Badge>
                    {product.owner.substring(0, 10)}...
                  </span>
                ) : (
                  <span>{product.owner.substring(0, 10)}...</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-gray-900">
              {product.purchased 
                ? "This item has been sold" 
                : "This item is available for purchase"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-6">
        <Button 
          onClick={() => onPurchase(product.id)} 
          disabled={!account || product.purchased || isOwner || loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : !account ? (
            "Connect wallet to purchase"
          ) : product.purchased ? (
            "Already purchased"
          ) : isOwner ? (
            "You own this item"
          ) : (
            "Buy Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductDetail;
