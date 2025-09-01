
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    newActionItem: true,
    deadlineReminder: true,
    weeklySummary: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleAccountAction = (action: string) => {
    alert(`Mock action: ${action} initiated.`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
          <div className="space-y-4">
            <ToggleSwitch
              label="New Action Item"
              description="Get an email when a new action item is assigned to you."
              enabled={notifications.newActionItem}
              onChange={() => handleNotificationChange('newActionItem')}
            />
            <ToggleSwitch
              label="Deadline Reminder"
              description="Receive an email reminder 24 hours before an action item is due."
              enabled={notifications.deadlineReminder}
              onChange={() => handleNotificationChange('deadlineReminder')}
            />
            <ToggleSwitch
              label="Weekly Summary"
              description="Receive a weekly summary of your open and in-progress action items."
              enabled={notifications.weeklySummary}
              onChange={() => handleNotificationChange('weeklySummary')}
            />
          </div>
        </div>

        {/* Account Management Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Account Management</h2>
          <div className="space-y-4">
            <button 
              onClick={() => handleAccountAction('Change Password')}
              className="w-full md:w-auto bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
              Change Password
            </button>
             <button 
              onClick={() => handleAccountAction('Export Data')}
              className="w-full md:w-auto ml-0 md:ml-4 mt-2 md:mt-0 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
              Export My Data
            </button>
            <div className="border-t border-red-500/30 dark:border-red-400/30 pt-4 mt-4">
               <button 
                onClick={() => handleAccountAction('Delete Account')}
                className="w-full md:w-auto bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                Delete My Account
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This action is permanent and cannot be undone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToggleSwitchProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description, enabled, onChange }) => (
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">{label}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      type="button"
      className={`${
        enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
      onClick={onChange}
      aria-pressed={enabled}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      />
    </button>
  </div>
);

export default Settings;