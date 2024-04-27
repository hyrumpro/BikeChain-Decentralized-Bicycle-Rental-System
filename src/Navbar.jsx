import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Spacer,
    useColorMode,
    useColorModeValue
} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import { Link } from "react-router-dom"

export const Navbar = () => {

    const { toggleColorMode } = useColorMode()
    const bgColor = useColorModeValue('gray.100', 'gray.900')

    return(
            <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white" width="100%">
                <Link to="/">
                <Flex align="center" mr={5}>
                    <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>Bike Rental App</Heading>
                </Flex>
                </Link>
                <Spacer />

                <Box>
                    <IconButton
                        onClick={toggleColorMode}
                        mr={4}
                        icon={bgColor === 'gray.100' ? <MoonIcon /> : <SunIcon />}
                        variant="ghost"
                        aria-label="Toggle color mode"
                    />
                    <Button
                        bg="black"
                        color="white"
                        borderRadius="md"
                        _hover={{
                            bg: "gray.700",
                            color: "white",
                            borderRadius: "xl"
                        }}>
                        <w3m-button/>
                    </Button>
                </Box>
            </Flex>
    );


}