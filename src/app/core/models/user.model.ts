export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

export class UserModel implements User {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public role: 'student' | 'teacher'
  ) {}

  get fullName(): string {
    return [this.firstName, this.lastName].filter(el => !!el).join(' ');
  }
}