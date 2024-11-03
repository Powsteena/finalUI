import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import '../CSS/Driverregister.css';

function DriverRegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    vehicleType: '',
    licenseNumber: '',
    licenseImage: null,
    vehicleRegistration: null,
    insuranceDocument: null
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validate the form fields
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

    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.licenseImage) {
      newErrors.licenseImage = 'License image is required';
    }

    if (!formData.vehicleRegistration) {
      newErrors.vehicleRegistration = 'Vehicle registration document is required';
    }

    if (!formData.insuranceDocument) {
      newErrors.insuranceDocument = 'Insurance document is required';
    }

    return newErrors;
  };

  // Handle form input changes
  const handleChange = (e) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('vehicleType', formData.vehicleType);
    formDataToSend.append('licenseNumber', formData.licenseNumber);
    formDataToSend.append('licenseImage', formData.licenseImage);
    formDataToSend.append('vehicleRegistration', formData.vehicleRegistration);
    formDataToSend.append('insuranceDocument', formData.insuranceDocument);

    try {
      const response = await axios.post('http://localhost:5000/api/driver/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Driver Registration Successful:', response.data);

      // Set success message and clear the form
      setSuccessMessage('Registration successful! Your profile is under review.');
      setFormData({
        username: '',
        email: '',
        password: '',
        vehicleType: '',
        licenseNumber: '',
        licenseImage: null,
        vehicleRegistration: null,
        insuranceDocument: null
      });
      setErrors({});
      setServerError('');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
      setSuccessMessage('');
    }
  };

  // Custom file input component for better styling
  const FileInput = ({ name, label, error }) => (
    <div className="relative w-full">
      <input
        type="file"
        name={name}
        id={name}
        onChange={handleChange}
        className="hidden"
      />
      <label 
        htmlFor={name} 
        className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                   cursor-pointer flex items-center justify-between 
                   hover:bg-yellow-500 hover:text-black transition duration-300"
      >
        <span>{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </label>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Diagonal Yellow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 transform rotate-45 translate-x-1/2 -translate-y-1/2 opacity-20"></div>
      
      <div className="w-full max-w-xl z-10 relative">
        <div className="bg-black border-2 border-yellow-500 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 relative">
            {/* Pulsing Yellow Accent Dot */}
            <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
            
            <h2 className="text-3xl font-bold text-center text-yellow-500 mb-8 uppercase tracking-wider">
              Driver Registration
            </h2>

            {serverError && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-center">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-4 text-center">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-yellow-500 
                               placeholder-yellow-700 transition duration-300"
                  />
                  {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-yellow-500 
                               placeholder-yellow-700 transition duration-300"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-yellow-500 
                             placeholder-yellow-700 transition duration-300"
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="vehicleType"
                    placeholder="Vehicle Type"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-yellow-500 
                               placeholder-yellow-700 transition duration-300"
                  />
                  {errors.vehicleType && <p className="text-red-400 text-sm mt-1">{errors.vehicleType}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="License Number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black text-yellow-500 border-2 border-yellow-500 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-yellow-500 
                               placeholder-yellow-700 transition duration-300"
                  />
                  {errors.licenseNumber && <p className="text-red-400 text-sm mt-1">{errors.licenseNumber}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <FileInput 
                  name="licenseImage" 
                  label="Upload License Image" 
                  error={errors.licenseImage} 
                />
                <FileInput 
                  name="vehicleRegistration" 
                  label="Upload Vehicle Registration" 
                  error={errors.vehicleRegistration} 
                />
                <FileInput 
                  name="insuranceDocument" 
                  label="Upload Insurance Document" 
                  error={errors.insuranceDocument} 
                />
              </div>

              <button 
                type="submit" 
                onSubmit={handleSubmit}
                className="w-full bg-yellow-500 text-black py-3 rounded-xl 
                           hover:bg-yellow-400 transition duration-300 
                           transform hover:scale-105 font-bold uppercase tracking-wider 
                           shadow-lg hover:shadow-yellow-500/50"
              >
                Register as Driver
              </button>

              <p className="text-center text-yellow-500 mt-4">
                Already registered? {' '}
                <Link 
                  to="/driver-login" 
                  className="text-yellow-300 hover:text-yellow-200 
                             underline transition duration-300"
                >
                  Login
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

export default DriverRegisterForm;