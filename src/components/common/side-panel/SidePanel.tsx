import { useEffect, type FC, type ReactNode } from "react";

type SidePanelProps = {
  title: string;
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
};

export const SidePanel: FC<SidePanelProps> = ({ title, children, footer, onClose }) => {
  // 'Escape' 키를 누르면 패널이 닫히도록 하는 효과
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[110]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      
      {/* Panel */}
      <aside
        className="absolute right-0 top-0 h-full w-[420px] bg-[var(--color-background-main)] border-l border-[var(--color-text-placeholder)] dark:border-[var(--color-text-light)] shadow-xl animate-slide-in-right will-change-transform flex flex-col"
        role="dialog" aria-modal="true" aria-label={title}
      >
        <header className="p-6">
          <h3 className="text-2xl font-bold text-[var(--color-text-main)]">{title}</h3>
        </header>
        <main className="flex-1 overflow-y-auto px-6 pb-4">{children}</main>
        <footer className="p-6 pt-2 flex justify-end gap-2">{footer}</footer>
      </aside>
    </div>
  );
};