import AppShell from "@/components/AppShell";

export default function WorkplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
