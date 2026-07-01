import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Payment() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2");
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
      toast.error("กรุณากรอกข้อมูลบัตรให้ครบถ้วน");
      return;
    }

    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("เลขบัตรต้องมี 16 หลัก");
      return;
    }

    if (formData.cvv.length !== 3) {
      toast.error("CVV ต้องมี 3 หลัก");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("ชำระเงินสำเร็จ!");
      
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="border-border bg-card max-w-md w-full mx-4">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">ชำระเงินสำเร็จ!</h2>
              <p className="text-muted-foreground">ขอบคุณที่ลงทะเบียนอบรมรถไฟฟ้า</p>
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
              <CardTitle>ข้อมูลการชำระเงิน</CardTitle>
              <CardDescription>กรุณากรอกข้อมูลบัตรเครดิตของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">เลขบัตรเครดิต *</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength={19}
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">ชื่อเจ้าของบัตร *</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">วันหมดอายุ (MM/YY) *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="12/25"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      maxLength={5}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength={3}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-lg bg-secondary p-4">
                  <div className="text-sm">
                    <p className="text-muted-foreground">ยอดชำระเงิน</p>
                    <p className="text-2xl font-bold text-accent">0 บาท</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/register">
                    <Button type="button" variant="outline" className="flex-1" disabled={isProcessing}>
                      ยกเลิก
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังประมวลผล...
                      </>
                    ) : (
                      "ชำระเงิน"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  นี่คือเว็บไซต์สำหรับการทดสอบ ข้อมูลบัตรจะไม่ถูกบันทึก
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
