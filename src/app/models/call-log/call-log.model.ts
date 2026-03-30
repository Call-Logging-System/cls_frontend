export interface CallLog {
  id: number;
  date: string;
  issue: string;
  type: string;
  reportedBy: string;
  status: string;
  duration: number;
}

export interface SaveCallLog {
  officeUserName: string;
  officeLevel: number;
  contactNumber: string;
  callDate: string;
  callStartTime: string;
  callEndTime: string;
  description: string;
  isReleased: boolean;
  issueReported: string;
  issueType: string;
  priority: string;
  releaseDate: string | null;
  reportedTo: number | null;
  solvedBy: number | null;
  status: string;
}