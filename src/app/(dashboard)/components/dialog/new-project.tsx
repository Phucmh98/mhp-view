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
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  nameProject: z.string().min(2).max(100),
  files: z.any().refine((val) => val instanceof FileList && val.length > 0, {
    message: "File is required",
  }),
});

const NewProject = () => {
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
    try {
      const formData = new FormData();
      Array.from(data.files).forEach((file) => {
        formData.append("files", file as File);
      });
      // Nếu muốn gửi thêm nameProject về API thì thêm dòng sau:
      formData.append("nameProject", data.nameProject);
      const res = await fetch("/api/cloudinary-upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(data.nameProject + result.error || "Upload failed");
        return;
      }
      console.log("Uploaded URLs:", result.urls);
      setOpen(false);
      form.reset();
    } catch (err: any) {
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
