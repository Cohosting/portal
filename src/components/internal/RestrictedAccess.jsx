import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestrictedAccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <ShieldAlert className="h-12 w-12 mb-4 animate-pulse" />
                  <h1 className="text-3xl font-bold mb-2">Access Restricted</h1>
                  <p className="text-red-100">Subscription Management Area</p>
              </div>
              <div className="p-6">
                  <p className="text-slate-600 mb-6">
                      This page is only accessible to authorized personnel. If you believe you should have access, please contact the system administrator.
                  </p>
                  <div className="space-y-4">
                      <button
                          onClick={() => navigate('/')}
                          className="w-full px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 group"
                      >
                          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                          <span>Return to Dashboard</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>
    );
};

export default RestrictedAccess;
