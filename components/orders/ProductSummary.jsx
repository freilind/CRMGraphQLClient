import { useContext, useState, useEffect } from 'react';
import OrderContext from '../../context/ordes/OrderContext';

const ProductSummary = ({product}) => {

    //context orders
    const orderContext = useContext(OrderContext);
    const { quantityProduct, updateTotal } = orderContext;

    const [ quantity, setQuantity] = useState(0);

    useEffect(() => {
        updateQuantity();
        updateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity])

    const updateQuantity = () => {
        const newProduct = {...product, quantity: Number(quantity)}
        quantityProduct(newProduct);
    };

    const { name, price } = product;
    return(
        <div className='md:flex md:justify-between md:items-center mt-5'>
            <div className='md:w-2/4 mb-2 md:mb-0'>
                <p className='text-sm'>{name}</p>
                <p className='text-sm'>$ {price}</p>
            </div>
            <input 
                type='number'
                placeholder='Quantity'
                className='shadow appearance-none border runded w-full py-2 px-3 text-gray-700 leading tigth focus:outline-none focus:shadow-outline md:ml-4'
                onChange={(e) => setQuantity(e.target.value)}
            />
        </div>
    );
};

export default ProductSummary;

