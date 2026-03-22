import { useState } from 'react';
import { Lock, Shield, X } from 'lucide-react';

const ADMIN_PASSCODE = 'kmit'; // Hardcoded passcode as you requested

export default function PasscodeModal({ onSuccess, onClose }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (passcode === ADMIN_PASSCODE) {
        onSuccess();
      } else {
        setError('Invalid passcode. Please try again.');
        setPasscode('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal */}
        <div className="bg-surface-800 rounded-2xl shadow-2xl border border-surface-700 p-8 animate-scale-in">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-sm text-slate-400">
              Enter passcode to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter passcode"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400 animate-shake">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-surface-700 text-center">
            <p className="text-xs text-slate-500">
              <span className="font-mono">🔒 Secured Admin Area</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}