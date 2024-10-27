export interface User {
    id: number;
    email: string;
    password?: string;
  }

  export interface ApiResponse {
    success:boolean,
    message:string,
    data:any
  }
  