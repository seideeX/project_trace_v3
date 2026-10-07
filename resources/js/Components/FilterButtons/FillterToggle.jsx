import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import SelectField from "@/components/SelectField";
import useSearch from "@/hooks/useSearch";
import { PROCUREMENT_STAGES, PR_STATUSES } from "@/constants";
import { useState } from "react";
import { Input } from "../ui/input";

export default function FilterToggle({
    queryParams = {},
    visibleFilters = [],
    clearRouteName,
    clearRouteParams = {},
    departments = {},
    statuses = {},
}) {
    const search = useSearch(clearRouteName, queryParams);

    const isVisible = (filterName) => visibleFilters.includes(filterName);

    const handleChange = (field) => (event) => {
        search(field, event.target.value);
    };

    const clearFilters = () => {
        const params = {
            ...clearRouteParams,
            ...queryParams,
        };

        visibleFilters.forEach((filter) => {
            delete params[filter];

            if (filter === "date") {
                delete params.date_from;
                delete params.date_to;
            }
        });

        delete params.search;
        delete params.page;

        setSearchValue("");

        router.get(
            route(clearRouteName, params),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const activeFilters = visibleFilters.filter(
        (filter) =>
            queryParams[filter] !== undefined &&
            queryParams[filter] !== null &&
            queryParams[filter] !== "",
    );

    const hasSearch = Boolean(queryParams.search?.trim());

    const activeFilterCount = activeFilters.length + (hasSearch ? 1 : 0);

    const hasActiveFilters = activeFilterCount > 0;
    // Inside your component
    const [searchValue, setSearchValue] = useState(queryParams.search ?? "");

    const handleSearch = (event) => {
        event.preventDefault();

        search("search", searchValue);
    };
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Side - Filter Title */}
                <div className="flex shrink-0 items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <SlidersHorizontal className="h-4 w-4" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-800">
                                Filters
                            </h3>

                            {hasActiveFilters && (
                                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>

                        <p className="text-[11px] text-slate-500">
                            Refine the records using the filters below
                        </p>
                    </div>
                </div>

                {/* Right Side - Search + Clear */}
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full gap-2 sm:w-auto"
                    >
                        <div className="relative flex-1 sm:w-[280px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={searchValue}
                                onChange={(event) =>
                                    setSearchValue(event.target.value)
                                }
                                placeholder="Search procurement..."
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="sm"
                            className="h-9 shrink-0 gap-2 bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </Button>
                    </form>

                    {hasActiveFilters && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={clearFilters}
                            className="h-9 shrink-0 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-red-500 hover:border-red-400 hover:bg-red-200 hover:text-black"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Filter Fields */}
            <div className="bg-white px-4 py-4">
                <div className="flex flex-wrap items-end gap-4">
                    {isVisible("department") && (
                        <div className="min-w-[200px] flex-1 sm:max-w-[280px]">
                            <SelectField
                                name="department"
                                label="Current Department"
                                value={queryParams.department ?? ""}
                                onChange={handleChange("department")}
                                placeholder="All Departments"
                                options={[
                                    {
                                        value: "",
                                        label: "All Departments",
                                    },
                                    ...Object.entries(departments).map(
                                        ([id, name]) => ({
                                            value: String(id),
                                            label: name,
                                        }),
                                    ),
                                ]}
                            />
                        </div>
                    )}
                    {visibleFilters.includes("date") && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                    From Date
                                </label>

                                <Input
                                    type="date"
                                    value={queryParams.date_from ?? ""}
                                    onChange={(e) =>
                                        search("date_from", e.target.value)
                                    }
                                    className="rounded-xl border-slate-200 bg-white/70"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                    To Date
                                </label>

                                <Input
                                    type="date"
                                    value={queryParams.date_to ?? ""}
                                    onChange={(e) =>
                                        search("date_to", e.target.value)
                                    }
                                    className="rounded-xl border-slate-200 bg-white/70"
                                />
                            </div>
                        </div>
                    )}
                    {isVisible("origin_department") && (
                        <div className="min-w-[200px] flex-1 sm:max-w-[280px]">
                            <SelectField
                                name="origin_department"
                                label="Origin Department"
                                value={queryParams.origin_department ?? ""}
                                onChange={handleChange("origin_department")}
                                placeholder="All Origin Departments"
                                options={[
                                    {
                                        value: "",
                                        label: "All Origin Departments",
                                    },
                                    ...Object.entries(departments).map(
                                        ([id, name]) => ({
                                            value: String(id),
                                            label: name,
                                        }),
                                    ),
                                ]}
                            />
                        </div>
                    )}

                    {isVisible("pr_status") && (
                        <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
                            <SelectField
                                name="pr_status"
                                label="Status"
                                value={queryParams.pr_status ?? ""}
                                onChange={handleChange("pr_status")}
                                placeholder="All Statuses"
                                options={[
                                    { value: "", label: "All Statuses" },
                                    ...PR_STATUSES,
                                ]}
                            />
                        </div>
                    )}

                    {(isVisible("status") || isVisible("stage")) && (
                        <div className="min-w-[240px] flex-[1.5] sm:max-w-[280px]">
                            <SelectField
                                name={isVisible("stage") ? "stage" : "status"}
                                label="Procurement Stage"
                                value={
                                    isVisible("stage")
                                        ? (queryParams.stage ?? "")
                                        : (queryParams.status ?? "")
                                }
                                onChange={handleChange(
                                    isVisible("stage") ? "stage" : "status",
                                )}
                                options={[
                                    {
                                        value: "",
                                        label: "All Stages",
                                    },
                                    ...PROCUREMENT_STAGES,
                                ]}
                            />
                        </div>
                    )}
                    {isVisible("queue") && (
                        <div className="min-w-[170px] flex-1 sm:max-w-[220px]">
                            <SelectField
                                name="queue"
                                label="Request View"
                                value={queryParams.queue ?? "all"}
                                onChange={handleChange("queue")}
                                options={[
                                    {
                                        value: "all",
                                        label: "All Requests",
                                    },
                                    {
                                        value: "my_queue",
                                        label: "My Queue",
                                    },
                                    {
                                        value: "in_progress",
                                        label: "In Progress",
                                    },
                                    {
                                        value: "completed",
                                        label: "Completed",
                                    },
                                ]}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
