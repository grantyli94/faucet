const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables validation
const requiredEnvVars = ['ETHEREUM_PRIVATE_KEY', 'SEPOLIA_RPC_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please create a .env file with the required variables');
  process.exit(1);
}

// Ethereum setup
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, provider);

// Faucet configuration
const FAUCET_AMOUNT = process.env.FAUCET_AMOUNT || '0.01'; // Default 0.1 ETH
const faucetAmountWei = ethers.parseEther(FAUCET_AMOUNT);

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to validate Ethereum address
function isValidEthereumAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
}

// Helper function to check rate limiting
function isRateLimited(address) {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(address.toLowerCase());
  
  if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW) {
    return true;
  }
  
  return false;
}

// Helper function to update rate limiting
function updateRateLimit(address) {
  rateLimitMap.set(address.toLowerCase(), Date.now());
}

// Routes
app.get('/api/faucet/info', async (req, res) => {
  try {
    const balance = await provider.getBalance(wallet.address);
    const network = await provider.getNetwork();
    
    res.json({
      faucetAddress: wallet.address,
      faucetBalance: ethers.formatEther(balance),
      faucetAmount: FAUCET_AMOUNT,
      network: {
        name: network.name,
        chainId: network.chainId.toString()
      }
    });
  } catch (error) {
    console.error('Error getting faucet info:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get faucet information' 
    });
  }
});

app.post('/api/faucet', async (req, res) => {
  try {
    const { address } = req.body;

    // Validate input
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address is required' 
      });
    }

    // Validate Ethereum address format
    if (!isValidEthereumAddress(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid Ethereum address format' 
      });
    }

    // Check rate limiting
    if (isRateLimited(address)) {
      return res.status(429).json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again in 24 hours.' 
      });
    }

    // Check faucet balance
    const faucetBalance = await provider.getBalance(wallet.address);
    if (faucetBalance < faucetAmountWei) {
      return res.status(503).json({ 
        success: false, 
        error: 'Insufficient faucet balance' 
      });
    }

    // Create and send transaction
    const transaction = {
      to: address,
      value: faucetAmountWei,
      gasLimit: 21000, // Standard ETH transfer gas limit
    };

    console.log(`Sending ${FAUCET_AMOUNT} ETH to ${address}`);
    
    const txResponse = await wallet.sendTransaction(transaction);
    
    // Update rate limiting
    updateRateLimit(address);

    // Wait for transaction confirmation (optional - can be removed for faster response)
    console.log(`Transaction sent: ${txResponse.hash}`);
    
    res.json({
      success: true,
      transactionHash: txResponse.hash,
      amount: FAUCET_AMOUNT,
      to: address,
      message: `Successfully sent ${FAUCET_AMOUNT} ETH to ${address}`
    });

  } catch (error) {
    console.error('Error processing faucet request:', error);
    
    // Handle specific error types
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return res.status(503).json({ 
        success: false, 
        error: 'Insufficient funds in faucet wallet' 
      });
    }
    
    if (error.code === 'NETWORK_ERROR') {
      return res.status(503).json({ 
        success: false, 
        error: 'Network error. Please try again later.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Faucet server running on port ${PORT}`);
  console.log(`Faucet wallet address: ${wallet.address}`);
});

module.exports = app;
