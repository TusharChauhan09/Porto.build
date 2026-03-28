interface A4PreviewProps {
  children: React.ReactNode;
}

export function A4Preview({ children }: A4PreviewProps) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/30 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-xl border border-border overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
