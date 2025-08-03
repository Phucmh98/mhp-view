"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, StarIcon, X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import NewProject from "./new-project";

import { useAllProjectsQuery } from "@/queries/projects.queries";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

const DialogProject = () => {
  const { user } = useClerk();
  const { data, isLoading } = useAllProjectsQuery();

  // Khai báo tất cả hooks trước khi có bất kỳ conditional logic nào
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [starredProjectId, setStarredProjectId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [confirmedProjectId, setConfirmedProjectId] = useState<string | null>(
    null
  ); // Project đã được confirm
  const [confirmedStarredId, setConfirmedStarredId] = useState<string | null>(
    null
  ); // Star đã được confirm

  useEffect(() => {
    // Load user view from local storage
    const userView = localStorage.getItem("userView");
    if (userView) {
      const { userId, projectId } = JSON.parse(userView);
      if (userId === user?.id) {
        setOpenProjectId(projectId);
        setConfirmedProjectId(projectId); // Cũng set confirmed project
        setStarredProjectId(projectId); // Set starred project từ localStorage
        setConfirmedStarredId(projectId); // Set confirmed starred
      }
    }
  }, [user?.id]);

  console.log("Objects:", data);

  // Check loading state sau khi đã khai báo tất cả hooks
  if (isLoading) {
    return <Skeleton className="h-3/4 w-32 " />;
  }

  const handleProjectToggle = (projectId: string) => {
    setOpenProjectId(openProjectId === projectId ? null : projectId);
    // Khi chọn project, cũng star nó luôn
    setStarredProjectId(projectId);

    // Khi mở project, chọn tất cả files trong project đó
    if (openProjectId !== projectId && data) {
      const project = data.find((p) => p._id === projectId);
      if (project && project.files) {
        const projectFileIds = project.files.map(
          (_, index) => `${projectId}-${index}`
        );
        setSelectedFiles((prev) => {
          const newSet = new Set(prev);
          projectFileIds.forEach((fileId) => newSet.add(fileId));
          return newSet;
        });
      }
    }
  };

  const handleFileToggle = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          // Khi mở dialog, reset về trạng thái đã confirm
          setStarredProjectId(confirmedStarredId);
          setOpenProjectId(confirmedProjectId);
        } else {
          // Khi đóng dialog mà không nhấn OK, reset về trạng thái đã confirm
          setStarredProjectId(confirmedStarredId);
          setOpenProjectId(confirmedProjectId);
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="h-full flex items-center  px-2 cursor-pointer text-white font-medium bg-primary hover:bg-yellow-600/30 p-0 rounded-none">
          <span className="truncate ">
            {confirmedProjectId
              ? data?.find((p) => p._id === confirmedProjectId)?.name ||
                "Select Project"
              : "Select Project"}
          </span>
          <ChevronDown className="ml-1" />
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-[600px]">
        <DialogHeader className="pt-4 px-4 border-b-1">
          <DialogTitle className="text-xl">Projects</DialogTitle>
          <DialogDescription className="my-1.5 flex justify-between">
            {/* Dialog New Project */}
            <NewProject />
            {/* <Input placeholder="Search..." className="ml-2 max-w-[200px]" /> */}
          </DialogDescription>
        </DialogHeader>
        {/* Body collaspe content */}
        <div className="max-h-[80vh] overflow-y-auto p-3 space-y-4">
          {data && data.length > 0 ? (
            data.map((project) => (
              <CollapsibleProject
                key={project._id}
                id={project._id}
                name={project.name}
                files={project.files || []}
                fileMetaSrc={project.fileMetaSrc}
                isOpen={openProjectId === project._id}
                isStarred={starredProjectId === project._id}
                onToggle={() => handleProjectToggle(project._id)}
                selectedFiles={selectedFiles}
                onFileToggle={handleFileToggle}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              {data === undefined ? "Loading..." : "No projects found"}
            </div>
          )}
        </div>
        <DialogFooter className="px-4 py-3 border-t-1">
          <Button
            disabled={openProjectId !== null}
            className="text-white"
            variant="default"
            onClick={() => {
              localStorage.setItem(
                "userView",
                JSON.stringify({
                  userId: user?.id,
                  projectId: openProjectId,
                  nameProject: data?.find((p) => p._id === openProjectId)?.name,
                })
              );
              setConfirmedProjectId(openProjectId); // Confirm project được chọn
              setConfirmedStarredId(starredProjectId); // Confirm starred được chọn
              setOpen(false); // Đóng dialog
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProject;

//#region CollapsibleProject
const CollapsibleProject = ({
  id,
  name,
  files,
  fileMetaSrc,
  isOpen,
  isStarred,
  onToggle,
  selectedFiles,
  onFileToggle,
}: {
  id: string;
  name: string;
  files: { name: string; storeId: string; size: number }[];
  fileMetaSrc: string;
  isOpen: boolean;
  isStarred: boolean;
  onToggle: () => void;
  selectedFiles: Set<string>;
  onFileToggle: (fileId: string) => void;
}) => {
  return (
    <Collapsible open={isOpen} className="">
      <CollapsibleTrigger
        className="w-full text-left font-medium text-lg hover:text-primary transition-colors flex items-center justify-between p-3 rounded-lg  bg-gray-100 hover:bg-gray-200 group cursor-pointer"
        onClick={onToggle}
      >
        <span className="flex items-center gap-2">
          <StarIcon
            className={`w-5 h-5 transition-colors ${
              isStarred
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          />
          {name}
        </span>
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-2">
        {files && files.length > 0 ? (
          files.map((file, index) => (
            <CardProject
              key={`${id}-${index}`}
              id={`${id}-${index}`}
              name={file.name}
              url={file.storeId}
              size={file.size}
              isSelected={selectedFiles.has(`${id}-${index}`)}
              onToggle={() => onFileToggle(`${id}-${index}`)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No files in this project
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

//#region CardProject
const CardProject = ({
  id,
  name,
  url,
  size,
  isSelected,
  onToggle,
  onDelete,
}: {
  id: string;
  name: string;
  url: string;
  size?: number;
  isSelected?: boolean;
  onToggle?: () => void;
  onDelete?: (id: string) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  // Sử dụng isSelected từ props nếu có, otherwise sử dụng state local
  const checked = isSelected !== undefined ? isSelected : isChecked;

  const handleCardClick = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsChecked(!isChecked);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className="flex items-center justify-between border rounded mt-1 px-3 py-1.5 bg-white hover:bg-gray-50 transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="form-checkbox h-4 w-4 text-primary pointer-events-none"
        />
        <div className="flex flex-col text-xs">
          <span className="truncate font-medium">{name}</span>
          {size && (
            <span className=" text-gray-500">{formatFileSize(size)}</span>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          onClick={handleDeleteClick}
          className="ml-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
          title="Xóa file"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
