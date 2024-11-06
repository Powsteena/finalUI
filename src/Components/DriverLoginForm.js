

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import '../CSS/FormStyle.css';

// function DriverLoginForm() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   // Validate form inputs
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }

//     return newErrors;
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/driver/login', formData);
//       const { token } = response.data;

//       if (!token) {
//         throw new Error('Token not received');
//       }

//       // Store the token
//       localStorage.setItem('token', token);
//       console.log('Token stored:', token);

//       // Decode the token
//       const decodedToken = jwtDecode(token);
//       const role = decodedToken.driver?.role;  // Adjust this based on your token payload structure

//       if (!role) {
//         throw new Error('Role not found in token');
//       }

//       // Store the role
//       localStorage.setItem('role', role);

//       // Set success message and clear the form
//       setSuccessMessage('Login successful!');
//       setFormData({ email: '', password: '' });
//       setErrors({});
//       setServerError('');

//       // Navigate to the Driver Dashboard after successful login
//       navigate('/driver-dashboard');
//     } catch (error) {
//       console.error('Login Error:', error);

//       if (error.response?.status === 403) {
//         setServerError('Your account is not approved yet.');
//       } else if (error.response) {
//         setServerError(error.response.data?.msg || 'Server error occurred');
//       } else if (error.request) {
//         setServerError('Network error');
//       } else {
//         setServerError(error.message || 'Request error');
//       }
//       setSuccessMessage('');
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100">
//       <div className="form-container bg-white p-5 rounded shadow">
//         <h2 className="text-center mb-4 text-dark-red">Driver Login</h2>
//         {serverError && <p className="text-danger text-center">{serverError}</p>}
//         {successMessage && <p className="text-success text-center">{successMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
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
//           <div className="form-group">
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
//           <button type="submit" className="btn w-100 mt-3">Login as Driver</button>
//           <p className="text-center mt-3">
//             <Link to="/driver-register" className="text-orange">Don't have an account? Register</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default DriverLoginForm;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import '../CSS/FormStyle.css';

// function DriverLoginForm() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   // Validate form inputs
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }

//     return newErrors;
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/driver/login', formData);
//       const { token } = response.data;

//       if (!token) {
//         throw new Error('Token not received');
//       }

//       // Store the token
//       localStorage.setItem('token', token);
//       console.log('Token stored:', token);

//       // Decode the token
//       const decodedToken = jwtDecode(token);
//       const { role, id: driverId } = decodedToken.driver;  // Adjust this based on your token payload structure

//       if (!role || !driverId) {
//         throw new Error('Role or driver ID not found in token');
//       }

//       // Store the role and driverId
//       localStorage.setItem('role', role);
//       localStorage.setItem('driverId', driverId);

//       // Set success message and clear the form
//       setSuccessMessage('Login successful!');
//       setFormData({ email: '', password: '' });
//       setErrors({});
//       setServerError('');

//       // Navigate to the Driver Dashboard after successful login
//       navigate('/driver-dashboard');
//     } catch (error) {
//       console.error('Login Error:', error);

//       if (error.response?.status === 403) {
//         setServerError('Your account is not approved yet.');
//       } else if (error.response) {
//         setServerError(error.response.data?.msg || 'Server error occurred');
//       } else if (error.request) {
//         setServerError('Network error');
//       } else {
//         setServerError(error.message || 'Request error');
//       }
//       setSuccessMessage('');
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center min-vh-100">
//       <div className="form-container bg-white p-5 rounded shadow">
//         <h2 className="text-center mb-4 text-dark-red">Driver Login</h2>
//         {serverError && <p className="text-danger text-center">{serverError}</p>}
//         {successMessage && <p className="text-success text-center">{successMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
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
//           <div className="form-group">
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
//           <button type="submit" className="btn w-100 mt-3">Login as Driver</button>
//           <p className="text-center mt-3">
//             <Link to="/driver-register" className="text-orange">Don't have an account? Register</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default DriverLoginForm;


import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 


function DriverLoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/driver/login', formData);
      const { token } = response.data;

      if (!token) {
        throw new Error('Token not received');
      }

      // Store the token
      localStorage.setItem('token', token);
      console.log('Token stored:', token);

      // Decode the token
      const decodedToken = jwtDecode(token);
      const { role, id: driverId, hasPaid } = decodedToken.driver || {}; // Adjust if structure differs

      if (!role || !driverId) {
        throw new Error('Role or driver ID not found in token');
      }

      // Store the role and driverId
      localStorage.setItem('role', role);
      localStorage.setItem('driverId', driverId);

     // Check if the driver has paid
     if (!hasPaid) {
      setServerError('You need to complete the first month payment');
      // Navigate to the payment page
      navigate(`/payment/${driverId}/${token}`);
    } else {
      // Set success message and clear the form
      setSuccessMessage('Login successful!');
      setFormData({ email: '', password: '' });
      setErrors({});
      setServerError('');

      // Navigate to the Driver Dashboard after successful login
      navigate(`/driver-dashboard/${driverId}`);
    }
    } catch (error) {
      console.error('Login Error:', error);

      if (error.response?.status === 403) {
        setServerError('Your account is not approved yet.');
      } else if (error.response) {
        setServerError(error.response.data?.msg || 'Server error occurred');
      } else if (error.request) {
        setServerError('Network error');
      } else {
        setServerError(error.message || 'Request error');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Diagonal Yellow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 transform rotate-45 translate-x-1/2 -translate-y-1/2 opacity-20"></div>
      
      <div className="w-full max-w-md z-10 relative">
        <div className="bg-black border-2 border-yellow-500 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 relative">
            {/* Pulsing Yellow Accent Dot */}
            <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
            
            <h2 className="text-3xl font-bold text-center text-yellow-500 mb-8 uppercase tracking-wider">
              Driver Login
            </h2>

            {serverError && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-center">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-yellow-500 
                             placeholder-yellow-700 transition duration-300"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-yellow-500 
                             placeholder-yellow-700 transition duration-300"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-500 text-black py-3 rounded-xl 
                           hover:bg-yellow-400 transition duration-300 
                           transform hover:scale-105 font-bold uppercase tracking-wider 
                           shadow-lg hover:shadow-yellow-500/50"
              >
                Login as Driver
              </button>

              <p className="text-center text-yellow-500 mt-4">
                Don't have an account? {' '}
                <Link 
                  to="/driver-register" 
                  className="text-yellow-300 hover:text-yellow-200 
                             underline transition duration-300"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500 rounded-full opacity-10 blur-2xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full opacity-10 blur-2xl animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default DriverLoginForm;