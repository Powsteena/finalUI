// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import '../CSS/FormStyle.css';

// function LoginForm() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

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
//       const response = await axios.post('http://localhost:5000/api/auth/login', formData);
//       const { token, role} = response.data;
//       console.log('Received Token:', token);
//       console.log('Received Role:', role);
//       // Decode token to get user role
//       // const base64Url = token.split('.')[1]; // Extract the payload part of the token
//       // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL safe base64 characters
//       // const decodedToken = JSON.parse(atob(base64)); // Decode the payload

//       // const userRole = decodedToken.role; // Safely extract the role from the decoded token

//       // Check if role is found
//       if (!role) {
//         throw new Error('Role not found in token payload');
//       }

//       // Store the token and role in localStorage
//       localStorage.setItem('authToken', token);
//       localStorage.setItem('userRole', role); // Store the role separately

//       setSuccessMessage('Login successful!');
//       setFormData({ email: '', password: '' });
//       setErrors({});
//       setServerError('');

//       // Redirect based on user role
//       if (role === 'admin') {
//         navigate('/admin-dashboard');
//       } else {
//         navigate('/user-dashboard');
//       }

//     } catch (error) {
//       if (error.response) {
//         setServerError(error.response.data?.msg || 'Server error');
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
//         <h2 className="text-center mb-4 text-dark-red">Welcome Back!</h2>
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
//           <button type="submit" className="btn w-100 mt-3">Login</button>
//           <p className="text-center mt-3">
//             <Link to="/register" className="text-orange">Don't have an account? Register</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginForm;

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/FormStyle.css';
import { jwtDecode } from 'jwt-decode';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;
      const decodedToken = jwtDecode(token);

      const role = decodedToken.user.role; // Adjust based on token payload


      if (!role) {
        throw new Error('Role not found in response data');
      }

      // Decode token if needed
      
      
      // Store the token and role in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);

      setSuccessMessage('Login successful!');
      setFormData({ email: '', password: '' });
      setErrors({});
      setServerError('');

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }

    } catch (error) {
      console.error('Login Error:', error);
      if (error.response) {
        setServerError(error.response.data?.msg || 'Server error');
      } else if (error.request) {
        setServerError('Network error');
      } else {
        setServerError(error.message || 'Request error');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="form-container bg-white p-5 rounded shadow">
        <h2 className="text-center mb-4 text-dark-red">Welcome Back!</h2>
        {serverError && <p className="text-danger text-center">{serverError}</p>}
        {successMessage && <p className="text-success text-center">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-danger">{errors.password}</p>}
          </div>
          <button type="submit" className="btn w-100 mt-3">Login</button>
          <p className="text-center mt-3">
            <Link to="/register" className="text-orange">Don't have an account? Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;


    