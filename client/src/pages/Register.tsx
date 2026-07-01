import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courseType: "",
    trainingDate: "",
    numberOfParticipants: "1",
    notes: "",
  });

  const createRegistration = trpc.registration.create.useMutation({
    onSuccess: (data) => {
      toast.success("ลงทะเบียนสำเร็จ! กำลังไปยังหน้าชำระเงิน...");
      setTimeout(() => {
        setLocation("/payment");
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    },
  });

  const courseTypes = [
    { value: "repair", label: "ช่างซ่อมรถไฟฟ้า (5 วัน)" },
    { value: "charging", label: "ช่างติดตั้งตู้ชาร์จ (5 วัน)" },
    { value: "users", label: "ผู้สนใจรถไฟฟ้า (1 วัน)" },
  ];

  const trainingDates = [
    "2026-07-15",
    "2026-08-01",
    "2026-08-15",
    "2026-09-01",
  ];

  const coursePrices: Record<string, number> = {
    repair: 15000,
    charging: 15000,
    users: 3000,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const totalPrice = formData.courseType 
    ? (coursePrices[formData.courseType] || 0) * parseInt(formData.numberOfParticipants || "1")
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.courseType || !formData.trainingDate) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    createRegistration.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      courseType: formData.courseType as "repair" | "charging" | "users",
      trainingDate: formData.trainingDate,
      numberOfParticipants: parseInt(formData.numberOfParticipants),
      totalPrice: totalPrice,
      notes: formData.notes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับ
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">ลงทะเบียนอบรม</h1>
        </div>
      </header>

      <section className="py-12">
        <div className="container max-w-2xl">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>แบบฟอร์มลงทะเบียน</CardTitle>
              <CardDescription>กรุณากรอกข้อมูลของคุณเพื่อลงทะเบียนอบรม</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">ชื่อ *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="ชื่อ"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={createRegistration.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">นามสกุล *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="นามสกุล"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={createRegistration.isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={createRegistration.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="08xxxxxxxx"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={createRegistration.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseType">เลือกหลักสูตร *</Label>
                  <Select value={formData.courseType} onValueChange={(value) => handleSelectChange("courseType", value)} disabled={createRegistration.isPending}>
                    <SelectTrigger id="courseType">
                      <SelectValue placeholder="เลือกหลักสูตร" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseTypes.map(course => (
                        <SelectItem key={course.value} value={course.value}>
                          {course.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainingDate">วันที่อบรม *</Label>
                  <Select value={formData.trainingDate} onValueChange={(value) => handleSelectChange("trainingDate", value)} disabled={createRegistration.isPending}>
                    <SelectTrigger id="trainingDate">
                      <SelectValue placeholder="เลือกวันที่อบรม" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainingDates.map(date => (
                        <SelectItem key={date} value={date}>
                          {new Date(date).toLocaleDateString("th-TH", { 
                            year: "numeric", 
                            month: "long", 
                            day: "numeric" 
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfParticipants">จำนวนผู้เข้าอบรม *</Label>
                  <Input
                    id="numberOfParticipants"
                    name="numberOfParticipants"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.numberOfParticipants}
                    onChange={handleChange}
                    required
                    disabled={createRegistration.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุเพิ่มเติม</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="หมายเหตุเพิ่มเติม (ไม่บังคับ)"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    disabled={createRegistration.isPending}
                  />
                </div>

                <div className="space-y-4 rounded-lg bg-secondary p-4">
                  <div className="flex justify-between text-sm">
                    <span>ราคาต่อคน:</span>
                    <span className="font-semibold">
                      {formData.courseType ? `${coursePrices[formData.courseType]?.toLocaleString("th-TH")} บาท` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>จำนวนผู้เข้าอบรม:</span>
                    <span className="font-semibold">{formData.numberOfParticipants} คน</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold">ราคารวม:</span>
                    <span className="text-lg font-bold text-accent">
                      {totalPrice.toLocaleString("th-TH")} บาท
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/">
                    <Button type="button" variant="outline" className="flex-1" disabled={createRegistration.isPending}>
                      ยกเลิก
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.courseType || !formData.trainingDate || createRegistration.isPending}
                  >
                    {createRegistration.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังประมวลผล...
                      </>
                    ) : (
                      "ไปชำระเงิน"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
