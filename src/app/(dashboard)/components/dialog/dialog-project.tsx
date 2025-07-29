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
      projects: [
        {
          id: 1,
          name: "Project Alpha",
          image: "https://picsum.photos/300/300?random=1",
        },
        {
          id: 2,
          name: "Project Beta",
          image: "https://picsum.photos/300/300?random=2",
        },
        {
          id: 3,
          name: "Project Gamma",
          image: "https://picsum.photos/300/300?random=3",
        },
      ],
    },
    {
      id: 2,
      name: "Example Model 2",
      projects: [
        {
          id: 4,
          name: "Project Delta",
          image: "https://picsum.photos/300/300?random=4",
        },
        {
          id: 5,
          name: "Project Epsilon",
          image: "https://picsum.photos/300/300?random=5",
        },
        {
          id: 6,
          name: "Project Zeta",
          image: "https://picsum.photos/300/300?random=6",
        },
      ],
    },
    {
      id: 3,
      name: "Example Model 3",
      projects: [
        {
          id: 7,
          name: "Project Eta",
          image: "https://picsum.photos/300/300?random=7",
        },
        {
          id: 8,
          name: "Project Theta",
          image: "https://picsum.photos/300/300?random=8",
        },
        {
          id: 9,
          name: "Project Iota",
          image: "https://picsum.photos/300/300?random=9",
        },
        {
          id: 10,
          name: "Project Kappa",
          image: "https://picsum.photos/300/300?random=10",
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
  projects: { id: number; name: string; image: string }[];
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
      <CollapsibleContent className="grid gap-4 grid-cols-3 pt-4">
        {projects.map((project) => (
          <CardProject
            key={project.id}
            id={project.id.toString()}
            name={project.name}
            image={project.image}
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
  image,
  onDelete,
}: {
  id: string;
  name: string;
  image: string;
  onDelete?: (id: string) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCardClick = () => {
    setIsChecked(!isChecked);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn event bubbling để không trigger handleCardClick
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      className={`shadow-md rounded w-full h-[200px] min-w-[150px] flex flex-col overflow-hidden transition-all duration-200 hover:bg-black/5 cursor-pointer relative group ${
        isChecked
          ? "border-2 border-primary ring-2 ring-primary/20"
          : "border border-gray-200"
      }`}
      onClick={handleCardClick}
    >
      {/* Nút xóa */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        title="Xóa dự án"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="relative flex-1">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-2 py-3 flex justify-between items-center">
        <Label
          htmlFor={`checkbox-${id}`}
          className="cursor-pointer flex-1 truncate"
        >
          {name}
        </Label>
        <Checkbox
          id={`checkbox-${id}`}
          checked={isChecked}
          onCheckedChange={() => {}} // Để trống vì đã xử lý ở onClick của div cha
          className="pointer-events-none" // Ngăn checkbox tự xử lý click
        />
      </div>
    </div>
  );
};
