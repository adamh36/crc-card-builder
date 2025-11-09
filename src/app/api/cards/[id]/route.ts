import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import Card from "@/models/Card";

const UpdateCard = z.object({
  className: z.string().min(1).optional(),
  responsibilities: z.array(z.string()).min(1).optional(),
  collaborators: z.array(z.string()).min(1).optional(),
  attributes: z.array(z.string()).optional(),
  methods: z.array(z.string()).optional(),
  issueFlags: z.array(z.object({
    category: z.string(),
    severity: z.string(),
    message: z.string(),
  })).optional(),
});

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const doc = await Card.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await req.json();
  const parsed = UpdateCard.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const doc = await Card.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const res = await Card.findByIdAndDelete(id).lean();
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
