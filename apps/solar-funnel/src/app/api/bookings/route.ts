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
  return client.db(dbName).collection('bookings');
}

export async function GET() {
  try {
    const collection = await getCollection();
    const bookings = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking = {
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    };
    
    const collection = await getCollection();
    await collection.insertOne(booking);
    
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
