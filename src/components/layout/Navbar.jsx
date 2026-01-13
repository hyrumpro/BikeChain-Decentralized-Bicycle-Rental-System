import { Box, Button, Flex, Heading, IconButton, Spacer, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';

const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const Navbar = () => {
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const navBgColor = useColorModeValue('teal.500', 'gray.900');
  const { isConnected, address, connectWallet } = useWeb3();

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" p="1.5rem" bg={navBgColor} color="white" width="100%" gap={4}>
      <Link to="/">
        <Flex align="center">
          <Heading as="h1" size="lg" letterSpacing="-.1rem">
            Bike Rental App
          </Heading>
        </Flex>
      </Link>
      <Spacer />
      <Box display="flex" alignItems="center" gap={4}>
        <IconButton
          onClick={toggleColorMode}
          icon={bgColor === 'gray.100' ? <MoonIcon /> : <SunIcon />}
          variant="ghost"
          aria-label="Toggle color mode"
          _hover={{ bg: 'whiteAlpha.200' }}
        />
        <Button
          bg="black"
          color="white"
          borderRadius="md"
          _hover={{ bg: 'gray.700', color: 'white', borderRadius: 'xl' }}
          onClick={() => connectWallet()}
        >
          {isConnected ? shortenAddress(address) : 'Connect Wallet'}
        </Button>
      </Box>
    </Flex>
  );
};

export default Navbar;
