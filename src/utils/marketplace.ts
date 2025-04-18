
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Product } from '@/types/marketplace';

// Import the contract ABI
// Note: In a production app, this would import the actual ABI JSON file
// Since we don't have the compiled ABI yet, we'll create a placeholder
const MARKETPLACE_ABI: AbiItem[] = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address payable",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "purchased",
        "type": "bool"
      }
    ],
    "name": "ProductCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address payable",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "purchased",
        "type": "bool"
      }
    ],
    "name": "ProductPurchased",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "createProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "purchased",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "purchaseProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Contract address - this would be set after deployment
// For development, we'll use a placeholder that gets updated when available
let marketplaceAddress = '';

// Function to initialize marketplace with the deployed address
export const initializeMarketplace = (address: string) => {
  marketplaceAddress = address;
  console.log('Marketplace initialized with address:', address);
};

// Create a marketplace contract instance
const getMarketplaceContract = async () => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider detected');
  }

  try {
    const web3 = new Web3(window.ethereum);
    
    // If we don't have a marketplace address yet, use a fallback for development
    if (!marketplaceAddress) {
      console.warn('No marketplace address set, using fallback mock data');
      return null;
    }
    
    return new web3.eth.Contract(MARKETPLACE_ABI, marketplaceAddress);
  } catch (error) {
    console.error('Error creating contract instance:', error);
    throw error;
  }
};

// Load all products from the marketplace
export const loadProducts = async (): Promise<Product[]> => {
  try {
    const contract = await getMarketplaceContract();
    
    // If no contract is available, return mock data for development
    if (!contract) {
      console.warn('Using mock product data');
      return [
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
    }
    
    const web3 = new Web3(window.ethereum);
    const productCount = await contract.methods.productCount().call();
    
    const products: Product[] = [];
    
    for (let i = 1; i <= productCount; i++) {
      const product = await contract.methods.products(i).call();
      products.push({
        id: parseInt(product.id),
        name: product.name,
        description: product.description,
        price: web3.utils.fromWei(product.price, 'ether'),
        owner: product.owner,
        purchased: product.purchased
      });
    }
    
    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProduct = async (id: number): Promise<Product | null> => {
  try {
    const contract = await getMarketplaceContract();
    
    // If no contract is available, return mock data for development
    if (!contract) {
      console.warn('Using mock product data for ID:', id);
      const mockProducts = [
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
      
      return mockProducts.find(p => p.id === id) || null;
    }
    
    const web3 = new Web3(window.ethereum);
    const product = await contract.methods.products(id).call();
    
    // Check if product exists (id > 0 in the contract means it exists)
    if (parseInt(product.id) === 0) {
      return null;
    }
    
    return {
      id: parseInt(product.id),
      name: product.name,
      description: product.description,
      price: web3.utils.fromWei(product.price, 'ether'),
      owner: product.owner,
      purchased: product.purchased
    };
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (name: string, description: string, price: number, account: string): Promise<void> => {
  try {
    const contract = await getMarketplaceContract();
    
    if (!contract) {
      console.warn('Cannot create product: No contract instance available');
      throw new Error('No contract instance available');
    }
    
    const web3 = new Web3(window.ethereum);
    const priceInWei = web3.utils.toWei(price.toString(), 'ether');
    
    await contract.methods
      .createProduct(name, description, priceInWei)
      .send({ from: account });
      
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Purchase a product
export const purchaseProduct = async (id: number, price: number, account: string): Promise<void> => {
  try {
    const contract = await getMarketplaceContract();
    
    if (!contract) {
      console.warn('Cannot purchase product: No contract instance available');
      throw new Error('No contract instance available');
    }
    
    const web3 = new Web3(window.ethereum);
    const priceInWei = web3.utils.toWei(price.toString(), 'ether');
    
    await contract.methods
      .purchaseProduct(id)
      .send({ from: account, value: priceInWei });
      
  } catch (error) {
    console.error('Error purchasing product:', error);
    throw error;
  }
};
