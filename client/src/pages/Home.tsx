import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Zap, Wrench, Lightbulb, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

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
            <h1 className="text-xl font-bold text-foreground">อบรมเทคโนโลยีรถไฟฟ้า</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin-login">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hidden sm:inline-flex">ผู้ดูแลระบบ</Button>
            </Link>
            <Link href="/status">
              <Button variant="ghost" size="sm" className="text-primary font-medium">เช็คสถานะ</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="sm">ลงทะเบียน</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pb-20">
        {/* Banner Image */}
        <div className="w-full">
          <img 
            src="/banner.png" 
            alt="EV Training Program Banner" 
            className="w-full h-auto object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        <div className="container relative z-10 space-y-6 mt-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
              เรียนรู้เทคโนโลยีรถไฟฟ้า
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              หลักสูตรอบรม 3-5 วัน ออกแบบมาสำหรับช่างซ่อม ช่างติดตั้ง และผู้สนใจรถไฟฟ้า
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90">ลงทะเบียนเลย</Button>
            </Link>
            <Link href="/status">
              <Button size="lg" variant="secondary" className="border shadow-sm">ตรวจสอบสถานะ</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="container space-y-12">
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-3xl font-bold text-foreground">
              <TrendingUp className="h-8 w-8 text-accent" />
              สิ่งที่ผู้เชี่ยวชาญต้องการรู้
            </h2>
            <p className="text-muted-foreground">ผลการวิจัยจากสังคมออนไลน์ Facebook, X, และ Pantip</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-accent" />
                  ช่างซ่อมรถไฟฟ้า
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "ความปลอดภัยไฟแรงสูง", percentage: 95 },
                  { label: "ทักษะการซ่อมแบตเตอรี่", percentage: 88 },
                  { label: "เครื่องมือวิเคราะห์", percentage: 82 },
                  { label: "การจัดการความร้อน", percentage: 76 },
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
                  ช่างติดตั้งตู้ชาร์จ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "มาตรฐานการติดตั้ง", percentage: 92 },
                  { label: "อัปเกรดมิเตอร์", percentage: 85 },
                  { label: "อุปกรณ์ป้องกัน", percentage: 89 },
                  { label: "การขยายอายุแบตเตอรี่", percentage: 78 },
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
                  ผู้สนใจรถไฟฟ้า
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "การบำรุงรักษาแบตเตอรี่", percentage: 92 },
                  { label: "ระบบชาร์จ", percentage: 88 },
                  { label: "ต้นทุนการเป็นเจ้าของ", percentage: 85 },
                  { label: "ระยะการขับขี่จริง", percentage: 82 },
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
            <h2 className="text-3xl font-bold text-foreground">หลักสูตรอบรม</h2>
            <p className="text-muted-foreground">30 ชั่วโมง 5 วัน การอบรมแบบปฏิบัติจริง</p>
          </div>

          <Tabs value={activeTrack} onValueChange={(v) => setActiveTrack(v as "repair" | "charging" | "users")}>
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-secondary">
              <TabsTrigger value="repair" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Wrench className="mr-2 h-4 w-4" />
                ช่างซ่อม
              </TabsTrigger>
              <TabsTrigger value="charging" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Zap className="mr-2 h-4 w-4" />
                ช่างติดตั้ง
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Users className="mr-2 h-4 w-4" />
                ผู้สนใจ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="repair" className="mt-8 space-y-4">
              {[
                {
                  day: 1,
                  title: "ความปลอดภัยไฟแรงสูง",
                  topics: [
                    "ระบบไฟแรงในรถไฟฟ้า (200-400V)",
                    "มาตรฐานความปลอดภัย ISO 6469 & ISO 13849",
                    "อุปกรณ์ป้องกันส่วนบุคคล (PPE)",
                    "ขั้นตอนการปิดกั้นและติดป้าย",
                    "การปฐมพยาบาลอุบัติเหตุไฟฟ้า"
                  ]
                },
                {
                  day: 2,
                  title: "ระบบแบตเตอรี่และการบำรุงรักษา",
                  topics: [
                    "ประเภทแบตเตอรี่: Li-ion, Li-Po, LFP",
                    "ระบบจัดการแบตเตอรี่ (BMS)",
                    "เทคนิคการวินิจฉัยและซ่อมแซม",
                    "การปรับสมดุลเซลล์และการทดสอบแรงดัน",
                    "ขั้นตอนความปลอดภัยสำหรับการทำงานกับแบตเตอรี่"
                  ]
                },
                {
                  day: 3,
                  title: "มอเตอร์ไฟฟ้าและระบบขับเคลื่อน",
                  topics: [
                    "มอเตอร์ AC แบบเหนี่ยวนำและ DC แบบแม่เหล็กถาวร",
                    "ระบบมอเตอร์เดี่ยวและคู่",
                    "ระบบเบรกแบบสร้างพลังงาน",
                    "การวินิจฉัยและแก้ไขปัญหามอเตอร์",
                    "การส่งกำลังและการจ่ายพลังงาน"
                  ]
                },
                {
                  day: 4,
                  title: "ระบบควบคุมและเครื่องมือวิเคราะห์",
                  topics: [
                    "หน่วยควบคุมอิเล็กทรอนิกส์ (ECU/PCM)",
                    "มาตรฐาน OBD-II และ OBD-EV",
                    "การใช้เครื่องสแกนเนอร์วินิจฉัย",
                    "เทคนิคมัลติมิเตอร์ดิจิทัล",
                    "การอ่านและตีความรหัสข้อผิดพลาด"
                  ]
                },
                {
                  day: 5,
                  title: "การจัดการความร้อนและศึกษากรณีจริง",
                  topics: [
                    "ระบบระบายความร้อนแบตเตอรี่",
                    "การระบายความร้อนมอเตอร์และเซ็นเซอร์ความร้อน",
                    "ระบบ HVAC ในรถไฟฟ้า",
                    "การแก้ไขปัญหาจากกรณีจริง",
                    "การสอบและการทดสอบปฏิบัติจริง"
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
                          <CardDescription>6 ชั่วโมง</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === dayData.day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === dayData.day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">หัวข้อเรียน:</h4>
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
                  title: "มาตรฐานการติดตั้งและความปลอดภัย",
                  topics: [
                    "ประเภทการชาร์จ: Level 1, 2, DC Fast",
                    "มาตรฐาน IEC 61851 & IEC 62196",
                    "มาตรฐานไฟฟ้าของไทย (TISI)",
                    "ขั้นตอนความปลอดภัยและ PPE",
                    "การประเมินสถานที่และการวางแผน"
                  ]
                },
                {
                  day: 2,
                  title: "อัปเกรดมิเตอร์และระบบไฟฟ้า",
                  topics: [
                    "ระบบเฟสเดี่ยวและสามเฟส",
                    "การคำนวณความต้องการพลังงาน",
                    "ขั้นตอนการอัปเกรดมิเตอร์",
                    "การประสานงานกับหน่วยงานไฟฟ้า",
                    "การเลือกขนาดสายและอุปกรณ์ป้องกัน"
                  ]
                },
                {
                  day: 3,
                  title: "การติดตั้งตู้ชาร์จและอุปกรณ์ป้องกัน",
                  topics: [
                    "การวางท่อและเส้นสาย",
                    "การติดตั้งตู้ชาร์จและการเดินสาย",
                    "การติดตั้งเบรกเกอร์",
                    "การป้องกัน RCD และ Surge",
                    "การต่อลงดินและการทดสอบความต่อเนื่อง"
                  ]
                },
                {
                  day: 4,
                  title: "การขยายอายุแบตเตอรี่และการจัดการพลังงาน",
                  topics: [
                    "ปัจจัยที่ส่งผลต่ออายุแบตเตอรี่",
                    "กลยุทธ์การชาร์จอย่างชาญฉลาด",
                    "ระบบตอบสนองต่อความต้องการ",
                    "การเพิ่มประสิทธิภาพอัตราค่าไฟรายชั่วโมง",
                    "ความเป็นไปได้ของการรวมพลังงานแสงอาทิตย์"
                  ]
                },
                {
                  day: 5,
                  title: "การทดสอบและการรับรอง",
                  topics: [
                    "ขั้นตอนการทดสอบความปลอดภัย",
                    "การทดสอบแรงดันและความต้านทาน",
                    "การทดสอบ RCD และเบรกเกอร์",
                    "การตรวจสอบการทำงานของตู้ชาร์จ",
                    "การสอบและการทดสอบปฏิบัติจริง"
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
                          <CardDescription>6 ชั่วโมง</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === dayData.day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === dayData.day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">หัวข้อเรียน:</h4>
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
                  title: "คู่มือผู้ใช้รถไฟฟ้าที่สมบูรณ์",
                  topics: [
                    "ประเภทรถไฟฟ้า: BEV, PHEV, HEV - ข้อดีและข้อเสีย",
                    "การบำรุงรักษาแบตเตอรี่: วิธีชาร์จที่ดีที่สุด",
                    "ระบบชาร์จ: Level 1, 2, DC Fast",
                    "การค้นหาและใช้สถานีชาร์จสาธารณะ",
                    "การวิเคราะห์ต้นทุนการเป็นเจ้าของ",
                    "ปัจจัยที่ส่งผลต่อระยะและการวางแผนการเดินทาง",
                    "การบำรุงรักษาประจำและความปลอดภัย",
                    "การแก้ไขปัญหาทั่วไป"
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
                          <CardDescription>6 ชั่วโมง (เข้มข้น)</CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedDay === dayData.day ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                  {expandedDay === dayData.day && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <h4 className="mb-3 font-semibold text-accent">หัวข้อที่ครอบคลุม:</h4>
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
            <h2 className="text-3xl font-bold text-foreground">พร้อมเปลี่ยนแปลงอาชีพของคุณหรือยัง?</h2>
            <p className="text-muted-foreground">เข้าร่วมผู้เชี่ยวชาญที่เรียนรู้เทคโนโลยีรถไฟฟ้า</p>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90">ลงทะเบียนเลย</Button>
            </Link>
            <Button size="lg" variant="outline">ดาวน์โหลดหลักสูตร</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-secondary py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>แดชบอร์ดการวิจัยและอบรมรถไฟฟ้า 2026</p>
        </div>
      </footer>
    </div>
  );
}
