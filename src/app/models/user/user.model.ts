export interface UserModel {
  userId: number;
  userName: string;
  email: string;
  role: number;
}

export interface SaveUserModel {
  userName: string;
  email: string;
  password: string;
  role: number;
}
