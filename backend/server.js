const express = require('express');
const { ethers } = require('ethers');
const { applyMiddleware, applyErrorHandling, updateRateLimit } = require('./middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware
applyMiddleware(app);

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
const FAUCET_AMOUNT = process.env.FAUCET_AMOUNT || '0.01'; // Default 0.01 ETH
const faucetAmountWei = ethers.parseEther(FAUCET_AMOUNT);

// Helper function to validate Ethereum address
function isValidEthereumAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
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

    // Rate limiting is now handled by middleware

    // Check faucet balance
    const faucetBalance = await provider.getBalance(wallet.address);
    // Estimate gas cost for the transaction
    const feeData = await provider.getFeeData();
    const gasLimit = 21000n; // Use BigInt literal
    const gasPrice = feeData.gasPrice || feeData.maxFeePerGas || ethers.parseUnits('20', 'gwei'); // Fallback gas price
    const estimatedGasCost = gasLimit * gasPrice;
    
    const totalRequired = faucetAmountWei + estimatedGasCost;

    if (faucetBalance < totalRequired) {
      return res.status(503).json({ 
        success: false, 
        error: `Insufficient faucet balance. Required: ${ethers.formatEther(totalRequired)} ETH (${FAUCET_AMOUNT} ETH + gas fees), Available: ${ethers.formatEther(faucetBalance)} ETH` 
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

// Apply error handling middleware
applyErrorHandling(app);

app.listen(PORT, () => {
  console.log(`Faucet server running on port ${PORT}`);
  console.log(`Faucet wallet address: ${wallet.address}`);
});

module.exports = app;
