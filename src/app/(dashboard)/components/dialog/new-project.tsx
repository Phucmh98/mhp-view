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
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    console.log("New project created:", data);
    // Upload trực tiếp lên Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      alert("Thiếu cấu hình Cloudinary");
      return;
    }
    const uploadedUrls: string[] = [];
    for (const file of Array.from(data.files)) {
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "models");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error?.message || "Upload failed");
        return;
      }
      uploadedUrls.push(result.secure_url);
    }
    // uploadedUrls là mảng các URL file đã upload
    console.log("Uploaded URLs:", uploadedUrls);
    // TODO: Gửi uploadedUrls và nameProject về server để lưu vào database nếu cần
    setOpen(false);
    form.reset();
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
