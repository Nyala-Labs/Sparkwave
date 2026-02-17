"use client";
import { cn } from "@/libs/utils";
import {
  ArrowLeftCircle,
  Calendar,
  CalendarCheck,
  CalendarClockIcon,
  CalendarHeart,
  Hammer,
  Home,
  Lightbulb,
  Sidebar,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const DashboardLinks = [
  {
    label: "Home",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/dashboard/events",
  },
];
const EventLinks = (slug: string) => [
  {
    label: "Events",
    icon: ArrowLeftCircle,
    href: "/dashboard/events",
  },
  {
    label: "Overview",
    icon: Calendar,
    href: `/dashboard/events/${slug}`,
  },
  {
    label: "Ideation",
    icon: Lightbulb,
    href: `/dashboard/events/${slug}/ideation`,
  },
  {
    label: "Prototype",
    icon: Hammer,
    href: `/dashboard/events/${slug}/prototype`,
  },
  {
    label: "Production",
    icon: Trophy,
    href: `/dashboard/events/${slug}/production`,
  },
  {
    label: "Pre-Event",
    icon: CalendarClockIcon,
    href: `/dashboard/events/${slug}/pre-event`,
  },
  {
    label: "Event",
    icon: CalendarHeart,
    href: `/dashboard/events/${slug}/event`,
  },

  {
    label: "Post-Event",
    icon: CalendarCheck,
    href: `/dashboard/events/${slug}/post-event`,
  },
];
const SidebarLinks = () => {
  const pathName = usePathname();
  console.log(`/dashboard/events/${pathName.split("/")[3]}/ideation`);
  return (
    <>
      {pathName.startsWith("/dashboard/events/")
        ? EventLinks(pathName.split("/")[3]).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  `is-drawer-close:tooltip is-drawer-close:tooltip-right`,
                  pathName == link.href
                    ? "bg-primary text-primary-content"
                    : "",
                )}
                data-tip={link.label}
              >
                <link.icon className="size-4 " />
                <span className="is-drawer-close:hidden">{link.label}</span>
              </Link>
            </li>
          ))
        : DashboardLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  `is-drawer-close:tooltip is-drawer-close:tooltip-right`,
                  pathName == link.href
                    ? "bg-primary text-primary-content"
                    : "",
                )}
                data-tip={link.label}
              >
                <link.icon className="size-4 " />
                <span className="is-drawer-close:hidden">{link.label}</span>
              </Link>
            </li>
          ))}

      <li className="self-end mt-auto mb-5">
        <label htmlFor="my-drawer-4" aria-label="open sidebar">
          <Sidebar className="size-4" />
        </label>
      </li>
    </>
  );
};

export default SidebarLinks;
