import React from 'react';

const FaucetInfo = ({ faucetInfo }) => {
  if (!faucetInfo) return null;

  return (
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
  );
};

export default FaucetInfo;
