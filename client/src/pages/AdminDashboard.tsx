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
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchEmail, setSearchEmail] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      setLocation("/");
    }
  }, [user, setLocation]);

  const { data: registrations, isLoading } = trpc.registration.list.useQuery();

  const courseTypeLabels: Record<string, string> = {
    repair: "ช่างซ่อมรถไฟฟ้า",
    charging: "ช่างติดตั้งตู้ชาร์จ",
    users: "ผู้สนใจรถไฟฟ้า",
  };

  const paymentStatusLabels: Record<string, string> = {
    pending: "รอชำระเงิน",
    completed: "ชำระเงินแล้ว",
    failed: "ชำระเงินล้มเหลว",
  };

  const paymentStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  const filteredRegistrations = registrations?.filter((reg: any) => {
    const matchEmail = reg.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchCourse = filterCourse === "all" || reg.courseType === filterCourse;
    return matchEmail && matchCourse;
  }) || [];

  const stats = {
    total: registrations?.length || 0,
    pending: registrations?.filter((r: any) => r.paymentStatus === "pending").length || 0,
    completed: registrations?.filter((r: any) => r.paymentStatus === "completed").length || 0,
  };

  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("ไม่มีข้อมูลให้ส่งออก");
      return;
    }

    const headers = ["ชื่อ", "นามสกุล", "อีเมล", "เบอร์โทร", "หลักสูตร", "วันที่อบรม", "จำนวนคน", "ราคารวม", "สถานะชำระเงิน"];
    const rows = registrations.map((reg: any) => [
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone,
      courseTypeLabels[reg.courseType],
      new Date(reg.trainingDate).toLocaleDateString("th-TH"),
      reg.numberOfParticipants,
      reg.totalPrice,
      paymentStatusLabels[reg.paymentStatus],
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("ส่งออกข้อมูลสำเร็จ");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ระบบจัดการการลงทะเบียน</h1>
          <p className="text-muted-foreground">ตรวจสอบและจัดการการลงทะเบียนอบรมรถไฟฟ้า</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">รอชำระเงิน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">ยังไม่ชำระเงิน</p>
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
                  onClick={handleExportCSV}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4" />
                  ส่งออก CSV
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
