import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Check,
    FileText,
    Layers,
    MessageSquare,
    Package,
    Pencil,
    X,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

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

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(Number(value ?? 0));

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Manila",
          })
        : "—";

const formatDateTime = (value) =>
    value
        ? new Date(value).toLocaleString("en-PH", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: "Asia/Manila",
          })
        : "—";

const itemTotal = (item) =>
    item.total_cost != null && item.total_cost !== ""
        ? Number(item.total_cost)
        : (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0);

export default function Show({ purchaseRequest }) {
    const { flash } = usePage().props;

    const breadcrumbs = [
        {
            label: "Purchase Requests",
            href: route("purchase-request.index"),
            showOnMobile: false,
        },
        {
            label: purchaseRequest.pr_no || `PR #${purchaseRequest.id}`,
            showOnMobile: true,
        },
    ];

    /* Flash messages -> toasts */
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const items = purchaseRequest.items ?? [];
    const totalAmount = items.length
        ? items.reduce((sum, item) => sum + itemTotal(item), 0)
        : Number(purchaseRequest.amount ?? 0);

    // Show full history if the backend sends it, otherwise just the latest entry
    const feedbacks = purchaseRequest.feedbacks?.length
        ? purchaseRequest.feedbacks
        : purchaseRequest.latest_feedback
          ? [purchaseRequest.latest_feedback]
          : [];

    // Only drafts are editable. Adjust to match your backend policy.
    const canEdit = purchaseRequest.status === "draft";

    return (
        <MainLayout>
            <Head title={`Purchase Request ${purchaseRequest.pr_no ?? ""}`} />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-[1200px] space-y-6">
                    {/* HEADER */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                <Layers className="h-3.5 w-3.5" />
                                Procurement Operations
                            </span>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                    {purchaseRequest.pr_no}
                                </h1>
                                <span
                                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${
                                        STATUS_STYLES[purchaseRequest.status] ??
                                        "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {purchaseRequest.status}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                                Dated {formatDate(purchaseRequest.pr_date)}
                                {purchaseRequest.requested_by?.name &&
                                    ` · Requested by ${purchaseRequest.requested_by.name}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={route("purchase-request.index")}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>

                            {canEdit && (
                                <Link
                                    href={route(
                                        "purchase-request.edit",
                                        purchaseRequest.id,
                                    )}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* PR INFORMATION */}
                    <DetailCard
                        icon={FileText}
                        title="Purchase Request Information"
                        description="Header details found at the top of the PR form."
                    >
                        <div className="space-y-7">
                            <DetailGroup label="Identification">
                                <div className="sm:col-span-2">
                                    <Detail
                                        label="Entity Name"
                                        value={purchaseRequest.entity_name}
                                    />
                                </div>
                                <Detail
                                    label="Date"
                                    value={formatDate(purchaseRequest.pr_date)}
                                />
                            </DetailGroup>

                            <DetailGroup label="Office & Fund">
                                <Detail
                                    label="Office/Section"
                                    value={purchaseRequest.office_section}
                                />
                                <Detail
                                    label="Fund Cluster"
                                    value={purchaseRequest.fund_cluster}
                                />
                                <Detail
                                    label="Responsibility Center Code"
                                    value={
                                        purchaseRequest.responsibility_center_code
                                    }
                                />
                            </DetailGroup>

                            <DetailGroup label="Purpose & Program">
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <Detail
                                        label="Purpose"
                                        value={purchaseRequest.purpose}
                                        multiline
                                    />
                                </div>
                                <Detail
                                    label="Program Title"
                                    value={purchaseRequest.program_title}
                                />
                                <Detail
                                    label="Fund Source"
                                    value={purchaseRequest.fund_source}
                                />
                                <Detail
                                    label="Sub-ARO No."
                                    value={purchaseRequest.sub_aro_no}
                                />
                            </DetailGroup>

                            <DetailGroup label="Implementation">
                                <Detail
                                    label="Implementation Date"
                                    value={purchaseRequest.implementation_date}
                                />
                                <Detail
                                    label="Focal Person"
                                    value={purchaseRequest.focal_person}
                                />
                            </DetailGroup>

                            <DetailGroup label="Planning References">
                                <Detail
                                    label="AR/ATC No."
                                    value={purchaseRequest.ar_atc_no}
                                />
                                <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-3">
                                    <FlagBadge
                                        label="With WAFP"
                                        active={purchaseRequest.with_wafp}
                                    />
                                    <FlagBadge
                                        label="Included in APP"
                                        active={purchaseRequest.included_in_app}
                                    />
                                    <FlagBadge
                                        label="Included in PPMP"
                                        active={
                                            purchaseRequest.included_in_ppmp
                                        }
                                    />
                                </div>
                            </DetailGroup>
                        </div>
                    </DetailCard>

                    {/* ITEMS */}
                    <DetailCard
                        icon={Package}
                        title="Items"
                        description={`${items.length} ${
                            items.length === 1 ? "item" : "items"
                        } · Total ${formatCurrency(totalAmount)}`}
                    >
                        {items.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-medium text-slate-400">
                                No items were added to this purchase request.
                            </p>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                                <table className="w-full min-w-[720px] text-left">
                                    <thead className="bg-slate-50/80">
                                        <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            <th className="w-12 px-4 py-3">
                                                #
                                            </th>
                                            <th className="w-[16%] px-4 py-3">
                                                Stock/Property No.
                                            </th>
                                            <th className="w-[10%] px-4 py-3">
                                                Unit
                                            </th>
                                            <th className="px-4 py-3">
                                                Item Description
                                            </th>
                                            <th className="w-[10%] px-4 py-3 text-right">
                                                Qty
                                            </th>
                                            <th className="w-[14%] px-4 py-3 text-right">
                                                Unit Cost
                                            </th>
                                            <th className="w-[14%] px-4 py-3 text-right">
                                                Total Cost
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {items.map((item, index) => (
                                            <tr
                                                key={item.id ?? index}
                                                className="align-top"
                                            >
                                                <td className="px-4 py-3 text-xs font-bold text-blue-600">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-700">
                                                    {item.stock_property_no ||
                                                        "—"}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-700">
                                                    {item.unit || "—"}
                                                </td>
                                                <td className="whitespace-pre-line px-4 py-3 text-xs font-medium text-slate-800">
                                                    {item.item_description ||
                                                        "—"}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs font-medium tabular-nums text-slate-700">
                                                    {Number(
                                                        item.quantity ?? 0,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs font-medium tabular-nums text-slate-700">
                                                    {formatCurrency(
                                                        item.unit_cost,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs font-bold tabular-nums text-slate-800">
                                                    {formatCurrency(
                                                        itemTotal(item),
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t border-slate-200 bg-slate-50/80">
                                            <td
                                                colSpan={6}
                                                className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500"
                                            >
                                                Grand total
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-extrabold tabular-nums text-slate-900">
                                                {formatCurrency(totalAmount)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </DetailCard>

                    {/* FEEDBACK */}
                    <DetailCard
                        icon={MessageSquare}
                        title="Feedback"
                        description="Review comments from Procurement."
                    >
                        {feedbacks.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-medium text-slate-400">
                                No feedback yet. Comments will appear here once
                                Procurement reviews this request.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {feedbacks.map((fb) => (
                                    <li
                                        key={fb.id}
                                        className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4"
                                    >
                                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${
                                                    FEEDBACK_STYLES[
                                                        fb.action
                                                    ] ??
                                                    "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {fb.action}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-400">
                                                {formatDateTime(fb.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700">
                                            {fb.feedback}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </DetailCard>
                </div>
            </div>
        </MainLayout>
    );
}

/*
|--------------------------------------------------------------------------
| LOCAL DISPLAY PRIMITIVES (match the form primitives in Create/Edit)
|--------------------------------------------------------------------------
*/
function DetailCard({ icon: Icon, title, description, children }) {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                {Icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200/60">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
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
            </div>
            {children}
        </div>
    );
}

function DetailGroup({ label, children }) {
    return (
        <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </div>
    );
}

function Detail({ label, value, multiline = false }) {
    const isEmpty = value === null || value === undefined || value === "";

    return (
        <div className="min-w-0">
            <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
            <p
                className={`text-sm font-semibold ${
                    isEmpty ? "text-slate-300" : "text-slate-800"
                } ${multiline ? "whitespace-pre-line" : "break-words"}`}
            >
                {isEmpty ? "—" : value}
            </p>
        </div>
    );
}

function FlagBadge({ label, active }) {
    return (
        <div
            className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium ${
                active
                    ? "border-emerald-200 bg-emerald-50/60 text-emerald-700"
                    : "border-slate-200/80 bg-slate-50/60 text-slate-400"
            }`}
        >
            {active ? (
                <Check className="h-4 w-4 shrink-0" />
            ) : (
                <X className="h-4 w-4 shrink-0" />
            )}
            {label}
        </div>
    );
}
