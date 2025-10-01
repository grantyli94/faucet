# Ethereum Sepolia Faucet - Setup Guide

This guide will walk you through setting up the Ethereum Sepolia testnet faucet application.

## Prerequisites

1. **Node.js v14+** - Download from [nodejs.org](https://nodejs.org/)
2. **MetaMask or Coinbase Wallet** - Browser extension for testing
3. **Sepolia testnet ETH** - For funding the faucet wallet
4. **Sepolia RPC endpoint** - From Infura, Alchemy, or another provider

## Step 1: Install Dependencies

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Step 2: Get Sepolia RPC Endpoint

### Option A: Alchemy (Recommended)
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Sign up for a free account
3. Create a new app on Sepolia testnet
4. Copy the HTTP endpoint (e.g., `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`)

### Option B: Infura
1. Go to [infura.io](https://infura.io/)
2. Sign up for a free account
3. Create a new project
4. Copy the Sepolia endpoint (e.g., `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`)

## Step 3: Create Faucet Wallet

### Generate a new wallet (Recommended for security)
```bash
# You can use any Ethereum wallet generator or create one programmatically
# For testing, you can use MetaMask to create a new account and export the private key
```

### Important Security Notes:
- **Never use a wallet with real funds for testing**
- **Never commit private keys to version control**
- **Use a dedicated wallet only for this faucet**

## Step 4: Fund Your Faucet Wallet

1. Get some Sepolia testnet ETH from public faucets:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

2. Send the testnet ETH to your faucet wallet address

## Step 5: Configure Environment Variables

### Backend Configuration
Create `backend/.env` file:
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env`:
```env
ETHEREUM_PRIVATE_KEY=your_faucet_wallet_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
FAUCET_AMOUNT=0.1
PORT=3001
```

### Frontend Configuration
Create `frontend/.env` file:
```bash
cp frontend/env.example frontend/.env
```

Edit `frontend/.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

## Step 6: Start the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm start
```

You should see:
```
Faucet server running on port 3001
Faucet wallet address: 0x...
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm start
```

The React app should open in your browser at `http://localhost:3000`

## Step 7: Test the Faucet

1. Open your browser to `http://localhost:3000`
2. You should see the faucet interface with your faucet information
3. Enter a Sepolia testnet address (you can use your MetaMask address)
4. Click "Request ETH"
5. Check the transaction on [Sepolia Etherscan](https://sepolia.etherscan.io/)

## Troubleshooting

### Backend Issues

**Error: "Missing required environment variables"**
- Make sure your `.env` file exists in the backend directory
- Check that all required variables are set

**Error: "Insufficient faucet balance"**
- Your faucet wallet needs Sepolia ETH
- Get more testnet ETH from public faucets

**Error: "Network error"**
- Check your RPC URL is correct
- Verify your API key is valid
- Try a different RPC provider

### Frontend Issues

**Error: "Network error. Please check if the backend server is running."**
- Make sure the backend server is running on port 3001
- Check the `REACT_APP_API_BASE_URL` in your frontend `.env` file

**Address validation errors**
- Make sure you're entering a valid Ethereum address (starts with 0x)
- Address should be 42 characters long

### Rate Limiting

The faucet implements rate limiting (1 request per address per 24 hours). If you need to test multiple times:
- Use different addresses
- Restart the backend server (this clears the in-memory rate limiting)

## Security Considerations

1. **Private Key Security**
   - Never share your private key
   - Use environment variables, never hardcode
   - Consider using a hardware wallet for production

2. **Rate Limiting**
   - The current implementation uses in-memory storage
   - For production, use Redis or a database

3. **CORS Configuration**
   - Currently allows all origins for development
   - Restrict origins for production deployment

4. **Input Validation**
   - The app validates Ethereum addresses
   - Additional validation can be added as needed

## Production Deployment

For production deployment, consider:

1. **Environment Variables**
   - Use proper secret management
   - Never expose private keys

2. **Database**
   - Replace in-memory rate limiting with persistent storage
   - Track transaction history

3. **Monitoring**
   - Add logging and monitoring
   - Set up alerts for low balance

4. **Security**
   - Use HTTPS
   - Implement proper CORS policies
   - Add additional rate limiting layers

## API Documentation

### GET /health
Health check endpoint

### GET /api/faucet/info
Returns faucet information including balance and configuration

### POST /api/faucet
Request testnet ETH

Request body:
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D6Ac6c0C0b3c3c3c"
}
```

Response:
```json
{
  "success": true,
  "transactionHash": "0x...",
  "amount": "0.1",
  "to": "0x742d35Cc6634C0532925a3b8D6Ac6c0C0b3c3c3c",
  "message": "Successfully sent 0.1 ETH to 0x742d35Cc6634C0532925a3b8D6Ac6c0C0b3c3c3c"
}
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check that your faucet wallet has sufficient balance
4. Ensure you're using the Sepolia testnet
