import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import supabase from "../../../lib/supabase";
import { v4 as uuidv4 } from 'uuid';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

const handleSupabaseSignIn = async ({ session, token } : { session: any, token: any }) => {
    const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("address", session.address.toLowerCase());
    
    if (data && data.length === 0) {
        // Add user
        const newUserId = uuidv4();

        const { data: userData, error: userError } = await supabase
            .from("User")
            .insert({ address: session.address.toLowerCase(), id: newUserId })
            .single();
        
        if (userError) {
            console.log('user error', userError);
        } else {
            console.log('user data', userData);
        }

        // Add session
        const newSessionId = uuidv4();
        const { data: sessionData, error: sessionError } = await supabase
            .from("Session")
            .insert({ 
                id: newSessionId, 
                userId: newUserId, 
                expires: session.expires, 
                sessionToken: token.jti
            })
            .single();
        
        if (sessionError) {
            console.log('session error', sessionError);
        } else {
            console.log('session data', sessionData);
        }
    } else {
        console.log('error', error);
    }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL(NEXTAUTH_URL)

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })

          if (result.success) {
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ]

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin")

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop()
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub
        session.user.name = token.sub
        session.user.image = "https://www.fillmurray.com/128/128"
        console.log('token is', token);
        console.log('session is', session);

        await handleSupabaseSignIn({ session, token });

        return session
      },
      
    },
  })
}