
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { initializeMarketplace } from '@/utils/marketplace';
import Web3 from 'web3';

// This component initializes the marketplace contract
// It doesn't render anything - it just handles the initialization
const MarketplaceInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      if (initialized) return;
      
      try {
        if (typeof window.ethereum === 'undefined') {
          console.warn('No Ethereum provider detected');
          return;
        }

        const web3 = new Web3(window.ethereum);
        
        // For local development with Truffle + Ganache
        try {
          const networkId = await web3.eth.net.getId();
          
          // For development purposes, we'll use a hardcoded address
          // In production, this should be fetched from the deployed contract
          
          // This address is a placeholder - it would be updated after deployment
          // If you're using a local blockchain like Ganache, deploy the contract first
          // Then, retrieve the address from the deployment and update it here
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Placeholder
          
          initializeMarketplace(contractAddress);
          setInitialized(true);
          
        } catch (error) {
          console.error('Error initializing marketplace contract:', error);
          toast({
            title: "Contract Initialization Failed",
            description: "Using mock data instead. Check console for details.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Marketplace initialization error:', error);
      }
    };

    init();
  }, [initialized, toast]);

  return null; // This component doesn't render anything
};

export default MarketplaceInitializer;
