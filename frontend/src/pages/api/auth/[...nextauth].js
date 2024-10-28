import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const fetchUrl = baseUrl + '/api/account/login';

        const res = await fetch(fetchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: credentials.username,
            account_password: credentials.password,
          }),
        });

        const user = await res.json();

        if (res.ok && user) {
          // Return id, username, and role to store in the session
          return { id: user.id, username: user.username, role: user.role };
        } else {
          return null;  // If login fails, return null
        }
      }
    })
  ],
  pages: {
    signIn: '/Login',  // Redirect users to the login page if they need to sign in
  },
  session: {
    jwt: true,  // Use JSON Web Tokens for session management
  },
  callbacks: {
    // This callback is called when JWT tokens are created
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;  // Add username to the JWT token
        token.role = user.role;
      }
      return token;
    },
    // This callback is called whenever a session is checked
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;  // Add username to session
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',  // Use a strong secret for signing the JWTs
});
