export interface OfficeModel {
  id: number;
  officeUserName: string;
  officeLevel: number; // 2=Circle, 3=Division, 4=Range
  contactNumber: string | null;
  alternateContactNumber: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean | null;
  createdAt: string | null; // ISO datetime string
  updatedAt: string | null; // ISO datetime string
}
