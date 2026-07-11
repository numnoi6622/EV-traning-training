import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchEmail, setSearchEmail] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      setLocation("/");
    }
  }, [user, setLocation]);

  const { data: registrations, isLoading, refetch } = trpc.registration.list.useQuery();
  
  const updateStatus = trpc.registration.updatePaymentStatus.useMutation({
    onSuccess: () => {
      toast.success("อัปเดตสถานะสำเร็จ");
      refetch();
    },
    onError: () => toast.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ")
  });

  const handleApprove = (id: number) => {
    updateStatus.mutate({ id, status: "completed" });
  };

  const deleteRegistration = trpc.registration.delete.useMutation({
    onSuccess: () => {
      toast.success("ลบข้อมูลสำเร็จ");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  });

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ ${name}?`)) {
      deleteRegistration.mutate(id);
    }
  };

  const courseTypeLabels: Record<string, string> = {
    repair: "ช่างซ่อมรถไฟฟ้า",
    charging: "ช่างติดตั้งตู้ชาร์จ",
    users: "ผู้สนใจรถไฟฟ้า",
  };

  const paymentStatusLabels: Record<string, string> = {
    unpaid: "ยังไม่ชำระเงิน",
    pending: "รอยืนยันสลิป",
    completed: "ชำระเงินแล้ว",
    failed: "ชำระเงินล้มเหลว",
  };

  const paymentStatusColors: Record<string, string> = {
    unpaid: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-gray-100 text-gray-800",
  };

  const filteredRegistrations = registrations?.filter((reg: any) => {
    const matchEmail = reg.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchCourse = filterCourse === "all" || reg.courseType === filterCourse;
    return matchEmail && matchCourse;
  }) || [];

  const stats = {
    total: registrations?.length || 0,
    unpaid: registrations?.filter((r: any) => r.paymentStatus === "unpaid").length || 0,
    pending: registrations?.filter((r: any) => r.paymentStatus === "pending").length || 0,
    completed: registrations?.filter((r: any) => r.paymentStatus === "completed").length || 0,
  };

  const handleExportExcel = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("ไม่มีข้อมูลให้ส่งออก");
      return;
    }

    const rows = registrations.map((reg: any) => ({
      "ชื่อ": reg.firstName,
      "นามสกุล": reg.lastName,
      "อีเมล": reg.email,
      "เบอร์โทร": reg.phone,
      "หลักสูตร": courseTypeLabels[reg.courseType],
      "วันที่อบรม": new Date(reg.trainingDate).toLocaleDateString("th-TH"),
      "จำนวนคน": reg.numberOfParticipants,
      "ราคารวม": reg.totalPrice,
      "สถานะชำระเงิน": paymentStatusLabels[reg.paymentStatus],
      "ที่อยู่ออกใบเสร็จ": reg.billingAddress || "-",
      "หมายเหตุ": reg.notes || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `registrations-${new Date().toISOString().split("T")[0]}.xlsx`);
    
    toast.success("ส่งออกข้อมูล Excel สำเร็จ");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ระบบจัดการการลงทะเบียน</h1>
          <p className="text-muted-foreground">ตรวจสอบและจัดการการลงทะเบียนอบรมรถไฟฟ้า</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">ทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">การลงทะเบียนทั้งหมด</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">ยังไม่ชำระเงิน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.unpaid}</div>
              <p className="text-xs text-muted-foreground mt-1">รออัพโหลดสลิป</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">รอยืนยัน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">รอตรวจสอบสลิป</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">ชำระเงินแล้ว</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">ชำระเงินสำเร็จ</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>ตัวกรอง</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ค้นหาอีเมล</label>
                <Input
                  placeholder="ค้นหาอีเมล..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">หลักสูตร</label>
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="repair">ช่างซ่อมรถไฟฟ้า</SelectItem>
                    <SelectItem value="charging">ช่างติดตั้งตู้ชาร์จ</SelectItem>
                    <SelectItem value="users">ผู้สนใจรถไฟฟ้า</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleExportExcel}
                  className="w-full bg-[#107c41] hover:bg-[#107c41]/90 gap-2 text-white"
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4" />
                  ส่งออก Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>รายการลงทะเบียน</CardTitle>
            <CardDescription>
              แสดง {filteredRegistrations.length} จาก {stats.total} รายการ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                ไม่พบข้อมูลการลงทะเบียน
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>ชื่อ-นามสกุล</TableHead>
                      <TableHead>อีเมล</TableHead>
                      <TableHead>เบอร์โทร</TableHead>
                      <TableHead>หลักสูตร</TableHead>
                      <TableHead>วันที่อบรม</TableHead>
                      <TableHead className="text-right">จำนวนคน</TableHead>
                      <TableHead className="text-right">ราคารวม</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>ที่อยู่ออกใบเสร็จ</TableHead>
                      <TableHead>จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((reg: any) => (
                      <TableRow key={reg.id} className="border-border">
                        <TableCell className="font-medium">
                          {reg.firstName} {reg.lastName}
                        </TableCell>
                        <TableCell className="text-sm">{reg.email}</TableCell>
                        <TableCell className="text-sm">{reg.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-secondary">
                            {courseTypeLabels[reg.courseType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(reg.trainingDate).toLocaleDateString("th-TH")}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {reg.numberOfParticipants}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {reg.totalPrice.toLocaleString("th-TH")} บาท
                        </TableCell>
                        <TableCell>
                          <Badge className={paymentStatusColors[reg.paymentStatus]}>
                            {paymentStatusLabels[reg.paymentStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {reg.billingAddress || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2 items-start">
                            {reg.paymentSlipUrl && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs" 
                                onClick={() => setPreviewImage(reg.paymentSlipUrl!)}
                              >
                                ดูสลิป
                              </Button>
                            )}
                            {reg.paymentStatus === "pending" && (
                              <Button 
                                size="sm" 
                                className="w-full text-xs bg-green-600 hover:bg-green-700 text-white" 
                                onClick={() => handleApprove(reg.id)} 
                                disabled={updateStatus.isPending}
                              >
                                ยืนยันชำระเงิน
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-full text-xs gap-1" 
                              onClick={() => handleDelete(reg.id, `${reg.firstName} ${reg.lastName}`)}
                              disabled={deleteRegistration.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                              ลบ
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" 
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            alt="Payment Slip Preview" 
            className="max-w-full max-h-full object-contain rounded-md" 
          />
          <Button 
            variant="destructive" 
            className="absolute top-4 right-4" 
            onClick={() => setPreviewImage(null)}
          >
            ปิดหน้าต่าง
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
