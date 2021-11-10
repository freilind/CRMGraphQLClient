import { useContext } from 'react';
import OrderContext from '../../context/ordes/OrderContext';

const Total = () => {
    //context orders
    const orderContext = useContext(OrderContext);
    const { total } = orderContext;

    return(
        <>
            <div className='flex items-center mt-5 justify-between bg-purple-300 p-3'>
                <h2 className='text-lg text-gray-800'>Total:</h2>
                <p className='text-sm text-gray-800 mt-0 '>$ {total}</p>
            </div>
        </>
    );
};

export default Total;

