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
            account_password: credentials.password
          })
        });

        const user = await res.json();

        if (res.ok && user) {
          return { id: user.id, username: user.username, role: user.role };
        } else {
          return null;
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
        token.role = user.role;  // Add user role to JWT token
      }
      return token;
    },
    // This callback is called whenever a session is checked
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;  // Add role to session object
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',  // Use a strong secret for signing the JWTs
});

