import { useContext, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import AssignClient from '../components/orders/AssignClient';
import AssignProduct from '../components/orders/AssignProduct';
import OrderSummary from '../components/orders/OrderSummary';
import Total from '../components/orders/Total';
import OrderContext from '../context/orders/OrderContext';

const NEW_ORDER = gql `
    mutation Mutation($input: OrderInput) {
        newOrder(input: $input) {
            id
        }
    }
`;

const GET_ORDERS_SELLER = gql `
    query Query {
        getOrdersSeller {
            id
            order {
                id
                name
                quantity
                price
            }
            total
            client {
                id
                name
                lastname
                email
                phone
            }
            seller
            created
            status
        }
    }
`;

const NewOrder = () => {

    const router = useRouter();

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    //use context, extract values
    const orderContext = useContext(OrderContext);
    const { client, products, total } = orderContext;

    const [ newOrder ] = useMutation(NEW_ORDER , {
        update(cache, { data: { newOrder }}) {
          const { getOrdersSeller } = cache.readQuery({query: GET_ORDERS_SELLER});
          cache.writeQuery({
            query: GET_ORDERS_SELLER,
            data: {
                getOrdersSeller: [...getOrdersSeller, newOrder]
            }
          })
        }
      });

    const validateOrder = () => {
        return !products.every( product => product ) || total === 0 || client.length === 0? ' opacity-50 cursor-not-allowed ' : '';
    };

    const createNewOrder = async () => {
        try {
            const  { id } = client;
            //remove not wanted product
            const order = products.map(({__typename, stock, created, ...product}) => product);
            console.log(order)
            const { data } = await newOrder({
                variables: {
                    input: {
                        client: id,
                        total,
                        order,
                    }
                }
            });

            router.push('/orders');

            Swal.fire(
                'Done!',
                'The order is register.',
                'success'
              );
        } catch (error) {
            setMessage({msg:error.message, type: 'error'});
            setTimeout(() => {
                setMessage({});
            }, 3000);
        }
    };

    const showMessage = () => {
        return (
            <div className={`rounded py-2 px-3 w-full my-3 max-w-sm text-center mx-auto ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-600'}`}>
                <p>
                    {message.msg}
                </p>
            </div>
        )
    };

  return (
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Create new order</h1>

        {message.msg && showMessage()}

        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <AssignClient />
                <AssignProduct />
                <OrderSummary />
                <Total />

                <button
                    type='button'
                    className={`w-full text-center flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 mt-5 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200 ${validateOrder()}`}
                    disabled={validateOrder()}
                    onClick={() => createNewOrder()}>
                        Register order
                </button>
            </div>
        </div>
      </Layout>
  )
}

export default NewOrder;
