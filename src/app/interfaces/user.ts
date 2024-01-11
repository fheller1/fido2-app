export class User {
  id!: string;
  userName!: string;
  firstName?: string;
  lastName?: string;

  constructor(userName: string, firstName: string, lastName: string) {
    this.id = crypto.randomUUID();
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
