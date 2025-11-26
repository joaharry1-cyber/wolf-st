import { NextResponse } from "next/server";

export async function GET() {
  // Just return a placeholder so deployment works
  return NextResponse.json({ xp: 0 });
}