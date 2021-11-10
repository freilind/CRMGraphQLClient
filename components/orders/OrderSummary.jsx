import { useContext } from 'react';
import OrderContext from '../../context/ordes/OrderContext';
import ProductSummary from './ProductSummary';

const OrderSummary = () => {

    //context orders
    const orderContext = useContext(OrderContext);
    const { products } = orderContext;

    return(
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
                3.- Ajust quantity products ...
            </p>
            { products.length > 0 ? (
                <>
                { products.map( product => (
                    <ProductSummary
                        key={product.id}
                        product={product}
                    />
                )) }
            </>
            ) : ( 
                <>
                    <p className='mt-5 text-sm'>No products.</p>
                </>
            )}
        </>  
    );
};

export default OrderSummary;

