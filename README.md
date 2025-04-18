
# Ethereum Marketplace DApp

A decentralized marketplace built on Ethereum that allows users to list items for sale and purchase them directly with cryptocurrency.

## Features

- **Blockchain Transactions**: Every purchase is securely processed on the Ethereum blockchain
- **Smart Contract Powered**: Automatic ownership transfer upon purchase
- **User-Friendly Interface**: Modern React UI for browsing, selling, and purchasing items
- **MetaMask Integration**: Connect your Ethereum wallet seamlessly

## Technology Stack

- **Smart Contracts**: Solidity
- **Blockchain Development**: Truffle & Ganache
- **Frontend**: React.js, TypeScript
- **Blockchain Interaction**: Web3.js
- **UI Components**: shadcn/ui with TailwindCSS
- **Styling**: TailwindCSS

## Setup & Installation

### Prerequisites

- Node.js
- MetaMask browser extension
- Ganache (for local blockchain development)
- Truffle (for smart contract deployment)

### Local Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start Ganache (personal blockchain)
4. Deploy contracts to the blockchain:
   ```
   truffle migrate --reset
   ```
5. Start the React development server:
   ```
   npm run dev
   ```
6. Connect MetaMask to your local Ganache blockchain (usually at http://localhost:7545)

## Smart Contract Structure

The marketplace is powered by a smart contract that handles:
- Listing items for sale
- Tracking ownership
- Processing purchases
- Transferring funds

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Browse items on the marketplace
3. List your own items for sale using the "Sell Item" page
4. Purchase items directly through the platform

## Future Enhancements

- Item categories and search functionality
- User ratings and reviews
- Support for NFT trading
- Multiple payment token options
