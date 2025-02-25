import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signUp(email, password);
        alert('Check your email for the confirmation link!');
      } else {
        await signIn(email, password);
        navigate('/Dashboard');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 py-12 px-4 overflow-hidden">
      {/* Sun Animation */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-300 rounded-full animate-pulse opacity-40 blur-3xl z-0"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full animate-spin-slow opacity-60 z-0"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-500 transform hover:scale-105 transition-all duration-300 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-800">
            {isSignUp ? 'Gain Your Powers' : 'Enter the Hero Zone'}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {isSignUp ? 'Join the league of superheroes!' : 'Unleash your potential now.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow-md animate-bounce">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="email"
                required
                className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
            >
              {isSignUp ? 'Power Up!' : 'Launch In!'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium transition-all"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp 
                ? 'Already a hero? Launch in!' 
                : 'New hero? Power up!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;