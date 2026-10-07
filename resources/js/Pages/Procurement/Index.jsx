import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    ArrowRightIcon,
    CheckCircle2Icon,
    Clock3Icon,
    GitBranchIcon,
    InboxIcon,
    SendIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import CreatePRModal from "@/Pages/Procurement/Partials/CreatePRModal";
import ProcurementDashboardHeader from "@/Components/Header";
import ProcurementRegistry from "./ProcurementRegistry";

export default function Dashboard({
    procurements,
    stats,
    latestRoutes,
    user,
    departments,
}) {
    const { auth, flash } = usePage().props;

    const breadcrumbs = [
        {
            label: "Dashboard",
            showOnMobile: true,
        },
    ];

    const [showCreateModal, setShowCreateModal] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Create Procurement Form
    |--------------------------------------------------------------------------
    */
    const { data, setData, post, processing, errors, reset } = useForm({
        pr_no: "",
        project_title: "",
        end_user: user?.department_id ?? "",
        abc: "",
        mode_of_procurement: "Small Value Procurement (Sec. 53.9)",
        date_of_implementation: "",
        purpose: "",
        documents: [],
    });

    /*
    |--------------------------------------------------------------------------
    | Create Procurement
    |--------------------------------------------------------------------------
    */
    const handleCreatePR = (e) => {
        e.preventDefault();

        post(route("procurement.store"), {
            forceFormData: true,

            onSuccess: () => {
                toast.success("Procurement created successfully.");

                setShowCreateModal(false);

                reset();

                setData("end_user", user?.department_id ?? "");
            },

            onError: (errors) => {
                const firstError = Object.values(errors)[0];

                toast.error(
                    Array.isArray(firstError) ? firstError[0] : firstError,
                );
            },
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Flash Messages
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    /*
    |--------------------------------------------------------------------------
    | Route Helpers
    |--------------------------------------------------------------------------
    */
    const getRouteIcon = (action) => {
        const value = action?.toLowerCase();

        if (value?.includes("forward")) {
            return <SendIcon size={16} />;
        }

        if (value?.includes("receive")) {
            return <InboxIcon size={16} />;
        }

        if (value?.includes("complete")) {
            return <CheckCircle2Icon size={16} />;
        }

        return <GitBranchIcon size={16} />;
    };

    const formatAction = (action) => {
        if (!action) return "Routing activity";

        return action
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="relative flex-1 overflow-x-hidden overflow-y-auto">
                {/*
                |--------------------------------------------------------------------------
                | Background Atmosphere
                |--------------------------------------------------------------------------
                */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

                    <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

                    <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/5 blur-3xl" />
                </div>

                <div className="relative p-4 sm:p-6 lg:p-7">
                    <div className="mx-auto max-w-[1800px] space-y-7">
                        {/*
                        |--------------------------------------------------------------------------
                        | Welcome / Dashboard Introduction
                        |--------------------------------------------------------------------------
                        */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/55 px-6 py-5 shadow-[0_8px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-7">
                            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

                            <div className="relative">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                                            Procurement Workspace
                                        </p>

                                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                            Welcome back,{" "}
                                            {user?.name?.split(" ")[0] ??
                                                "User"}
                                        </h1>

                                        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
                                            Monitor your procurement records,
                                            track routing activity, and manage
                                            items requiring your attention.
                                        </p>
                                    </div>

                                    {user?.department && (
                                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3.5 py-2 text-xs font-semibold text-blue-700 backdrop-blur-md">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            {user.department}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/*
                        |--------------------------------------------------------------------------
                        | KPI Header
                        |--------------------------------------------------------------------------
                        */}

                        <ProcurementDashboardHeader
                            stats={stats}
                            canCreate={["admin"].includes(auth.user?.role)}
                            createLabel="Route PR"
                            onCreate={() => setShowCreateModal(true)}
                        />

                        {/*
                        |--------------------------------------------------------------------------
                        | Main Dashboard Grid
                        |--------------------------------------------------------------------------
                        */}
                        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
                            {/*
                            |--------------------------------------------------------------------------
                            | Procurement Registry
                            |--------------------------------------------------------------------------
                            */}
                            <section className="min-w-0">
                                <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/65 shadow-[0_10px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl">
                                    <div className="border-b border-slate-200/70 px-5 py-5 sm:px-6">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <GitBranchIcon
                                                            size={18}
                                                        />
                                                    </div>

                                                    <h2 className="text-base font-bold text-slate-900">
                                                        My Procurement Records
                                                    </h2>
                                                </div>

                                                <p className="mt-2 text-sm text-slate-500">
                                                    Procurement records
                                                    currently assigned to your
                                                    department.
                                                </p>
                                            </div>

                                            <div className="rounded-full border border-slate-200/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-500">
                                                {procurements?.total ?? 0}{" "}
                                                records
                                            </div>
                                        </div>
                                    </div>

                                    <ProcurementRegistry
                                        showFilters={false}
                                        procurements={procurements}
                                        user={user}
                                    />
                                </div>
                            </section>

                            {/*
                            |--------------------------------------------------------------------------
                            | Latest Routing Activity
                            |--------------------------------------------------------------------------
                            */}
                            <aside>
                                <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-sm backdrop-blur-xl">
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <Clock3Icon size={17} />
                                            </div>

                                            <div>
                                                <h2 className="text-sm font-bold text-slate-900">
                                                    Recent Activity
                                                </h2>

                                                <p className="text-[11px] text-slate-400">
                                                    Latest routing
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                                            {latestRoutes?.length ?? 0}
                                        </span>
                                    </div>

                                    {/* Activities */}
                                    {latestRoutes?.length > 0 ? (
                                        <div className="divide-y divide-slate-100">
                                            {latestRoutes.map((route) => (
                                                <div
                                                    key={route.id}
                                                    className="px-5 py-3.5 transition hover:bg-white/70"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Icon */}
                                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                            {getRouteIcon(
                                                                route.action,
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="truncate text-xs font-bold text-blue-600">
                                                                    {
                                                                        route.pr_no
                                                                    }
                                                                </p>

                                                                <span className="shrink-0 text-[10px] text-slate-400">
                                                                    {formatDate(
                                                                        route.updated_at,
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                                                                {
                                                                    route.project_title
                                                                }
                                                            </p>

                                                            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                                                                <span className="max-w-[110px] truncate">
                                                                    {route.from_department ??
                                                                        "—"}
                                                                </span>

                                                                <ArrowRightIcon
                                                                    size={11}
                                                                    className="shrink-0 text-slate-300"
                                                                />

                                                                <span className="max-w-[110px] truncate font-medium text-slate-700">
                                                                    {route.to_department ??
                                                                        "—"}
                                                                </span>
                                                            </div>

                                                            <div className="mt-1">
                                                                <span className="text-[10px] font-semibold text-slate-400">
                                                                    {formatAction(
                                                                        route.action,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-5 py-10 text-center">
                                            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                                                <Clock3Icon size={20} />
                                            </div>

                                            <p className="text-xs font-semibold text-slate-600">
                                                No recent activity
                                            </p>

                                            <p className="mt-1 text-[11px] text-slate-400">
                                                Routing activity will appear
                                                here.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

            {/*
            |--------------------------------------------------------------------------
            | Create Procurement Modal
            |--------------------------------------------------------------------------
            */}
            <CreatePRModal
                isOpen={showCreateModal}
                departments={departments}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreatePR}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                user={user}
            />
        </MainLayout>
    );
}
