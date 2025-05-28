import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Esporta i handler per le richieste GET e POST
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions); 