export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white h-screen w-full">{children}</div>;
}