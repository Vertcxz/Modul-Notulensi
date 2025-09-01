
import React, { useState, useEffect } from 'react';
import { MOCK_USERS } from '../../api/mockData';
import { Meeting, User, MeetingStatus, UserRole } from '../../types';

interface EditMeetingFormProps {
  meeting: Meeting;
  onClose: () => void;
  onSave: (meeting: Meeting) => void;
}

const EditMeetingForm: React.FC<EditMeetingFormProps> = ({ meeting, onClose, onSave }) => {
  const [formData, setFormData] = useState<Meeting>(meeting);

  useEffect(() => {
    setFormData(meeting);
  }, [meeting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (user: User) => {
    setFormData(prev => {
        const isParticipant = prev.participants.some(p => p.id === user.id);
        if (isParticipant) {
            return { ...prev, participants: prev.participants.filter(p => p.id !== user.id) };
        } else {
            return { ...prev, participants: [...prev.participants, user] };
        }
    });
  };

  const handleNotulisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const notulis = MOCK_USERS.find(u => u.id === e.target.value);
    if(notulis) {
        setFormData(prev => ({...prev, notulis}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agenda</label>
          <textarea id="agenda" name="agenda" value={formData.agenda} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required></textarea>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
          <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
          <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
         <div className="md:col-span-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600" required>
                <option value={MeetingStatus.Scheduled}>Scheduled</option>
                <option value={MeetingStatus.Completed}>Completed</option>
                <option value={MeetingStatus.Canceled}>Canceled</option>
            </select>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="notulis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notulis</label>
            <select id="notulis" value={formData.notulis.id} onChange={handleNotulisChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600" required>
                {MOCK_USERS.filter(user => user.role === UserRole.Notulis).map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
        </div>
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Participants</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md dark:border-gray-600">
                {MOCK_USERS.map(user => (
                    <label key={user.id} className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input type="checkbox" checked={formData.participants.some(p => p.id === user.id)} onChange={() => handleParticipantChange(user)} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"/>
                        <span className="text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
                    </label>
                ))}
            </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancel</button>
        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Save Changes</button>
      </div>
    </form>
  );
};

export default EditMeetingForm;
