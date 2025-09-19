import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { goal, barrier } = await request.json()

    if (!goal || !barrier) {
      return NextResponse.json({ error: "Goal and barrier are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
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
