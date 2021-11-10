import { useQuery, gql } from "@apollo/client";
import { useRouter } from 'next/router';

const GET_USER = gql `
    query Query {
        getUser {
        id
        name
        lastname
        email
        }
    }
`;

const Header = () => {

    const router = useRouter();
    
    const { data, loading, error } = useQuery(GET_USER);

    if (loading) return 'Loading...';

    if (!data) {
        router.push('/login');
        return <p>login...</p>
    }

    const { name, lastname } = data?.getUser;

    const signOut = () => {
        localStorage.removeItem('token');
        router.push('/login');
        return <p>login...</p>
    };

    return (
        <div className='sm:flex justify-between mb-6'>
            <p className='mr-2 mb-5 lg:mb-0'>Hello {name} {lastname} </p>

            <button 
                className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md' 
                onClick={() => signOut()}
                type='button'>
            Sign out
            </button>
        </div>
    );
};

export default Header;
