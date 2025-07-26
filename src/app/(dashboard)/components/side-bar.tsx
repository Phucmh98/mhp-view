"use client";

import { MapPin, MessagesSquare  } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const buttonSideBar = [
    {
      title: "View",
      icons: MapPin,
      href: "/view",
    },
    {
      title: "Comments",
      icons: MessagesSquare ,
      href: "/comments",
      notificationCount: 99, // Bạn có thể thay đổi số này
    },
  ];
  return (
    <nav className="w-23 h-full  text-[#3e5867] text-sm shadow-2xl shadow-left">
      <div className="flex items-center justify-center h-[40px]">
        <Image
          src="/assets/imgs/logo_mhp.png"
          alt="logo_mhp"
          width={30}
          height={30}
        />
        <p className="text-lg font-bold ml-0.5">MHP</p>
      </div>
      {buttonSideBar.map((item) => (
        <div
          key={item.title}
          className={cn(
            "p-2 flex flex-col justify-center items-center font-semibold cursor-pointer transition-all relative hover:bg-[#3e586714]",
            pathname.startsWith(item.href) && "bg-[#3e58671f] pl-2"
          )}
          onClick={() => router.push(item.href)}
        >
          {pathname.startsWith(item.href) && (
            <span className="absolute left-[4px] top-0 h-full w-1 bg-primary rounded-l"></span>
          )}
          <div className="relative">
            <item.icons className="h-8 w-8" strokeWidth={1.5} />
            {item.notificationCount && (
              <span className="absolute top-[-5px] right-[-10px] bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[16px] px-1">
                {item.notificationCount > 99 ? "99+" : item.notificationCount}
              </span>
            )}
          </div>
          <span className="select-none">{item.title}</span>
        </div>
      ))}
    </nav>
  );
}
