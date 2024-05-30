export interface IUser {
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  DOB: Date;
  Address: string;
  Gender: string;
  Role: string;
  ProfilePictureLink: string;
  PersonalSecurityQuestions: Array<{ QuestionID: number; Answer: string }>;
  IsBanned: boolean;
  LoggedIn: boolean;
  Subscribe: boolean;
}
