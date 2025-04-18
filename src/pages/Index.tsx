
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/marketplace";
import { useWalletConnection } from "@/utils/web3";
import { loadProducts, purchaseProduct } from "@/utils/marketplace";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { account } = useWalletConnection();
  const { toast } = useToast();

  useEffect(() => {
    // Load products from blockchain
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await loadProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please check your connection.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

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
      // Find the product to get its price
      const product = products.find(p => p.id === id);
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Purchase initiated",
        description: "Please confirm the transaction in your wallet",
      });
      
      await purchaseProduct(id, product.price, account);
      
      // Update the local state to reflect the purchase
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
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">No items listed yet</h2>
            <p className="text-gray-500 mt-2">Be the first to sell something!</p>
            <Button 
              variant="default" 
              className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600"
              onClick={() => window.location.href = '/sell'}
            >
              Sell an Item
            </Button>
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
