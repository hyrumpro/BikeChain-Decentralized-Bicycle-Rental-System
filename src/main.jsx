import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import * as ReactDOM from 'react-dom/client';
import App from './App.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import Navbar from './components/layout/Navbar.jsx';
import { Web3Provider } from './contexts/Web3Context.jsx';
import './index.css';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const projectId = 'e97192181e408f58f43947960818fb15';

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
};

const bscTestnet = {
  chainId: 97,
  name: 'BNB Smart Chain Testnet',
  currency: 'BNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545'
};

const metadata = {
  name: 'BikeChain',
  description: 'Decentralized bike rental',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true
});

createWeb3Modal({
  ethersConfig,
  chains: [mainnet, bscTestnet],
  projectId,
  enableAnalytics: true
});

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <Web3Provider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </ChakraProvider>
  </React.StrictMode>
);
