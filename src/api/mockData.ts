import { User, UserRole, Meeting, ActionItem, ActionItemStatus, Attachment, MeetingStatus } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Anisa Rahmawati', email: 'anisa.admin@example.com', password: 'password123', role: UserRole.Admin, avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Budi Setiawan', email: 'budi.notulis@example.com', password: 'password123', role: UserRole.Notulis, avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Cahyo Nugroho', email: 'cahyo@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Dewi Lestari', email: 'dewi@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'u5', name: 'Eko Prasetyo', email: 'eko@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u5' },
  { id: 'u6', name: 'Fitriani Indah', email: 'fitriani@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u6' },
  { id: 'u7', name: 'Fajar Sidik', email: 'fajar@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u7' },
  { id: 'u8', name: 'Hendra Gunawan', email: 'hendra.notulis@example.com', password: 'password123', role: UserRole.Notulis, avatar: 'https://i.pravatar.cc/150?u=u8' },
  { id: 'u9', name: 'Indah Puspita', email: 'indah@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u9' },
  { id: 'u10', name: 'Joko Santoso', email: 'joko.admin@example.com', password: 'password123', role: UserRole.Admin, avatar: 'https://i.pravatar.cc/150?u=u10' },
  { id: 'u11', name: 'Kartika Sari', email: 'kartika@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u11' },
  { id: 'u12', name: 'Liana Sari', email: 'liana@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u12' },
  { id: 'u13', name: 'Maulana Yusuf', email: 'maulana@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u13' },
  { id: 'u14', name: 'Nina Zulkarnain', email: 'nina.notulis@example.com', password: 'password123', role: UserRole.Notulis, avatar: 'https://i.pravatar.cc/150?u=u14' },
  { id: 'u15', name: 'Omar Faruq', email: 'omar@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u15' },
  { id: 'u16', name: 'Putri Wulandari', email: 'putri@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u16' },
  { id: 'u17', name: 'Rahmat Hidayat', email: 'rahmat@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u17' },
  { id: 'u18', name: 'Siti Aminah', email: 'siti@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u18' },
  { id: 'u19', name: 'Taufik Hidayat', email: 'taufik@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u19' },
  { id: 'u20', name: 'Yuni Shara', email: 'yuni@example.com', password: 'password123', role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u20' },
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
    createdBy: MOCK_USERS[0],
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
    createdBy: MOCK_USERS[4],
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
    participants: MOCK_USERS.slice(0, 10), // Use a subset for this big meeting
    notulis: MOCK_USERS[1],
    createdBy: MOCK_USERS[0],
    status: MeetingStatus.Scheduled,
  },
  {
    id: 'm4',
    title: 'Marketing Campaign Brainstorm',
    agenda: 'Generate ideas for the upcoming holiday season campaign.',
    date: '2024-07-25',
    startTime: '11:00',
    endTime: '12:30',
    location: 'Marketing Hub',
    participants: [MOCK_USERS[0], MOCK_USERS[3], MOCK_USERS[5], MOCK_USERS[8]],
    notulis: MOCK_USERS[7],
    createdBy: MOCK_USERS[3],
    status: MeetingStatus.Completed,
    minutes: {
      summary: 'Brainstormed three main campaign concepts: "Winter Wonderland", "Gifts that Give Back", and "Holiday Hackathon". Voted to proceed with "Gifts that Give Back". Discussed potential partnerships with local charities.',
      actionItems: [
        { id: 'a5', task: 'Create detailed proposal for "Gifts that Give Back"', pic: MOCK_USERS[3], deadline: '2024-08-01', status: ActionItemStatus.Done },
        { id: 'a6', task: 'List of potential charity partners', pic: MOCK_USERS[5], deadline: '2024-08-05', status: ActionItemStatus.Done },
      ],
      attachments: [
        { id: 'att3', name: 'Campaign_Ideas.pdf', url: '#', type: 'pdf' },
      ],
    },
  },
  {
    id: 'm5',
    title: 'Mobile App UI/UX Review',
    agenda: 'Review the new user onboarding flow and provide feedback.',
    // FIX: The `date` property must be a string. Creating a dynamic date for an upcoming meeting and formatting it as YYYY-MM-DD.
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '14:00',
    location: 'Online via Zoom',
    participants: [MOCK_USERS[6], MOCK_USERS[8], MOCK_USERS[10]],
    notulis: MOCK_USERS[7],
    createdBy: MOCK_USERS[6],
    status: MeetingStatus.Scheduled,
  },
];