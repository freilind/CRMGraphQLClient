import { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import OrderContext from '../../context/ordes/OrderContext';

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
 

const AssignClient = () => {

    const [ client, setClient ] = useState([]);

    //context orders
    const orderContext = useContext(OrderContext);
    const { addClient } = orderContext;

    const { data, loading, error } = useQuery(GET_CLIENTS_SELLER);

    useEffect(() => {
        addClient(client);
    }, [client])

    const selectClient= client => {
      setClient(client);
    };

    if(loading) return null;

    if(error) return 'error...';

    const { getClientsSeller } = data;

  return (
    <>
    <p 
        className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
            1.- Assign a client to order...
    </p>
      <Select
            className='mt-3'
            options={getClientsSeller}
            onChange={(option) => selectClient(option)}
            getOptionValue={options => options.id}
            getOptionLabel={options => options.name}
            placeholder='Select client...'
            noOptionsMessage={() => 'Clients not found.'}
        />
    </>
  )
}

export default AssignClient;

