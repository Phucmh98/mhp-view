import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type TaskComment = {
  id: string;
  title: string;
  created: string;
  description: string;
  deadline: string;
  status: "active" | "resolved" | "closed";
  responsibleUser: string;
  createdBy: string;
  responsibleEmail: string;
  requesterEmail: string;
};

export const columns: ColumnDef<TaskComment>[] = [
    {
        id: "No", // Thêm id để tránh conflict
        header: ".No",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span
                    className={`inline-block h-3.5 w-3.5 rounded-full ${
                        row.getValue("status") === "active"
                            ? "bg-red-500"
                            : row.getValue("status") === "resolved"
                            ? "bg-yellow-400"
                            : "bg-gray-300"
                    }`}
                />
                <span className="text-sm font-medium">{row.index + 1}</span>

            </div>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="text-sm truncate max-w-xs">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "created",
        header: "Created",
        cell: ({ row }) => (
            <div className="text-sm truncate max-w-xs">{row.getValue("created")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="text-sm truncate max-w-sm">
                {row.getValue("description")}
            </div>
        ),
    },
    {
        accessorKey: "deadline",
        header: "Deadline",
        cell: ({ row }) => (
            <div className="text-sm truncate max-w-xs">
                {row.getValue("deadline")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={`capitalize ${
                    row.getValue("status") === "active"
                        ? "bg-red-100 text-red-800 border-red-300"
                        : row.getValue("status") === "resolved"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
            >
                {row.getValue("status")}
            </Badge>
        ),
    },
    {
        accessorKey: "responsibleUser",
        header: "Responsible User",
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue("responsibleUser")}</div>
        ),
    },
    {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue("createdBy")}</div>
        ),
    },
    {
        accessorKey: "responsibleEmail",
        header: "Responsible Email",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("responsibleEmail")}</div>
        ),
    },
    {
        accessorKey: "requesterEmail",
        header: "Requester Email",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("requesterEmail")}</div>
        ),
    },
];
