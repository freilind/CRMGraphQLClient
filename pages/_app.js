import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client';
import clientApollo from '../config/apollo';
import OrderState from '../context/ordes/Orderstate';

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

