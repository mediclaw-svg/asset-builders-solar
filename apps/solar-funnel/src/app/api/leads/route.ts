import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function getLeads() {
  try {
    const data = await readFile(LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveLeads(leads: unknown[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, address, electricBill } = body;

  if (!name || !email || !phone || !address || !electricBill) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const lead = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    address,
    electricBill,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  const leads = await getLeads();
  leads.push(lead);
  await saveLeads(leads);

  return NextResponse.json(lead, { status: 201 });
}
