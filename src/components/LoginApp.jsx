import React, { useState, useEffect } from 'react';
import { Check, X, UserPlus, LogIn } from 'lucide-react';

// Mock default user
const defaultUser = {
  username: 'demo',
  password: 'Demo@123'
};

const LoginApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginStatus, setLoginStatus] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [users, setUsers] = useState([defaultUser]);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    symbol: false
  });

  // Load saved users on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers([defaultUser, ...JSON.parse(savedUsers)]);
    }
  }, []);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Registration form state
  const [registrationForm, setRegistrationForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => 
      u.username === loginForm.username && 
      u.password === loginForm.password
    );
    
    if (user) {
      setLoginStatus('success');
    } else {
      setLoginStatus('error');
    }
  };

  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = registrationForm;
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      setRegistrationStatus('Username already exists');
      return;
    }

    if (password !== confirmPassword) {
      setRegistrationStatus('Passwords do not match');
      return;
    }

    if (Object.values(passwordValidation).every(Boolean)) {
      // Create new user
      const newUser = { username, password };
      
      // Save to localStorage (excluding default user)
      const existingUsers = users.filter(u => u.username !== defaultUser.username);
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update state
      setUsers([defaultUser, ...updatedUsers]);
      setRegistrationStatus('User successfully created! You can now log in.');
      
      // Clear form
      setRegistrationForm({
        username: '',
        password: '',
        confirmPassword: ''
      });
      
      // Switch to login tab after short delay
      setTimeout(() => {
        setIsLogin(true);
      }, 2000);
    } else {
      setRegistrationStatus('Please meet all password requirements');
    }
  };

  const handleRegistrationInput = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'password') {
      validatePassword(value);
    }
  };

  if (loginStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <Check className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome {loginForm.username}!</h2>
          <p className="text-gray-600">You have successfully logged in.</p>
          <button
            onClick={() => {
              setLoginStatus('');
              setLoginForm({ username: '', password: '' });
            }}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-between mb-6">
          <button
            className={`flex-1 py-2 ${isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}
          >
            <LogIn className="inline mr-2" size={20} /> Login
          </button>
          <button
            className={`flex-1 py-2 ${!isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}
          >
            <UserPlus className="inline mr-2" size={20} /> Register
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            {loginStatus === 'error' && (
              <p className="text-red-500 text-sm">Invalid username or password</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegistration} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registrationForm.username}
                onChange={handleRegistrationInput}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registrationForm.password}
                onChange={handleRegistrationInput}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registrationForm.confirmPassword}
                onChange={handleRegistrationInput}
                required
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Password Requirements:</p>
              <div className="flex items-center space-x-2">
                {passwordValidation.length ? 
                  <Check className="text-green-500" size={16} /> : 
                  <X className="text-red-500" size={16} />}
                <span className="text-sm">At least 8 characters</span>
              </div>
              <div className="flex items-center space-x-2">
                {passwordValidation.uppercase ? 
                  <Check className="text-green-500" size={16} /> : 
                  <X className="text-red-500" size={16} />}
                <span className="text-sm">Contains uppercase letter</span>
              </div>
              <div className="flex items-center space-x-2">
                {passwordValidation.symbol ? 
                  <Check className="text-green-500" size={16} /> : 
                  <X className="text-red-500" size={16} />}
                <span className="text-sm">Contains symbol</span>
              </div>
            </div>

            {registrationStatus && (
              <p className={`text-sm ${registrationStatus.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                {registrationStatus}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginApp;