import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [faucetInfo, setFaucetInfo] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');

  // Fetch faucet information on component mount
  useEffect(() => {
    fetchFaucetInfo();
  }, []);

  const fetchFaucetInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/faucet/info`);
      setFaucetInfo(response.data);
    } catch (error) {
      console.error('Error fetching faucet info:', error);
    }
  };

  const validateAddress = (addr) => {
    try {
      return ethers.isAddress(addr);
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setMessage('Please enter an Ethereum address');
      setMessageType('error');
      return;
    }

    if (!validateAddress(address)) {
      setMessage('Please enter a valid Ethereum address');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setTransactionHash('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/faucet`, {
        address: address.trim()
      });

      if (response.data.success) {
        setMessage(`Successfully sent ${response.data.amount} ETH to ${response.data.to}`);
        setMessageType('success');
        setTransactionHash(response.data.transactionHash);
        setAddress(''); // Clear the input
        
        // Refresh faucet info to show updated balance
        fetchFaucetInfo();
      } else {
        setMessage(response.data.error || 'Transaction failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error requesting funds:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else if (error.code === 'NETWORK_ERROR') {
        setMessage('Network error. Please check if the backend server is running.');
      } else {
        setMessage('Failed to request funds. Please try again.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    // Clear message when user starts typing
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const getExplorerUrl = (txHash) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚰 Ethereum Sepolia Testnet Faucet</h1>
        <p>Get free testnet ETH for development and testing</p>
      </header>

      <main className="App-main">
        {faucetInfo && (
          <div className="faucet-info">
            <h3>Faucet Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Network:</span>
                <span className="value">{faucetInfo.network.name} (Chain ID: {faucetInfo.network.chainId})</span>
              </div>
              <div className="info-item">
                <span className="label">Faucet Balance:</span>
                <span className="value">{parseFloat(faucetInfo.faucetBalance).toFixed(4)} ETH</span>
              </div>
              <div className="info-item">
                <span className="label">Amount per request:</span>
                <span className="value">{faucetInfo.faucetAmount} ETH</span>
              </div>
              <div className="info-item">
                <span className="label">Faucet Address:</span>
                <span className="value address">{faucetInfo.faucetAddress}</span>
              </div>
            </div>
          </div>
        )}

        <div className="faucet-form">
          <h2>Request Testnet ETH</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="address">Ethereum Address:</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={handleAddressChange}
                placeholder="0x..."
                disabled={loading}
                className={messageType === 'error' && !loading ? 'error' : ''}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !address.trim()}
              className="submit-button"
            >
              {loading ? 'Sending...' : `Request ${faucetInfo?.faucetAmount || '0.1'} ETH`}
            </button>
          </form>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          {transactionHash && (
            <div className="transaction-info">
              <h3>Transaction Details</h3>
              <div className="transaction-hash">
                <span className="label">Transaction Hash:</span>
                <a 
                  href={getExplorerUrl(transactionHash)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tx-link"
                >
                  {transactionHash}
                </a>
              </div>
              <p className="explorer-note">
                Click the transaction hash to view on Etherscan
              </p>
            </div>
          )}
        </div>

        <div className="instructions">
          <h3>Instructions</h3>
          <ol>
            <li>Make sure you have MetaMask or another Ethereum wallet installed</li>
            <li>Switch your wallet to the Sepolia testnet</li>
            <li>Copy your wallet address and paste it above</li>
            <li>Click "Request ETH" to receive testnet funds</li>
            <li>You can request funds once every 24 hours per address</li>
          </ol>
        </div>

        <div className="warning">
          <h4>⚠️ Important Notes</h4>
          <ul>
            <li>This faucet only works on the Sepolia testnet</li>
            <li>Testnet ETH has no real value and cannot be used on mainnet</li>
            <li>Rate limiting: 1 request per address per 24 hours</li>
            <li>If you need more testnet ETH, try other public faucets</li>
          </ul>
        </div>
      </main>

      <footer className="App-footer">
        <p>Built for Ethereum development and testing</p>
      </footer>
    </div>
  );
}

export default App;