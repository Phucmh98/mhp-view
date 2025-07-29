import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  nameProject: z.string().min(2).max(100),
});

const NewProject = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameProject: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("New project created:", data);
    // Handle project creation logic here
    
    // Đóng dialog sau khi tạo thành công
    setOpen(false);
    
    // Reset form
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
        <DialogContent className="p-0 min-w-[400px]">
          <DialogHeader className="pt-4 pb-3 px-4 border-b-1">
            <DialogTitle className="text-xl">New Project</DialogTitle>
          </DialogHeader>

          <div className="max-h-[80vh] overflow-y-auto px-3 space-y-4 ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <Button type="button" className="mt-3">
                     Upload files
                </Button>
                
              </form>
            </Form>
          </div>
          <DialogFooter className="pt-3 pb-4 px-4 border-t-1 flex">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" className="text-white" onClick={form.handleSubmit(onSubmit)}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewProject;
