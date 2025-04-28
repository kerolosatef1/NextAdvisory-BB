import React, { useContext, useEffect, useState } from "react";
import imgLOGO from '../../assets/imagelogo.jpeg'
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup'
import  axios  from 'axios';
import  Swal  from 'sweetalert2';
import { UserContext } from "../UserContext/UserContext";



export default function Login(){
    const { setUserLogin } = useContext(UserContext);
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const validationSchema = Yup.object().shape({
        userName: Yup.string().min(3, 'Min length is 3').max(50, 'Max length is 50').required('Name is required'),
        password: Yup.string().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must start with a capital letter and contain a symbol and numbers').required('Password is required')
            });

    async function handleLogin(formsdata){
        setLoading(true)
        console.log('register',formsdata)
        try{
            let data= await axios.post(`https://timetableapi.runasp.net/api/Auth/token`,formsdata)
            console.log(data)
            
            if(data.message==null){
                localStorage.setItem('userToken', data.data.token);
                setUserLogin(data.data.token);
                setLoading(false)
                navigate('/')
            }
            else {
                setApiError('Registration failed. Please try again.');
            }
        }
        catch (error) {
            setLoading(false)
            console.error('Registration error:', error);
            console.error('error:', error.response.data);
            console.log('error',error.response.data)
            const errorMessage = error?.response?.data || 'An unexpected error occurred.';
            setApiError(errorMessage);
        }
    }

    let formik =useFormik({
        initialValues:{
            userName:'',
            password:'',
        },
        validationSchema,
        onSubmit:handleLogin
    })
    useEffect(() => {
        if (apiError) {
            Swal.fire({
                title: 'Error!',
                text: apiError,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setApiError("");
        }
    }, [apiError]);
    const [count, setCount] = useState(0);
    useEffect(() => {},[]);
    return <>
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img class="w-8 h-8 mr-2" src={imgLOGO} alt="imglogo"/>
            NEXT Advisory
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to your account
                </h1>
                <form onSubmit={formik.handleSubmit} class="space-y-4 md:space-y-6" action="#">
                <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">username</label>
                        <input type="text" name='userName' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userName} id="username" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required=""/>
                    </div>
                    {formik.errors.userName&&formik.touched.userName&&
                    (<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    {formik.errors.userName}
                </div>
            )
                    }
                  
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" name='password' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                    </div>
                    {formik.errors.password && formik.touched.password && (
                            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                {formik.errors.password}
                            </div>
                        )}
                    
                    
                    <button  type="submit"
                    disabled={!(formik.isValid && formik.dirty)}
                    className="w-full color-main text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? <i className="fas fa-spinner fa-spin"></i> : 'Submit'}</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don’t have an account yet? <NavLink to='/register' className="font-medium text-primary-600  dark:text-primary-500">Sign up</NavLink>
                    </p>
                </form>
            </div>
        </div>
    </div>
    </section>  </>
}