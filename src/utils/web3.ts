
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async () => {
  try {
    if (window.ethereum) {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } else {
      throw new Error("No ethereum provider detected. Please install MetaMask.");
    }
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    throw error;
  }
};

export const useWalletConnection = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return { account, connect, isConnecting, error };
};
