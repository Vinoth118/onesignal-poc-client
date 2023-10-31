import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import axios from 'axios';
import { API_BASE_URL } from '../components/app_constants';

axios.defaults.baseURL = API_BASE_URL;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp
