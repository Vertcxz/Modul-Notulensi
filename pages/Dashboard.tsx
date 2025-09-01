
import React, { useState, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useMeetings } from '../contexts/MeetingContext';
import { Meeting, MeetingStatus } from '../types';
import Modal from '../components/Modal';
import CreateMeetingForm from '../components/CreateMeetingForm';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Dashboard: React.FC = () => {
  const { meetings } = useMeetings();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewScope, setViewScope] = useState<'all' | 'my'>('all');
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const filteredMeetings = useMemo(() => {
    let relevantMeetings = meetings;

    if (viewScope === 'my' && user) {
        relevantMeetings = meetings.filter(meeting => 
            meeting.participants.some(p => p.id === user.id) || meeting.notulis.id === user.id
        );
    }

    return relevantMeetings.filter(meeting =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.agenda.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [meetings, searchTerm, viewScope, user]);

  const upcomingMeetings = filteredMeetings.filter(m => new Date(m.date) >= new Date() && m.status !== MeetingStatus.Completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastMeetings = filteredMeetings.filter(m => new Date(m.date) < new Date() || m.status === MeetingStatus.Completed).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Meeting Dashboard</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <button onClick={() => setIsModalOpen(true)} className="flex-shrink-0 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300">
             New Meeting
           </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button onClick={() => setViewScope('all')} className={`px-4 py-1 rounded-md text-sm font-medium ${viewScope === 'all' ? 'bg-white dark:bg-gray-800 shadow dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>All Meetings</button>
              <button onClick={() => setViewScope('my')} className={`px-4 py-1 rounded-md text-sm font-medium ${viewScope === 'my' ? 'bg-white dark:bg-gray-800 shadow dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>My Meetings</button>
          </div>
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
      </div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">Upcoming Meetings</h2>
          {upcomingMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No upcoming meetings found.</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">Past Meetings</h2>
          {pastMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No past meetings found.</p>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Meeting">
        <CreateMeetingForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
        case MeetingStatus.Scheduled: return <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900/50 dark:text-blue-300">{status}</span>;
        case MeetingStatus.Completed: return <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900/50 dark:text-green-300">{status}</span>;
        case MeetingStatus.Canceled: return <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded-full dark:bg-red-900/50 dark:text-red-300">{status}</span>;
        default: return <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
  };
  
  return (
    <Link to={`/meeting/${meeting.id}`} className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:border dark:border-gray-700 dark:hover:border-primary-500">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">{meeting.title}</h3>
        {getStatusBadge(meeting.status)}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">{meeting.agenda}</p>
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 border-t dark:border-gray-700 pt-4">
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{meeting.startTime} - {meeting.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{meeting.location}</span>
        </div>
      </div>
      <div className="flex -space-x-2 overflow-hidden mt-4">
        {meeting.participants.slice(0, 5).map(p => (
            <img key={p.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src={p.avatar} alt={p.name} title={p.name} />
        ))}
        {meeting.participants.length > 5 && (
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 ring-2 ring-white dark:ring-gray-800 text-xs font-medium text-gray-600 dark:text-gray-200">+{meeting.participants.length - 5}</div>
        )}
      </div>
    </Link>
  );
};


export default Dashboard;
