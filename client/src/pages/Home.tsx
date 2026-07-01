import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Zap, Wrench, Lightbulb, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [activeTrack, setActiveTrack] = useState<"repair" | "charging" | "users">("repair");

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

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  Charging Specialists
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

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  EV Users & Enthusiasts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Battery Maintenance", percentage: 92 },
                  { label: "Charging Systems", percentage: 88 },
                  { label: "Cost of Ownership", percentage: 85 },
                  { label: "Real-World Range", percentage: 82 },
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

          <Tabs value={activeTrack} onValueChange={(v) => setActiveTrack(v as "repair" | "charging" | "users")}>
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-secondary">
              <TabsTrigger value="repair" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Wrench className="mr-2 h-4 w-4" />
                Repair Tech
              </TabsTrigger>
              <TabsTrigger value="charging" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Zap className="mr-2 h-4 w-4" />
                Charging Spec
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Users className="mr-2 h-4 w-4" />
                EV Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="repair" className="mt-8 space-y-4">
              {[
                {
                  day: 1,
                  title: "High Voltage Safety & Fundamentals",
                  topics: [
                    "High voltage systems in EVs (200-400V)",
                    "Safety standards: ISO 6469 & ISO 13849",
                    "Personal protective equipment (PPE)",
                    "Lockout/Tagout procedures",
                    "First aid for electrical accidents"
                  ]
                },
                {
                  day: 2,
                  title: "Battery Systems & Maintenance",
                  topics: [
                    "Battery types: Li-ion, Li-Po, LFP",
                    "Battery management system (BMS)",
                    "Diagnosis and repair techniques",
                    "Cell balancing and voltage testing",
                    "Safety procedures for battery work"
                  ]
                },
                {
                  day: 3,
                  title: "Electric Motors & Drivetrain",
                  topics: [
                    "AC induction and DC permanent magnet motors",
                    "Single vs dual motor systems",
                    "Regenerative braking systems",
                    "Motor diagnostics and troubleshooting",
                    "Transmission and power delivery"
                  ]
                },
                {
                  day: 4,
                  title: "Control Systems & Diagnostic Tools",
                  topics: [
                    "Electronic control units (ECU/PCM)",
                    "OBD-II and OBD-EV standards",
                    "Using diagnostic scanners",
                    "Digital multimeter techniques",
                    "Fault code reading and interpretation"
                  ]
                },
                {
                  day: 5,
                  title: "Thermal Management & Case Studies",
                  topics: [
                    "Battery cooling systems",
                    "Motor cooling and thermal sensors",
                    "HVAC systems in EVs",
                    "Real-world troubleshooting cases",
                    "Certification exam and practical testing"
                  ]
                }
              ].map((dayData) => (
                <Card key={dayData.day} className="cursor-pointer border-border bg-card transition-all hover:border-primary/50"
                  onClick={() => setExpandedDay(expandedDay === dayData.day ? null : dayData.day)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">{dayData.day}</div>
                        <div>
                          <CardTitle className="text-lg">{dayData.title}</CardTitle>
                          <CardDescription>6 hours</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === dayData.day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === dayData.day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">Topics:</h4>
                        <ul className="space-y-2">
                          {dayData.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="charging" className="mt-8 space-y-4">
              {[
                {
                  day: 1,
                  title: "Installation Standards & Safety",
                  topics: [
                    "EV charging types: Level 1, 2, DC Fast",
                    "IEC 61851 & IEC 62196 standards",
                    "Thai electrical standards (TISI)",
                    "Safety procedures and PPE",
                    "Site assessment and planning"
                  ]
                },
                {
                  day: 2,
                  title: "Meter Upgrade & Electrical Systems",
                  topics: [
                    "Single-phase vs three-phase systems",
                    "Power requirement calculations",
                    "Meter upgrade procedures",
                    "Electrical authority coordination",
                    "Cable sizing and protection devices"
                  ]
                },
                {
                  day: 3,
                  title: "Charger Installation & Safety Devices",
                  topics: [
                    "Conduit and cable routing",
                    "Charger mounting and wiring",
                    "Circuit breaker installation",
                    "RCD and surge protection",
                    "Grounding and continuity testing"
                  ]
                },
                {
                  day: 4,
                  title: "Battery Longevity & Energy Management",
                  topics: [
                    "Factors affecting battery lifespan",
                    "Smart charging strategies",
                    "Demand response systems",
                    "Time-of-use tariff optimization",
                    "Solar integration possibilities"
                  ]
                },
                {
                  day: 5,
                  title: "Testing, Troubleshooting & Certification",
                  topics: [
                    "Safety testing procedures",
                    "Voltage and resistance testing",
                    "RCD and circuit breaker testing",
                    "Charger functionality verification",
                    "Certification exam and practical testing"
                  ]
                }
              ].map((dayData) => (
                <Card key={dayData.day} className="cursor-pointer border-border bg-card transition-all hover:border-primary/50"
                  onClick={() => setExpandedDay(expandedDay === dayData.day ? null : dayData.day)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent font-semibold">{dayData.day}</div>
                        <div>
                          <CardTitle className="text-lg">{dayData.title}</CardTitle>
                          <CardDescription>6 hours</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === dayData.day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === dayData.day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">Topics:</h4>
                        <ul className="space-y-2">
                          {dayData.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="users" className="mt-8 space-y-4">
              {[
                {
                  day: 1,
                  title: "Complete EV User Guide (Full Day)",
                  topics: [
                    "EV types: BEV, PHEV, HEV - pros and cons",
                    "Battery maintenance: charging best practices",
                    "Charging systems: Level 1, 2, DC Fast",
                    "Finding and using public charging stations",
                    "Total cost of ownership analysis",
                    "Real-world range factors and planning",
                    "Routine maintenance and safety",
                    "Troubleshooting common issues"
                  ]
                }
              ].map((dayData) => (
                <Card key={dayData.day} className="cursor-pointer border-border bg-card transition-all hover:border-primary/50"
                  onClick={() => setExpandedDay(expandedDay === dayData.day ? null : dayData.day)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary font-semibold">✓</div>
                        <div>
                          <CardTitle className="text-lg">{dayData.title}</CardTitle>
                          <CardDescription>6 hours (Intensive)</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === dayData.day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === dayData.day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">Topics Covered:</h4>
                        <ul className="space-y-2">
                          {dayData.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
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
