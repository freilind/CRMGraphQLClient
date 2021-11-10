import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_ACCOUNT = gql `
    mutation NewUserMutation($newUserInput: UserInput) {
        newUser(input: $newUserInput) {
            id
            name
            lastname
            email
        }
    }
`;

const NewAccount = () => {

    const router = useRouter();

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    const [ newUser ] = useMutation(NEW_ACCOUNT);

    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name:
                Yup.string().required('The name is required'),
            lastname:
                Yup.string().required('The lastname is required'),
            email:
                Yup.string().email('The email is not valid').required('The email is required'),
            password:
                Yup.string().required('The password is required').min(6, 'The password length is minimun 6')
        }),
        onSubmit: async values => {
            try {
                const { name, lastname, email, password } = values;
                const { data } = await newUser({
                    variables: {
                        newUserInput: {
                            name,
                            lastname,
                            email,
                            password
                        }
                    }
                });
                setMessage({msg: `User: ${data.newUser.name} created.`, type:'info'});
                setTimeout(() => {
                    setMessage({});
                    router.push('/login');
                }, 3000);
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
        <h1 className='text-2xl font-light'>Create new account</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-sm'>
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
                            placeholder='Name user'
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
                            placeholder='Lastname user'
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
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                            Email
                        </label>
                        <input 
                            className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                            id='email'
                            type='email'
                            placeholder='Email user'
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
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                            Password
                        </label>
                        <input 
                            className='shadow appearance border border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                            id='password'
                            type='password'
                            placeholder='Password user'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.password && formik.errors.password ? (
                        <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.password}</p>
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

export default NewAccount;