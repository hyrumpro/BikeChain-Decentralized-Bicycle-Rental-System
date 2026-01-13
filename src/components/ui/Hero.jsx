import { Box, Heading, Container, Text, Button, Stack, Icon, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const Hero = () => {
  return (
    <Container maxW="3xl">
      <Stack as={Box} textAlign="center" spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
        <Heading fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }} lineHeight="110%">
          Revolutionize Your Bike Rental Experience with <br />
          <Text as="span" color="teal.400">
            Blockchain Technology
          </Text>
        </Heading>
        <Text color="gray.500">
          Discover a new era of bike rental with our decentralized platform powered by blockchain. Say goodbye to intermediaries and hello to seamless, secure, and cost-effective bike sharing. Rent bikes directly from owners and enjoy the freedom of exploring your city on two wheels.
        </Text>
        <Stack direction="column" spacing={3} align="center" alignSelf="center" position="relative">
          <Link to="/dashboard">
            <Button colorScheme="teal" bg="teal.400" rounded="full" px={6} _hover={{ bg: 'teal.500' }}>
              Start Renting
            </Button>
          </Link>
          <Button variant="link" colorScheme="teal" size="sm">
            Learn more
          </Button>
          <Box display={{ base: 'none', md: 'block' }}>
            <Icon as={ArrowForwardIcon} color={useColorModeValue('gray.800', 'gray.300')} w={6} h={6} position="absolute" right="-20px" top="10px" />
            <Text fontSize="lg" fontFamily="Caveat" position="absolute" right="-90px" top="-15px" transform="rotate(10deg)">
              Rent from just $0.50/hour
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Hero;
