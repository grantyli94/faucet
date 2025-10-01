import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const FaucetForm = ({ faucetInfo, onTransactionSuccess }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [transactionHash, setTransactionHash] = useState('');

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
        
        // Notify parent component to refresh faucet info
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }
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
  );
};

export default FaucetForm;
