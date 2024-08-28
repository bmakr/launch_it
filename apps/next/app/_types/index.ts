export type Val = string;

export type KeyValues = {
  [key: string]: any;
}

export type Params = { params: { id: string; } }

export type User = {
  createdAt: number;
  email: string;
  roles: string[];
}

export type Session = {
  userId: number;
  passcode: number;
  createdAt: number;
}
