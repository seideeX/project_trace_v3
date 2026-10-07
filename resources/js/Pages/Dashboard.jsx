import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    CheckCircle2Icon,
    Clock3Icon,
    FileTextIcon,
    PlusIcon,
    TrendingUpIcon,
    FilePlus2,
} from "lucide-react";
import { useState, useEffect } from "react";
import SidebarModal from "@/components/SidebarModal";
import CreatePRModal from "@/Pages/Procurement/Partials/CreatePRModal";
import { toast } from "sonner";
import ProcurementDashboardHeader from "@/Components/Header";
import ProcurementRegistry from "@/Pages/Procurement/ProcurementRegistry";

export default function Dashboard({
    departments,
    procurements,
    stats,
    queryParams,
}) {
    const { auth, flash } = usePage().props;
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const user = auth?.user;
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
            <Head title="Dashboard" />

            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-7">
                <div className="min-w-0 space-y-6">
                    {/* <pre>{JSON.stringify(procurements, undefined, 2)}</pre> */}
                    <ProcurementDashboardHeader
                        stats={stats}
                        canCreate={user?.role !== "user"}
                        onCreate={() => setShowCreateModal(true)}
                    />

                    <ProcurementRegistry
                        queryParams={queryParams}
                        procurements={procurements}
                        departments={departments}
                        user={user}
                    />
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
