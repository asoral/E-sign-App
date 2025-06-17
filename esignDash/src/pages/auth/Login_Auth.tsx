import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { useState ,useRef, useEffect } from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducers/userReducerSlice';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast ,Flip } from 'react-toastify';
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';

function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const {  login, logout } = useFrappeAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginRef = useRef(null);

    const navigateToBack = () => {
        gsap.to(loginRef.current, {
            x: '-100%',
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => navigate('/'),
        });
    }

    const handleSignupRedirect = () => {
        gsap.to(loginRef.current, {
            x: '-100%',
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => navigate('/signup'),
        });
    };
    useGSAP(()=>{ 
        gsap.from(loginRef.current, {
            x: '-100%',
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
        });
    })
    
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          onSubmit(); 
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [email, password]);
    
    const onSubmit = () => {
      if( email== '' && password== '' )
        { 
          toast.error('Login Enter Email & Password', {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true, 
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Flip,
            });
            return;
        }  

        login({
            username: email,
            password: password
        }).then(res => {
            // // // console.log(res);
            //  { message: "Logged In", home_page: "/app", full_name: "Administrator" }
            //  Store Email as well
            if (res.message === 'Logged In') {
                dispatch(setUser({ full_name: res.full_name as string, email: email }));
                toast.success('Login Successfully', {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Flip,
                    });
                    setTimeout(() => {
                        navigate('/dashboard');
                      }, 1600);
            }
        }).catch(error => {
            console.error('Login failed', error);
            // alert('Login failed. Please check your credentials.');
            toast.error('Login failed. Please check your credentials.', {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true, 
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Flip,
                });
        });
    };
  //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  //     if (e.key === 'Enter') {
  //         onSubmit();
  //     }
  // };

    return (
        <div className="h-screen w-screen flex items-center justify-center">
        <div ref={loginRef} className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

          <div className="w-full lg:w-1/2 p-8">
            <div className="relative p-4">
              <button 
                className="absolute top-2 left-2 rounded-full bg-[#d1e0e4] p-1 hover:bg-[#a2c1ca]"
                onClick={navigateToBack}
              >
                <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.348 5.652a.5.5 0 01.707.707l-9.9 9.9a.5.5 0 11-.707-.707l9.9-9.9zM5.653 5.652a.5.5 0 00-.707.707l9.9 9.9a.5.5 0 00.707-.707l-9.9-9.9z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">Sign-in with Frappe</p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input 
                className="bg-[#d1e0e4] text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" 
                type="email" 
                value={email}
                
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                {/* <Link to="#" className="text-xs text-gray-500">Forgot Password?</Link>  */}
              {/* Add functionality of Forget password ---------------------------------> */}
              </div>
              <input 
                className="bg-[#d1e0e4] text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <button onClick={onSubmit} className="bg-[#283C42] text-white font-bold py-2 px-4 w-full rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300">
                Login
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <button onClick={handleSignupRedirect} className="text-xs text-gray-500 uppercase">Don't Have an Account?</button>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
          {/* Background Image Area */}
          <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611095780122-d692cee29291?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
          </div>
        </div>
        <ToastContainer limit={1} />
      </div>
    );
}

export default SignIn;
