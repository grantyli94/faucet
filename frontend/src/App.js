import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FaucetInfo from './components/FaucetInfo';
import FaucetForm from './components/FaucetForm';
import Info from './components/Info';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [faucetInfo, setFaucetInfo] = useState(null);

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



  return (
    <div className="App">
      <header className="App-header">
        <h1>🚰 Ethereum Sepolia Testnet Faucet</h1>
        <p>Get free testnet ETH for development and testing</p>
      </header>

      <main className="App-main">
        <FaucetInfo faucetInfo={faucetInfo} />
        
        <FaucetForm 
          faucetInfo={faucetInfo}
          onTransactionSuccess={fetchFaucetInfo}
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