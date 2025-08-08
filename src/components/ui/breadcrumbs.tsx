"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href: string;
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbItems: BreadcrumbItem[] = pathSegments.map(
    (segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, href };
    }
  );

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4" />
              <Link
                href={item.href}
                className={`ml-2 ${
                  index === breadcrumbItems.length - 1
                    ? "text-foreground"
                    : "hover:text-primary"
                }`}
                aria-current={
                  index === breadcrumbItems.length - 1 ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
