export type Single = {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    occupation: string;
    notes: string;
    aliyaPreference: string;
    location: string;
    religiousStatus: string;
    spousePreferences: string;
    height: string;
    previouslyMarried: boolean;
    hasChildren: boolean;
    currentRelationshipStatus: string;
    age: number;
    gender: string;
  };
  
  export type Match = {
    id: number;
    single1Id: number;
    single2Id: number;
    status: 'Idea' | 'Suggested' | 'Dating' | 'Serious' | 'Engaged' | 'Married';
    archived: boolean;
  };