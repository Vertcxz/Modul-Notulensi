
import React, { useState, useContext } from 'react';
import { useMeetings } from '../../hooks/useMeetings';
import { AuthContext } from '../../contexts/AuthContext';
import { MOCK_USERS } from '../../api/mockData';
import { Meeting, User, UserRole, MeetingStatus } from '../../types';

interface CreateMeetingFormProps {
  onClose: () => void;
}

const CreateMeetingForm: React.FC<CreateMeetingFormProps> = ({ onClose }) => {
  const { addMeeting } = useMeetings();
  const authContext = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState<User[]>([]);
  const [notulisId, setNotulisId] = useState<string>('');


  const handleParticipantChange = (user: User) => {
    setParticipants(prev => 
        prev.some(p => p.id === user.id) 
            ? prev.filter(p => p.id !== user.id) 
            : [...prev, user]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authContext?.user) return;

    const notulis = MOCK_USERS.find(u => u.id === notulisId);
    if (!notulis) {
        alert('Please select a notulis.');
        return;
    }

    const newMeeting: Omit<Meeting, 'id'> = {
      title,
      agenda,
      date,
      startTime,
      endTime,
      location,
      participants,
      notulis,
      createdBy: authContext.user,
      status: MeetingStatus.Scheduled
    };
    addMeeting(newMeeting as Meeting); // Casting because id is added in context
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agenda</label>
          <textarea id="agenda" value={agenda} onChange={e => setAgenda(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required></textarea>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
          <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
          <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div className="md:col-span-2">
            <label htmlFor="notulis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notulis</label>
            <select id="notulis" value={notulisId} onChange={e => setNotulisId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600" required>
                <option value="" disabled>Select a Notulis</option>
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
                        <input type="checkbox" checked={participants.some(p => p.id === user.id)} onChange={() => handleParticipantChange(user)} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"/>
                        <span className="text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
                    </label>
                ))}
            </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancel</button>
        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Create Meeting</button>
      </div>
    </form>
  );
};

export default CreateMeetingForm;
