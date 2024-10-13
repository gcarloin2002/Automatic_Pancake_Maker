// src/types/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;  // Custom role field
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    username: string;
    role: string;  // Custom role field
    email?: string | null;
    image?: string | null;
  }
}
