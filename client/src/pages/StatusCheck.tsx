import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Search, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function StatusCheck() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialPhone = searchParams.get("phone") || "";
  
  const [phone, setPhone] = useState(initialPhone);
  const [searchPhone, setSearchPhone] = useState(initialPhone);
  const [hasSearched, setHasSearched] = useState(!!initialPhone);

  const { data: registration, isLoading, isError, error, refetch } = trpc.registration.checkStatus.useQuery(
    { phone: searchPhone },
    { 
      enabled: hasSearched && !!searchPhone,
      retry: false
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }
    setSearchPhone(phone);
    setHasSearched(true);
    refetch();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unpaid":
        return <Badge variant="destructive" className="bg-red-500"><AlertCircle className="w-3 h-3 mr-1" /> ยังไม่ชำระเงิน</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" /> รอยืนยันการชำระเงิน</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> ชำระเงินเรียบร้อย</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> ยกเลิก/ไม่สำเร็จ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้าแรก
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">ตรวจสอบสถานะการลงทะเบียน</h1>
        </div>
      </header>

      <section className="py-12">
        <div className="container max-w-md mx-auto">
          <Card className="border-border bg-card shadow-lg mb-8">
            <CardHeader>
              <CardTitle>ตรวจสอบสถานะ</CardTitle>
              <CardDescription>กรอกเบอร์โทรศัพท์ที่คุณใช้ลงทะเบียนเพื่อดูสถานะ</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="เบอร์โทรศัพท์ 10 หลัก"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="ml-2">ค้นหา</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {hasSearched && (
            <div>
              {isLoading && (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
              
              {isError && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="p-6 text-center text-red-600">
                    <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{error?.message || "ไม่พบข้อมูลการลงทะเบียน"}</p>
                    <Link href="/register">
                      <Button variant="link" className="mt-2 text-red-600">ลงทะเบียนใหม่คลิกที่นี่</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {registration && (
                <Card className="border-border bg-card overflow-hidden">
                  <div className="bg-primary/10 p-4 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold text-lg">ข้อมูลผู้ลงทะเบียน</h3>
                    {getStatusBadge(registration.paymentStatus)}
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div className="text-muted-foreground">ชื่อ-นามสกุล</div>
                      <div className="font-medium text-right">{registration.firstName} {registration.lastName}</div>
                      
                      <div className="text-muted-foreground">หลักสูตร</div>
                      <div className="font-medium text-right">
                        {registration.courseType === "repair" ? "ช่างซ่อมรถไฟฟ้า" : 
                         registration.courseType === "charging" ? "ช่างติดตั้งตู้ชาร์จ" : "ผู้สนใจรถไฟฟ้า"}
                      </div>
                      
                      <div className="text-muted-foreground">วันที่อบรม</div>
                      <div className="font-medium text-right">{registration.trainingDate}</div>
                      
                      <div className="text-muted-foreground">จำนวนผู้เข้าอบรม</div>
                      <div className="font-medium text-right">{registration.numberOfParticipants} ท่าน</div>
                      
                      <div className="text-muted-foreground">ยอดชำระเงิน</div>
                      <div className="font-bold text-right text-lg text-primary">{registration.totalPrice.toLocaleString()} บาท</div>

                      {registration.billingAddress && (
                        <>
                          <div className="text-muted-foreground">ที่อยู่ออกใบเสร็จ</div>
                          <div className="font-medium text-right break-words">{registration.billingAddress}</div>
                        </>
                      )}
                    </div>

                    {registration.paymentStatus === "unpaid" && (
                      <div className="pt-4 border-t border-border mt-4">
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg mb-4 text-sm text-yellow-800 dark:text-yellow-200">
                          <AlertCircle className="w-4 h-4 inline mr-2 -mt-1" />
                          คุณยังไม่ได้ชำระเงิน กรุณาชำระเงินเพื่อยืนยันสิทธิ์การเข้าร่วมอบรม
                        </div>
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => setLocation(`/payment?phone=${registration.phone}`)}
                        >
                          ไปหน้าชำระเงินและอัพโหลดสลิป
                        </Button>
                      </div>
                    )}
                    
                    {registration.paymentStatus === "pending" && (
                      <div className="pt-4 border-t border-border mt-4">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200 text-center">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-70" />
                          <p>ระบบได้รับสลิปการโอนเงินของคุณแล้ว</p>
                          <p className="font-medium mt-1">เจ้าหน้าที่จะตรวจสอบและยืนยันภายใน 24 ชั่วโมง</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
