import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Layout from '../components/Layout';
import Order from '../components/Order';

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

const Orders = () => {

  const { data, loading, error } = useQuery(GET_ORDERS_SELLER);

  if(loading) return null;

  if(error) return 'error...';

  const { getOrdersSeller } = data;

  return (
    <div>
      <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Orders</h1>
          <Link href='/neworder'>
            <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>
              New Order
            </a>
          </Link>
            
          {getOrdersSeller.length === 0 ?(
            <p className='mt-5 text-center text-2xl'>No orders yet.</p>
          ) : (
            getOrdersSeller.map(order => (
              <Order
                key={order.id}
                order={order}
              />
            ))
          )}
      </Layout>
    </div>
  )
}

export default Orders;
