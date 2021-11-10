import { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import Layout from '../components/Layout';

const NEW_PRODUCT = gql `
    mutation NewProductMutation($newProductInput: ProductInput) {
        newProduct(input: $newProductInput) {
            id
            name
            stock
            created
            price
        }
    }
`;

const GET_PRODUCTS = gql `
    query Query {
        getProducts {
            id
            name
            stock
            price
            created
        }
    }
`;

const NewProduct = () => {

    const router = useRouter();

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    const [ newProduct ] = useMutation(NEW_PRODUCT, {
        update(cache, { data: { newProduct }}) {
            //get object from cache for update
            const  { getProducts } = cache.readQuery({ query : GET_PRODUCTS });

            //re-write cache
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts : [...getProducts, newProduct]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            stock: '',
            price: ''
        },
        validationSchema: Yup.object({
            name:
                Yup.string().required('The name is required.'),
            stock:
                Yup.number().required('The stock is required.').positive('Only positive numbers.').integer('Only integer numbers.'),
            price:
                Yup.number().required('The price is required.').positive('Only positive numbers.')
            
        }),
        onSubmit: async values => {
            try {
                const { name, stock, price  } = values;
                const { data } = await newProduct({
                    variables: {
                        newProductInput: {
                            name,
                            stock,
                            price
                        }
                    }
                });
                router.push('/products');
            } catch (error) {
                setMessage({msg:error.message, type: 'error'});
                setTimeout(() => {
                    setMessage({});
                }, 3000);
            }
        }
    });

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
        <h1 className='text-2xl font-light'>Create new product</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <form 
                    className='bg-purple-100 rounded shadow-md px-8 pt-6 pb-8 mb-4'
                    onSubmit={formik.handleSubmit}
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
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.name && formik.errors.name ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.name}</p>
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
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.stock && formik.errors.stock ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.stock}</p>
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
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.price && formik.errors.price ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.price}</p>
                        </div>
                    ) : null }


                    <input 
                        className='w-full text-center flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200'
                        type='submit'
                        value='Create product'
                     />

                </form>
            </div>
        </div>
      </Layout>
    </>
  )
}

export default NewProduct;
