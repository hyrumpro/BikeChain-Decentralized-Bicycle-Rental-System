/* eslint-disable react/prop-types */
import { Box, Image, Text, Button, Skeleton } from '@chakra-ui/react';

const BikeCard = ({ bike, isLoading, onCheckIn, onCheckOut, isConnected }) => {
  if (isLoading) {
    return <Skeleton height="250px" />;
  }

  return (
    <Box p={6} bg="white" boxShadow="md" borderRadius="md" maxW="sm">
      <Image src={bike.image} alt={bike.name} mb={4} />
      <Text fontWeight="bold" mb={2}>{bike.name}</Text>
      <Text mb={4}>{bike.description}</Text>
      <Button colorScheme="teal" mr={4} onClick={onCheckIn} isDisabled={!isConnected}>
        Check In
      </Button>
      <Button colorScheme="teal" onClick={onCheckOut} isDisabled={!isConnected}>
        Check Out
      </Button>
    </Box>
  );
};

export default BikeCard;
