import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { BrowserProvider, Contract, formatUnits, parseEther } from 'ethers';
import { useToast } from '@chakra-ui/react';
import config from '../config.json';

function DashboardContext() {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const toast = useToast();
    console.log(address, isConnected, chainId);

    async function getBalance() {
        if (!isConnected) throw Error('User disconnected');

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(config.contractAddress, config.abi, signer);

        const balance = await contract.balanceOfRenter(address);
        console.log(formatUnits(balance, 18));
    }

    async function makeDeposit() {
        if (!isConnected) throw Error('User disconnected');

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(config.contractAddress, config.abi, signer);

        try {
            const balance = await ethersProvider.getBalance(address);
            const depositAmount = parseEther('0.001');

            if (balance < depositAmount) {
                alert('Insufficient funds. Please make sure you have enough balance to cover the deposit amount.');
                return;
            }

            const tx = await contract.deposit(address, { value: depositAmount });
            await tx.wait();

            toast({
                title: 'Transaction Successful',
                description: (
                    <>
                        Your deposit transaction was successful.{' '}
                        <a href={`https://testnet.bscscan.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                            View on Blockchain Explorer
                        </a>
                    </>
                ),
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Deposit failed:', error);
            toast({
                title: 'Transaction Failed',
                description: 'Your deposit transaction failed. Please try again.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    return (
        <div>
            <button onClick={getBalance}>Get User Balance</button>
            <button onClick={makeDeposit}>Make Deposit</button>
        </div>
    );
}

export default DashboardContext;