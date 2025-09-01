import { useContext } from 'react';
import { MeetingContext, MeetingContextType } from '../contexts/MeetingContext';

export const useMeetings = (): MeetingContextType => {
    const context = useContext(MeetingContext);
    if (!context) {
        throw new Error('useMeetings must be used within a MeetingProvider');
    }
    return context;
};
