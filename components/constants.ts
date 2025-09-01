
import { User, UserRole, Meeting, ActionItem, ActionItemStatus, Attachment, MeetingStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Budi Santoso', email: 'budi.admin@example.com', role: UserRole.Admin, avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Sari Lestari', email: 'sari.notulis@example.com', role: UserRole.Notulis, avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Agus Wijaya', email: 'agus.user@example.com', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Dewi Anggraini', email: 'dewi@example.com', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'u5', name: 'Eko Prasetyo', email: 'eko@example.com', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u5' },
];

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Q3 Product Strategy Review',
    agenda: 'Discuss Q3 performance and plan for Q4 product launches.',
    date: '2024-08-15',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Conference Room A',
    participants: [MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[3]],
    notulis: MOCK_USERS[1],
    status: MeetingStatus.Completed,
    minutes: {
      summary: 'The team reviewed the Q3 sales data which showed a 15% increase in user engagement. Key decisions were made regarding the marketing budget for the upcoming "Phoenix" project. The design team presented new mockups which were approved with minor revisions.',
      actionItems: [
        { id: 'a1', task: 'Finalize Q4 marketing budget', pic: MOCK_USERS[0], deadline: '2024-08-22', status: ActionItemStatus.Done },
        { id: 'a2', task: 'Update Phoenix project mockups', pic: MOCK_USERS[3], deadline: '2024-08-25', status: ActionItemStatus.OnProgress },
        { id: 'a3', task: 'Prepare competitor analysis report', pic: MOCK_USERS[2], deadline: '2024-09-01', status: ActionItemStatus.Open },
      ],
      attachments: [
        { id: 'att1', name: 'Q3_Sales_Report.pdf', url: '#', type: 'pdf' },
        { id: 'att2', name: 'Phoenix_Mockups.png', url: '#', type: 'img' },
      ],
    }
  },
  {
    id: 'm2',
    title: 'Weekly Engineering Sync',
    agenda: 'Sprint progress updates and blocker discussion.',
    date: '2024-08-12',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Online via Google Meet',
    participants: [MOCK_USERS[1], MOCK_USERS[4], MOCK_USERS[2]],
    notulis: MOCK_USERS[1],
    status: MeetingStatus.Completed,
    minutes: {
      summary: 'Discussed current sprint progress. API integration is 80% complete. Frontend team reported a minor blocker with the state management library.',
      actionItems: [
        { id: 'a4', task: 'Resolve state management issue', pic: MOCK_USERS[4], deadline: '2024-08-14', status: ActionItemStatus.Done },
      ],
      attachments: [],
    }
  },
  {
    id: 'm3',
    title: 'Project Kick-off: Titan',
    agenda: 'Define project scope, goals, and team roles for the new Titan project.',
    date: '2024-08-20',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Main Auditorium',
    participants: MOCK_USERS,
    notulis: MOCK_USERS[1],
    status: MeetingStatus.Scheduled,
  },
];
