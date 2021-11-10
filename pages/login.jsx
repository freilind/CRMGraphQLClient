import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';


const AUTHENTICATE_USER = gql `
  mutation AuthenticationMutation($authenticationInput: AuthenticationInput) {
    authentication(input: $authenticationInput) {
      token
    }
  }
`;

const Login = () => {
    const router = useRouter();

    const [ message, setMessage ] = useState({
        msg: '',
        type: ''
    });

    const [ authenticatedUser ] = useMutation(AUTHENTICATE_USER);

  const formik = useFormik({
    initialValues: {
        email: '',
        password: ''
    },
    validationSchema: Yup.object({
        email:
            Yup.string().email('The email is not valid').required('The email is required'),
        password:
            Yup.string().required('The password is required').min(6, 'The password length is minimun 6')
    }),
    onSubmit: async values => {
        try {
            const { email, password } = values;
            const { data } = await authenticatedUser({
                variables: {
                    authenticationInput: {
                        email,
                        password
                    }
                }
            });

            setMessage({msg:'Authenticating...', type: 'info'});
            const { token } = data.authentication;
            localStorage.setItem('token', token);
            
            setTimeout(() => {
                setMessage({});
                router.push('/');
            }, 2000);
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
        <h1 className='text-center text-2xl text-white font-light'>Login</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-sm'>
                <form 
                  className='bg-purple-100 rounded shadow-md px-8 pt-6 pb-8 mb-4'
                  onSubmit={formik.handleSubmit}
                >
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
                        { formik.touched.email && formik.errors.email ? (
                          <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                              <p className='font-bold'>Error</p>
                              <p>{formik.errors.email}</p>
                          </div>
                        ) : null }
                    </div>

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
                        { formik.touched.password && formik.errors.password ? (
                          <div className='text-xs my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2'>
                              <p className='font-bold'>Error</p>
                              <p>{formik.errors.password}</p>
                          </div>
                        ) : null }
                    </div>

                    <input 
                        className='w-full text-center flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200'
                        type='submit'
                        value='Sign in'
                     />

                </form>
            </div>
        </div>
      </Layout>
    </>
  )
}

export default Login;
