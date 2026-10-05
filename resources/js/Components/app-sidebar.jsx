import { Link, usePage } from "@inertiajs/react";
import {
    CheckCircle2Icon,
    ChevronDownIcon,
    CalendarDaysIcon,
    Clock3Icon,
    FileTextIcon,
    HistoryIcon,
    HomeIcon,
    Layers3Icon,
    User,
    UserRoundCheckIcon,
    ArrowDownToLineIcon,
    ArrowUpFromLineIcon,
    Form,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarLogout } from "./SidebarLogout";

const navLinkBaseClass =
    "flex h-9 w-full items-center justify-start gap-2 rounded-2xl px-3.5 text-xs font-extrabold";

export function AppSidebar({ ...props }) {
    const page = usePage();

    const currentUrl = page.url;
    const user = page.props.auth.user;
    const incomingPRCount = page.props.incomingPRCount ?? 0;
    const isAdmin = user?.roles?.some((role) => role.name === "admin") ?? false;

    const isUser = user?.roles?.some((role) => role.name === "user") ?? false;

    const hasNoDepartment =
        user?.department_id === null || user?.department_id === undefined;
    const isAdminWithoutDepartment = isAdmin && hasNoDepartment;
    const userNavItems = [
        {
            title: "Dashboard",
            href: route("dashboard"),
            icon: HomeIcon,
            active: true,
        },
        {
            title: "Purchase Request Form",
            href: route("purchase-request.create"),
            icon: Form,
        },
        {
            title: "My Purchase Requests",
            href: route("purchase-request.index"),
            icon: Form,
        },
        {
            title: "My Procurements",
            href: route("procurement.index"),
            icon: Clock3Icon,
        },
        {
            title: "Incoming PRs",
            href: route("incoming.index"),
            icon: ArrowDownToLineIcon,

            // RED BADGE
            badge: incomingPRCount,
        },
        {
            title: "Outgoing PRs",
            href: route("outgoing.index"),
            icon: ArrowUpFromLineIcon,
        },
        {
            title: "Procurement History",
            href: route("route.index"),
            icon: HistoryIcon,
        },
        {
            title: "CAPA",
            href: route("capa.index"),
            icon: CalendarDaysIcon,
        },
    ];

    const adminNavItems = [
        {
            title: "Dashboard",
            href: route("admin.dashboard"),
            icon: HomeIcon,
            active: true,
        },
        {
            title: "Procurement Records",
            href: route("procurement.index"),
            icon: HistoryIcon,
        },
        ...(!isAdminWithoutDepartment
            ? [
                  {
                      title: "Incoming PRs",
                      href: route("incoming.index"),
                      icon: ArrowDownToLineIcon,
                      badge: incomingPRCount,
                  },
                  {
                      title: "Outgoing PRs",
                      href: route("outgoing.index"),
                      icon: ArrowUpFromLineIcon,
                  },
              ]
            : []),
        {
            title: "Routing History",
            href: route("route.index"),
            icon: HistoryIcon,
        },

        // Only available to admins without a department
        ...(isAdmin && hasNoDepartment
            ? [
                  {
                      title: "User Management",
                      href: route("user.index"),
                      icon: User,
                  },
              ]
            : []),

        {
            title: "CAPA",
            href: route("capa.index"),
            icon: CalendarDaysIcon,
        },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;
    return (
        <Sidebar
            variant="sidebar"
            className="border-r border-slate-100 bg-white [--sidebar:#ffffff] [--sidebar-accent:#eff6ff] [--sidebar-accent-foreground:#1d4ed8] [--sidebar-border:#e2e8f0] [--sidebar-foreground:#334155] [--sidebar-primary:#1d4ed8] [--sidebar-primary-foreground:#ffffff]"
            {...props}
        >
            <SidebarHeader className="border-b border-slate-100 px-5.5 py-3.5">
                <Link
                    href={route("dashboard")}
                    className="flex items-center gap-2.5"
                >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
                        <Layers3Icon className="size-5" strokeWidth={2.35} />
                    </span>
                    <span className="text-xl font-extrabold leading-none tracking-normal text-blue-700">
                        Project Trace
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-3 pt-6">
                <SidebarMenu className="w-full gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            item.href !== "#" &&
                            currentUrl.split("?")[0] ===
                                new URL(item.href, window.location.origin)
                                    .pathname;

                        return (
                            <SidebarMenuItem
                                key={item.title}
                                className="w-full"
                            >
                                <Link
                                    href={item.href}
                                    className={
                                        isActive
                                            ? `${navLinkBaseClass} bg-blue-700 text-white shadow-lg shadow-blue-700/25 [&_svg]:text-white`
                                            : `${navLinkBaseClass} text-slate-700 hover:bg-blue-50 hover:text-blue-700 [&_svg]:text-slate-400`
                                    }
                                >
                                    <Icon
                                        className="size-4"
                                        strokeWidth={2.05}
                                    />
                                    <span className="min-w-0 truncate">
                                        {item.title}
                                    </span>

                                    {/* INCOMING PR BADGE */}
                                    {item.badge > 0 ? (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-extrabold text-white shadow-sm shadow-red-500/30">
                                            {item.badge > 99
                                                ? "99+"
                                                : item.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="px-3.5 pb-4">
                <SidebarLogout />
            </SidebarFooter>
        </Sidebar>
    );
}
