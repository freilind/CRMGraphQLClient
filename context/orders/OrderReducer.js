import  * as TYPE from '../../types';


const OrderReducer = (state, {type, payload }) => {
    switch(type) {
        case TYPE.SELECT_CLIENT:
            return {
                ...state,
                client: payload
            }
        case TYPE.SELECT_PRODUCT:
            return {
                ...state,
                products: payload
            }
        case TYPE.QUANTITY_PRODUCT:
            return {
                ...state,
                products: state.products.map(product => product.id === payload.id 
                    ? product = payload
                    : product)
            }
        case TYPE.UPDATE_TOTAL:
            return {
                ...state,
                total: state.products.reduce( (acc, item) => acc += item.price * item.quantity, 0)
            }
        default:
            return state;
    }
};

export default OrderReducer;
