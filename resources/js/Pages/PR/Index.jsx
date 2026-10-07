import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import DynamicTable from "../../Components/DynamicTable";
import FilterToggle from "../../Components/FilterButtons/FillterToggle";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Briefcase,
    Eye,
    FileText,
    MessageSquare,
    Pencil,
    Printer,
    Trash2,
    User,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";

const STATUS_STYLES = {
    draft: "bg-slate-100 text-slate-600",
    submitted: "bg-blue-50 text-blue-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
};

const FEEDBACK_STYLES = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    returned: "bg-red-50 text-red-700",
};

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "Asia/Manila",
          })
        : "—";

const formatPeso = (value) =>
    `₱${Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function Dashboard({
    purchaseRequests,
    queryParams,
    isAdmin,
    departments,
}) {
    const { flash } = usePage().props;
    queryParams = queryParams || {};

    const breadcrumbs = [
        {
            label: "My Purchase Requests",
            showOnMobile: true,
        },
    ];

    // Works with both a plain array and a Laravel paginator ({ data, links, ... })
    const rows = Array.isArray(purchaseRequests)
        ? purchaseRequests
        : (purchaseRequests?.data ?? []);

    const handleView = (pr) => {
        router.get(route("purchase-request.show", pr.id));
    };
    const handlePrint = (pr) => {
        window.location.href = route("purchase-request.print", pr.id);
    };

    const handleEdit = (pr) => {
        router.get(route("purchase-request.edit", pr.id));
    };

    const handleDelete = (pr) => {
        if (
            !confirm(
                `Are you sure you want to delete Purchase Request ${pr.pr_no}?`,
            )
        ) {
            return;
        }

        router.delete(route("purchase-request.destroy", pr.id), {
            preserveScroll: true,
        });
    };

    const allColumns = [
        {
            key: "purchase_request",
            label: "PR Number & Purpose",
            className: "w-[28%] min-w-[260px]",
        },
        {
            key: "pr_date",
            label: "PR Date",
            className: "w-[11%] min-w-[110px]",
        },
        {
            key: "requested_by",
            label: "Requested By",
            className: "w-[15%] min-w-[150px]",
        },
        {
            key: "amount",
            label: "Amount",
            className: "w-[11%] min-w-[130px] text-right",
            cellClassName: "text-right",
        },
        {
            key: "status",
            label: "Status",
            className: "w-[10%] min-w-[100px]",
        },
        {
            key: "latest_feedback",
            label: "Latest Feedback",
            className: "w-[18%] min-w-[200px]",
        },
        {
            key: "actions",
            label: "Actions",
            className: "w-[12%] min-w-[150px] text-center",
            cellClassName: "text-center",
        },
    ];

    const columnRenderers = {
        purchase_request: (pr) => (
            <div className="flex items-start gap-2.5 min-w-0 w-full">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-slate-800">
                        {pr.pr_no}
                    </div>

                    <div
                        className="line-clamp-2 text-[11px] font-medium text-slate-500 mt-0.5"
                        title={pr.purpose}
                    >
                        {pr.purpose || "No purpose provided"}
                    </div>
                </div>
            </div>
        ),

        pr_date: (pr) => (
            <span className="text-xs font-medium text-slate-700">
                {formatDate(pr.pr_date)}
            </span>
        ),

        requested_by: (pr) => (
            <div className="flex items-center gap-2 min-w-0 w-full">
                <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                <span className="truncate text-xs font-medium text-slate-700">
                    {pr.requested_by?.name || "—"}
                </span>
            </div>
        ),

        amount: (pr) => (
            <div className="flex items-center justify-end w-full">
                <span className="text-xs font-semibold text-slate-700 tabular-nums">
                    {formatPeso(pr.amount)}
                </span>
            </div>
        ),

        status: (pr) => (
            <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold capitalize ${
                    STATUS_STYLES[pr.status] ?? "bg-slate-100 text-slate-600"
                }`}
            >
                {pr.status}
            </span>
        ),

        latest_feedback: (pr) => {
            const fb = pr.latest_feedback;

            if (!fb) {
                return <span className="text-xs text-slate-400">—</span>;
            }

            return (
                <div className="flex flex-col min-w-0 w-full gap-1">
                    <span
                        className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${
                            FEEDBACK_STYLES[fb.action] ??
                            "bg-slate-100 text-slate-600"
                        }`}
                    >
                        {fb.action}
                    </span>

                    <div className="flex items-start gap-1.5 text-[10px] text-slate-400">
                        <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />

                        <span className="line-clamp-2" title={fb.feedback}>
                            {fb.feedback}
                        </span>
                    </div>
                </div>
            );
        },

        actions: (pr) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: Eye,
                        onClick: () => handleView(pr),
                        className:
                            "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                    },
                    {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => handleEdit(pr),
                        className:
                            "text-blue-500 hover:bg-blue-50 hover:text-blue-600",
                    },
                    {
                        label: "Delete",
                        icon: Trash2,
                        onClick: () => handleDelete(pr),
                        className:
                            "text-red-500 hover:bg-red-50 hover:text-red-600",
                    },
                    ...(pr.status === "approved"
                        ? [
                              {
                                  label: "Print",
                                  icon: Printer,
                                  onClick: () => handlePrint(pr),
                                  className:
                                      "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
                              },
                          ]
                        : []),
                ]}
            />
        ),
    };

    return (
        <MainLayout>
            <Head title="My Purchase Requests" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                <div className="min-w-0 space-y-4">
                    {/* Page Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-bold text-slate-800">
                                    My Purchase Requests
                                </h1>
                                <p className="text-xs font-medium text-slate-500">
                                    Track the status and feedback of the
                                    purchase requests you submitted.
                                </p>
                            </div>
                        </div>
                    </div>

                    <FilterToggle
                        queryParams={queryParams}
                        visibleFilters={
                            isAdmin
                                ? ["pr_status", "date", "origin_department"]
                                : ["pr_status", "date"]
                        }
                        departments={departments}
                        clearRouteName="purchase-request.index"
                    />

                    <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-slate-100/80 bg-white/40 px-6 py-4">
                            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                <Briefcase className="h-4 w-4 text-blue-600" />
                                <span>My Purchase Requests</span>
                            </h2>
                        </div>

                        <DynamicTable
                            data={rows}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                            pagination={purchaseRequests}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
