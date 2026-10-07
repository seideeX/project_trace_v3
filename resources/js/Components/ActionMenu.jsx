import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function ActionMenu({ actions = [] }) {
    const ref = useRef(null);
    const [compact, setCompact] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setCompact(entry.contentRect.width < 150);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="flex w-full items-center justify-center">
            {compact ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100">
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {actions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <DropdownMenuItem
                                    key={action.label}
                                    onClick={action.onClick}
                                    className={action.className}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {action.label}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center gap-1">
                    {actions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <button
                                key={action.label}
                                type="button"
                                onClick={action.onClick}
                                title={action.label}
                                className={`flex h-8 w-8 items-center justify-center rounded-md ${action.className}`}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
