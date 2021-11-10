import Router from 'next/router';
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';

const DELETE_CLIENT = gql `
    mutation Mutation($deleteClientId: ID!) {
        deleteClient(id: $deleteClientId)
    }
`;

const GET_CLIENTS_SELLER = gql `
  query Query {
    getClientsSeller {
      id
      name
      lastname
      company
      email
    }
  }
`;

const Client = ({client}) => {

    const { id, name, lastname, company, email} = client;

    const [ deleteClient ] = useMutation(DELETE_CLIENT, {
        update(cache) {
            //get object from cache for delete
            const  { getClientsSeller } = cache.readQuery({ query : GET_CLIENTS_SELLER });

            //re-write cache
            cache.writeQuery({
                query: GET_CLIENTS_SELLER,
                data: {
                    getClientsSeller : [...getClientsSeller.filter( clientCache => clientCache.id !== id)]
                }
            })
        }
    });

    const dialogDeleteClient = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete client!'
          }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await deleteClient ({
                        variables: {
                            deleteClientId: id
                        }
                    });

                    Swal.fire(
                        'Deleted!',
                        data.deleteClient,
                        'success'
                      );

                } catch(error) {
                    console.log(error)
                }
            }
          })
    };

    const editClient = () => {
        Router.push({
            pathname: '/editclient/[id]',
            query: { id }
        })
    };

    return (
        <tr>
            <td className='border px-4 py-2'>
                {name} {lastname}
            </td>
            <td className='border px-4 py-2'>
                {company}
            </td>
            <td className='border px-4 py-2'>
                {email}
            </td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => dialogDeleteClient()}
                >
                    Delete
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => editClient()}
                >
                    Edit
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default Client;
