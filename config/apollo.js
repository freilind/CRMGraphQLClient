import { ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client';
import { setContext }  from 'apollo-link-context';

const httpLink = new createHttpLink({
    uri: 'https://polar-shore-84134.herokuapp.com/'
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});


const clientApollo = new ApolloClient({
    connectToDevTools:true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});


export default clientApollo;
