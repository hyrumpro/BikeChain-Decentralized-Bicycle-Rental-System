import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';
import Hero from '../components/ui/Hero';

const HomePage = () => {
  const footerBg = useColorModeValue('gray.100', 'gray.900');

  return (
    <VStack>
      <Hero />
      <Box as="footer" py="2rem" bg={footerBg} width="100%" textAlign="center">
        <Text fontSize="sm">&copy; {new Date().getFullYear()} BikeChain. All rights reserved.</Text>
      </Box>
    </VStack>
  );
};

export default HomePage;
