import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';

const GET_CLIENT = gql `
    query Query($getClientId: ID!) {
        getClient(id: $getClientId) {
            id
            name
            lastname
            company
            email
            phone
        }
    }
`;

const UPDATE_CLIENT = gql `
    mutation Mutation($updateClientId: ID!, $input: ClientInput) {
        updateClient(id: $updateClientId, input: $input) {
            id
            name
            lastname
            company
            email
            phone
        }
    }
`;

const EditClient = () => {
    const router = useRouter();
    const { query: { id } } = router;

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    const { data, loading, error } = useQuery(GET_CLIENT, {
        variables: {
            getClientId: id
        }
    });

    const [ updateClient ] = useMutation(UPDATE_CLIENT);

    const schemaValidation = Yup.object({
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
    });

    if (loading) return 'Loading...';

    const { getClient } = data;

    const updateInfoClient = async values => {
        try {
            const { name, lastname, company, email, phone } = values;
            const { data } = await updateClient({
                variables: {
                    updateClientId: id,
                    input: {
                        name, lastname, company, email, phone 
                    }
                }
            });

            Swal.fire(
                'Updated!',
                'The client is update!',
                'success'
            );

            router.push('/');
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
        <h1 className='text-center text-2xl text-white font-light'>Edit client</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <Formik
                    validationSchema={schemaValidation}
                    enableReinitialize
                    initialValues={getClient}
                    onSubmit={(values) => {
                        updateInfoClient(values)
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
                                        placeholder='Name client'
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
                                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='lastname'>
                                        Lastname
                                    </label>
                                    <input 
                                        className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                                        id='lastname'
                                        type='text'
                                        placeholder='Lastname client'
                                        value={props.values.lastname}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                { props.touched.lastname && props.errors.lastname ? (
                                    <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                                        <p className='font-bold'>Error</p>
                                        <p>{props.errors.lastname}</p>
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
                                        value={props.values.company}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                { props.touched.company && props.errors.company ? (
                                    <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                                        <p className='font-bold'>Error</p>
                                        <p>{props.errors.company}</p>
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
                                        value={props.values.email}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                { props.touched.email && props.errors.email ? (
                                    <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                                        <p className='font-bold'>Error</p>
                                        <p>{props.errors.email}</p>
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
                                        value={props.values.phone}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                { props.touched.phone && props.errors.phone ? (
                                    <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                                        <p className='font-bold'>Error</p>
                                        <p>{props.errors.phone}</p>
                                    </div>
                                ) : null }

                                <input 
                                    className='w-full text-center flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200'
                                    type='submit'
                                    value='Edit client'
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

export default EditClient;
