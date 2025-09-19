import { GoalUnblocker } from "@/components/goal-unblocker"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Goal Unblocker</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Transform your barriers into stepping stones. Get a personalized action plan to achieve your goals.
            </p>
          </div>
          <GoalUnblocker />
        </div>
      </div>
    </main>
  )
}
