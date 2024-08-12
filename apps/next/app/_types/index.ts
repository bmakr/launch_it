export type Val = string;

export type KeyValues = {
  [key: string]: string;
}

export type Params = { params: { id: string; } }

export type User = {
  id: string;
  createdAt: number;
  email: string;
  roles: string[];
}

export type Passcode = {
  id: string;
  userId: string;
  code: string;
  createdAt: number;
}

export type Session = {
  id: string;
  userId: string;
  createdAt: number;
  loggedOutAt: number;
  active: boolean;
}
