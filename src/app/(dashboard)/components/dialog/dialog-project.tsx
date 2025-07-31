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
import { Label } from "@/components/ui/label";
import { ChevronDown, Plus, StarIcon, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import NewProject from "./new-project";

// Dữ liệu mẫu cho các models và projects
const sampleData = {
  models: [
    {
      id: 1,
      name: "Example Model 1",
      isActive: true,

      projects: [
        {
          id: 1,
          name: "Project Alpha",
          url: "/assets/files/examples/fileTest/0c0_06.glb",
        },
       
      ],
    },
    
  ],
};

const DialogProject = () => {
  const [openModelId, setOpenModelId] = useState<number | null>(null);
  const [starredModelId, setStarredModelId] = useState<number | null>(null);
  const [modelsData, setModelsData] = useState(sampleData.models);

  const handleModelToggle = (modelId: number) => {
    setOpenModelId(openModelId === modelId ? null : modelId);
    // Khi chọn model, cũng star nó luôn
    setStarredModelId(modelId);
  };

  const handleDeleteProject = (modelId: number, projectId: string) => {
    setModelsData(prevModels => 
      prevModels.map(model => 
        model.id === modelId 
          ? {
              ...model,
              projects: model.projects.filter(project => project.id !== parseInt(projectId))
            }
          : model
      )
    );
  };

  const handleDeleteModel = (modelId: number) => {
    setModelsData(prevModels => prevModels.filter(model => model.id !== modelId));
    // Nếu model bị xóa là model đang mở hoặc được star, reset state
    if (openModelId === modelId) {
      setOpenModelId(null);
    }
    if (starredModelId === modelId) {
      setStarredModelId(null);
    }
  };

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
          {modelsData.map((model) => (
            <CollapsibleProject
              key={model.id}
              {...model}
              isOpen={openModelId === model.id}
              isStarred={starredModelId === model.id}
              onToggle={() => handleModelToggle(model.id)}
              onDeleteProject={(projectId: string) => handleDeleteProject(model.id, projectId)}
              onDeleteModel={() => handleDeleteModel(model.id)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProject;

const CollapsibleProject = ({
  id,
  name,
  projects,
  isOpen,
  isStarred,
  onToggle,
  onDeleteProject,
  onDeleteModel,
}: {
  id: number;
  name: string;
  projects: { id: number; name: string; url: string }[];
  isOpen: boolean;
  isStarred: boolean;
  onToggle: () => void;
  onDeleteProject: (projectId: string) => void;
  onDeleteModel: () => void;
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn event bubbling để không trigger onToggle
    onDeleteModel();
  };

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
          {/* Nút xóa model */}
          <div
            onClick={handleDeleteClick}
            className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            title="Xóa model"
          >
            <Trash2 className="w-3 h-3" />
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {projects.map((project) => (
          <CardProject
            key={project.id}
            id={project.id.toString()}
            name={project.name}
            url={project.url}
            onDelete={onDeleteProject}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const CardProject = ({
  id,
  name,
  url,
  onDelete,
}: {
  id: string;
  name: string;
  url: string;
  onDelete?: (id: string) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // Lấy tên file từ url
  const fileName = url.split("/").pop();

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
        <span className="truncate font-medium">{fileName}</span>
      </div>
      <button
        onClick={handleDeleteClick}
        className="ml-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
        title="Xóa dự án"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
