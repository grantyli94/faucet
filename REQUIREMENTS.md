# Ethereum Sepolia Faucet - Requirements and Dependencies

## Project Overview
A simple faucet application for Ethereum's Sepolia testnet with:
- React frontend for user interface
- Node.js/Express backend for transaction handling
- Ethers.js integration for Ethereum interactions

## System Requirements

### Node.js and npm
- Node.js v18
- npm (comes with Node.js)

### Wallet Extension (for testing)
- MetaMask or Coinbase Wallet browser extension

## Backend Dependencies (Node.js/Express)

### package.json dependencies:
- `express` - Web framework
- `ethers` - Ethereum JavaScript library
- `dotenv` - Environment variable management
- `cors` - CORS handling for API

## Frontend Dependencies (React)

### package.json dependencies:
- `react` - Frontend framework
- `react-dom` - React DOM rendering
- `axios` - HTTP client for API calls
- `ethers` - Ethereum JavaScript library for address validation

## Environment Variables Required

### Backend (.env)
- `ETHEREUM_PRIVATE_KEY` - Private key for the faucet wallet
- `SEPOLIA_RPC_URL` - Sepolia testnet RPC endpoint
- `FAUCET_AMOUNT` - Amount of ETH to send (in wei)

### Frontend (.env)
- `REACT_APP_API_BASE_URL` - Backend API base URL

## Setup Instructions

1. Install Node.js v14+ and npm
2. Install wallet extension (MetaMask or Coinbase Wallet)
3. Clone/setup project directories
4. Install backend dependencies: `cd backend && npm install`
5. Install frontend dependencies: `cd frontend && npm install`
6. Configure environment variables (see .env.example files)
7. Start backend server: `cd backend && npm start`
8. Start frontend development server: `cd frontend && npm start`

## API Endpoints

### POST /api/faucet
Request body:
```json
{
  "address": "0x..."
}
```

Response:
```json
{
  "success": true,
  "transaction_hash": "0x...",
  "amount": "0.1"
}
```
