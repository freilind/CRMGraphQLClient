import { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import Layout from '../components/Layout';

const NEW_CLIENT = gql `
    mutation Mutation($newClientInput: ClientInput) {
        newClient(input: $newClientInput) {
            id
            name
            lastname
            company
            email
            phone
            seller
            created
        }
    }
`;

const GET_CLIENTS_SELLER = gql `
  query Query {
    getClientsSeller {
      id
      name
      lastname
      company
      email
    }
  }
`;

const NewClient = () => {

    const router = useRouter();

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    const [ newClient ] = useMutation(NEW_CLIENT, {
        update(cache, { data: { newClient }}) {
            //get object from cache for update
            const  { getClientsSeller } = cache.readQuery({ query : GET_CLIENTS_SELLER });

            //re-write cache
            cache.writeQuery({
                query: GET_CLIENTS_SELLER,
                data: {
                    getClientsSeller : [...getClientsSeller, newClient]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            company: '',
            email: '',
            phone: ''
        },
        validationSchema: Yup.object({
            name:
                Yup.string().required('The name is required'),
            lastname:
                Yup.string().required('The lastname is required'),
            company:
                Yup.string().required('The company is required'),
            email:
                Yup.string().email('The email is not valid').required('The email is required'),
            phone:
                Yup.string()
            
        }),
        onSubmit: async values => {
            try {
                const { name, lastname, company, email, phone  } = values;
                const { data } = await newClient({
                    variables: {
                        newClientInput: {
                            name,
                            lastname,
                            company,
                            email,
                            phone
                        }
                    }
                });
                router.push('/');
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
        <h1 className='text-2xl font-light'>Create new client</h1>
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
                            placeholder='Name client'
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
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='lastname'>
                            Lastname
                        </label>
                        <input 
                            className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                            id='lastname'
                            type='text'
                            placeholder='Lastname client'
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.lastname && formik.errors.lastname ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.lastname}</p>
                        </div>
                    ) : null }

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='company'>
                            Company
                        </label>
                        <input 
                            className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                            id='company'
                            type='text'
                            placeholder='Company'
                            value={formik.values.company}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.company && formik.errors.company ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.company}</p>
                        </div>
                    ) : null }

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                            Email
                        </label>
                        <input 
                            className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                            id='email'
                            type='email'
                            placeholder='Email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.email && formik.errors.email ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.email}</p>
                        </div>
                    ) : null }

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>
                            Phone
                        </label>
                        <input 
                            className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                            id='phone'
                            type='tel'
                            placeholder='Phone'
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.phone && formik.errors.phone ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.phone}</p>
                        </div>
                    ) : null }

                    <input 
                        className='w-full text-center flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200'
                        type='submit'
                        value='Sign up'
                     />

                </form>
            </div>
        </div>
      </Layout>
    </>
  )
}

export default NewClient;