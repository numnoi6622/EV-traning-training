import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2, CheckCircle, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseType: string;
  trainingDate: string;
  numberOfParticipants: number;
  totalPrice: number;
}

export default function Payment() {
  const [, setLocation] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [slipImage, setSlipImage] = useState<string | null>(null);

  const createRegistration = trpc.registration.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("ชำระเงินและลงทะเบียนสำเร็จ!");
      setTimeout(() => {
        setLocation("/");
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    },
  });

  useEffect(() => {
    const data = sessionStorage.getItem('registrationData');
    if (data) {
      setRegistrationData(JSON.parse(data));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSlipImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slipImage) {
      toast.error("กรุณาแนบหลักฐานการโอนเงิน (สลิป)");
      return;
    }

    if (!registrationData) {
      toast.error("ไม่พบข้อมูลการลงทะเบียน กรุณาทำรายการใหม่");
      return;
    }

    createRegistration.mutate({
      ...registrationData,
      courseType: registrationData.courseType as any,
      paymentSlipUrl: slipImage, // Send base64 image
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="border-border bg-card max-w-md w-full mx-4">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">บันทึกข้อมูลสำเร็จ!</h2>
              <p className="text-muted-foreground">รอการตรวจสอบและยืนยันจากเจ้าหน้าที่</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>กำลังกลับไปยังหน้าแรก...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/register">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับ
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">ชำระเงิน</h1>
        </div>
      </header>

      <section className="py-12">
        <div className="container max-w-2xl">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>แจ้งชำระเงิน</CardTitle>
              <CardDescription>กรุณาโอนเงินตามบัญชีด้านล่างและแนบหลักฐานการโอน</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Bank Account Info Mock */}
                <div className="p-6 bg-secondary/50 rounded-lg text-center space-y-4 border border-border">
                  <h3 className="font-semibold text-lg">ธนาคารกสิกรไทย</h3>
                  <p className="text-2xl font-mono tracking-widest font-bold">123-4-56789-0</p>
                  <p className="text-muted-foreground">ชื่อบัญชี: บจก. EV Training</p>
                </div>

                <div className="space-y-4 rounded-lg bg-secondary p-4">
                  <div className="text-sm">
                    <p className="text-muted-foreground">ยอดที่ต้องชำระ</p>
                    <p className="text-2xl font-bold text-accent">{registrationData?.totalPrice.toLocaleString('th-TH') || '0'} บาท</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slipImage">แนบสลิปโอนเงิน *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer relative">
                    <Input 
                      type="file" 
                      id="slipImage"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      disabled={createRegistration.isPending}
                    />
                    {slipImage ? (
                      <div className="space-y-4">
                        <img src={slipImage} alt="Payment Slip" className="max-h-64 mx-auto rounded shadow-sm" />
                        <p className="text-sm text-green-600 font-medium">แนบไฟล์สำเร็จ (คลิกเพื่อเปลี่ยนรูป)</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <UploadCloud className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">คลิกเพื่ออัปโหลดสลิป (รองรับรูปภาพ ไม่เกิน 2MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/register">
                    <Button type="button" variant="outline" className="flex-1" disabled={createRegistration.isPending}>
                      ยกเลิก
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!slipImage || createRegistration.isPending}
                  >
                    {createRegistration.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      "ยืนยันการชำระเงิน"
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
