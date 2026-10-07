// export const PROCUREMENT_STAGES = [
//     {
//         id: 1,
//         value: "stage_1",
//         label: "Preparation of Purchase Request",
//         name: "PR Preparation",
//         actor: "End-User Department",
//         department: "BAC Secretariat",
//         color: "from-blue-500 to-indigo-600",
//         docs: ["Purchase Request", "PPMP"],
//     },
//     {
//         id: 2,
//         value: "stage_2",
//         label: "Preparation of Request for Quotation",
//         name: "RFQ & Bidding",
//         actor: "BAC Secretariat",
//         department: "BAC Secretariat",
//         color: "from-indigo-500 to-purple-600",
//         docs: ["Request for Quotation", "Abstract of Bids"],
//     },
//     {
//         id: 3,
//         value: "stage_3",
//         label: "Preparation of Purchase Order",
//         name: "Purchase Order",
//         actor: "Procurement / Finance",
//         department: "Budget & Accounting",
//         color: "from-purple-500 to-pink-600",
//         docs: [
//             "Purchase Order",
//             "Notice of Award (NOA)",
//             "Notice to Proceed (NTP)",
//         ],
//     },
//     {
//         id: 4,
//         value: "stage_4",
//         label: "Delivery of Goods and Services",
//         name: "Delivery & Inspection",
//         actor: "Supply & Property",
//         department: "Supply & Property Office",
//         color: "from-amber-500 to-orange-600",
//         docs: ["Delivery Receipt", "Inspection Report (IAR)"],
//     },
//     {
//         id: 5,
//         value: "stage_5",
//         label: "Project Implementation",
//         name: "Implementation",
//         actor: "End-User / Project Lead",
//         department: "End User Department",
//         color: "from-teal-500 to-emerald-600",
//         docs: ["Activity Report", "Attendance Sheet"],
//     },
//     {
//         id: 6,
//         value: "stage_6",
//         label: "Payment Processing",
//         name: "Payment & CAPA",
//         actor: "Accounting & Cashier",
//         department: "Accounting Office",
//         color: "from-emerald-500 to-green-600",
//         docs: ["Disbursement Voucher", "ORS / BARS"],
//     },
//     {
//         id: 7,
//         value: "stage_7",
//         label: "Completed",
//         name: "Completed",
//         actor: "System",
//         department: "Completed",
//         color: "from-slate-500 to-slate-700",
//         docs: [],
//     },
// ];

export const PROCUREMENT_STAGES = [
    {
        id: 1,
        value: "stage_1",
        label: "Preparation of Purchase Request",
        name: "PR Preparation",
        actor: "End-User Department",
        department: "BAC Secretariat",
        color: "from-blue-500 to-indigo-600",

        docs: ["Purchase Request", "PPMP"],

        fields: [
            {
                name: "pr_no",
                label: "PR No.",
                type: "text",
                placeholder: "PR-2026-000",
            },
            {
                name: "project_title",
                label: "Project Title",
                type: "text",
                placeholder: "Enter project title",
            },
            {
                name: "purpose",
                label: "Purpose",
                type: "textarea",
                placeholder: "Enter procurement purpose",
                fullWidth: true,
            },
            {
                name: "end_user",
                label: "End-User Department",
                type: "text",
                placeholder: "Enter end-user department",
            },
            {
                name: "abc",
                label: "ABC (Approved Budget)",
                type: "number",
                placeholder: "0.00",
            },
            {
                name: "mode_of_procurement",
                label: "Mode of Procurement",
                type: "text",
                placeholder: "Select procurement mode",
            },
        ],
    },

    {
        id: 2,
        value: "stage_2",
        label: "Preparation of Request for Quotation",
        name: "RFQ & Bidding",
        actor: "BAC Secretariat",
        department: "BAC Secretariat",
        color: "from-indigo-500 to-purple-600",

        docs: ["Request for Quotation", "Abstract of Bids"],

        fields: [
            {
                name: "rfq_no",
                label: "RFQ No.",
                type: "text",
                placeholder: "RFQ-2026-000",
            },
            {
                name: "rfq_date",
                label: "RFQ Date",
                type: "date",
            },
            {
                name: "abstract_no",
                label: "Abstract of Bids No.",
                type: "text",
                placeholder: "AB-2026-000",
            },
            {
                name: "abstract_date",
                label: "Abstract Date",
                type: "date",
            },
            {
                name: "winning_supplier",
                label: "Winning Supplier / Bidder",
                type: "text",
                placeholder: "Enter winning supplier",
                fullWidth: true,
            },
            {
                name: "contract_amount",
                label: "Contract Amount",
                type: "number",
                placeholder: "0.00",
            },
        ],
    },

    {
        id: 3,
        value: "stage_3",
        label: "Preparation of Purchase Order",
        name: "Purchase Order",
        actor: "Procurement / Finance",
        department: "Budget & Accounting",
        color: "from-purple-500 to-pink-600",

        docs: [
            "Purchase Order",
            "Notice of Award (NOA)",
            "Notice to Proceed (NTP)",
        ],

        fields: [
            {
                name: "po_no",
                label: "Purchase Order No.",
                type: "text",
                placeholder: "PO-2026-000",
            },
            {
                name: "po_date",
                label: "P.O. Date",
                type: "date",
            },
            {
                name: "noa_no",
                label: "Notice of Award No.",
                type: "text",
                placeholder: "NOA-2026-000",
            },
            {
                name: "noa_date",
                label: "NOA Date",
                type: "date",
            },
            {
                name: "ntp_no",
                label: "Notice to Proceed No.",
                type: "text",
                placeholder: "NTP-2026-000",
            },
            {
                name: "ntp_date",
                label: "NTP Date",
                type: "date",
            },
        ],
    },

    {
        id: 4,
        value: "stage_4",
        label: "Delivery of Goods and Services",
        name: "Delivery & Inspection",
        actor: "Supply & Property",
        department: "Supply & Property Office",
        color: "from-amber-500 to-orange-600",

        docs: ["Delivery Receipt", "Inspection Report (IAR)"],

        fields: [
            {
                name: "delivery_receipt_no",
                label: "Delivery Receipt No.",
                type: "text",
                placeholder: "DR-2026-000",
            },
            {
                name: "delivery_date",
                label: "Date of Delivery",
                type: "date",
            },
            {
                name: "iar_no",
                label: "IAR No.",
                type: "text",
                placeholder: "IAR-2026-000",
            },
            {
                name: "inspection_date",
                label: "Inspection Date",
                type: "date",
            },
            {
                name: "delivery_status",
                label: "Delivery Status",
                type: "select",
                options: [
                    {
                        value: "complete",
                        label: "Complete Delivery",
                    },
                    {
                        value: "partial",
                        label: "Partial Delivery",
                    },
                ],
            },
        ],
    },

    {
        id: 5,
        value: "stage_5",
        label: "Project Implementation",
        name: "Implementation",
        actor: "End-User / Project Lead",
        department: "End User Department",
        color: "from-teal-500 to-emerald-600",

        docs: ["Activity Report", "Attendance Sheet"],

        fields: [
            {
                name: "implementation_date",
                label: "Implementation Date",
                type: "date",
            },
            {
                name: "activity_report",
                label: "Activity Report",
                type: "text",
                placeholder: "Activity report reference",
            },
            {
                name: "attendance_sheet",
                label: "Attendance Sheet",
                type: "text",
                placeholder: "Attendance sheet reference",
            },
        ],
    },

    {
        id: 6,
        value: "stage_6",
        label: "Payment Processing",
        name: "Payment",
        actor: "Accounting & Cashier",
        department: "Accounting Office",
        color: "from-emerald-500 to-green-600",

        docs: ["Disbursement Voucher", "ORS / BARS"],

        fields: [
            {
                name: "dv_no",
                label: "Disbursement Voucher No.",
                type: "text",
                placeholder: "DV-2026-000",
            },
            {
                name: "dv_date",
                label: "DV Date",
                type: "date",
            },
            {
                name: "ors_no",
                label: "ORS No.",
                type: "text",
                placeholder: "ORS-2026-000",
            },
            {
                name: "ors_date",
                label: "ORS Date",
                type: "date",
            },
            {
                name: "bars_no",
                label: "BARS No.",
                type: "text",
                placeholder: "BARS-2026-000",
            },
            {
                name: "payment_date",
                label: "Payment Date",
                type: "date",
            },
        ],
    },

    {
        id: 7,
        value: "stage_7",
        label: "Completed",
        name: "Completed",
        actor: "System",
        department: "Completed",
        color: "from-slate-500 to-slate-700",

        docs: [],

        fields: [],
    },
];

export const DEPARTMENTS_KV = {
    OSDS: "Office of the Schools Division Superintendent",
    OASDS: "Office of the Assistant Schools Division Superintendent",
    SGOD: "Schools Governance and Operations Division",
    CID: "Curriculum Implementation Division",
    ICTU: "ICT Unit",
    ACU: "Accounting Unit",
    BU: "Budget Unit",
    CU: "Cash Unit",
    SU: "Supply Unit",
    PU: "Procurement Unit",
    HRMU: "Human Resource Management Unit",
    RU: "Records Unit",
    AU: "Administrative Unit",
    SHNU: "School Health and Nutrition Unit",
    PRU: "Planning and Research Unit",
    LU: "Legal Unit",
};
export const DEPARTMENTS = [
    "Office of the Schools Division Superintendent",
    "Office of the Assistant Schools Division Superintendent",
    "Schools Governance and Operations Division",
    "Curriculum Implementation Division",
    "ICT Unit",
    "Accounting Unit",
    "Budget Unit",
    "Cash Unit",
    "Supply Unit",
    "Procurement Unit",
    "Human Resource Management Unit",
    "Records Unit",
    "Administrative Unit",
    "School Health and Nutrition Unit",
    "Planning and Research Unit",
    "Legal Unit",
];
export const PR_STATUSES = [
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];
