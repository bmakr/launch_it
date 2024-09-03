export type Response = { 
  error?: string | undefined; 
  id?: string | undefined; 
  status?: number; 
}

export interface KeyValues {
  [key: string]: any
}