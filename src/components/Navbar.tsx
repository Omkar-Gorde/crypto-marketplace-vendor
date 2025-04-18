
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/utils/web3";

const Navbar = () => {
  const { account, connect, isConnecting } = useWalletConnection();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Ethereum Marketplace</div>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" className="flex-1" asChild>
            <a href="/">Browse</a>
          </Button>
          <Button variant="secondary" className="flex-1" asChild>
            <a href="/sell">Sell Item</a>
          </Button>
          {account ? (
            <Button variant="outline" className="bg-white text-purple-700 border-white hover:bg-purple-50">
              {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
            </Button>
          ) : (
            <Button onClick={connect} disabled={isConnecting} className="bg-white text-purple-700 border-white hover:bg-purple-50">
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
