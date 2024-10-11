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
        const res = await fetch('http://localhost:4000/api/account/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            login: credentials.username,
            hashedPassword: hashPassword(credentials.password, credentials.username)
          })
        });

        const user = await res.json();

        if (user && user.token) {
          // Return user object with role if successful
          return { id: user.id, username: user.username, role: user.role };
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/Login',
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;  // Include user role in JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;  // Include user role in the session
      }
      return session;
    },
  },
});
