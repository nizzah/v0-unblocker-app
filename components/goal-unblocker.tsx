"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Target, Zap, CheckCircle } from "lucide-react"

interface ActionPlan {
  goal: string
  barrier: string
  steps: Array<{
    title: string
    description: string
    timeframe: string
  }>
}

export function GoalUnblocker() {
  const [goal, setGoal] = useState("")
  const [barrier, setBarrier] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateActionPlan = async () => {
    if (!goal.trim() || !barrier.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: goal.trim(),
          barrier: barrier.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate action plan")
      }

      const plan = await response.json()
      setActionPlan(plan)
    } catch (err) {
      setError("Failed to generate your action plan. Please try again.")
      console.error("Error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSteps = (userGoal: string, userBarrier: string) => {
    // Simple rule-based step generation based on common patterns
    const steps = [
      {
        title: "Break Down Your Goal",
        description: `Divide "${userGoal}" into smaller, manageable milestones. This makes the goal less overwhelming and creates clear progress markers.`,
        timeframe: "Week 1",
      },
      {
        title: "Address the Root Cause",
        description: `Analyze why "${userBarrier}" is blocking you. Is it a skill gap, resource limitation, or mindset issue? Understanding the root cause helps target your solution.`,
        timeframe: "Week 1-2",
      },
      {
        title: "Create Alternative Pathways",
        description: `Identify 2-3 different approaches to overcome "${userBarrier}". Having multiple options reduces dependency on a single solution.`,
        timeframe: "Week 2",
      },
      {
        title: "Build Supporting Habits",
        description: `Establish daily or weekly habits that directly support achieving "${userGoal}". Small consistent actions compound over time.`,
        timeframe: "Week 2-3",
      },
      {
        title: "Seek Resources and Support",
        description: `Find tools, people, or resources that can help you navigate around "${userBarrier}". Don't try to solve everything alone.`,
        timeframe: "Week 3-4",
      },
      {
        title: "Take Action and Iterate",
        description: `Start implementing your plan, track progress, and adjust based on what you learn. Action creates momentum and reveals new solutions.`,
        timeframe: "Ongoing",
      },
    ]

    return steps
  }

  const resetForm = () => {
    setGoal("")
    setBarrier("")
    setActionPlan(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {!actionPlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Tell us about your goal
            </CardTitle>
            <CardDescription>
              Share your goal and the main barrier preventing you from achieving it. We'll create a personalized action
              plan using AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">What is your goal?</Label>
              <Input
                id="goal"
                placeholder="e.g., Start a fitness routine, Learn a new skill, Launch a business..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barrier">What's the main barrier stopping you?</Label>
              <Textarea
                id="barrier"
                placeholder="e.g., Lack of time, Don't know where to start, Fear of failure, Limited budget..."
                value={barrier}
                onChange={(e) => setBarrier(e.target.value)}
                rows={3}
                className="text-base resize-none"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            <Button
              onClick={generateActionPlan}
              disabled={!goal.trim() || !barrier.trim() || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your personalized action plan...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate AI Action Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">Your Goal</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground">{actionPlan.goal}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-1">
                  Barrier
                </Badge>
                <p className="text-muted-foreground">{actionPlan.barrier}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your AI-Generated Action Plan</h2>
              <Button variant="outline" onClick={resetForm}>
                Create New Plan
              </Button>
            </div>

            <div className="grid gap-4">
              {actionPlan.steps.map((step, index) => (
                <Card key={index} className="transition-all hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{step.title}</h3>
                          <Badge variant="secondary">{step.timeframe}</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Remember</h3>
              </div>
              <p className="text-muted-foreground">
                This AI-generated plan is personalized for your specific goal and barrier. Progress isn't always linear
                - celebrate small wins, learn from setbacks, and adjust your approach as needed.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
