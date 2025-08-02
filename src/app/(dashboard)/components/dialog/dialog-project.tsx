"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, StarIcon, X, Trash2 } from "lucide-react";
import { useState } from "react";
import NewProject from "./new-project";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const DialogProject = () => {
  const objects = useQuery(api.containProjects.containProjects.getAllProjects); // gọi function vừa tạo
  console.log('Objects:', objects);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [starredProjectId, setStarredProjectId] = useState<string | null>(null);

  const handleProjectToggle = (projectId: string) => {
    setOpenProjectId(openProjectId === projectId ? null : projectId);
    // Khi chọn project, cũng star nó luôn
    setStarredProjectId(projectId);
  };

  // Không cần delete functions nữa vì data từ server
  // const handleDeleteProject = (modelId: number, projectId: string) => {
  //   setModelsData(prevModels => 
  //     prevModels.map(model => 
  //       model.id === modelId 
  //         ? {
  //             ...model,
  //             projects: model.projects.filter(project => project.id !== parseInt(projectId))
  //           }
  //         : model
  //     )
  //   );
  // };

  // const handleDeleteModel = (modelId: number) => {
  //   setModelsData(prevModels => prevModels.filter(model => model.id !== modelId));
  //   // Nếu model bị xóa là model đang mở hoặc được star, reset state
  //   if (openProjectId === modelId) {
  //     setOpenProjectId(null);
  //   }
  //   if (starredProjectId === modelId) {
  //     setStarredProjectId(null);
  //   }
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="h-full flex items-center  px-2 cursor-pointer text-white font-medium bg-primary hover:bg-yellow-600/30 p-0 rounded-none">
          <span className="truncate ">Example Model</span>
          <ChevronDown className="ml-1" />
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 min-w-[600px]">
        <DialogHeader className="pt-4 px-4 border-b-1">
          <DialogTitle className="text-xl">Projects</DialogTitle>
          <DialogDescription className="my-1.5 flex justify-between">
            {/* Dialog New Project */}
            <NewProject/>
            <Input placeholder="Search..." className="ml-2 max-w-[200px]" />
          </DialogDescription>
        </DialogHeader>
        {/* <div className="p-3 mb-3 grid gap-4 grid-cols-3  overflow-y-auto max-h-[500px]">
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
        </div> */}
        <div className="max-h-[80vh] overflow-y-auto p-3 space-y-4">
          {objects && objects.length > 0 ? (
            objects.map((project) => (
              <CollapsibleProject
                key={project._id}
                id={project._id}
                name={project.name}
                files={project.files || []}
                fileMetaSrc={project.fileMetaSrc}
                isOpen={openProjectId === project._id}
                isStarred={starredProjectId === project._id}
                onToggle={() => handleProjectToggle(project._id)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              {objects === undefined ? "Đang tải..." : "Chưa có dự án nào"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProject;

const CollapsibleProject = ({
  id,
  name,
  files,
  fileMetaSrc,
  isOpen,
  isStarred,
  onToggle,
}: {
  id: string;
  name: string;
  files: { name: string; storeId: string; size: number }[];
  fileMetaSrc: string;
  isOpen: boolean;
  isStarred: boolean;
  onToggle: () => void;
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
      <CollapsibleContent className="pt-4">
        {files && files.length > 0 ? (
          files.map((file, index) => (
            <CardProject
              key={`${id}-${index}`}
              id={`${id}-${index}`}
              name={file.name}
              url={file.storeId}
              size={file.size}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            Không có file nào trong dự án này
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

const CardProject = ({
  id,
  name,
  url,
  size,
  onDelete,
}: {
  id: string;
  name: string;
  url: string;
  size?: number;
  onDelete?: (id: string) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className="flex items-center justify-between border rounded px-3 py-2 bg-white hover:bg-gray-50 transition-all cursor-pointer"
      onClick={() => setIsChecked(!isChecked)}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          className="form-checkbox h-4 w-4 text-primary pointer-events-none"
        />
        <div className="flex flex-col">
          <span className="truncate font-medium">{name}</span>
          {size && (
            <span className="text-xs text-gray-500">{formatFileSize(size)}</span>
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
