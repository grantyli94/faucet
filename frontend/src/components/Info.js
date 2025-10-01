import React from 'react';

const Info = () => {
  return (
    <>
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
    </>
  );
};

export default Info;
