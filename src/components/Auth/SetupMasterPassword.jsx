import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
  Progress,
  HStack,
  Center,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useAuth from '../../hooks/useAuth';
import { validateMasterPassword } from '../../utils/validation';
import { calculatePasswordStrength, getPasswordStrengthLabel } from '../../utils/passwordUtils';

const SetupMasterPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const { setupMasterPassword, error, clearError } = useAuth();
  
  // Calculate password strength
  const strength = calculatePasswordStrength(password);
  const strengthInfo = getPasswordStrengthLabel(strength);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError(null);
    
    // Validate master password
    const validation = validateMasterPassword(password);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await setupMasterPassword(password);
      // If successful, the user will be redirected by the auth context
    } catch (error) {
      console.error('Setup error:', error);
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
          <Heading size="md">Setup Master Password</Heading>
          
          <Text textAlign="center">
            Create a strong master password to protect your passwords.
            This password will be used to encrypt all your data and cannot be recovered if lost.
          </Text>
          
          {(error || validationError) && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error || validationError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="flex-start">
              <FormControl isRequired isInvalid={validationError}>
                <FormLabel>Master Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setValidationError(null);
                      if (error) clearError();
                    }}
                    placeholder="Create your master password"
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
                <FormHelperText>
                  Use at least 8 characters with uppercase, lowercase, numbers, and special characters
                </FormHelperText>
              </FormControl>
              
              {password && (
                <Box width="100%">
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm">Password Strength:</Text>
                    <Text fontSize="sm" color={strengthInfo.color}>
                      {strengthInfo.text}
                    </Text>
                  </HStack>
                  <Progress
                    value={strength}
                    max={100}
                    colorScheme={strengthInfo.color === 'green' ? 'green' : 
                                strengthInfo.color === 'light-green' ? 'teal' :
                                strengthInfo.color === 'yellow' ? 'yellow' :
                                strengthInfo.color === 'orange' ? 'orange' : 'red'}
                    size="sm"
                    borderRadius="md"
                  />
                </Box>
              )}
              
              <FormControl isRequired isInvalid={validationError === 'Passwords do not match'}>
                <FormLabel>Confirm Master Password</FormLabel>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationError === 'Passwords do not match') {
                      setValidationError(null);
                    }
                  }}
                  placeholder="Confirm your master password"
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                loadingText="Setting up"
                isDisabled={!password || !confirmPassword}
              >
                Create Master Password
              </Button>
            </VStack>
          </form>
          
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Remember your master password! It cannot be recovered if lost.
          </Alert>
        </VStack>
      </Box>
    </Container>
  );
};

export default SetupMasterPassword;