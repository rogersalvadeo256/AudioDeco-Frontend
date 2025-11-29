import React from 'react';

interface DashboardProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome to Dashboard</h2>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="mb-2 text-gray-700">
            <strong className="font-semibold">Name:</strong> {user?.name}
          </p>
          <p className="text-gray-700">
            <strong className="font-semibold">Email:</strong> {user?.email}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
