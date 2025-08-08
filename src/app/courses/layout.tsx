import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="container py-6">
        <Breadcrumbs />
      </div>
      <main>{children}</main>
    </div>
  );
}
