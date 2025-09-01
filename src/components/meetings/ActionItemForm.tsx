
import React, { useState, useEffect } from 'react';
import { ActionItem, ActionItemStatus, User, UserRole } from '../../types';

interface ActionItemFormProps {
  onClose: () => void;
  onSave: (item: ActionItem) => void;
  initialData?: ActionItem | null;
  participants: User[];
  currentUser: User | null | undefined;
}

const ActionItemForm: React.FC<ActionItemFormProps> = ({ onClose, onSave, initialData, participants, currentUser }) => {
  const [task, setTask] = useState('');
  const [picId, setPicId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ActionItemStatus>(ActionItemStatus.Open);

  const isCreatingNew = !initialData;
  const isStatusEditable = !isCreatingNew;


  useEffect(() => {
    if (initialData) {
      setTask(initialData.task);
      setPicId(initialData.pic.id);
      setDeadline(initialData.deadline);
      setStatus(initialData.status);
    } else {
      setTask('');
      setPicId(participants[0]?.id || '');
      setDeadline('');
      setStatus(ActionItemStatus.Open);
    }
  }, [initialData, participants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pic = participants.find(p => p.id === picId);
    if (!pic) {
        alert("Selected PIC not found!");
        return;
    }

    const itemToSave: ActionItem = {
      id: initialData?.id || '', // ID is handled by parent, but needed for type
      task,
      pic,
      deadline,
      status,
    };
    onSave(itemToSave);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task</label>
          <textarea id="task" value={task} onChange={e => setTask(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Person in Charge (PIC)</label>
            <select id="pic" value={picId} onChange={e => setPicId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600" required>
              {participants.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
            <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select 
            id="status" 
            value={status} 
            onChange={e => setStatus(e.target.value as ActionItemStatus)} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-600" 
            required
            disabled={!isStatusEditable}
          >
            <option value={ActionItemStatus.Open}>Open</option>
            <option value={ActionItemStatus.OnProgress}>On Progress</option>
            <option value={ActionItemStatus.Done}>Done</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancel</button>
        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          {initialData ? 'Save Changes' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default ActionItemForm;
