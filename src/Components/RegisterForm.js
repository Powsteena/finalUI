// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
// import '../CSS/FormStyle.css';
// import login from '../Images/login.webp';

// function RegisterForm() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate(); // Initialize the useNavigate hook

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/register', formData);
//       console.log('Registration Successful:', response.data);

//       // Store user details in localStorage
//       localStorage.setItem('username', formData.username);
//       localStorage.setItem('email', formData.email);
//       // Set success message and clear the form
//       setSuccessMessage('Registration successful! Redirecting to your dashboard...');
//       setFormData({
//         username: '',
//         email: '',
//         password: ''
//       });
//       setErrors({});
//       setServerError('');

//       // Redirect to user dashboard
//       navigate('/user-dashboard'); // Navigate to the user dashboard after successful registration

//     } catch (error) {
//       if (error.response && error.response.data) {
//         console.log('Detailed Error:', error.response.data); // Log detailed error response
//         setServerError(error.response.data.message || 'Registration failed. Please try again.');
//       } else {
//         setServerError('An unexpected error occurred. Please try again.');
//       }
//       console.error('Registration Error:', error);
//     }
//   };


// return (
//   <div
//     className="container-fluid d-flex justify-content-start align-items-center min-vh-100"
//     style={{
//       backgroundImage: `url(${login})`, // Set your background image here
//       backgroundSize: 'cover',
//       backgroundPosition: 'center left',
//       backgroundRepeat: 'no-repeat',
//       height: '100vh',
//     }}
//   >
//     {/* Left Side with Signup Form */}
//     <div
//       className="col-md-4 d-flex justify-content-center align-items-center"
//       style={{
//         height: '100vh',
//         padding: '20px',
//       }}
//     >
//       <div className="form-container w-100 p-5 rounded shadow">
//         <h2 className="text-center mb-4">Join Us Today!</h2>
//         {serverError && <p className="text-danger text-center">{serverError}</p>}
//         {successMessage && <p className="text-success text-center">{successMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group mb-3">
//             <input
//               type="text"
//               name="username"
//               className="form-control"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//             {errors.username && <p className="text-danger">{errors.username}</p>}
//           </div>
//           <div className="form-group mb-3">
//             <input
//               type="email"
//               name="email"
//               className="form-control"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//             {errors.email && <p className="text-danger">{errors.email}</p>}
//           </div>
//           <div className="form-group mb-3">
//             <input
//               type="password"
//               name="password"
//               className="form-control"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             {errors.password && <p className="text-danger">{errors.password}</p>}
//           </div>
//           <button type="submit" className="btn w-100 mt-3">Register</button>
//           <p className="text-center mt-3">
//             <Link to="/login" className="text-orange">Already have an account? Login</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   </div>
// );
// };

// export default RegisterForm;


import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Keep your existing validation and handleChange functions

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('email', formData.email);
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      setFormData({ username: '', email: '', password: '' });
      setErrors({});
      setServerError('');
      navigate('/user-dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
      console.error('Registration Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              <div className="w-32 h-32 bg-yellow-500/10 rounded-full blur-xl" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="group relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500">
          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-yellow-500 rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-500 rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-yellow-500 rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-yellow-500 rounded-br-lg" />

          {/* Header with animation */}
          <div className="text-center mb-8 transform group-hover:scale-105 transition-transform duration-500">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
              Join Us Today
            </h2>
            <div className="mt-2 inline-block">
              <p className="text-yellow-500/60 text-sm">Create your account</p>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          </div>

          {/* Error/Success Messages */}
          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-center">
              {serverError}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="relative group/input">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500/50 group-hover/input:text-yellow-500 transition-colors duration-300" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-black/50 text-yellow-500 border border-yellow-500/20 rounded-xl px-12 py-3 focus:outline-none focus:border-yellow-500 placeholder-yellow-500/30 transition-all duration-300"
                placeholder="Choose a username"
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 transform scale-x-0 group-hover/input:scale-x-100 transition-transform duration-500" />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative group/input">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500/50 group-hover/input:text-yellow-500 transition-colors duration-300" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 text-yellow-500 border border-yellow-500/20 rounded-xl px-12 py-3 focus:outline-none focus:border-yellow-500 placeholder-yellow-500/30 transition-all duration-300"
                placeholder="Enter your email"
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 transform scale-x-0 group-hover/input:scale-x-100 transition-transform duration-500" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative group/input">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500/50 group-hover/input:text-yellow-500 transition-colors duration-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 text-yellow-500 border border-yellow-500/20 rounded-xl px-12 py-3 focus:outline-none focus:border-yellow-500 placeholder-yellow-500/30 transition-all duration-300"
                placeholder="Choose a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500/50 hover:text-yellow-500 transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 transform scale-x-0 group-hover/input:scale-x-100 transition-transform duration-500" />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group/button"
            >
              <div className="absolute inset-0 bg-yellow-500 rounded-xl opacity-50 blur-lg group-hover/button:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full bg-yellow-500 text-black py-3 px-4 rounded-xl font-bold hover:bg-yellow-400 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 animate-bounce-x" />
                  </>
                )}
              </div>
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-yellow-500/60">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-yellow-500 hover:text-yellow-400 font-medium inline-flex items-center space-x-1 group/login"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/login:translate-x-1 transition-transform duration-300" />
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;