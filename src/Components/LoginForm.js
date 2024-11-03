import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    // Clear errors when user starts typing
    setErrors({});
    setServerError('');
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
      // Making request to the login endpoint
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;

      if (!token) {
        throw new Error('Token not received');
      }

      // Store the token
      localStorage.setItem('token', token);
      console.log('Token stored:', token);

      // Decode the token
      const decodedToken = jwtDecode(token);
      const role = decodedToken.user?.role;  // Adjust this based on token payload

      if (!role) {
        throw new Error('Role not found in token');
      }

      // Store the role and user details
      localStorage.setItem('role', role);
      localStorage.setItem('email', formData.email);

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
        setServerError(error.response.data?.msg || 'Server error occurred');
      } else if (error.request) {
        setServerError('Network error');
      } else {
        setServerError(error.message || 'Request error');
      }
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
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
        {/* Main Card with hover effect */}
        <div className="group relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500">
          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-yellow-500 rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-500 rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-yellow-500 rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-yellow-500 rounded-br-lg" />

          {/* Header with animation */}
          <div className="text-center mb-8 transform group-hover:scale-105 transition-transform duration-500">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <div className="mt-2 inline-block">
              <p className="text-yellow-500/60 text-sm">Sign in to continue</p>
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
                placeholder="Enter your password"
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              onSubmit={handleSubmit}
              className="relative w-full group/button"
            >
              <div className="absolute inset-0 bg-yellow-500 rounded-xl opacity-50 blur-lg group-hover/button:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full bg-yellow-500 text-black py-3 px-4 rounded-xl font-bold hover:bg-yellow-400 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 animate-bounce-x" />
                  </>
                )}
              </div>
            </button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-yellow-500/60">
                New here?{' '}
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="text-yellow-500 hover:text-yellow-400 font-medium inline-flex items-center space-x-1 group/register"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/register:translate-x-1 transition-transform duration-300" />
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;