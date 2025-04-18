
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/utils/web3";
import { Product } from "@/types/marketplace";
import { getProduct, purchaseProduct } from "@/utils/marketplace";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";

const ProductView = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const { account } = useWalletConnection();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productId = parseInt(id || "0");
        if (isNaN(productId) || productId <= 0) {
          toast({
            title: "Invalid product ID",
            description: "The product ID is not valid",
            variant: "destructive"
          });
          navigate("/");
          return;
        }
        
        const fetchedProduct = await getProduct(productId);
        
        if (!fetchedProduct) {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist",
            variant: "destructive"
          });
          navigate("/");
          return;
        }
        
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error loading product",
          description: "There was an error loading the product details",
          variant: "destructive"
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const handlePurchase = async (productId: number) => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this item",
        variant: "destructive"
      });
      return;
    }
    
    if (!product) {
      return;
    }
    
    try {
      setPurchaseLoading(true);
      
      toast({
        title: "Purchase initiated",
        description: "Please confirm the transaction in your wallet",
      });
      
      await purchaseProduct(productId, product.price, account);
      
      setProduct({
        ...product,
        purchased: true,
        owner: account
      });
      
      toast({
        title: "Purchase successful!",
        description: "You are now the owner of this item",
        variant: "default",
      });
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate("/")} variant="outline">Return to Marketplace</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          &larr; Back to Marketplace
        </Button>
        
        <div className="max-w-2xl mx-auto">
          <ProductDetail 
            product={product} 
            onPurchase={handlePurchase}
            loading={purchaseLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductView;
