import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';

const GET_PRODUCT = gql `
    query Query($getProductId: ID!) {
        getProduct(id: $getProductId) {
            id
            name
            stock
            price
            created
        }
    }
`;

const UPDATE_PRODUCT = gql `
    mutation UpdateProductMutation($updateProductId: ID!, $updateProductInput: ProductInput) {
        updateProduct(id: $updateProductId, input: $updateProductInput) {
            id
            stock
            name
            price
            created
        }
    }
`;

const EditProduct = () => {
    const router = useRouter();
    const { query: { id } } = router;

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            getProductId: id
        }
    });

    const [ updateProduct ] = useMutation(UPDATE_PRODUCT);

    const schemaValidation = Yup.object({
        name:
            Yup.string().required('The name is required.'),
        stock:
            Yup.number().required('The stock is required.').positive('Only positive numbers.').integer('Only integer numbers.'),
        price:
            Yup.number().required('The price is required.').positive('Only positive numbers.')
    });

    if (loading) return 'Loading...';

    if (error) return 'Error...';

    const { getProduct } = data;

    const updateInfoProduct = async values => {
        try {
            const { name, stock, price } = values;
            const { data } = await updateProduct({
                variables: {
                    updateProductId: id,
                    updateProductInput: {
                        name, stock, price
                    }
                }
            });

            Swal.fire(
                'Updated!',
                'The product is update!',
                'success'
            );

            router.push('/products');
        } catch(error) {
            console.log(error)
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
    <>
      <Layout>
        { message.msg && showMessage() }
        <h1 className='text-center text-2xl text-white font-light'>Edit product</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <Formik
                    validationSchema={schemaValidation}
                    enableReinitialize
                    initialValues={getProduct}
                    onSubmit={(values) => {
                        updateInfoProduct(values)
                    }}>
                    {props => {
                        return (
                            <form 
                                className='bg-purple-100 rounded shadow-md px-8 pt-6 pb-8 mb-4'
                                onSubmit={props.handleSubmit}
                            >
                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                                        Name
                                    </label>
                                    <input 
                                        className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                                        id='name'
                                        type='text'
                                        placeholder='Name product'
                                        value={props.values.name}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                { props.touched.name && props.errors.name ? (
                                    <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                                        <p className='font-bold'>Error</p>
                                        <p>{props.errors.name}</p>
                                    </div>
                                ) : null }

                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='stock'>
                                        Stock
                                    </label>
                                    <input 
                                        className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                                        id='stock'
                                        type='number'
                                        placeholder='Stock'
                                        value={props.values.stock}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                { props.touched.stock && props.errors.stock ? (
                                    <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                                        <p className='font-bold'>Error</p>
                                        <p>{props.errors.stock}</p>
                                    </div>
                                ) : null }

                                <div className='mb-4'>
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='price'>
                                        Price
                                    </label>
                                    <input 
                                        className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                                        id='price'
                                        type='number'
                                        placeholder='Price'
                                        value={props.values.price}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                { props.touched.price && props.errors.price ? (
                                    <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                                        <p className='font-bold'>Error</p>
                                        <p>{props.errors.price}</p>
                                    </div>
                                ) : null }

                                <input 
                                    className='w-full text-center flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200'
                                    type='submit'
                                    value='Edit product'
                                />
                            </form>
                        )
                    }}
                </Formik>
            </div>
        </div>
      </Layout>
    </>
  )
}

export default EditProduct;
