import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  VStack,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  Container,
  Center,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(password);
      // If successful, the user will be redirected by the auth context
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxW="md" centerContent py={10}>
      <Box w="100%" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Center mb={6}>
          <Heading size="lg">Password Manager</Heading>
        </Center>
        
        <VStack spacing={6}>
          <Heading size="md">Login</Heading>
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="flex-start">
              <FormControl isRequired>
                <FormLabel>Master Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) clearError();
                    }}
                    placeholder="Enter your master password"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={toggleShowPassword}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                loadingText="Logging in"
              >
                Login
              </Button>
            </VStack>
          </form>
          
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Enter your master password to access your passwords
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;