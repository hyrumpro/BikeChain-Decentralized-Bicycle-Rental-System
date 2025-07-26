import { VStack, Box, Text } from '@chakra-ui/react';
import Hero from '../components/ui/Hero';

const HomePage = () => {
  return (
    <VStack>
      <Hero />
      <Box as="footer" py="2rem" bg="gray.100" width="100%" textAlign="center">
        <Text fontSize="sm">&copy; {new Date().getFullYear()} BikeChain. All rights reserved.</Text>
      </Box>
    </VStack>
  );
};

export default HomePage;
