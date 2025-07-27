"use client";
import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TableOfContents, Search, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const ResizeSidebar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dataSidebar = [
    {
      name: "All comments",
      icon: <Search />,
      count: 8,
      href: "/comments/all-comments",
    },
    {
      name: "My inbox",
      icon: <User />,
      count: 3,
      href: "/comments/my-inbox",
    },
  ];
  return (
    <ResizablePanelGroup
      direction="horizontal"
      style={{ width: "calc(100% - 92px)" }}
      className="text-[#3e5867] "
    >
      <ResizablePanel className="text-sm" defaultSize={15} maxSize={25} minSize={5}>
        <div className="h-[40px] py-2">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg font-semibold flex  items-center gap-2">
              <TableOfContents /> Comments
            </div>
          </div>
        </div>

        {dataSidebar.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={item.href}
              className={`flex items-center justify-between cursor-pointer hover:bg-gray-200 px-2 py-1 ${
                isActive ? "bg-gray-100" : ""
              }`}
              onClick={() => router.push(item.href)}
            >
              <span className="pl-6 flex gap-2 items-center flex-1 min-w-0">
                <div className="w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="truncate">{item.name}</span>
              </span>
              <Badge variant={"outline"} className="w-6 h-6 rounded-full ">
                {item.count}
              </Badge>
            </div>
          );
        })}
      </ResizablePanel>
      <ResizableHandle className="w-[3px] hover:scale-x-150  transition-all duration-200" />
      <ResizablePanel defaultSize={85}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};
