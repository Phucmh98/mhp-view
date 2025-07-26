import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, StarIcon } from "lucide-react";
import Image from "next/image";

const DialogProject = () => {
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
            <Button variant={"ghost"}>
              <Plus name="plus" />
              New project
            </Button>
            <Input placeholder="Search..." className="ml-2 max-w-[200px]" />
          </DialogDescription>
        </DialogHeader>
        <div className="p-3 mb-3 grid gap-4 grid-cols-3  overflow-y-auto max-h-[500px]">
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
          <CardProject />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProject;

const CardProject = () => {
  return (
    <div className="shadow-md rounded w-full h-[200px] min-w-[150px] flex flex-col overflow-hidden transition-colors duration-200 hover:bg-black/5 cursor-pointer">
      <div className="relative flex-1">
        <Image
          src="https://picsum.photos/300/300"
          alt="Project"
          fill
          className="object-cover"
        />
      </div>
      <div className="p-2 py-3 flex justify-between">
        <h3 className="text-sm font-semibold text-gray-600 truncate">
          Project Name
        </h3>
        <StarIcon className="text-gray-200" />
      </div>
    </div>
  );
};
