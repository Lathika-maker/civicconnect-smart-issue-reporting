import { Complaint } from './types';

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CC-1001',
    fullName: 'John Doe',
    phoneNumber: '9876543210',
    email: 'john@example.com',
    category: 'Road Potholes',
    description: 'Large pothole in the middle of the main road near Central Park.',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Main St, Near Central Park, Bangalore'
    },
    status: 'In Progress',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    upvotes: 15,
    confirmations: 8,
    isCommunityVerified: true,
  },
  {
    id: 'CC-1002',
    fullName: 'Jane Smith',
    phoneNumber: '9876543211',
    email: 'jane@example.com',
    category: 'Garbage / Sanitation',
    description: 'Garbage pile-up near the community center for over 3 days.',
    location: {
      lat: 12.9816,
      lng: 77.6046,
      address: '2nd Cross, Indiranagar, Bangalore'
    },
    status: 'Submitted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotes: 5,
    confirmations: 2,
    isCommunityVerified: false,
  },
  {
    id: 'CC-1003',
    fullName: 'Robert Brown',
    phoneNumber: '9876543212',
    email: 'robert@example.com',
    category: 'Streetlight Failure',
    description: 'Streetlight not working for the past week, making it dangerous at night.',
    location: {
      lat: 12.9616,
      lng: 77.5846,
      address: 'MG Road, Bangalore'
    },
    status: 'Resolved',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    upvotes: 25,
    confirmations: 12,
    isCommunityVerified: true,
  }
];
