import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  VStack,
  useColorModeValue,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import { 
  AddIcon, 
  LockIcon, 
  UnlockIcon, 
  SettingsIcon, 
  ViewIcon, 
  RepeatIcon 
} from '@chakra-ui/icons';
import usePasswordStorage from '../../hooks/usePasswordStorage';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const Dashboard = () => {
  const { passwords, isLoading } = usePasswordStorage();
  const { logout } = useAuth();
  
  // Calculate statistics
  const totalPasswords = passwords.length;
  const recentPasswords = passwords
    .filter(p => {
      const updatedDate = new Date(p.updatedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return updatedDate > thirtyDaysAgo;
    })
    .length;
  
  const weakPasswords = passwords.filter(p => p.strength && p.strength < 40).length;
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Password Manager Dashboard</Heading>
        <Button onClick={logout} variant="outline">Logout</Button>
      </Flex>
      
      {/* Stats Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
        <GridItem>
          <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px" borderRadius="lg">
            <CardBody>
              <Stat>
                <StatLabel>Total Passwords</StatLabel>
                <StatNumber>{totalPasswords}</StatNumber>
                <StatHelpText>Secured passwords</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px" borderRadius="lg">
            <CardBody>
              <Stat>
                <StatLabel>Recent Activity</StatLabel>
                <StatNumber>{recentPasswords}</StatNumber>
                <StatHelpText>Updated in the last 30 days</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px" borderRadius="lg">
            <CardBody>
              <Stat>
                <StatLabel>Weak Passwords</StatLabel>
                <StatNumber>{weakPasswords}</StatNumber>
                <StatHelpText color={weakPasswords > 0 ? "orange.500" : "green.500"}>
                  {weakPasswords > 0 ? "Consider updating these" : "Great job!"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      
      {/* Quick Actions */}
      <Heading size="md" mb={4}>Quick Actions</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={8}>
        <GridItem>
          <Link as={RouterLink} to="/add-password" textDecoration="none" _hover={{ textDecoration: "none" }}>
            <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px" borderRadius="lg" 
                  _hover={{ transform: "translateY(-4px)", shadow: "md" }} 
                  transition="all 0.3s ease">
              <CardBody>
                <VStack spacing={3} align="center">
                  <Icon as={AddIcon} boxSize={8} color="blue.500" />
                  <Text fontWeight="bold">Add New Password</Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Store a new website or service credential
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Link>
        </GridItem>
        
        <GridItem>
          <Link as={RouterLink} to="/passwords" textDecoration="none" _hover={{ textDecoration: "none" }}>
            <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px" borderRadius="lg" 
                  _hover={{ transform: "translateY(-4px)", shadow: "md" }} 
                  transition="all 0.3s ease">
              <CardBody>
                <VStack spacing={3} align="center">
                  <Icon as={ViewIcon} boxSize={8} color="purple.500" />
                  <Text fontWeight="bold">View All Passwords</Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Browse and manage your stored credentials
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Link>
        </GridItem>
        
        <GridItem>
          <Link as={RouterLink} to="/generator" textDecoration="none" _hover={{ textDecoration: "none" }}>
            <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px" borderRadius="lg" 
                  _hover={{ transform: "translateY(-4px)", shadow: "md" }} 
                  transition="all 0.3s ease">
              <CardBody>
                <VStack spacing={3} align="center">
                  <Icon as={RepeatIcon} boxSize={8} color="green.500" />
                  <Text fontWeight="bold">Generate Password</Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Create strong, secure passwords
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Link>
        </GridItem>
      </Grid>
      
      {/* Recent Passwords Section */}
      <Heading size="md" mb={4}>Recent Passwords</Heading>
      {isLoading ? (
        <Text>Loading your passwords...</Text>
      ) : passwords.length > 0 ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {passwords
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 6)
            .map(password => (
              <GridItem key={password.id}>
                <Link as={RouterLink} to={`/passwords/${password.id}`} textDecoration="none" _hover={{ textDecoration: "none" }}>
                  <Card bg={cardBg} borderColor={cardBorder} borderWidth="1px" borderRadius="lg" 
                        _hover={{ transform: "translateY(-2px)", shadow: "sm" }} 
                        transition="all 0.2s ease">
                    <CardBody>
                      <Flex align="center">
                        <Icon 
                          as={password.strength && password.strength >= 60 ? LockIcon : UnlockIcon} 
                          color={password.strength && password.strength >= 60 ? "green.500" : "orange.500"} 
                          mr={3} 
                        />
                        <Box>
                          <Text fontWeight="bold" noOfLines={1}>{password.title}</Text>
                          <Text fontSize="sm" color="gray.500" noOfLines={1}>
                            {password.username || password.email || "No username"}
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </Link>
              </GridItem>
            ))}
        </Grid>
      ) : (
        <Box p={5} borderWidth="1px" borderRadius="lg" borderStyle="dashed">
          <VStack spacing={3}>
            <Text>You don't have any passwords stored yet.</Text>
            <Button
              as={RouterLink}
              to="/add-password"
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="sm"
            >
              Add Your First Password
            </Button>
          </VStack>
        </Box>
      )}
      
      {/* Settings Link */}
      <Flex justify="center" mt={10}>
        <Button
          as={RouterLink}
          to="/settings"
          variant="ghost"
          leftIcon={<SettingsIcon />}
          size="sm"
        >
          Settings
        </Button>
      </Flex>
    </Box>
  );
};

export default Dashboard;