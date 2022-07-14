export interface UserData extends AccountData {
  email: string;
  name: string;
  uid: string;
}

export interface AccountData {
  createdAt: {
    nanoseconds: number;
    seconds: number;
  };
  grade: string;
  group: string;
  role: string;
}
