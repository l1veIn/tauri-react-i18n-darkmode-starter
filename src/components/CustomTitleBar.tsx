import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { Minus, X, Maximize2, Minimize2, Activity, Sun, Moon, Languages } from "lucide-react";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const detectIsMac = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = (navigator as typeof navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? "";
  return /Mac|Darwin/.test(platform) || /Mac\sOS\sX/.test(ua);
};

interface CustomTitleBarProps {
  running?: boolean;
  title?: string;
}

export function CustomTitleBar({ running = false, title }: CustomTitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMac, setIsMac] = useState(() => detectIsMac());
  const [appWindow, setAppWindow] = useState<Window | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let cancelled = false;
    
    const setupWindow = async () => {
      try {
        const window = getCurrentWindow();
        setAppWindow(window);
        
        unlisten = await window.onResized(async () => {
          const maximized = await window.isMaximized();
          setIsMaximized(maximized);
        });

        const maximized = await window.isMaximized();
        setIsMaximized(maximized);
      } catch {
        // 在非 Tauri 环境中（如浏览器）忽略错误
      }

      if (!cancelled) {
        setIsMac(detectIsMac());
      }
    };

    setupWindow();
    
    return () => {
      unlisten?.();
      cancelled = true;
    };
  }, []);

  const handleMinimize = async () => {
    if (appWindow) await appWindow.minimize();
  };

  const handleMaximize = async () => {
    if (appWindow) await appWindow.toggleMaximize();
  };

  const handleClose = async () => {
    if (appWindow) await appWindow.close();
  };

  const toggleTheme = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    // 检查浏览器是否支持 View Transitions API
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    
    // 计算从点击位置到最远角落的距离，作为圆的半径
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      // 使用 flushSync 确保 DOM 在这里同步更新
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    // 等待伪元素准备好后执行动画
    await transition.ready;

    // 动画逻辑：裁剪路径从 0 扩大到全屏
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 500,
        easing: "ease-in-out",
        // 始终让新视图（在上层）进行扩散动画
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");
  };

  const displayTitle = title ?? t("app.title", "Starter Template");
  const paddingClass = isMac ? "pl-16 pr-4" : "px-4";
  const showWindowControls = !isMac;
  const titleContent = (
    <div className="flex items-center gap-3 group" data-tauri-drag-region>
      <div className={`relative flex items-center justify-center w-2 h-2 rounded-full transition-all duration-500 ${running ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-zinc-400 dark:bg-zinc-600"}`} data-tauri-drag-region>
        {running && <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" data-tauri-drag-region></div>}
      </div>
      
      <span 
        className="text-xs font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors"
        suppressHydrationWarning
        data-tauri-drag-region
      >
        {displayTitle}
      </span>

      {/* 分隔符 */}
      <div className="h-3 w-[1px] bg-border" data-tauri-drag-region></div>

      {/* 运行状态文字 */}
      <div className="flex items-center gap-1.5" data-tauri-drag-region>
        <Activity className={`w-3 h-3 ${running ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-600"}`} data-tauri-drag-region />
        <span 
          className={`text-[10px] uppercase font-bold tracking-wider ${running ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-600"}`}
          suppressHydrationWarning
          data-tauri-drag-region
        >
          {running ? t("app.status_online", "Online") : t("app.status_standby", "Standby")}
        </span>
      </div>
    </div>
  );

  return (
    <div 
      className="relative flex items-center justify-between h-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground select-none border-b border-border/40 transition-colors duration-300"
      data-tauri-drag-region
      onDoubleClick={!isMac ? handleMaximize : undefined}
    >
      {isMac && (
        <div 
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          data-tauri-drag-region
        >
          {titleContent}
        </div>
      )}

      {/* 左侧：应用图标和标题 */}
      <div 
        className={`flex items-center gap-4 flex-1 h-full ${paddingClass}`}
        data-tauri-drag-region
      >
        {!isMac && titleContent}
      </div>

      {/* 右侧：控制区域 */}
      <div className="flex items-center h-full" data-tauri-drag-region>
        
        {/* 语言切换 */}
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="h-full w-10 px-0 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
            title="Switch Language"
            data-tauri-drag-region="false"
        >
            <Languages className="h-[1.1rem] w-[1.1rem]" />
            <span className="sr-only">Switch Language</span>
        </Button>

        {/* 主题切换 (一键切换) */}
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="h-full w-10 px-0 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
            data-tauri-drag-region="false"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>

        {/* 窗口控制按钮 */}
        {showWindowControls && (
          <>
            {/* 分隔线 */}
            <div className="w-[1px] h-4 bg-border mx-1"></div>

            <Button
              variant="ghost"
              size="sm"
              className="h-full w-12 p-0 rounded-none hover:bg-zinc-200 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleMinimize}
              data-tauri-drag-region="false"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-full w-12 p-0 rounded-none hover:bg-zinc-200 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleMaximize}
              data-tauri-drag-region="false"
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-full w-12 p-0 rounded-none hover:bg-red-500 hover:text-white text-muted-foreground transition-all"
              onClick={handleClose}
              data-tauri-drag-region="false"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
