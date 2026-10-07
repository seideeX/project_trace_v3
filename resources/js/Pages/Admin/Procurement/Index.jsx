import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import CreatePRModal from "@/Pages/Procurement/Partials/CreatePRModal";
import ProcurementRegistry from "@/Pages/Procurement/ProcurementRegistry";
import ProcurementDashboardHeader from "@/Components/Header";
import { FileSpreadsheet, Plus } from "lucide-react";

export default function Index({ departments, procurements, queryParams }) {
    const { auth, flash } = usePage().props;

    const user = auth?.user;

    const breadcrumbs = [
        {
            label: "Procurement Registry",
            showOnMobile: true,
        },
    ];

    const [showCreateModal, setShowCreateModal] = useState(false);

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

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <MainLayout>
            <Head title="Procurement Registry" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
                <div className="w-full space-y-6">
                    {/* Procurement Header */}

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                                    <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                                    Procurement Tracking System
                                </h1>
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                                Monitor and manage procurement requests from
                                purchase request preparation through completion.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 active:translate-y-0"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Route PR</span>
                        </button>
                    </div>

                    {/* Procurement Registry */}
                    <ProcurementRegistry
                        queryParams={queryParams}
                        procurements={procurements}
                        departments={departments}
                        user={user}
                    />

                    {/* Create Procurement Modal */}
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
