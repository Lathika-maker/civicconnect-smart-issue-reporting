export type IssueCategory = 
  | 'Road Potholes' 
  | 'Garbage / Sanitation' 
  | 'Electricity Damage' 
  | 'Water Leakage' 
  | 'Drainage Problems' 
  | 'Streetlight Failure';

export type ComplaintStatus = 
  | 'Submitted' 
  | 'Verified' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Resolved';

export interface Complaint {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  category: IssueCategory;
  description: string;
  imageUrl?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: ComplaintStatus;
  createdAt: string;
  upvotes: number;
  confirmations: number;
  isCommunityVerified: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  createdAt: string;
  read: boolean;
}
