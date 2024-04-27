import { useState } from 'react'
import { Box, Flex, Spacer, Heading, Button, useColorModeValue, Text, VStack } from '@chakra-ui/react'
import { Hero } from './Hero.jsx'

function App() {
    const bgColor = useColorModeValue('gray.100', 'gray.900')
    const textColor = useColorModeValue('gray.800', 'white')

    return (
        <VStack bg={bgColor}>
            <Hero />
            <Spacer />
            {/* Footer */}
            <Box as="footer" py="2rem" bg="gray.100" width="100%" textAlign="center">
                <Text fontSize="sm">&copy; {new Date().getFullYear()} My App. All rights reserved.</Text>
            </Box>
        </VStack>
    )
}

export default App
