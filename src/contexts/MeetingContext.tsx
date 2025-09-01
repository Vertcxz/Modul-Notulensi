import React, { createContext, useState, ReactNode } from 'react';
import { Meeting } from '../types';
import { MOCK_MEETINGS } from '../api/mockData';

export interface MeetingContextType {
  meetings: Meeting[];
  getMeetingById: (id: string) => Meeting | undefined;
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (updatedMeeting: Meeting) => void;
  deleteMeeting: (meetingId: string) => void;
}

export const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);

  const getMeetingById = (id: string) => {
    return meetings.find(m => m.id === id);
  };
  
  const addMeeting = (meeting: Meeting) => {
    const newMeeting = { ...meeting, id: `m${meetings.length + 1}` };
    setMeetings(prevMeetings => [newMeeting, ...prevMeetings]);
  };

  const updateMeeting = (updatedMeeting: Meeting) => {
    setMeetings(prevMeetings => 
      prevMeetings.map(m => m.id === updatedMeeting.id ? updatedMeeting : m)
    );
  };

  const deleteMeeting = (meetingId: string) => {
    setMeetings(prevMeetings => prevMeetings.filter(m => m.id !== meetingId));
  };

  return (
    <MeetingContext.Provider value={{ meetings, getMeetingById, addMeeting, updateMeeting, deleteMeeting }}>
      {children}
    </MeetingContext.Provider>
  );
};