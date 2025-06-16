"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu, Globe, Radio } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const upcomingElections = [
  {
    title: "Peru",
    href: "/elections/peru",
    description: "Upcoming presidential elections in Peru",
  },
  {
    title: "Colombia",
    href: "/elections/colombia",
    description: "Presidential and legislative elections in Colombia",
  },
  {
    title: "Bangladesh",
    href: "/elections/bangladesh",
    description: "General elections in Bangladesh",
  },
  {
    title: "Costa Rica",
    href: "/elections/costa-rica",
    description: "Municipal elections in Costa Rica",
  },
  {
    title: "Portugal",
    href: "/elections/portugal",
    description: "Legislative elections in Portugal",
  },
]

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [language, setLanguage] = React.useState("en")
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Section - Controls in top right corner */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-6 pr-0 relative h-28">
          {/* Controls positioned in absolute top right corner */}
          <div className="absolute top-3 right-6 flex items-center gap-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[85px] h-7 text-xs border-none bg-transparent px-2 py-1 focus:ring-0">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en" className="text-xs">English</SelectItem>
                <SelectItem value="es" className="text-xs">Español</SelectItem>
              </SelectContent>
            </Select>

            {/* Live Update Indicator */}
            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
              <Radio className="h-3 w-3" />
              <span className="text-[10px] font-medium">Live Updates</span>
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/about"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/about" ? "text-primary" : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Who We Are
                  </Link>
                  <Link
                    href="/mission"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/mission" ? "text-primary" : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Our Mission
                  </Link>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Elections</p>
                    {upcomingElections.map((election) => (
                      <Link
                        key={election.title}
                        href={election.href}
                        className="text-sm text-muted-foreground hover:text-primary pl-4"
                        onClick={() => setIsOpen(false)}
                      >
                        {election.title}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo and Title - Full width container */}
          <div className="max-w-[1400px] mx-auto flex items-center justify-between h-full">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-3xl font-bold text-primary">BD</span>
              </div>
              <div className="hidden md:flex flex-col">
                <h1 className="text-3xl font-semibold tracking-tight">Bolivia Election Dashboard</h1>
                <p className="text-base text-muted-foreground mt-1">Professional Election Monitoring System</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Section - Restored to previous state */}
      <div className="border-b border-t border-border/60 bg-slate-950/90">
        <div className="container mx-auto px-6">
          <NavigationMenu className="h-7">
            <NavigationMenuList className="flex justify-end gap-6">
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "text-sm font-medium px-3 py-0.5 hover:text-primary transition-colors",
                    pathname === "/about" ? "text-primary" : "text-foreground/80"
                  )}>
                    Who We Are
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/mission" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "text-sm font-medium px-3 py-0.5 hover:text-primary transition-colors",
                    pathname === "/mission" ? "text-primary" : "text-foreground/80"
                  )}>
                    Our Mission
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium px-3 py-0.5 hover:text-primary transition-colors data-[state=open]:text-primary bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                  Upcoming Elections
                </NavigationMenuTrigger>
                <NavigationMenuContent className="border border-border/60 shadow-lg bg-transparent">
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/95 backdrop-blur-sm rounded-md">
                    {upcomingElections.map((election) => (
                      <ListItem
                        key={election.title}
                        title={election.title}
                        href={election.href}
                      >
                        {election.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1.5">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem" 