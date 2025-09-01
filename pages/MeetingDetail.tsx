

import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMeetings } from '../contexts/MeetingContext';
import { ActionItem, ActionItemStatus, Attachment, User, UserRole, Meeting, MeetingStatus } from '../types';
import { exportToPdf } from '../services/pdfService';
import { AuthContext } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import ActionItemForm from '../components/ActionItemForm';
import EditMeetingForm from '../components/EditMeetingForm';
import { MOCK_USERS } from '../components/constants';

const MeetingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMeetingById, updateMeeting } = useMeetings();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [editableMeeting, setEditableMeeting] = useState<Meeting | undefined | null>(null);
  const [isActionItemModalOpen, setIsActionItemModalOpen] = useState(false);
  const [isEditMeetingModalOpen, setIsEditMeetingModalOpen] = useState(false);
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null);
  
  const meeting = getMeetingById(id!);

  useEffect(() => {
    if (meeting) {
      setEditableMeeting(JSON.parse(JSON.stringify(meeting)));
    }
  }, [meeting]);

  if (!id) return <p>Meeting ID not found.</p>;
  if (!meeting) return <p>Meeting not found.</p>;
  
  const isAllowedToView = useMemo(() => {
    if (!user) return false;
    // Admins can see everything
    if (user.role === UserRole.Admin) return true;
    // The notetaker can see the meeting
    if (meeting.notulis.id === user.id) return true;
    // Participants can see the meeting
    if (meeting.participants.some(p => p.id === user.id)) return true;
    // Anyone else cannot
    return false;
  }, [user, meeting]);

  if (!isAllowedToView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">You do not have permission to view this meeting's details.</p>
        <Link to="/" className="mt-6 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!editableMeeting) return <p>Loading meeting details...</p>;

  const handleExport = () => {
    exportToPdf(meeting, `Notulensi_${meeting.title.replace(/\s/g, '_')}`);
  }

  const isNotulis = authContext?.user?.id === meeting.notulis.id;
  const isAdmin = authContext?.user?.role === UserRole.Admin;
  const canEditMinutes = isNotulis || isAdmin;
  const canEditDetails = isAdmin;

  const handleEditMinutesToggle = () => {
    if (isEditingMinutes) {
      updateMeeting(editableMeeting);
    }
    setIsEditingMinutes(!isEditingMinutes);
  };

  const handleCancelEditMinutes = () => {
    setEditableMeeting(JSON.parse(JSON.stringify(meeting)));
    setIsEditingMinutes(false);
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableMeeting(prev => prev ? { ...prev, minutes: { ...prev.minutes!, summary: e.target.value } } : null);
  };
  
  const handleSaveActionItem = (item: ActionItem) => {
    setEditableMeeting(prev => {
      if (!prev) return prev;
      const minutes = prev.minutes || { summary: '', actionItems: [], attachments: [] };
      const newItems = [...(minutes.actionItems || [])];
      const index = newItems.findIndex(i => i.id === item.id);
      if (index > -1) {
        newItems[index] = item;
      } else {
        newItems.push({ ...item, id: `a${Date.now()}` });
      }
      return { ...prev, minutes: { ...minutes, actionItems: newItems } };
    });
    setIsActionItemModalOpen(false);
    setEditingActionItem(null);
  };
  
  const handleSaveMeetingDetails = (updatedDetails: Meeting) => {
    updateMeeting(updatedDetails);
    setEditableMeeting(updatedDetails); // Also update local editable state
    setIsEditMeetingModalOpen(false);
  };

  // Action Item CRUD
  const handleEditActionItem = (item: ActionItem) => { setEditingActionItem(item); setIsActionItemModalOpen(true); };
  const handleAddNewActionItem = () => { setEditingActionItem(null); setIsActionItemModalOpen(true); };
  const handleDeleteActionItem = (itemId: string) => {
    if (window.confirm('Are you sure?')) {
        setEditableMeeting(prev => {
            if (!prev || !prev.minutes) return prev;
            return { ...prev, minutes: { ...prev.minutes, actionItems: prev.minutes.actionItems.filter(i => i.id !== itemId) } };
        });
    }
  };
  // Attachment CRUD
  const handleDeleteAttachment = (attId: string) => {
     if (window.confirm('Are you sure?')) {
        setEditableMeeting(prev => {
            if (!prev || !prev.minutes) return prev;
            return { ...prev, minutes: { ...prev.minutes, attachments: prev.minutes.attachments.filter(a => a.id !== attId) } };
        });
    }
  };
  const handleAddAttachment = () => {
      const fileName = prompt("Enter file name (e.g., 'report.pdf'):");
      if (fileName) {
          const type = fileName.split('.').pop()?.startsWith('doc') ? 'doc' : (fileName.split('.').pop() === 'pdf' ? 'pdf' : 'img');
          const newAttachment: Attachment = { id: `att${Date.now()}`, name: fileName, url: '#', type: type as any };
          setEditableMeeting(prev => {
              if (!prev) return prev;
              const minutes = prev.minutes || { summary: '', actionItems: [], attachments: [] };
              return { ...prev, minutes: { ...minutes, attachments: [...minutes.attachments, newAttachment] }};
          });
      }
  };
  // Participant CRUD
  const handleRemoveParticipant = (userId: string) => {
      setEditableMeeting(prev => {
          if (!prev) return prev;
          return {...prev, participants: prev.participants.filter(p => p.id !== userId) };
      });
  };
  const handleAddParticipant = (userId: string) => {
      const userToAdd = MOCK_USERS.find(u => u.id === userId);
      if(userToAdd) {
        setEditableMeeting(prev => {
            if (!prev || prev.participants.some(p => p.id === userId)) return prev;
            return {...prev, participants: [...prev.participants, userToAdd]};
        });
      }
  }


  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
        case MeetingStatus.Scheduled: return <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full dark:bg-blue-900/50 dark:text-blue-300">{status}</span>;
        case MeetingStatus.Completed: return <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full dark:bg-green-900/50 dark:text-green-300">{status}</span>;
        case MeetingStatus.Canceled: return <span className="text-sm font-semibold bg-red-100 text-red-800 px-3 py-1 rounded-full dark:bg-red-900/50 dark:text-red-300">{status}</span>;
        default: return <span className="text-sm font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div id="meeting-minutes-content" className="p-8">
            <div className="border-b dark:border-gray-700 pb-6 mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{meeting.title}</h1>
                           {getStatusBadge(meeting.status)}
                        </div>
                        <p className="text-md text-gray-500 dark:text-gray-400 mt-1">{meeting.agenda}</p>
                    </div>
                    <div className="flex items-center gap-2 no-print flex-wrap">
                      {canEditDetails && (
                        <button onClick={() => setIsEditMeetingModalOpen(true)} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                           <PencilIcon/> Edit Details
                        </button>
                      )}
                      {canEditMinutes && !isEditingMinutes && (
                        <button onClick={handleEditMinutesToggle} className="flex items-center gap-2 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
                           <PencilIcon/> Edit Minutes
                        </button>
                      )}
                      {isEditingMinutes && (
                        <>
                         <button onClick={handleCancelEditMinutes} className="flex items-center gap-2 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300">Cancel</button>
                         <button onClick={handleEditMinutesToggle} className="flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300">Save Changes</button>
                        </>
                      )}
                      <button onClick={handleExport} className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300">
                          <DownloadIcon /> Export PDF
                      </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <InfoItem icon={<CalendarIcon />} label="Date" value={formatDate(meeting.date)} />
                    <InfoItem icon={<ClockIcon />} label="Time" value={`${meeting.startTime} - ${meeting.endTime}`} />
                    <InfoItem icon={<LocationMarkerIcon />} label="Location" value={meeting.location} />
                    <InfoItem icon={<UserCircleIcon />} label="Notulis" value={meeting.notulis.name} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Section title="Minutes Summary">
                        <textarea 
                            value={editableMeeting.minutes?.summary || ''} 
                            readOnly={!isEditingMinutes}
                            placeholder={isEditingMinutes ? "Enter meeting summary..." : "No summary available."}
                            onChange={handleSummaryChange}
                            className={`w-full p-3 border rounded-md min-h-[150px] transition-colors ${isEditingMinutes ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600' : 'border-transparent bg-gray-50 dark:bg-gray-700/50'}`}
                        />
                    </Section>
                    
                    <Section title="Action Plan">
                       <ActionPlanTable 
                         items={editableMeeting.minutes?.actionItems} 
                         isEditing={isEditingMinutes}
                         onAdd={handleAddNewActionItem}
                         onEdit={handleEditActionItem}
                         onDelete={handleDeleteActionItem}
                       />
                    </Section>
                </div>

                <div className="space-y-8">
                    <Section title="Participants">
                        <UserList 
                            users={editableMeeting.participants} 
                            isEditing={isEditingMinutes}
                            onRemove={handleRemoveParticipant}
                            onAdd={handleAddParticipant}
                        />
                    </Section>

                    <Section title="Attachments">
                       <AttachmentList 
                         attachments={editableMeeting.minutes?.attachments} 
                         isEditing={isEditingMinutes}
                         onAdd={handleAddAttachment}
                         onDelete={handleDeleteAttachment}
                       />
                    </Section>
                </div>
            </div>
        </div>
      </div>
      <Modal isOpen={isActionItemModalOpen} onClose={() => setIsActionItemModalOpen(false)} title={editingActionItem ? "Edit Action Item" : "Add Action Item"}>
        <ActionItemForm 
            onClose={() => setIsActionItemModalOpen(false)} 
            onSave={handleSaveActionItem}
            initialData={editingActionItem}
            participants={MOCK_USERS}
        />
      </Modal>
       <Modal isOpen={isEditMeetingModalOpen} onClose={() => setIsEditMeetingModalOpen(false)} title="Edit Meeting Details">
        <EditMeetingForm
            meeting={editableMeeting}
            onClose={() => setIsEditMeetingModalOpen(false)} 
            onSave={handleSaveMeetingDetails}
        />
      </Modal>
    </div>
  );
};

// Sub-components...
const InfoItem: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({ icon, label, value }) => ( <div className="flex items-start"><div className="flex-shrink-0 text-gray-400 h-5 w-5 mr-2 mt-0.5">{icon}</div><div><p className="text-gray-500 dark:text-gray-400 font-semibold">{label}</p><p className="text-gray-800 dark:text-gray-200">{value}</p></div></div>);
const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (<div><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2></div>{children}</div>);

const UserList: React.FC<{users: User[], isEditing: boolean, onRemove: (id: string) => void, onAdd: (id: string) => void}> = ({ users, isEditing, onRemove, onAdd }) => {
    const [newUser, setNewUser] = useState('');
    const availableUsers = useMemo(() => {
        return MOCK_USERS.filter(u => !users.some(p => p.id === u.id));
    }, [users]);
    
    const handleAdd = () => {
        if (newUser) {
            onAdd(newUser);
            setNewUser('');
        }
    };

    return (
        <div className="space-y-3">
            {users.map(user => (
                <div key={user.id} className="group flex items-center">
                    <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex-grow">{user.name}</span>
                    {isEditing && <button onClick={() => onRemove(user.id)} className="no-print ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>}
                </div>
            ))}
            {isEditing && (
                <div className="flex gap-2 mt-2 no-print">
                    <select value={newUser} onChange={e => setNewUser(e.target.value)} className="flex-grow mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Add participant...</option>
                        {availableUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <button onClick={handleAdd} className="bg-primary-500 text-white px-3 rounded-md hover:bg-primary-600 disabled:bg-gray-300" disabled={!newUser}>Add</button>
                </div>
            )}
        </div>
    )
};

const ActionPlanTable: React.FC<{items?: ActionItem[], isEditing?: boolean, onAdd: () => void, onEdit: (item: ActionItem) => void, onDelete: (id: string) => void}> = ({ items, isEditing, onAdd, onEdit, onDelete }) => {
    if ((!items || items.length === 0) && !isEditing) return <p className="text-gray-500 dark:text-gray-400">No action items.</p>;
    const statusColor = (s: ActionItemStatus) => ({'Done': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300','On Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300','Open': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}[s] || 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200');
    return (<div className="space-y-4"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead className="bg-gray-50 dark:bg-gray-700/50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Task</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PIC</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deadline</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>{isEditing && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>}</tr></thead><tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">{items?.map(item => (<tr key={item.id}><td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 align-top">{item.task}</td><td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 align-top">{item.pic.name}</td><td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 align-top">{item.deadline}</td><td className="px-4 py-4 text-sm align-top"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(item.status)}`}>{item.status}</span></td>{isEditing && (<td className="px-4 py-4 text-sm text-right space-x-2 align-top no-print"><button onClick={() => onEdit(item)} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"><PencilIcon /></button><button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon /></button></td>)}</tr>))}{(!items || items.length === 0) && isEditing && (<tr><td colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">No action items yet. Click below to add one.</td></tr>)}</tbody></table></div>{isEditing && (<button onClick={onAdd} className="no-print w-full text-sm text-primary-600 dark:text-primary-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">+ Add Action Item</button>)}</div>);
};

const AttachmentList: React.FC<{attachments?: Attachment[], isEditing?: boolean, onAdd: () => void, onDelete: (id: string) => void}> = ({ attachments, isEditing, onAdd, onDelete }) => {
     if (!attachments || attachments.length === 0 && !isEditing) return <p className="text-gray-500 dark:text-gray-400">No attachments.</p>;
     const typeIcon = (type: string) => {
        if (type === 'pdf') return <span className="text-red-500"><FilePdfIcon/></span>; if (type === 'doc') return <span className="text-blue-500"><FileDocIcon/></span>; if (type === 'img') return <span className="text-green-500"><FileImgIcon/></span>; return <FileIcon/>;
     };
     return (<div className="space-y-3">{attachments?.map(att => (<div key={att.id} className="group flex items-center p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><div className="h-6 w-6 mr-3">{typeIcon(att.type)}</div><a href={att.url} className="flex-grow text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">{att.name}</a>{isEditing && (<button onClick={() => onDelete(att.id)} className="no-print ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>)}</div>))}{isEditing && (<button onClick={onAdd} className="no-print mt-2 w-full text-sm text-primary-600 dark:text-primary-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Upload File</button>)}</div>);
};

// SVG Icons...
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>;

{/* FIX: Added missing icon components */}
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" /></svg>;
const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const FilePdfIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414A2 2 0 0017.414 7L13 2.586A2 2 0 0011.586 2H4zm5 9a1 1 0 00-1 1v1.586l-1.707-1.707a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l3.5-3.5a1 1 0 00-1.414-1.414L11 12.586V12a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const FileDocIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414A2 2 0 0017.414 7L13 2.586A2 2 0 0011.586 2H4zm5 7a1 1 0 11-2 0 1 1 0 012 0zm-2 2a1 1 0 100 2h6a1 1 0 100-2H7zm6 2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>;
const FileImgIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414A2 2 0 0017.414 7L13 2.586A2 2 0 0011.586 2H4zm5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-2.586 4.586a.5.5 0 00-.707.707l3.5 3.5a.5.5 0 00.707 0l5.5-5.5a.5.5 0 00-.707-.707L9 12.293 6.414 9.707z" clipRule="evenodd" /></svg>;

{/* FIX: Added missing default export */}
export default MeetingDetail;
