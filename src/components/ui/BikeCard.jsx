/* eslint-disable react/prop-types */
import { Box, Image, Text, Button, Skeleton, useColorModeValue, Stack } from '@chakra-ui/react';

const BikeCard = ({ bike, isLoading, onCheckIn, onCheckOut, isConnected }) => {
  const bg = useColorModeValue('white', 'gray.800');

  if (isLoading) {
    return <Skeleton height="250px" />;
  }

  return (
    <Box p={6} bg={bg} boxShadow="md" borderRadius="md" _hover={{ boxShadow: 'lg' }} transition="all 0.2s">
      <Image src={bike.image} alt={bike.name} mb={4} borderRadius="md" />
      <Text fontWeight="bold" mb={2} fontSize="xl">{bike.name}</Text>
      <Text mb={4} color="gray.500">{bike.description}</Text>
      <Stack direction="row" spacing={4} width="100%">
        <Button colorScheme="teal" onClick={onCheckIn} isDisabled={!isConnected} flex={1}>
          Check In
        </Button>
        <Button colorScheme="teal" onClick={onCheckOut} isDisabled={!isConnected} flex={1}>
          Check Out
        </Button>
      </Stack>
    </Box>
  );
};

export default BikeCard;
