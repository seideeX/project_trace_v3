import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Activity,
    ArrowUpRight,
    Banknote,
    Building2,
    CheckCircle2,
    Clock3,
    FileCheck2,
    FileText,
    FolderKanban,
    Layers,
    Plus,
    Route,
    TrendingUp,
    Waypoints,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreatePRModal from "@/Pages/Procurement/Partials/CreatePRModal";

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    CartesianGrid,
    Cell,
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// Modern Chart Palette
const PIE_COLORS = ["#10B981", "#F59E0B", "#6366F1", "#EC4899", "#8B5CF6"];

export default function Dashboard({ departments = {}, dashboardData = {} }) {
    const { auth, flash } = usePage().props;

    const breadcrumbs = [
        {
            label: "Dashboard",
            showOnMobile: true,
        },
    ];

    const user = auth?.user;
    const [showCreateModal, setShowCreateModal] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Dashboard Data Destructuring
    |--------------------------------------------------------------------------
    */
    const {
        stats = {},
        statusSummary = [],
        stageDistribution = [],
        departmentWorkload = [],
        endUserDistribution = [],
        procurementModes = [],
        monthlyTrend = [],
        monthlyCompleted = [],
        routeSummary = [],
        recentProcurements = [],
        largestProcurements = [],
    } = dashboardData;

    /*
    |--------------------------------------------------------------------------
    | Form Handling
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

    const handleCreatePR = (e) => {
        e.preventDefault();

        post(route("procurement.store"), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Procurement created successfully.");
                setShowCreateModal(false);
                reset();
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
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    /*
    |--------------------------------------------------------------------------
    | Formatters
    |--------------------------------------------------------------------------
    */
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(Number(value ?? 0));
    };

    const formatNumber = (value) => {
        return Number(value ?? 0).toLocaleString();
    };

    const stageChartData = stageDistribution.map((item) => ({
        ...item,
        name: `Stage ${item.stage}`,
    }));

    /*
    |--------------------------------------------------------------------------
    | Custom Recharts Tooltip Component
    |--------------------------------------------------------------------------
    */
    const ChartTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;

        return (
            <div className="rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">
                <p className="mb-1 text-xs font-semibold text-slate-500">
                    {label}
                </p>
                {payload.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 text-sm font-bold text-slate-800"
                    >
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{
                                backgroundColor:
                                    item.color || item.fill || "#3b82f6",
                            }}
                        />
                        <span>
                            {item.name}:{" "}
                            {typeof item.value === "number"
                                ? item.value.toLocaleString()
                                : item.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Admin Dashboard" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-[1800px] space-y-8">
                    {/* =====================================================
                        HEADER SECTION
                    ====================================================== */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                <Layers className="h-3.5 w-3.5" />
                                Procurement Operations
                            </span>

                            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                Procurement Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Real-time analytics on budget allocation,
                                progress metrics, and department throughput.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                        >
                            <Waypoints className="h-4 w-4 stroke-[2.5]" />
                            Route Purchase Request
                        </button>
                    </div>

                    {/* =====================================================
                        PRIMARY STAT CARDS
                    ====================================================== */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Total Procurements"
                            value={formatNumber(stats.total)}
                            description="All recorded PR items"
                            icon={FolderKanban}
                            iconBg="bg-blue-50 text-blue-600 ring-blue-500/20"
                        />

                        <StatCard
                            title="In Progress"
                            value={formatNumber(stats.inProgress)}
                            description="Currently undergoing routing"
                            icon={Clock3}
                            iconBg="bg-amber-50 text-amber-600 ring-amber-500/20"
                        />

                        <StatCard
                            title="Completed"
                            value={formatNumber(stats.completed)}
                            description={`${stats.completionRate ?? 0}% overall efficiency`}
                            icon={CheckCircle2}
                            iconBg="bg-emerald-50 text-emerald-600 ring-emerald-500/20"
                        />

                        <StatCard
                            title="Total ABC"
                            value={formatCurrency(stats.totalBudget)}
                            description="Approved budget allocation"
                            icon={Banknote}
                            iconBg="bg-indigo-50 text-indigo-600 ring-indigo-500/20"
                        />
                    </div>

                    {/* =====================================================
                        SECONDARY SUMMARY STRIP
                    ====================================================== */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            icon={FileCheck2}
                            label="Completed Budget"
                            value={formatCurrency(stats.completedBudget)}
                            badgeColor="text-emerald-600 bg-emerald-50"
                        />
                        <SummaryCard
                            icon={Activity}
                            label="Active Budget"
                            value={formatCurrency(stats.inProgressBudget)}
                            badgeColor="text-amber-600 bg-amber-50"
                        />
                        <SummaryCard
                            icon={Route}
                            label="Total Routes"
                            value={formatNumber(stats.totalRoutes)}
                            badgeColor="text-blue-600 bg-blue-50"
                        />
                        <SummaryCard
                            icon={TrendingUp}
                            label="Completion Rate"
                            value={`${stats.completionRate ?? 0}%`}
                            badgeColor="text-indigo-600 bg-indigo-50"
                        />
                    </div>

                    {/* =====================================================
                        PROCUREMENT TREND
                    ====================================================== */}
                    <DashboardCard
                        title="Procurement Activity Trend"
                        description="Monthly volume vs budget baseline"
                        icon={TrendingUp}
                    >
                        <div className="h-[340px] w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={monthlyTrend}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorTotal"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#3B82F6"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#3B82F6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E2E8F0"
                                    />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748B" }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#64748B" }}
                                    />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        name="Procurements"
                                        stroke="#2563EB"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>

                    {/* =====================================================
                        STATUS & STAGES GRID
                    ====================================================== */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        {/* Status Breakdown */}
                        <DashboardCard
                            title="Procurement Status"
                            description="Status distribution ratio"
                            icon={Activity}
                        >
                            <div className="h-[260px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusSummary}
                                            dataKey="value"
                                            nameKey="label"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={6}
                                        >
                                            {statusSummary.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            PIE_COLORS[
                                                                index %
                                                                    PIE_COLORS.length
                                                            ]
                                                        }
                                                        stroke="none"
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip content={<ChartTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-3">
                                {statusSummary.map((item, index) => (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        PIE_COLORS[
                                                            index %
                                                                PIE_COLORS.length
                                                        ],
                                                }}
                                            />
                                            <p className="text-xs font-semibold text-slate-500">
                                                {item.label}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xl font-bold text-slate-800">
                                            {formatNumber(item.value)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>

                        {/* Stage Breakdown */}
                        <div className="xl:col-span-2">
                            <DashboardCard
                                title="Procurement by Stage"
                                description="Pipeline load across routing stages"
                                icon={FileText}
                            >
                                <div className="h-[340px] w-full pt-4">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={stageChartData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#E2E8F0"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 11,
                                                    fill: "#64748B",
                                                }}
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 11,
                                                    fill: "#64748B",
                                                }}
                                            />
                                            <Tooltip
                                                content={<ChartTooltip />}
                                            />
                                            <Bar
                                                dataKey="total"
                                                name="Procurements"
                                                fill="#3B82F6"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </DashboardCard>
                        </div>
                    </div>

                    {/* =====================================================
                        DEPARTMENT & PROCUREMENT MODES
                    ====================================================== */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {/* Workload */}
                        <DashboardCard
                            title="Current Department Workload"
                            description="Active queue assigned per department"
                            icon={Building2}
                        >
                            <div className="h-[360px] w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={departmentWorkload}
                                        layout="vertical"
                                        margin={{
                                            left: 10,
                                            right: 20,
                                            top: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                            stroke="#E2E8F0"
                                        />
                                        <XAxis
                                            type="number"
                                            allowDecimals={false}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="department"
                                            width={140}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 11,
                                                fill: "#475569",
                                                fontWeight: 500,
                                            }}
                                        />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Bar
                                            dataKey="total"
                                            name="Procurements"
                                            fill="#6366F1"
                                            radius={[0, 6, 6, 0]}
                                            barSize={18}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardCard>

                        {/* Procurement Modes */}
                        <DashboardCard
                            title="Procurement Modes"
                            description="Methods used for current acquisitions"
                            icon={FileText}
                        >
                            <div className="space-y-4 pt-1">
                                {procurementModes.slice(0, 7).map((item) => {
                                    const percentage =
                                        stats.total > 0
                                            ? (
                                                  (item.total / stats.total) *
                                                  100
                                              ).toFixed(1)
                                            : 0;

                                    return (
                                        <div
                                            key={item.mode}
                                            className="group space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition">
                                                    {item.mode}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">
                                                        {item.total}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        ({percentage}%)
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all duration-500 group-hover:bg-blue-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>

                                            <p className="text-[11px] font-medium text-slate-400">
                                                Subtotal Budget:{" "}
                                                <span className="text-slate-600 font-semibold">
                                                    {formatCurrency(
                                                        item.budget,
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </DashboardCard>
                    </div>

                    {/* =====================================================
                        END USER DISTRIBUTION
                    ====================================================== */}
                    <DashboardCard
                        title="End-User Department Allocations"
                        description="Originating request distribution and associated budget"
                        icon={Building2}
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {endUserDistribution.map((item) => (
                                <div
                                    key={item.department}
                                    className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                                >
                                    <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600">
                                        {item.department}
                                    </p>

                                    <div className="mt-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-2xl font-black text-slate-900">
                                                {formatNumber(item.total)}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-400">
                                                Procurements
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs font-bold text-blue-600">
                                                {formatCurrency(item.budget)}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Total Value
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>

                    {/* =====================================================
                        RECENT & LARGEST PROCUREMENTS
                    ====================================================== */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {/* Recent Procurements */}
                        <DashboardCard
                            title="Recent Procurements"
                            description="Latest registered PR requests"
                            icon={Clock3}
                        >
                            <div className="divide-y divide-slate-100">
                                {recentProcurements.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 py-3.5 transition hover:bg-slate-50/80 px-2 rounded-xl"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                                                    {item.pr_no}
                                                </span>
                                                <span className="truncate text-xs font-semibold text-slate-800">
                                                    {item.project_title}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-medium text-slate-400">
                                                End-user:{" "}
                                                {item.end_user || "Unassigned"}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-xs font-bold text-slate-900">
                                                {formatCurrency(item.abc)}
                                            </p>
                                            <span className="inline-block mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {recentProcurements.length === 0 && (
                                    <EmptyData message="No recent procurements found." />
                                )}
                            </div>
                        </DashboardCard>

                        {/* Largest Procurements */}
                        <DashboardCard
                            title="Highest-Value Procurements"
                            description="Top budget allocations"
                            icon={Banknote}
                        >
                            <div className="divide-y divide-slate-100">
                                {largestProcurements.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 py-3.5 transition hover:bg-slate-50/80 px-2 rounded-xl"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                                                    {item.pr_no}
                                                </span>
                                                <span className="truncate text-xs font-semibold text-slate-800">
                                                    {item.project_title}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-medium text-slate-400">
                                                {item.end_user || "Unassigned"}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-extrabold text-blue-600">
                                                {formatCurrency(item.abc)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {largestProcurements.length === 0 && (
                                    <EmptyData message="No procurement data available." />
                                )}
                            </div>
                        </DashboardCard>
                    </div>

                    {/* =====================================================
                        CREATE PR MODAL
                    ====================================================== */}
                    <CreatePRModal
                        departments={departments}
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreatePR}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                    />
                </div>
            </div>
        </MainLayout>
    );
}

/*
|--------------------------------------------------------------------------
| REUSABLE CARD WRAPPER
|--------------------------------------------------------------------------
*/
function DashboardCard({ title, description, icon: Icon, children }) {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-slate-900">
                        {title}
                    </h3>
                    {description && (
                        <p className="mt-0.5 text-xs font-medium text-slate-400">
                            {description}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200/60">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| STAT CARD COMPONENT
|--------------------------------------------------------------------------
*/
function StatCard({ title, value, description, icon: Icon, iconBg }) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {title}
                    </p>
                    <p className="text-3xl font-black tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${iconBg}`}
                >
                    <Icon className="h-6 w-6 stroke-[2]" />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>{description}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-500" />
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| SUMMARY STRIP CARD
|--------------------------------------------------------------------------
*/
function SummaryCard({ icon: Icon, label, value, badgeColor }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3.5">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${badgeColor}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-400">
                        {label}
                    </p>
                    <p className="text-base font-bold text-slate-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| EMPTY DATA FALLBACK
|--------------------------------------------------------------------------
*/
function EmptyData({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs font-medium text-slate-400">{message}</p>
        </div>
    );
}
