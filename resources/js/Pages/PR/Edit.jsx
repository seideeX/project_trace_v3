import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import InputField from "@/Components/InputField";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FileText, Layers, Loader2, Package, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const emptyItem = () => ({
    stock_property_no: "",
    unit: "",
    item_description: "",
    quantity: "",
    unit_cost: "",
    total_cost: "",
});

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(Number(value ?? 0));

// "2026-10-13T16:00:00Z" -> "2026-10-14" (Manila), the format <input type="date"> needs
const toDateInput = (value) =>
    value
        ? new Date(value).toLocaleDateString("en-CA", {
              timeZone: "Asia/Manila",
          })
        : "";

// null/undefined -> "" so inputs stay controlled
const str = (value) => value ?? "";

export default function Edit({ purchaseRequest }) {
    const { flash } = usePage().props;

    const breadcrumbs = [
        {
            label: "Purchase Requests",
            href: route("purchase-request.index"),
            showOnMobile: false,
        },
        {
            label: purchaseRequest.pr_no || `PR #${purchaseRequest.id}`,
            href: route("purchase-request.show", purchaseRequest.id),
            showOnMobile: false,
        },
        {
            label: "Edit",
            showOnMobile: true,
        },
    ];

    const existingItems = (purchaseRequest.items ?? []).map((item) => ({
        id: item.id,
        stock_property_no: str(item.stock_property_no),
        unit: str(item.unit),
        item_description: str(item.item_description),
        quantity: str(item.quantity),
        unit_cost: str(item.unit_cost),
        total_cost: str(item.total_cost),
    }));

    const { data, setData, put, processing, errors } = useForm({
        // Basic PR information
        pr_date: toDateInput(purchaseRequest.pr_date),
        entity_name: str(purchaseRequest.entity_name),
        fund_cluster: str(purchaseRequest.fund_cluster),
        office_section: str(purchaseRequest.office_section),
        responsibility_center_code: str(
            purchaseRequest.responsibility_center_code,
        ),

        // Purpose / program
        purpose: str(purchaseRequest.purpose),
        program_title: str(purchaseRequest.program_title),
        fund_source: str(purchaseRequest.fund_source),
        sub_aro_no: str(purchaseRequest.sub_aro_no),

        // Implementation
        implementation_date: str(purchaseRequest.implementation_date),
        focal_person: str(purchaseRequest.focal_person),

        // Planning references
        ar_atc_no: str(purchaseRequest.ar_atc_no),
        with_wafp: Boolean(purchaseRequest.with_wafp),
        included_in_app: Boolean(purchaseRequest.included_in_app),
        included_in_ppmp: Boolean(purchaseRequest.included_in_ppmp),

        // Signatories (sections are hidden, same as Create)
        requested_by_name: str(purchaseRequest.requested_by_name),
        requested_by_designation: str(purchaseRequest.requested_by_designation),
        recommended_by_name: str(purchaseRequest.recommended_by_name),
        recommended_by_designation: str(
            purchaseRequest.recommended_by_designation,
        ),
        approved_by_name: str(purchaseRequest.approved_by_name),
        approved_by_designation: str(purchaseRequest.approved_by_designation),

        // Budget certification (hidden, same as Create)
        certified_allotment: str(purchaseRequest.certified_allotment),
        certified_by_name: str(purchaseRequest.certified_by_name),
        certified_by_designation: str(purchaseRequest.certified_by_designation),

        items: existingItems.length ? existingItems : [emptyItem()],
    });

    /* Flash messages -> toasts */
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleChange = (e) => setData(e.target.name, e.target.value);

    const updateItem = (index, field, value) => {
        const items = data.items.map((item, i) => {
            if (i !== index) return item;
            const updated = { ...item, [field]: value };

            const qty = parseFloat(updated.quantity);
            const cost = parseFloat(updated.unit_cost);
            updated.total_cost =
                !isNaN(qty) && !isNaN(cost) ? (qty * cost).toFixed(2) : "";

            return updated;
        });
        setData("items", items);
    };

    const addItem = () => setData("items", [...data.items, emptyItem()]);

    const removeItem = (index) => {
        if (data.items.length === 1) return;
        setData(
            "items",
            data.items.filter((_, i) => i !== index),
        );
    };

    const totalAmount = data.items.reduce(
        (sum, i) => sum + (parseFloat(i.total_cost) || 0),
        0,
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("purchase-request.update", purchaseRequest.id), {
            onError: (errors) => {
                const firstError = Object.values(errors)[0];

                toast.error("Unable to update Purchase Request", {
                    description: Array.isArray(firstError)
                        ? firstError[0]
                        : firstError || "Please check the form and try again.",
                });
            },
        });
    };

    /* Helper to keep field markup short */
    const field = (name, label, props = {}) => (
        <Field error={errors[name]}>
            <InputField
                label={label}
                name={name}
                value={data[name]}
                onChange={handleChange}
                {...props}
            />
        </Field>
    );

    return (
        <MainLayout>
            <Head
                title={`Edit ${purchaseRequest.pr_no ?? "Purchase Request"}`}
            />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto w-full max-w-[1200px] space-y-6"
                >
                    {/* HEADER */}
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            <Layers className="h-3.5 w-3.5" />
                            Procurement Operations
                        </span>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                            Edit Purchase Request
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Updating{" "}
                            <span className="font-semibold text-slate-700">
                                {purchaseRequest.pr_no}
                            </span>
                            . Changes are saved to this request only.
                        </p>
                    </div>

                    {/* PR INFORMATION */}
                    <FormCard
                        icon={FileText}
                        title="Purchase Request Information"
                        description="Header details found at the top of the PR form."
                    >
                        <div className="space-y-7">
                            <FieldGroup label="Identification">
                                <div className="sm:col-span-2">
                                    {field("entity_name", "Entity Name", {
                                        required: true,
                                    })}
                                </div>
                                {field("pr_date", "Date", {
                                    type: "date",
                                    required: true,
                                })}
                            </FieldGroup>

                            <FieldGroup label="Office & Fund">
                                {field("office_section", "Office/Section", {
                                    placeholder: "e.g. DRRM",
                                })}
                                {field("fund_cluster", "Fund Cluster", {
                                    placeholder: "e.g. MOOE",
                                })}
                                {field(
                                    "responsibility_center_code",
                                    "Responsibility Center Code",
                                )}
                            </FieldGroup>

                            <FieldGroup label="Purpose & Program">
                                <div className="sm:col-span-2 lg:col-span-3">
                                    {field("purpose", "Purpose", {
                                        isTextarea: true,
                                        rows: 3,
                                        placeholder:
                                            "e.g. Meals and snacks of awardees and attendees of the ...",
                                    })}
                                </div>
                                {field("program_title", "Program Title", {
                                    placeholder: "e.g. PPA 229",
                                })}
                                {field("fund_source", "Fund Source", {
                                    placeholder: "e.g. BPLP",
                                })}
                                {field("sub_aro_no", "Sub-ARO No.", {
                                    placeholder: "e.g. RO-2-25-01602",
                                })}
                            </FieldGroup>

                            <FieldGroup label="Implementation">
                                {field(
                                    "implementation_date",
                                    "Implementation Date",
                                    { placeholder: "e.g. 2026 February" },
                                )}
                                {field("focal_person", "Focal Person")}
                            </FieldGroup>

                            <FieldGroup label="Planning References">
                                {field("ar_atc_no", "AR/ATC No.")}
                                <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-3">
                                    <CheckboxField
                                        label="With WAFP"
                                        name="with_wafp"
                                        checked={data.with_wafp}
                                        onChange={setData}
                                    />
                                    <CheckboxField
                                        label="Included in APP"
                                        name="included_in_app"
                                        checked={data.included_in_app}
                                        onChange={setData}
                                    />
                                    <CheckboxField
                                        label="Included in PPMP"
                                        name="included_in_ppmp"
                                        checked={data.included_in_ppmp}
                                        onChange={setData}
                                    />
                                </div>
                            </FieldGroup>
                        </div>
                    </FormCard>

                    {/* ITEMS */}
                    <FormCard
                        icon={Package}
                        title="Items"
                        description={`${data.items.length} ${
                            data.items.length === 1 ? "item" : "items"
                        } · Total ${formatCurrency(totalAmount)}`}
                        action={
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                            >
                                <Plus className="h-4 w-4 stroke-[2.5]" />
                                Add Item
                            </button>
                        }
                    >
                        <div className="space-y-4">
                            {errors.items && (
                                <p className="text-xs font-medium text-red-600">
                                    {errors.items}
                                </p>
                            )}

                            {data.items.map((item, index) => (
                                <div
                                    key={item.id ?? `new-${index}`}
                                    className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-[11px] font-bold text-blue-600">
                                                {index + 1}
                                            </span>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Item {index + 1}
                                            </span>
                                        </div>

                                        {data.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                                aria-label={`Remove item ${index + 1}`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <Field
                                            error={
                                                errors[
                                                    `items.${index}.stock_property_no`
                                                ]
                                            }
                                        >
                                            <InputField
                                                label="Stock/Property No."
                                                name={`items.${index}.stock_property_no`}
                                                value={item.stock_property_no}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "stock_property_no",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>

                                        <Field
                                            error={
                                                errors[`items.${index}.unit`]
                                            }
                                        >
                                            <InputField
                                                label="Unit"
                                                name={`items.${index}.unit`}
                                                value={item.unit}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "unit",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Pax, pc, set"
                                            />
                                        </Field>

                                        <div className="sm:col-span-2 lg:col-span-3">
                                            <Field
                                                error={
                                                    errors[
                                                        `items.${index}.item_description`
                                                    ]
                                                }
                                            >
                                                <InputField
                                                    label="Item Description"
                                                    name={`items.${index}.item_description`}
                                                    value={
                                                        item.item_description
                                                    }
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "item_description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    isTextarea
                                                    rows={3}
                                                    placeholder="e.g. Catering Services (Breakfast, AM Snacks, Buffet Lunch, PM Snacks)"
                                                    required
                                                />
                                            </Field>
                                        </div>

                                        <Field
                                            error={
                                                errors[
                                                    `items.${index}.quantity`
                                                ]
                                            }
                                        >
                                            <InputField
                                                label="Quantity"
                                                name={`items.${index}.quantity`}
                                                type="number"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "quantity",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </Field>

                                        <Field
                                            error={
                                                errors[
                                                    `items.${index}.unit_cost`
                                                ]
                                            }
                                        >
                                            <InputField
                                                label="Unit Cost"
                                                name={`items.${index}.unit_cost`}
                                                type="number"
                                                step="0.01"
                                                value={item.unit_cost}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "unit_cost",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </Field>

                                        {/* Computed total (read-only display) */}
                                        <div>
                                            <p className="mb-1.5 text-sm font-medium text-slate-700">
                                                Total Cost
                                            </p>
                                            <div className="flex h-10 items-center justify-end rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold tabular-nums text-slate-800">
                                                {formatCurrency(
                                                    item.total_cost,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <Plus className="h-4 w-4" />
                                Add another item
                            </button>
                        </div>
                    </FormCard>

                    {/* ACTIONS */}
                    <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3 shadow-lg backdrop-blur-md">
                        <span className="text-xs font-semibold text-slate-500">
                            {data.items.length}{" "}
                            {data.items.length === 1 ? "item" : "items"} · Total{" "}
                            <span className="font-bold text-slate-900">
                                {formatCurrency(totalAmount)}
                            </span>
                        </span>

                        <div className="flex items-center gap-3">
                            <Link
                                href={route(
                                    "purchase-request.show",
                                    purchaseRequest.id,
                                )}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Save changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}

/*
|--------------------------------------------------------------------------
| LOCAL FORM PRIMITIVES (same as Create)
|--------------------------------------------------------------------------
*/
function FormCard({ icon: Icon, title, description, action, children }) {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
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
                {action}
            </div>
            {children}
        </div>
    );
}

function FieldGroup({ label, children }) {
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

function Field({ error, children }) {
    return (
        <div className="min-w-0">
            {children}
            {error && (
                <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
            )}
        </div>
    );
}

function CheckboxField({ label, name, checked, onChange }) {
    return (
        <label
            htmlFor={name}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
        >
            <input
                id={name}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(name, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            {label}
        </label>
    );
}
