
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/utils/web3";
import { Product } from "@/types/marketplace";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";

// Mock data for initial development - will be replaced with actual blockchain data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vintage Guitar",
    description: "A beautiful vintage electric guitar in excellent condition. This classic instrument has been well maintained and produces a warm, rich tone that's perfect for blues and rock. Includes original case and accessories.",
    price: 0.5,
    owner: "0x123456789abcdef123456789abcdef123456789a",
    purchased: false
  },
  {
    id: 2,
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX graphics, 16GB RAM, 1TB SSD, and a 15.6\" 144Hz display. Perfect for both gaming and content creation, this machine can handle any modern game at high settings.",
    price: 0.75,
    owner: "0x123456789abcdef123456789abcdef123456789a",
    purchased: true
  },
  {
    id: 3,
    name: "Designer Watch",
    description: "Luxury designer watch with automatic movement. Features a sapphire crystal face, stainless steel case, and genuine leather band. Water resistant to 100m and includes a 2-year warranty.",
    price: 0.3,
    owner: "0xabcdef123456789abcdef123456789abcdef1234",
    purchased: false
  }
];

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
        // In a real implementation, this would fetch data from the blockchain
        const productId = parseInt(id || "0");
        const foundProduct = MOCK_PRODUCTS.find(p => p.id === productId) || null;
        
        if (!foundProduct) {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist",
            variant: "destructive"
          });
          navigate("/");
          return;
        }
        
        setProduct(foundProduct);
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
    
    try {
      setPurchaseLoading(true);
      
      // In a real implementation, this would send a transaction to the blockchain
      toast({
        title: "Purchase initiated",
        description: "Please confirm the transaction in your wallet",
      });
      
      // Mock successful purchase
      setTimeout(() => {
        if (product) {
          setProduct({
            ...product,
            purchased: true,
            owner: account
          });
        }
        
        toast({
          title: "Purchase successful!",
          description: "You are now the owner of this item",
          variant: "default",
        });
        setPurchaseLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
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
