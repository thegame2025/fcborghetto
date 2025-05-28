// Questo file deve essere usato solo sul server
"use server";

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const options = {};

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function connectToDatabase() {
  // Se abbiamo già una connessione, riutilizzala
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Se no, crea una nuova connessione
    const client = new MongoClient(uri, options);
    await client.connect();
    
    const db = client.db('fc_borghetto');
    
    // Memorizza la connessione nella cache
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('Errore durante la connessione a MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase; 