import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import { PasswordProvider } from './context/PasswordContext';
import AppRoutes from './routes/Routes';
import './App.css';

// Custom theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0086e6',
      600: '#0069b3',
      700: '#004d80',
      800: '#00304d',
      900: '#00141f',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <PasswordProvider>
          <AppRoutes />
        </PasswordProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;