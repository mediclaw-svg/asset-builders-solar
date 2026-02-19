import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

async function getCollection() {
  await client.connect();
  return client.db("asset-builders-solar").collection("leads");
}

export async function GET() {
  try {
    const collection = await getCollection();
    const leads = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(leads);
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, electricBill } = body;

    if (!name || !email || !phone || !address || !electricBill) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lead = {
      name,
      email,
      phone,
      address,
      electricBill,
      status: "new",
      createdAt: new Date(),
    };

    const collection = await getCollection();
    const result = await collection.insertOne(lead);

    return NextResponse.json({ id: result.insertedId, ...lead }, { status: 201 });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const collection = await getCollection();
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
