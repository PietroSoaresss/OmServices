import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  // Ensure getServerSession is visible to TS even when exports are mis-resolved.
  function getServerSession(...args: any[]): Promise<Session | null>;
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
