import { NextResponse } from "next/server";

export async function GET() {
  // Fastest guaranteed deploy-safe placeholder
  return NextResponse.json({ xp: 0 });
}