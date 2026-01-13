import { Box, Flex, Heading, Input, Button, VStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import bicycle1 from '../assets/bicycle-1.jpg';
import bicycle2 from '../assets/bicycle-2.jpg';
import BikeCard from '../components/ui/BikeCard';
import { useBikeChainRead, useBikeChainWrite } from '../hooks/useBikeChain';
import { useWeb3 } from '../contexts/Web3Context';

const bikes = [
  { id: 1, name: 'Bicycle 1', image: bicycle1, description: 'This is a description of Bicycle 1.' },
  { id: 2, name: 'Bicycle 2', image: bicycle2, description: 'This is a description of Bicycle 2.' },
  { id: 3, name: 'Bicycle 3', image: bicycle1, description: 'This is a description of Bicycle 3.' }
];

const DashboardPage = () => {
  const { address, isConnected } = useWeb3();
  const { data: renterExists } = useBikeChainRead('renterExists', [address]);
  const { execute: addRenter, isLoading: addingRenter } = useBikeChainWrite('addRenter');
  const { execute: payDue, isLoading: paying } = useBikeChainWrite('makePayment');
  const { execute: deposit, isLoading: depositing } = useBikeChainWrite('deposit');
  const { execute: checkIn } = useBikeChainWrite('CheckIn');
  const { execute: checkOut } = useBikeChainWrite('CheckOut');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const handleAddRenter = async (e) => {
    e.preventDefault();
    await addRenter(address, firstName, lastName, true, true, 0, 0, 0, 0);
  };

  const handlePayDue = async (e) => {
    e.preventDefault();
    await payDue(address, { value: payAmount });
    setPayAmount('');
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    await deposit(address, { value: depositAmount });
    setDepositAmount('');
  };

  return (
    <Box p={8}>
      <Heading mb={8}>Dashboard</Heading>
      {!renterExists && (
        <Box as="form" onSubmit={handleAddRenter} mb={8} maxW="md">
          <VStack spacing={4} align="stretch">
            <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <Button type="submit" colorScheme="teal" isLoading={addingRenter}>
              Add Renter
            </Button>
          </VStack>
        </Box>
      )}

      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} mb={8}>
        <Box as="form" onSubmit={handlePayDue} maxW="sm" flex={1}>
          <VStack spacing={4} align="stretch">
            <Input placeholder="Amount" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
            <Button type="submit" colorScheme="teal" isLoading={paying}>
              Pay Due
            </Button>
          </VStack>
        </Box>
        <Box as="form" onSubmit={handleDeposit} maxW="sm" flex={1}>
          <VStack spacing={4} align="stretch">
            <Input placeholder="Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            <Button type="submit" colorScheme="teal" isLoading={depositing}>
              Deposit
            </Button>
          </VStack>
        </Box>
      </Stack>

      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {bikes.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            onCheckIn={() => checkIn(address)}
            onCheckOut={() => checkOut(address)}
            isConnected={isConnected}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DashboardPage;
