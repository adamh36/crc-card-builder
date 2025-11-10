import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";

const CreateProject = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
});

export async function GET() {
  await dbConnect();
  const list = await Project.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const parsed = CreateProject.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const doc = await Project.create({ ...parsed.data, ownerId: null, members: [] });
  return NextResponse.json(doc, { status: 201 });
}
