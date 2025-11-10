import { NextResponse } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/db";
import Card from "@/models/Card";

const CreateCard = z.object({
  projectId: z.string(),
  className: z.string().min(1),
  responsibilities: z.array(z.string()).min(1),
  collaborators: z.array(z.string()).min(1),
  attributes: z.array(z.string()).optional().default([]),
  methods: z.array(z.string()).optional().default([]),
});

export async function GET(req: Request) {
  await dbConnect();
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const q: any = {};
  if (projectId) {
    if (!Types.ObjectId.isValid(projectId)) return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
    q.projectId = projectId;
  }
  const list = await Card.find(q).sort({ className: 1 }).lean();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const parsed = CreateCard.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (!Types.ObjectId.isValid(parsed.data.projectId)) return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
  const doc = await Card.create(parsed.data);
  return NextResponse.json(doc, { status: 201 });
}
