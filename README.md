# Tauri + React Starter

[中文](./README.zh.md)

A minimal **Tauri v2 + React 19 + Vite + Tailwind/Shadcn** template. All business logic has been removed; the skeleton keeps theme/language switching, a custom title bar, and tuned Toast/Dialog styles so you can start desktop + frontend development quickly.

![Screenshot of the application](preview.jpg)

## Features
- **Custom Title Bar**: Drag support, window controls, theme toggle with view transitions, language switch.
- **Light/Dark + i18n**: `ThemeProvider` and `i18next` wired with English/Chinese sample texts.
- **Navigation Ready**: React Router v6 configured with `HashRouter` and a sample layout.
- **UI Ready**: Tailwind + Shadcn component set (buttons, cards, dialogs, tabs, toast styles via `sonner`).
- **Tauri Backend**: `ping` command sample and `tauri-plugin-log` pre-configured for debug logging.

## Development
```bash
pnpm install          # install deps
pnpm dev              # web dev mode
pnpm tauri dev        # run Tauri app (frontend + backend)
pnpm build            # build web
pnpm tauri build      # package desktop app
```

## Structure
- `src/`: Frontend source.
  - `App.tsx`: Main layout component (TitleBar + Nav + Outlet).
  - `pages/`: Application pages (`Home.tsx`, `Demo.tsx`).
  - `components/CustomTitleBar.tsx`: Custom window chrome implementation.
  - `components/ui/`: Shadcn components.
  - `lib/i18n.ts`: i18n setup.
- `src-tauri/`: Backend source.
  - `src/lib.rs`: Command handlers (`ping`) and plugin setup.
  - `tauri.conf.json`: Project configuration.

## Next steps
- Add new routes in `src/main.tsx` and create pages in `src/pages/`.
- Update navigation links in `src/App.tsx`.
- Add commands/plugins in `src-tauri/src/lib.rs` and call them via `invoke`.
- Reuse the shipped Shadcn/Tailwind styles.
