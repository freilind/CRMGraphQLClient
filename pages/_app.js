import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client';
import clientApollo from '../config/apollo';
import OrderState from '../context/orders/OrderState';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={clientApollo}>
      <OrderState>
        <Component {...pageProps} />
      </OrderState>
    </ApolloProvider>
  )
}

export default MyApp;

