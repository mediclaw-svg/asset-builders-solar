import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

async function getCollection() {
  await client.connect();
  return client.db("asset-builders-solar").collection("bookings");
}

export async function GET() {
  try {
    const collection = await getCollection();
    const bookings = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, notes, leadId, name, email, phone } = body;

    if (!date || !time) {
      return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
    }

    const booking = {
      leadId: leadId || null,
      name: name || "",
      email: email || "",
      phone: phone || "",
      date,
      time,
      notes: notes || "",
      status: "pending",
      createdAt: new Date(),
    };

    const collection = await getCollection();
    const result = await collection.insertOne(booking);

    return NextResponse.json({ id: result.insertedId, ...booking }, { status: 201 });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
