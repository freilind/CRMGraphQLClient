import React, {useState, useEffect} from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2'

const UPDATE_ORDER = gql`
    mutation UpdateOrderMutation($updateOrderId: ID!, $input: OrderInput) {
        updateOrder(id: $updateOrderId, input: $input) {
            status
        }
  }
`;
const DELETE_ORDER = gql`
    mutation DeleteOrderMutation($deleteOrderId: ID!) {
        deleteOrder(id: $deleteOrderId)
    }
`

const GET_ORDERS_SELLER= gql`
    query Query {
        getOrdersSeller {
            id
        } 
    }
`

const Order = ({order}) => {

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    const { id, total, client: { name, lastname, phone, email }, status, client } = order;

    // Mutation to change status order
    const [ updateOrder ] = useMutation(UPDATE_ORDER);
    const [ deleteOrder] = useMutation(DELETE_ORDER, {
        update(cache) {
            const { getOrdersSeller} = cache.readQuery({
                query: GET_ORDERS_SELLER
            });

            cache.writeQuery({
                query: GET_ORDERS_SELLER,
                data: {
                    getOrdersSeller: getOrdersSeller.filter( order => order.id !== id )
                }
            })
        }
    })

    const [ statusOrder, setStatusOrder ] = useState(status);
    const [ classStyle, setClassStyle] = useState('');

    useEffect(() => {
        if(statusOrder) {
            setStatusOrder(statusOrder);
        }
        // Function modify class
        const classOrder = () => {
            if(statusOrder === 'PENDING') {
                setClassStyle('border-yellow-500')
            } else if (statusOrder === 'DONE') {
                setClassStyle('border-green-500')
            } else {
                setClassStyle('border-red-800')
            }
        }
        classOrder();
    }, [ statusOrder ]);

    const changeStatusOrder = async newStatus => {
        try {
            const { data } = await updateOrder({
                variables: {
                    updateOrderId: id, 
                    input: {
                        status: newStatus,
                        client: client.id
                    }
                }
            });
            setStatusOrder(data.updateOrder.status);
        } catch (error) {
            setMessage({msg:error.message, type: 'error'});
            setTimeout(() => {
                setMessage({});
            }, 3000);
        }
    }

    const confirmDeleteOrder = () => {
        Swal.fire({
            title: '¿you want delete this order?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Not, Cancel'
          }).then( async (result) => {
            if (result.value) {
                try {
                    const data = await deleteOrder({
                        variables: {
                            deleteOrderId: id
                        }
                    });

                    Swal.fire(
                        'Delete',
                        data.deleteOrder,
                        'success'
                    );
                } catch (error) {
                    console.log(error)
                }
            }
          })
    }

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

        <div className={` ${classStyle} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            {message.msg && showMessage()}
            <div>
                <p className="font-bold text-gray-800">Client: {name} {lastname} </p>

                {email && (
                    <p className="flex items-center my-2">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        {email}
                    </p>
                )}

                {phone && (
                    <p className="flex items-center my-2">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {phone}
                    </p>
                )}

                <h2 className="text-gray-800 font-bold mt-10">Status Order:</h2>

                <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold "
                    value={statusOrder}
                    onChange={ e => changeStatusOrder( e.target.value )  }
                >
                    <option value="DONE">DONE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCEL">CANCEL</option>
                </select>
            </div>

            <div>
                <h2 className="text-gray-800 font-bold mt-2">Summary of order</h2>
                { order.order.map( article => (
                    <div key={article.id} className="mt-4">
                        <p className="text-sm text-gray-600">Product: {article.name} </p>
                        <p className="text-sm text-gray-600">Quantity: {article.quantity} </p>
                    </div>
                )) }

                <p className="text-gray-800 mt-3 font-bold ">Total to pay:
                    <span className="font-light"> $ {total}</span>
                </p>

                <button
                    className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                    onClick={() => confirmDeleteOrder()}
                >
                    Delete Order
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>
        </div>
     );
}
 
export default Order;

