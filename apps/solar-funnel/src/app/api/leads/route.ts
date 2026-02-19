import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:CubeClaw2026@cluster0.tluof.mongodb.net/';
const dbName = process.env.MONGODB_DB || 'assetbuilders';

let client: MongoClient;

async function getCollection() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName).collection('leads');
}

export async function GET() {
  try {
    const collection = await getCollection();
    const leads = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = {
      ...body,
      status: 'new',
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    };
    
    const collection = await getCollection();
    await collection.insertOne(lead);
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
