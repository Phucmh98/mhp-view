import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useInvalidateProjects } from "@/queries/projects.queries";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { api } from "../../../../../convex/_generated/api";

const formSchema = z.object({
  nameProject: z.string().min(2).max(100),
  files: z.any().refine((val) => {
    if (!(val instanceof FileList) || val.length === 0) {
      return false;
    }
    
    // Kiểm tra file size (max 50MB per file)
    const maxSize = 50 * 1024 * 1024; // 50MB
    for (let i = 0; i < val.length; i++) {
      if (val[i].size > maxSize) {
        return false;
      }
    }
    
    return true;
  }, {
    message: "File is required and each file must be less than 50MB",
  }),
});

const NewProject = () => {
  const { user, isLoaded } = useUser();
  const invalidateProjects = useInvalidateProjects();
  const generateUploadUrl = useMutation(api.files.files.generateUploadUrl);
  const createProject = useMutation(api.containProjects.containProjects.createProject);
  const [open, setOpen] = useState(false);
  const inputRefFiles = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameProject: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("New project created:", data);
    // Kiểm tra authentication
    if (!isLoaded) {
      toast.error("Loading user information...");
      return;
    }
    
    if (!user) {
      toast.error("Please sign in to upload files");
      return;
    }

    try {
      const uploadedFiles = [];
      
      // Upload từng file lên Convex
      for (const file of Array.from(data.files) as File[]) {
        
        // 1. Lấy upload URL từ Convex
        const uploadUrl = await generateUploadUrl();
        
        // 2. Upload file lên URL này
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: file, // Chỉ gửi file, không cần headers Content-Type
        });
        
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to upload ${file.name}: ${res.status} ${errorText}`);
        }
        
        const result = await res.json();
        const { storageId } = result;
        
        uploadedFiles.push({
          storageId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
      }

      // 3. Lưu thông tin project và files vào Convex database
       await createProject({
        idCreated: user.id, // Sử dụng user ID từ Clerk
        name: data.nameProject,
        files: uploadedFiles
      });
      
      // 4. Invalidate cache để refetch data
      await invalidateProjects();
      
      toast.success(`Project "${data.nameProject}" created with ${uploadedFiles.length} file(s)`);

      setOpen(false);
      form.reset();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Upload failed");
    }
  };


  const handleCancel = () => {
    // Đóng dialog
    setOpen(false);

    // Reset form về giá trị ban đầu
    form.reset();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Plus name="plus" />
            New project
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 w-[400px]" aria-describedby={undefined}>
          <DialogHeader className="pt-4 pb-3 px-4 border-b-1">
            <DialogTitle className="text-xl">New Project</DialogTitle>
          </DialogHeader>

          <div className="max-h-[80vh] overflow-y-auto px-3 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="nameProject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name project:</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Name project"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Files:</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept=".glb,.gltf,.ifc"
                          onChange={(e) => field.onChange(e.target.files)}
                          ref={inputRefFiles}
                        />
                      </FormControl>
                      {/* Hiển thị tên file đã chọn */}
                      {field.value && field.value.length > 0 && (
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {Array.from(field.value as File[]).map(
                            (file, idx) => (
                              <Badge key={idx} variant="outline">
                                {file.name}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DialogFooter className="pt-3 pb-4 px-4 border-t-1 flex">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-white"
              onClick={form.handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewProject;
