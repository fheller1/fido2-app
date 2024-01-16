export class User {
  userName!: string;
  firstName?: string;
  lastName?: string;
  credentialId?: string;

  constructor(userName: string) {
    this.userName = userName;
  }

  setCredentialId(credentialId: string) {
    this.credentialId = credentialId;
  }
}
