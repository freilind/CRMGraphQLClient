import React, { useReducer } from 'react';
import OrderContext from "./OrderContext";
import OrderReducer from './OrderReducer';
import  * as TYPE from '../../types';
import { ProvidedRequiredArgumentsOnDirectivesRule } from 'graphql/validation/rules/ProvidedRequiredArgumentsRule';

const OrderState = ({children}) => {

    const initialState = {
        client: {},
        products: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(OrderReducer, initialState);

    //Modify client
    const addClient = client => {
        dispatch({
            type: TYPE.SELECT_CLIENT,
            payload: client
        });
    };

    const addProduct= products => {
        let newState;
        if(state.products.length > 0 ) {
            newState = products.map( product => {
                const newObject = state.products.find( productState => productState.id === product.id  );
                return {...product, ...newObject}
            } )
        } else {
            newState = products;
        }
        dispatch({
            type: TYPE.SELECT_PRODUCT,
            payload: newState
        });
    };

    // Modifica las cantidades de los productos
    const quantityProduct = newProduct => {
        dispatch({
            type: TYPE.QUANTITY_PRODUCT,
            payload: newProduct
        })
    }

    const updateTotal = () => {
        dispatch({
            type: TYPE.UPDATE_TOTAL
        })
    }

    return(
        <OrderContext.Provider
            value={{
                client: state.client,
                products: state.products,
                total: state.total,
                addClient,
                addProduct,
                quantityProduct,
                updateTotal
            }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderState;

