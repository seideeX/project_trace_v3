import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import CreatePRModal from "@/Pages/Procurement/Partials/CreatePRModal";
import ProcurementRegistry from "@/Pages/Procurement/ProcurementRegistry";
import ProcurementDashboardHeader from "@/Components/Header";

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
                    <ProcurementDashboardHeader
                        onCreate={() => setShowCreateModal(true)}
                        canCreate={user?.role !== "user"}
                    />

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
