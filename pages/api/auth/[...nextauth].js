import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";


export default NextAuth({
  session: {
    // jwt: true
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db('auth-demo').collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          client.close();
          throw new Error("Could not log you in with this passsword!");
        }
        client.close();

        // authorization succeeded 
        // return object that is encoded for JWT token
        return { email: user.email };

      }
    })
  ],
})
