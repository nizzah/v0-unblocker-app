// app/api/generate-plan/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

// This matches your frontend's ActionPlan interface
const PlanSchema = z.object({
  goal: z.string(),
  barrier: z.string(),
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      timeframe: z.string(),
    })
  ).min(3).max(8)
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY. Add it to .env.local (dev) and Vercel env (prod)." },
        { status: 500 }
      );
    }

    const { goal, barrier } = await req.json();
    if (!goal || !barrier) {
      return NextResponse.json({ error: "Missing goal or barrier" }, { status: 400 });
    }

    const system = `You are Goal Unblocker, a practical, warm coach.
Return ONLY JSON that matches the provided schema: { goal, barrier, steps[{title, description, timeframe}] }.
Steps must be concrete, small, and doable. Vary suggestions each time.`;

    const { object } = await generateObject({
      model: openai("gpt-4o-mini", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      schema: PlanSchema,
      temperature: 0.9,          // add randomness so results differ
      maxTokens: 700,
      prompt: `${system}

User goal: ${goal}
Main barrier: ${barrier}

Generate 3–6 steps. Each step:
- title: 2–6 words
- description: 1–3 sentences, specific and kind
- timeframe: one of ["Today", "Tomorrow", "This Week", "Next 7 Days", "Week 1", "Week 2", "Ongoing"]`,
    });

    return NextResponse.json(object);
  } catch (err: any) {
    console.error("generate-plan error:", err);
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}



/*
// app/api/plan/route.ts
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    // 0) Check env var early (don't print the key, just confirm presence)
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY (set it in .env.local and restart dev server)" },
        { status: 500 }
      );
    }

    const { goal, barrier } = await req.json();
    if (!goal || !barrier) {
      return NextResponse.json({ error: "Missing goal or barrier" }, { status: 400 });
    }

    const prompt = `You are a supportive Goal Unblocker coach.

Goal: ${goal}
Barrier: ${barrier}

Please return a short plan with:
- a reframed goal,
- 2–3 likely root causes,
- one 20–30 minute step for today,
- a 7-day micro action plan (one bullet per day),
- one warm, encouraging sentence at the end.`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini", {
        apiKey: process.env.OPENAI_API_KEY, // <- uses your env var
      }),
      prompt,
      temperature: 0.9, // add randomness so it varies
      maxTokens: 500,
    });

    return NextResponse.json({ result: text });
  } catch (err: any) {
    // Surface a readable error to the browser so you can see what's wrong
    console.error("API /api/plan error:", err);
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
*/

/*
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { goal, barrier } = await request.json()

    if (!goal || !barrier) {
      return NextResponse.json({ error: "Goal and barrier are required" }, { status: 400 })
    }

    console.log("API Key exists:", !!process.env.OPENAI_API_KEY)
    console.log("API Key starts with:", process.env.OPENAI_API_KEY?.substring(0, 10))

    const { text } = await generateText({
      model: openai("gpt-4o-mini", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      prompt: `You are an expert life coach and goal achievement specialist. A user wants to achieve this goal: "${goal}"

But they're facing this barrier: "${barrier}"

Create a detailed, actionable 6-step plan to help them overcome this barrier and achieve their goal. For each step, provide:
1. A clear, motivating title (4-8 words)
2. A detailed description explaining what to do and why it works
3. A realistic timeframe

Format your response as a JSON object with this structure:
{
  "steps": [
    {
      "title": "Step title here",
      "description": "Detailed description here",
      "timeframe": "Week 1" or "Week 1-2" etc.
    }
  ]
}

Make the advice specific to their goal and barrier. Be encouraging but realistic. Focus on actionable steps they can take immediately.`,
    })

    // Parse the AI response
    const planData = JSON.parse(text)

    return NextResponse.json({
      goal,
      barrier,
      steps: planData.steps,
    })
  } catch (error) {
    console.error("Error generating plan:", error)
    return NextResponse.json({ error: "Failed to generate action plan" }, { status: 500 })
  }
}
*/