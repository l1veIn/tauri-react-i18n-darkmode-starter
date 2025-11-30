import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Palette, Sparkles, MonitorCog } from "lucide-react";
import { toast } from "sonner";
import type { GreetResponse } from "@/bindings/greet_response";

export default function HomePage() {
  const [pingMessage, setPingMessage] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [immersive, setImmersive] = useState(true);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handlePing = async () => {
    try {
      setIsCalling(true);
      const response = await invoke<GreetResponse>("ping", { name: "Starter" });
      setPingMessage(response.greeting);
    } catch (error) {
      setPingMessage(`error:${String(error)}`);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <Badge variant="secondary" className="uppercase tracking-wide">
          {t("app.badge")}
        </Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">{t("app.heading")}</h1>
          <p className="text-muted-foreground max-w-3xl">{t("app.subheading")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge>{t("app.stack.react")}</Badge>
          <Badge variant="outline">{t("app.stack.shadcn")}</Badge>
          <Badge variant="outline">{t("app.stack.tauri")}</Badge>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{t("sections.quickstart.title")}</CardTitle>
              <CardDescription>{t("sections.quickstart.desc")}</CardDescription>
            </div>
            <Sparkles className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-border/60 p-4 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">{t("sections.quickstart.theme.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("sections.quickstart.theme.desc")}</p>
            </div>
            <div className="space-y-3 rounded-lg border border-border/60 p-4 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">{t("sections.quickstart.layout.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("sections.quickstart.layout.desc")}</p>
            </div>
            <div className="space-y-3 rounded-lg border border-border/60 p-4 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">{t("sections.quickstart.components.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("sections.quickstart.components.desc")}</p>
            </div>
            <div className="space-y-3 rounded-lg border border-border/60 p-4 bg-card">
              <h3 className="text-sm font-medium text-muted-foreground">{t("sections.quickstart.tauri.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("sections.quickstart.tauri.desc")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{t("sections.settings.title")}</CardTitle>
              <CardDescription>{t("sections.settings.desc")}</CardDescription>
            </div>
            <Palette className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
              <div className="space-y-1">
                <p className="font-medium">{t("sections.settings.immersive.title")}</p>
                <p className="text-sm text-muted-foreground">{t("sections.settings.immersive.desc")}</p>
              </div>
              <Switch checked={immersive} onCheckedChange={setImmersive} aria-label="切换沉浸模式" />
            </div>
            <Separator />
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("sections.settings.ping.title")}</p>
              <Button onClick={handlePing} className="w-full sm:w-auto" disabled={isCalling}>
                {isCalling ? t("sections.settings.ping.loading") : t("sections.settings.ping.cta")}
              </Button>
              <div className="rounded-lg border border-border/60 bg-muted/50 p-3 text-sm min-h-[48px]">
                {pingMessage ?? t("sections.settings.ping.empty")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>{t("sections.cards.title")}</CardTitle>
            <CardDescription>{t("sections.cards.desc")}</CardDescription>
          </div>
          <MonitorCog className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {["sections.cards.items.decoupled", "sections.cards.items.lightweight", "sections.cards.items.extendable"].map((key) => (
            <div key={key} className="rounded-lg border border-border/60 p-4 bg-card">
              <h3 className="font-medium mb-1">{t(`${key}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`${key}.desc`)}</p>
            </div>
          ))}

          <div className="rounded-lg border border-border/60 p-4 bg-card md:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1">
                <p className="font-medium">{t("sections.cards.interactions.title")}</p>
                <p className="text-sm text-muted-foreground">{t("sections.cards.interactions.desc")}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast.success(t("sections.cards.interactions.toast"))}>
                  {t("sections.cards.interactions.toast_btn")}
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>{t("sections.cards.interactions.dialog_btn")}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("ui.dialog_title")}</DialogTitle>
                      <DialogDescription>{t("ui.dialog_desc")}</DialogDescription>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                      {t("sections.cards.interactions.dialog_body")}
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
