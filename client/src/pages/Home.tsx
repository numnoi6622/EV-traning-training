import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Zap, Wrench, Lightbulb, TrendingUp } from "lucide-react";

export default function Home() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [activeTrack, setActiveTrack] = useState<"repair" | "charging">("repair");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">EV Research & Training</h1>
          </div>
          <Button variant="outline" size="sm">Get Started</Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container relative z-10 space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Master Electric Vehicle Technology
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Research-backed 3-day training programs designed for technicians and EV enthusiasts.
            </p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">Explore Curriculum</Button>
            <Button size="lg" variant="outline">View Research</Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="container space-y-12">
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-3xl font-bold text-foreground">
              <TrendingUp className="h-8 w-8 text-accent" />
              What Professionals Want to Know
            </h2>
            <p className="text-muted-foreground">Analysis of social media discussions from Facebook, X, and Pantip</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-accent" />
                  Repair Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "High Voltage Safety", percentage: 95 },
                  { label: "Battery Repair Skills", percentage: 88 },
                  { label: "Diagnostic Tools", percentage: 82 },
                  { label: "Thermal Management", percentage: 76 },
                ].map((finding, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{finding.label}</span>
                      <span className="font-semibold text-accent">{finding.percentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${finding.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  General Users & Installers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Installation Standards", percentage: 92 },
                  { label: "Meter Upgrading", percentage: 85 },
                  { label: "Safety Devices", percentage: 89 },
                  { label: "Battery Longevity", percentage: 78 },
                ].map((finding, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{finding.label}</span>
                      <span className="font-semibold text-accent">{finding.percentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${finding.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="container space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Training Curriculums</h2>
            <p className="text-muted-foreground">30 hours, 3 days, hands-on experience</p>
          </div>

          <Tabs value={activeTrack} onValueChange={(v) => setActiveTrack(v as "repair" | "charging")}>
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary">
              <TabsTrigger value="repair" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Wrench className="mr-2 h-4 w-4" />
                Repair Technician
              </TabsTrigger>
              <TabsTrigger value="charging" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Zap className="mr-2 h-4 w-4" />
                Charging Specialist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="repair" className="mt-8 space-y-4">
              {[1, 2, 3].map((day) => (
                <Card key={day} className="cursor-pointer border-border bg-card transition-all hover:border-primary/50"
                  onClick={() => setExpandedDay(expandedDay === day ? null : day)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">{day}</div>
                        <div>
                          <CardTitle className="text-lg">Day {day} Topics</CardTitle>
                          <CardDescription>10 hours</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">Topics:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                            Sample Topic {day}
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="charging" className="mt-8 space-y-4">
              {[1, 2, 3].map((day) => (
                <Card key={day} className="cursor-pointer border-border bg-card transition-all hover:border-primary/50"
                  onClick={() => setExpandedDay(expandedDay === day ? null : day)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent font-semibold">{day}</div>
                        <div>
                          <CardTitle className="text-lg">Day {day} Topics</CardTitle>
                          <CardDescription>10 hours</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">Topics:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                            Sample Topic {day}
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="border-t border-border bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Ready to Transform Your Career?</h2>
            <p className="text-muted-foreground">Join professionals mastering EV technology.</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">Enroll Now</Button>
            <Button size="lg" variant="outline">Download Curriculum</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-secondary py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>EV Research and Training Dashboard 2026</p>
        </div>
      </footer>
    </div>
  );
}
