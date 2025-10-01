import React from 'react';

const FaucetForm = ({ 
  address, 
  loading, 
  message, 
  messageType, 
  transactionHash, 
  faucetInfo,
  onAddressChange, 
  onSubmit 
}) => {
  const getExplorerUrl = (txHash) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  return (
    <div className="faucet-form">
      <h2>Request Testnet ETH</h2>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="address">Ethereum Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={onAddressChange}
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
