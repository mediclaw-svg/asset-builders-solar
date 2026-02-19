import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function getBookings() {
  try {
    const data = await readFile(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveBookings(bookings: unknown[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, time, notes, leadId } = body;

  if (!date || !time) {
    return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
  }

  const booking = {
    id: crypto.randomUUID(),
    leadId: leadId || null,
    date,
    time,
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  const bookings = await getBookings();
  bookings.push(booking);
  await saveBookings(bookings);

  return NextResponse.json(booking, { status: 201 });
}
