import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Gallery() {
  const imageCount = 136;
  const images = Array.from({ length: imageCount }, (_, i) => `/gallery/${i + 1}.jpg`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับหน้าหลัก
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">บรรยากาศงานอบรม</h1>
          </div>
        </div>
      </header>

      <section className="py-12">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">ประมวลภาพบรรยากาศ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ภาพบรรยากาศการอบรมเชิงปฏิบัติการ เทคโนโลยีรถไฟฟ้า (EV) 
              จากสถานที่จริง ทั้งภาคทฤษฎีและภาคปฏิบัติ
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((src, index) => (
              <Card key={index} className="overflow-hidden border-border bg-card group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0 relative aspect-square bg-secondary/50 flex items-center justify-center">
                  <a href={src} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                    <img 
                      src={src} 
                      alt={"บรรยากาศงานอบรม ภาพที่ " + (index + 1)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" size="icon" className="rounded-full bg-white/20 hover:bg-white/40 text-white border-0">
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
