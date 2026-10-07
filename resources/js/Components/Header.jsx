import {
    FileSpreadsheet,
    Plus,
    ClockIcon,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";

export default function ProcurementDashboardHeader({
    title = "Procurement Tracking System",
    description = "Monitor and manage procurement requests from purchase request preparation through completion.",
    badge = null,
    stats = null,
    onCreate = null,
    createLabel = "Create New PR",
    canCreate,
}) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                            {title}
                        </h1>

                        {badge && (
                            <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                {badge}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>

                {canCreate && onCreate && (
                    <button
                        type="button"
                        onClick={onCreate}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 active:translate-y-0"
                    >
                        <Plus className="h-4 w-4" />
                        <span>{createLabel}</span>
                    </button>
                )}
            </div>

            {/* KPI Cards — only rendered when stats are provided */}
            {stats && <StatsGrid stats={stats} />}
        </div>
    );
}

function StatsGrid({ stats }) {
    const cards = [
        {
            key: "total",
            title: "Total Procurement Requests",
            value: stats.total ?? 0,
            description: "Across all procurement stages",
            icon: "FileSpreadsheet",
            color: "blue",
        },
        {
            key: "myQueue",
            title: "My Current Queue",
            value: stats.myQueue ?? 0,
            description: "Requests requiring your action",
            icon: "ClockIcon",
            color: "amber",
            highlight: (stats.myQueue ?? 0) > 0,
        },
        {
            key: "inProgress",
            title: "In Progress",
            value: stats.inProgress ?? 0,
            description: "Active procurement requests",
            icon: "TrendingUp",
            color: "purple",
        },
        {
            key: "completed",
            title: "Completed",
            value: stats.completed ?? 0,
            description: "Successfully finalized requests",
            icon: "CheckCircle2",
            color: "emerald",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.key} {...card} />
            ))}
        </div>
    );
}

function StatCard({
    title,
    value,
    description,
    icon,
    color = "blue",
    highlight = false,
}) {
    const colors = {
        blue: {
            icon: "bg-blue-100 text-blue-600",
            border: "border-blue-100",
        },
        amber: {
            icon: "bg-amber-100 text-amber-600",
            border: "border-amber-100",
        },
        purple: {
            icon: "bg-purple-100 text-purple-600",
            border: "border-purple-100",
        },
        emerald: {
            icon: "bg-emerald-100 text-emerald-600",
            border: "border-emerald-100",
        },
    };

    const icons = {
        FileSpreadsheet,
        ClockIcon,
        TrendingUp,
        CheckCircle2,
    };

    const Icon = icons[icon];
    const style = colors[color];

    return (
        <div
            className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                highlight
                    ? `${style.border} ring-1 ring-amber-100`
                    : "border-slate-100"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {title}
                    </p>

                    <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-800">
                        {value}
                    </h3>
                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.icon}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <p className="mt-2 text-[10px] font-medium text-slate-400">
                {description}
            </p>
        </div>
    );
}
