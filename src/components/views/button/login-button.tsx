import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, Sun,CircleQuestionMark  } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const LoginButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-full w-full items-center justify-end">
          <div className="cursor-pointer flex h-full w-fit items-center gap-2 hover:bg-yellow-600/30 px-2 font-medium text-white">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>BIM - Model</span>
            <ChevronDown className="ml-1" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mr-1 max-w-32">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-normal truncate">
            fileApvasdasd@gmail.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Sun />
          Light
        </DropdownMenuItem>
           <DropdownMenuItem>
          <CircleQuestionMark />
          <span>Tutorial</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
     
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginButton;
