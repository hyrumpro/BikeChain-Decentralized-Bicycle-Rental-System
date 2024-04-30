import {
    Box,
    Flex,
    Heading,
    Input,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    useColorModeValue,
    Icon,
    Button,
    useBreakpointValue,
    Image,
    VStack,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { useState, useEffect } from 'react'
import { BsWallet2, BsCreditCard, BsStopwatch, BsBicycle } from 'react-icons/bs';
import { motion } from 'framer-motion';
import bicycleImage from './assets/bicycle-1.jpg';
import bicycleImage2 from './assets/bicycle-2.jpg';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { BrowserProvider, Contract, formatUnits, parseEther } from 'ethers';
import { useToast } from '@chakra-ui/react';
import config from './config.json';




const Dashboard = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const accentColor = useColorModeValue('teal.500', 'teal.300');
    const isDesktop = useBreakpointValue({ base: false, lg: true });

    const [renterExists, setRenterExists] = useState(false);
    const [payDueAmount, setPayDueAmount] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [balance, setBalance] = useState('0');
    const [bnbDue, setBnbDue] = useState('0');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [canRentBike, setCanRentBike] = useState(false);
    const [canRent, setCanRent] = useState(false);
    const [active, setActive] = useState(false);
    const [totalTime, setTotalTime] = useState(0);


    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const toast = useToast();
    console.log(address, isConnected, chainId);





    useEffect(() => {
        const fetchBalance = async () => {
            if (!isConnected) return;

            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(config.contractAddress, config.abi, signer);

            const fetchedBalance = await contract.balanceOfRenter(address);
            setBalance(formatUnits(fetchedBalance, 18));
        };

        fetchBalance();

        const intervalId = setInterval(fetchBalance, 30000);

        return () => {
            clearInterval(intervalId);
        };
    }, [isConnected, walletProvider, address, config]);


    useEffect(() => {
        const fetchBnbDue = async () => {
            if (!isConnected) return;

            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(config.contractAddress, config.abi, signer);

            const fetchedDue = await contract.getDue(address);
            setBnbDue(formatUnits(fetchedDue, 18));
        };

        fetchBnbDue();

        const intervalId = setInterval(fetchBnbDue, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [isConnected, walletProvider, address, config]);

    useEffect(() => {
        const checkRenterExists = async () => {
            if (!isConnected) return;

            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(config.contractAddress, config.abi, signer);

            const exists = await contract.renterExists(address);
            setRenterExists(exists);
        };

        checkRenterExists();
    }, [isConnected, walletProvider, address, config]);


    useEffect(() => {
        const fetchRenterDetails = async () => {
            if (!isConnected) return;

            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(config.contractAddress, config.abi, signer);

            try {
                const exists = await contract.renterExists(address);
                setRenterExists(exists);

                if (exists) {
                    const [fetchedFirstName, fetchedLastName, fetchedCanRent, fetchedActive] =
                        await contract.getRenter(address);

                    setFirstName(fetchedFirstName);
                    setLastName(fetchedLastName);
                    setCanRent(fetchedCanRent);
                    setActive(fetchedActive);

                    const fetchedCanRentBike = await contract.canRentBike(address);
                    setCanRentBike(fetchedCanRentBike);
                }
            } catch (error) {
                console.error('Error fetching renter details:', error);
                setRenterExists(false);
            }
        };

        fetchRenterDetails();
    }, [isConnected, walletProvider, address, config]);


    useEffect(() => {
        const fetchTotalTime = async () => {
            if (!isConnected) return;

            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(config.contractAddress, config.abi, signer);

            try {
                const fetchedTotalTime = await contract.GetTotalTime(address);
                const totalTimeNumber = Number(fetchedTotalTime);
                setTotalTime(totalTimeNumber);
            } catch (error) {
                console.error('Error fetching total time:', error);
            }
        };

        fetchTotalTime();

        const intervalId = setInterval(fetchTotalTime, 10000); // Fetch every minute

        return () => {
            clearInterval(intervalId);
        };
    }, [isConnected, walletProvider, address, config]);



    const handleCheckIn = async (bicycleId) => {
        if (!isConnected) {
            console.log('Please connect your wallet to check in.');
            return;
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(config.contractAddress, config.abi, signer);

        try {
            const tx = await contract.CheckIn(address);
            await tx.wait();
            console.log(`Checked in bicycle ${bicycleId} successfully.`);
        } catch (error) {
            console.error(`Error checking in bicycle ${bicycleId}:`, error);
        }
    };

    const handleCheckOut = async (bicycleId) => {
        if (!isConnected) {
            console.log('Please connect your wallet to check out.');
            return;
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(config.contractAddress, config.abi, signer);

        try {
            const tx = await contract.CheckOut(address);
            await tx.wait();
            console.log(`Checked out bicycle ${bicycleId} successfully.`);
        } catch (error) {
            console.error(`Error checking out bicycle ${bicycleId}:`, error);
        }
    };




    const handleAddRenter = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            toast({
                title: 'Not Connected',
                description: 'Please connect your wallet to add a renter.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(config.contractAddress, config.abi, signer);

        try {
            const tx = await contract.addRenter(
                address,
                firstName,
                lastName,
                true,
                true,
                0,
                0,
                0,
                0
            );
            await tx.wait();

            toast({
                title: 'Renter Added',
                description: 'The renter has been successfully added.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setRenterExists(true);
        } catch (error) {
            console.error('Error adding renter:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while adding the renter.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };



    const handlePayDue = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            toast({
                title: 'Not Connected',
                description: 'Please connect your wallet to make a payment.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (payDueAmount.trim() === '') {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid amount to pay your due.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(config.contractAddress, config.abi, signer);

        try {
            const tx = await contract.makePayment(address, {
                value: parseEther(payDueAmount),
            });
            await tx.wait();

            toast({
                title: 'Payment Successful',
                description: 'Your payment has been successfully processed.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            setPayDueAmount('');
        } catch (error) {
            console.error('Error making payment:', error);
            toast({
                title: 'Payment Error',
                description: 'An error occurred while processing your payment.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const makeDeposit = async (amount) => {
        if (!isConnected) throw Error('User disconnected');

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(config.contractAddress, config.abi, signer);

        try {
            const balance = await ethersProvider.getBalance(address);
            const depositAmount = parseEther(amount);

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
    };

    const handleCreditAccount = async (e) => {
        e.preventDefault();
        if (creditAmount.trim() === '' || parseFloat(creditAmount) === 0) {
            alert('Please enter a valid amount greater than 0 to credit your account.');
        } else {
            try {
                await makeDeposit(creditAmount);
                setCreditAmount(''); // Clear the input field after successful deposit
            } catch (error) {
                console.error('Deposit failed:', error);
            }
        }
    };

    return (
        <Box bg={bgColor} minH="100vh" py={8}>
            {!renterExists && (
            <Flex justify="center" mb={8}>
                <Heading color={textColor}>Dashboard</Heading>
            </Flex>
            )}
            <Flex maxW="container.lg" mx="auto" direction="column" align="center">
                <Heading as="h1" size="2xl" mb={8} color={textColor}>
                    {renterExists && isConnected && (
                        <Text color={textColor}>
                            Welcome, {firstName} {lastName}!
                        </Text>
                    )}
                </Heading>

                {!renterExists && (
                    <Box
                        bg={bgColor}
                        p={8}
                        borderRadius="lg"
                        boxShadow="md"
                        maxW="md"
                        w="100%"
                    >
                        <Heading as="h2" size="xl" mb={6} color={textColor}>
                            Add Renter
                        </Heading>
                        <form onSubmit={handleAddRenter}>
                            <VStack spacing={4} align="stretch">
                                <FormControl id="firstName">
                                    <FormLabel>First Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </FormControl>
                                <FormControl id="lastName">
                                    <FormLabel>Last Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </FormControl>
                                <Button type="submit" colorScheme="teal">
                                    Add Renter
                                </Button>
                            </VStack>
                        </form>
                    </Box>
                )}
            </Flex>

            {renterExists && (
            <Flex justify="center" mb={8} flexWrap="wrap">

                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    transition={{duration: 0.2}}
                >
                    <Stat
                        mr={[0, 4, 8]}
                        mb={[8, 0]}
                        p={6}
                        bg="white"
                        boxShadow="md"
                        borderRadius="md"
                        maxW="sm"
                    >
                        <Flex alignItems="center" mb={4}>
                            <Icon as={BsWallet2} boxSize={6} mr={2} color={accentColor}/>
                            <StatLabel color={textColor}>BNB Credit</StatLabel>
                        </Flex>
                        <StatNumber color={textColor} fontSize="2xl" fontWeight="bold">
                            {balance}
                        </StatNumber>
                    </Stat>
                </motion.div>

                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    transition={{duration: 0.2}}
                >
                    <Stat
                        mr={[0, 4, 8]}
                        mb={[8, 0]}
                        p={6}
                        bg="white"
                        boxShadow="md"
                        borderRadius="md"
                        maxW="sm"
                    >
                        <Flex alignItems="center" mb={4}>
                            <Icon as={BsCreditCard} boxSize={6} mr={2} color={accentColor}/>
                            <StatLabel color={textColor}>BNB Due</StatLabel>
                        </Flex>
                        <StatNumber color={textColor} fontSize="2xl" fontWeight="bold">
                            {bnbDue}
                        </StatNumber>
                    </Stat>
                </motion.div>

                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    transition={{duration: 0.2}}
                >
                    <Stat
                        mr={[0, 4, 8]}
                        mb={[8, 0]}
                        p={6}
                        bg="white"
                        boxShadow="md"
                        borderRadius="md"
                        maxW="sm"
                    >
                        <Flex alignItems="center" mb={4}>
                            <Icon as={BsStopwatch} boxSize={6} mr={2} color={accentColor}/>
                            <StatLabel color={textColor}>Ride Minutes</StatLabel>
                        </Flex>
                        <StatNumber color={textColor} fontSize="2xl" fontWeight="bold">
                            {totalTime}
                        </StatNumber>
                    </Stat>
                </motion.div>

                <motion.div
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    transition={{duration: 0.2}}
                >
                    <Stat p={6} bg="white" boxShadow="md" borderRadius="md" maxW="sm">
                        <Flex alignItems="center" mb={4}>
                            <Icon as={BsBicycle} boxSize={6} mr={2} color={accentColor}/>
                            <StatLabel color={textColor}>Bike Status</StatLabel>
                        </Flex>
                        <StatNumber color={textColor} fontSize="2xl" fontWeight="bold">
                            {canRentBike ? 'Available' : 'Unavailable'}
                        </StatNumber>
                    </Stat>
                </motion.div>
            </Flex> )}


            {renterExists && (
            <Flex justify="center" mb={8} flexWrap="wrap">
                <Box
                    as="form"
                    onSubmit={handlePayDue}
                    mr={[0, 8]}
                    mb={[8, 0]}
                    p={6}
                    bg="white"
                    boxShadow="md"
                    borderRadius="md"
                    maxW="sm"
                >
                    <Text color={textColor} mb={4} fontWeight="bold">
                        Pay Your Due
                    </Text>
                    <Input
                        placeholder="Enter BNB amount"
                        mb={4}
                        value={payDueAmount}
                        onChange={(e) => setPayDueAmount(e.target.value)}
                        pattern="^[0-9]*\.?[0-9]*$"
                        title="Please enter a valid number"
                    />
                    <Button type="submit" colorScheme="teal">
                        Pay Now
                    </Button>
                </Box>
                <Box
                    as="form"
                    onSubmit={handleCreditAccount}
                    p={6}
                    bg="white"
                    boxShadow="md"
                    borderRadius="md"
                    maxW="sm"
                >
                    <Text color={textColor} mb={4} fontWeight="bold">
                        Credit Your Account
                    </Text>
                    <Input
                        placeholder="Enter BNB amount"
                        mb={4}
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        pattern="^[0-9]*\.?[0-9]*$"
                        title="Please enter a valid number"
                    />
                    <Button type="submit" colorScheme="teal">
                        Credit Now
                    </Button>
                </Box>
            </Flex>)}

            <Flex justify="center" mb={8} flexWrap="wrap">
                <Box bg={bgColor} minH="100vh" py={8}>
                    <Flex maxW="container.lg" mx="auto" direction="column" align="center">
                        <Heading as="h1" size="2xl" mb={8} color={textColor}>
                            Dashboard
                        </Heading>

                        <Flex justify="center" mb={8} flexWrap="wrap">
                            <Box
                                mr={[0, 4, 8]}
                                mb={[8, 0]}
                                p={6}
                                bg="white"
                                boxShadow="md"
                                borderRadius="md"
                                maxW="sm"
                            >
                                <Image src={bicycleImage} alt="Bicycle" mb={4} />
                                <Heading as="h3" size="md" mb={2}>
                                    Bicycle 1
                                </Heading>
                                <Text color={textColor} mb={4}>
                                    This is a description of Bicycle 1.
                                </Text>
                                <Flex>
                                    <Button
                                        colorScheme="teal"
                                        mr={4}
                                        onClick={() => handleCheckIn(1)}
                                        disabled={!isConnected}
                                    >
                                        Check In
                                    </Button>
                                    <Button
                                        colorScheme="teal"
                                        onClick={() => handleCheckOut(1)}
                                        disabled={!isConnected}
                                    >
                                        Check Out
                                    </Button>
                                </Flex>
                            </Box>

                            <Box
                                mr={[0, 4, 8]}
                                mb={[8, 0]}
                                p={6}
                                bg="white"
                                boxShadow="md"
                                borderRadius="md"
                                maxW="sm"
                            >
                                <Image src={bicycleImage2} alt="Bicycle" mb={4} />
                                <Heading as="h3" size="md" mb={2}>
                                    Bicycle 2
                                </Heading>
                                <Text color={textColor} mb={4}>
                                    This is a description of Bicycle 2.
                                </Text>
                                <Flex>
                                    <Button
                                        colorScheme="teal"
                                        mr={4}
                                        onClick={() => handleCheckIn(2)}
                                        disabled={!isConnected}
                                    >
                                        Check In
                                    </Button>
                                    <Button
                                        colorScheme="teal"
                                        onClick={() => handleCheckOut(2)}
                                        disabled={!isConnected}
                                    >
                                        Check Out
                                    </Button>
                                </Flex>
                            </Box>


                            <Box p={6} bg="white" boxShadow="md" borderRadius="md" maxW="sm">
                                <Image src={bicycleImage} alt="Bicycle" mb={4} />
                                <Heading as="h3" size="md" mb={2}>
                                    Bicycle 3
                                </Heading>
                                <Text color={textColor} mb={4}>
                                    This is a description of Bicycle 3.
                                </Text>
                                <Flex>
                                    <Button
                                        colorScheme="teal"
                                        mr={4}
                                        onClick={() => handleCheckIn(3)}
                                        disabled={!isConnected}
                                    >
                                        Check In
                                    </Button>
                                    <Button
                                        colorScheme="teal"
                                        onClick={() => handleCheckOut(3)}
                                        disabled={!isConnected}
                                    >
                                        Check Out
                                    </Button>
                                </Flex>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default Dashboard;