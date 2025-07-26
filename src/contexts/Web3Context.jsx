/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { useWeb3Modal, useWeb3ModalProvider, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers/react';

const Web3Context = createContext({});

export const Web3Provider = ({ children }) => {
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      if (walletProvider) {
        const ethersProvider = new BrowserProvider(walletProvider);
        setProvider(ethersProvider);
        try {
          const signer = await ethersProvider.getSigner();
          setSigner(signer);
        } catch {
          setSigner(null);
        }
      } else {
        setProvider(null);
        setSigner(null);
      }
    };
    loadProvider();
  }, [walletProvider]);

  const connectWallet = async () => {
    await open();
  };

  return (
    <Web3Context.Provider value={{ provider, signer, address, chainId, isConnected, connectWallet, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
