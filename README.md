# 🚰 Ethereum Sepolia Testnet Faucet

A simple, modern faucet application for distributing Sepolia testnet ETH to developers and testers.

## Features

- **Rate limiting** - Prevents abuse with 24-hour cooldown per address
- **Address validation** - Validates Ethereum addresses before processing
- **Transaction tracking** - View transactions on Etherscan
- **Real-time balance** - Shows current faucet balance and configuration

## Architecture

- **Frontend**: React application
- **Backend**: Node.js/Express API server
- **Blockchain**: Ethereum Sepolia testnet via ethers.js
- **Rate Limiting**: In-memory storage

## Quick Start

1. **Install dependencies**:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend  
   cd frontend && npm install
   ```

2. **Configure environment**:
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your private key and RPC URL
   
   # Frontend
   cp frontend/env.example frontend/.env
   ```

3. **Start the application**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

4. **Open your browser** to `http://localhost:3000`

## What You Need

### Before Starting
- Node.js v18+ installed
- MetaMask or Coinbase Wallet browser extension
- Sepolia RPC endpoint (Alchemy/Infura)
- Sepolia testnet ETH for the faucet wallet

### Environment Variables

**Backend** (`backend/.env`):
```env
ETHEREUM_PRIVATE_KEY=your_faucet_wallet_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
FAUCET_AMOUNT=0.1
PORT=3001
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

## API Endpoints

- `GET /api/faucet/info` - Faucet information and balance
- `POST /api/faucet` - Request testnet ETH

## Development

### Project Structure
```
faucet/
├── backend/           # Node.js/Express API
│   ├── server.js      # Main server file
│   ├── package.json   # Dependencies
│   └── env.example    # Environment template
├── frontend/          # React application
│   ├── src/
│   │   ├── App.js     # Main component
│   │   └── App.css    # Styles
│   ├── package.json   # Dependencies
│   └── env.example    # Environment template
├── SETUP.md          # Detailed setup guide
└── REQUIREMENTS.md   # Technical requirements
```

### Key Technologies
- **Backend**: Express.js, ethers.js, CORS, dotenv
- **Frontend**: React, axios, ethers.js (for validation)
- **Blockchain**: Ethereum Sepolia testnet

## Troubleshooting

**Common Issues:**

1. **"Missing required environment variables"**
   - Ensure `.env` files are created and populated

2. **"Insufficient faucet balance"**
   - Fund your faucet wallet with Sepolia ETH

3. **"Network error"**
   - Verify RPC URL and API key are correct

4. **Rate limiting**
   - Wait 24 hours or use a different address
   - Restart backend to clear in-memory limits (development only)