import React, { useState } from 'react';
import { 
  useRegister, 
  useLogin, 
  useCurrentUser, 
  useLogout, 
  useForgotPassword,
  useUserFromStorage,
  useIsAuthenticated 
} from '../hooks/useAuthQuery';

const AuthExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');

  // Auth hooks
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const forgotPasswordMutation = useForgotPassword();
  
  // Get current user data
  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();
  
  // Get user from storage (immediate access)
  const userFromStorage = useUserFromStorage();
  
  // Check authentication status
  const isAuthenticated = useIsAuthenticated();

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync(formData);
      // Success handling is done in the hook (navigation, etc.)
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(loginData);
      // Success handling is done in the hook (navigation, etc.)
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Success handling is done in the hook (navigation, etc.)
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordMutation.mutateAsync(forgotEmail);
      alert('Password reset email sent!');
      setForgotEmail('');
    } catch (error) {
      console.error('Forgot password error:', error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Authentication</h2>
        
        {/* Registration Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Register</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </button>
            {registerMutation.error && (
              <p className="text-red-500 text-sm">{registerMutation.error.message}</p>
            )}
          </form>
        </div>

        {/* Login Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Login</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
            {loginMutation.error && (
              <p className="text-red-500 text-sm">{loginMutation.error.message}</p>
            )}
          </form>
        </div>

        {/* Forgot Password Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Forgot Password</h3>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Email'}
            </button>
            {forgotPasswordMutation.error && (
              <p className="text-red-500 text-sm">{forgotPasswordMutation.error.message}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome!</h2>
      
      {/* User Info from Storage (immediate) */}
      {userFromStorage && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">User from Storage:</h3>
          <p>Name: {userFromStorage.name}</p>
          <p>Email: {userFromStorage.email}</p>
        </div>
      )}

      {/* Current User Data (from API) */}
      {userLoading && <p>Loading user data...</p>}
      {userError && <p className="text-red-500">Error: {userError.message}</p>}
      {currentUser && (
        <div className="mb-6 p-4 bg-blue-100 rounded">
          <h3 className="font-semibold mb-2">Current User (from API):</h3>
          <p>Name: {currentUser.name}</p>
          <p>Email: {currentUser.email}</p>
          <p>Phone: {currentUser.phone || 'Not provided'}</p>
          <p>Favorites: {currentUser.favorites?.length || 0}</p>
          <p>My Listings: {currentUser.myListings?.length || 0}</p>
          <p>My Offers: {currentUser.myOffers?.length || 0}</p>
          <p>Notifications: {currentUser.notifications?.length || 0}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default AuthExample; 