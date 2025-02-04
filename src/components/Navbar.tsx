"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

import { CalendarCheck, Menu } from "lucide-react";
import Cart from "./Cart";
import { ModeToggle } from "./ModeToggle";
import { buttonVariants } from "./ui/button";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [

  {
    href: "/#sobremi",
    label: "Sobre mí",

  },
  {
    href: "/#howitworks",
    label: "¿Cómo funciona?",
  },
  {
    href: "/#esquemas",
    label: "Esquemas",
  },
  {
    href: "/#examples",
    label: "Ejemplos",
  },
  {
    href: "/temas",
    label: "Temas por bloque",
  },

  {
    href: "/#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              href="/"
              className="ml-2 font-bold text-xl flex text-primary"
            >

              Opo<span className="text-[#b985ab]">gacela</span>
            </a>
          </NavigationMenuItem>

          {/* mobile with error */}
          <div className="flex md:hidden">
            <ModeToggle />

            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >

                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    <a
                      href="/"
                      className="mx-auto font-bold text-xl flex text-primary"
                    >

                      Opo<span className="text-[#b985ab]">gacela</span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                 
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <Cart />
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};