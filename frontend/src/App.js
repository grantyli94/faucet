import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import './App.css';
import FaucetInfo from './components/FaucetInfo';
import FaucetForm from './components/FaucetForm';
import Info from './components/Info';

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


  return (
    <div className="App">
      <header className="App-header">
        <h1>🚰 Ethereum Sepolia Testnet Faucet</h1>
        <p>Get free testnet ETH for development and testing</p>
      </header>

      <main className="App-main">
        <FaucetInfo faucetInfo={faucetInfo} />
        
        <FaucetForm 
          address={address}
          loading={loading}
          message={message}
          messageType={messageType}
          transactionHash={transactionHash}
          faucetInfo={faucetInfo}
          onAddressChange={handleAddressChange}
          onSubmit={handleSubmit}
        />

        <Info />
      </main>

      <footer className="App-footer">
        <p>Built for Ethereum development and testing</p>
      </footer>
    </div>
  );
}

export default App;