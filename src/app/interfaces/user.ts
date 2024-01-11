export class User {
  userName!: string;
  firstName?: string;
  lastName?: string;
  credentialId?: string;

  constructor(userName: string, firstName: string, lastName: string) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  setCredentialId(credentialId: string) {
    this.credentialId = credentialId;
  }
}
