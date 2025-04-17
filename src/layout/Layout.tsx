interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <div className="flex flex-col h-screen w-full">{children}</div>;
}
