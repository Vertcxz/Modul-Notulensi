

export enum UserRole {
  Admin = 'Admin',
  Participant = 'Participant',
  Notulis = 'Notulis'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
}

export enum ActionItemStatus {
  Open = 'Open',
  OnProgress = 'On Progress',
  Done = 'Done'
}

export interface ActionItem {
  id: string;
  task: string;
  pic: User;
  deadline: string;
  status: ActionItemStatus;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'img';
}

export enum MeetingStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export interface Meeting {
  id: string;
  title: string;
  agenda: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: User[];
  notulis: User;
  createdBy: User;
  status: MeetingStatus;
  minutes?: {
    summary: string;
    actionItems: ActionItem[];
    attachments: Attachment[];
  };
}