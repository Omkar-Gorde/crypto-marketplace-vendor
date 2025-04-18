
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/marketplace";
import { useWalletConnection } from "@/utils/web3";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

// Mock data for initial development - will be replaced with actual blockchain data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vintage Guitar",
    description: "A beautiful vintage electric guitar in excellent condition.",
    price: 0.5,
    owner: "0x123456789abcdef123456789abcdef123456789a",
    purchased: false
  },
  {
    id: 2,
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX graphics.",
    price: 0.75,
    owner: "0x123456789abcdef123456789abcdef123456789a",
    purchased: true
  },
  {
    id: 3,
    name: "Designer Watch",
    description: "Luxury designer watch with automatic movement.",
    price: 0.3,
    owner: "0xabcdef123456789abcdef123456789abcdef1234",
    purchased: false
  }
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { account } = useWalletConnection();
  const { toast } = useToast();

  useEffect(() => {
    // Load products from blockchain (using mock data for now)
    const loadProducts = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch data from the blockchain
        // const web3 = new Web3(window.ethereum);
        // const networkId = await web3.eth.net.getId();
        // const marketplaceData = Marketplace.networks[networkId];
        
        setTimeout(() => {
          setProducts(MOCK_PRODUCTS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handlePurchase = async (id: number) => {
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this item",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real implementation, this would send a transaction to the blockchain
      toast({
        title: "Purchase initiated",
        description: "Please confirm the transaction in your wallet",
      });
      
      // Mock successful purchase
      setTimeout(() => {
        setProducts(products.map(p => 
          p.id === id 
            ? { ...p, purchased: true, owner: account } 
            : p
        ));
        
        toast({
          title: "Purchase successful!",
          description: "You are now the owner of this item",
          variant: "default",
        });
      }, 2000);
    } catch (error) {
      console.error("Error purchasing product:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Decentralized Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Buy and sell items securely on the blockchain with instant ownership transfer
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPurchase={handlePurchase}
                connected={Boolean(account)}
                isOwner={account === product.owner}
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="mt-16 bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Ethereum Marketplace. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Powered by Ethereum Blockchain</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
