
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext!;

  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  if (!user) {
    return <p>User not found.</p>;
  }
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call a function from AuthContext to update the user
    alert(`Name updated to "${name}" (mock update).`);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">My Profile</h1>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
          <div className="flex-shrink-0">
            <img src={user.avatar} alt="User Avatar" className="w-32 h-32 rounded-full ring-4 ring-primary-200" />
          </div>
          <div className="flex-grow w-full">
            {!isEditing ? (
              <div className="space-y-4">
                <InfoRow label="Name" value={user.name} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Role" value={user.role} />
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="mt-4 w-full md:w-auto bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Role" value={user.role} />
                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsEditing(false); setName(user.name); }} 
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-lg text-gray-800 dark:text-gray-200">{value}</p>
  </div>
);

export default Profile;
