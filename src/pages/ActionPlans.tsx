
import React, { useState, useMemo, useContext } from 'react';
import { useMeetings } from '../hooks/useMeetings';
import { MOCK_USERS } from '../api/mockData';
import { ActionItem, User, ActionItemStatus, Meeting, UserRole } from '../types';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface EnrichedActionItem extends ActionItem {
  meeting: {
    id: string;
    title: string;
  };
}

const ActionPlans: React.FC = () => {
  const { meetings, updateMeeting } = useMeetings();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActionItemStatus | 'all'>('all');
  const [picFilter, setPicFilter] = useState<string>('all');

  const allActionItems = useMemo((): EnrichedActionItem[] => {
    return meetings.flatMap(meeting => 
      meeting.minutes?.actionItems.map(item => ({
        ...item,
        meeting: { id: meeting.id, title: meeting.title }
      })) ?? []
    );
  }, [meetings]);

  const filteredActionItems = useMemo(() => {
    return allActionItems
      .filter(item => searchTerm === '' || item.task.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(item => statusFilter === 'all' || item.status === statusFilter)
      .filter(item => picFilter === 'all' || item.pic.id === picFilter)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [allActionItems, searchTerm, statusFilter, picFilter]);

  const statusColor = (status: ActionItemStatus) => {
    switch (status) {
        case ActionItemStatus.Done: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case ActionItemStatus.OnProgress: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case ActionItemStatus.Open: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
    }
  };

  const handleStatusChange = (itemToUpdate: EnrichedActionItem, newStatus: ActionItemStatus) => {
    const meetingToUpdate = meetings.find(m => m.id === itemToUpdate.meeting.id);
    if (!meetingToUpdate || !meetingToUpdate.minutes) return;

    const updatedActionItems = meetingToUpdate.minutes.actionItems.map(item =>
      item.id === itemToUpdate.id ? { ...item, status: newStatus } : item
    );

    const updatedMeeting = {
      ...meetingToUpdate,
      minutes: {
        ...meetingToUpdate.minutes,
        actionItems: updatedActionItems,
      },
    };

    updateMeeting(updatedMeeting);
  };

  const showMyItems = () => {
      if(user) {
          setPicFilter(user.id);
      }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Action Plans</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by task..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 md:col-span-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as ActionItemStatus | 'all')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value={ActionItemStatus.Open}>Open</option>
            <option value={ActionItemStatus.OnProgress}>On Progress</option>
            <option value={ActionItemStatus.Done}>Done</option>
          </select>
          <select 
            value={picFilter} 
            onChange={e => setPicFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
            aria-label="Filter by person in charge"
          >
            <option value="all">All PICs</option>
            {MOCK_USERS.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-4">
            <button onClick={showMyItems} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Show My Action Items</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Task</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Related Meeting</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PIC</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deadline</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredActionItems.length > 0 ? filteredActionItems.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 dark:text-gray-100">{item.task}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <Link to={`/meeting/${item.meeting.id}`} className="text-primary-600 hover:text-primary-800 hover:underline dark:text-primary-400 dark:hover:text-primary-300">
                      {item.meeting.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <img src={item.pic.avatar} alt={item.pic.name} className="h-6 w-6 rounded-full mr-2" />
                      {item.pic.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.deadline}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user?.id === item.pic.id ? (
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item, e.target.value as ActionItemStatus)}
                        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-xs font-semibold p-1 ${statusColor(item.status)} dark:border-gray-600`}
                      >
                        <option value={ActionItemStatus.Open}>Open</option>
                        <option value={ActionItemStatus.OnProgress}>On Progress</option>
                        <option value={ActionItemStatus.Done}>Done</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(item.status)}`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">No action items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActionPlans;
