import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import * as ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Dashboard from "./Dashboard.jsx";
import { Navbar } from './Navbar.jsx';
import './index.css';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// 1. Get projectId
const projectId = 'e97192181e408f58f43947960818fb15';

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com',
};

const bscTestnet = {
    chainId: 97,
    name: 'BNB Smart Chain Testnet',
    currency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
};

// 3. Create a metadata object
const metadata = {
    name: 'My Website',
    description: 'My Website description',
    url: 'https://mywebsite.com',
    icons: ['https://avatars.mywebsite.com/'],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [mainnet, bscTestnet],
    projectId,
    enableAnalytics: true,
});

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ChakraProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                 <Route path="/" element={<App />} />
                 <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>
);