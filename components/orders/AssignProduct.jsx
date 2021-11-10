import { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import OrderContext from '../../context/ordes/OrderContext';

const GET_PRODUCTS = gql `
  query Query {
    getProducts {
        id
        name
        stock
        price
      }
  }
`;
 

const AssignProduct= () => {

    const [ products, setProducts ] = useState([]);

    //context orders
    const orderContext = useContext(OrderContext);
    const { addProduct, updateTotal } = orderContext;

    const { data, loading, error } = useQuery(GET_PRODUCTS);

    useEffect(() => {
      addProduct(products);
      updateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products]);

    const selectProduct = product => {
      setProducts(product);
    };

    if(loading) return null;

    if(error) return 'error...';

    const { getProducts } = data;

  return (
    <>
    <p 
        className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
            2.- Select products ...
    </p>
      <Select
            className='mt-3'
            options={getProducts}
            isMulti={true}
            onChange={(option) => selectProduct(option)}
            getOptionValue={options => options.id}
            getOptionLabel={options => `${options.name} - ${options.stock} availables.`}
            placeholder='Select product...'
            noOptionsMessage={() => 'Products not found.'}
        />
    </>
  )
}

export default AssignProduct;

