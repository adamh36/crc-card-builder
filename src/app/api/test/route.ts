import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();
    const count = await Project.countDocuments();
    return NextResponse.json({ ok: true, projectCount: count });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
