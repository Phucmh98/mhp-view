'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, Sun, CircleQuestionMark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginButton = () => {
  const { signOut, user } = useClerk();
  const router = useRouter();
  
  console.log("user", user);
  
  // Redirect to sign-in if no user
  useEffect(() => {
    if (user === null) {
      router.push("/sign-in");
    }
  }, [user, router]);

  // Show loading state while checking user
  if (user === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-end">
        <div className="cursor-pointer flex h-full w-fit items-center gap-2 hover:bg-yellow-600/30 px-2 font-medium text-white">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // If user is null, we're redirecting, so show nothing or loading
  if (user === null) {
    return (
      <div className="flex h-full w-full items-center justify-end">
        <div className="cursor-pointer flex h-full w-fit items-center gap-2 hover:bg-yellow-600/30 px-2 font-medium text-white">
          <span>Redirecting...</span>
        </div>
      </div>
    );
  }

  // Get user email safely
  const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "No email";
  
  // Get user name safely
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : userEmail;
  
  // Get user initials for avatar fallback
  const initials = user.firstName && user.lastName 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : userEmail.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
      // After sign out, Clerk will automatically redirect to sign-in
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-full w-full items-center justify-end">
          <div className="cursor-pointer flex h-full w-fit items-center gap-2 hover:bg-yellow-600/30 px-2 font-medium text-white">
            <Avatar>
              <AvatarImage src={user.imageUrl || "https://github.com/shadcn.png"} alt={userName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span>{userName}</span>
            <ChevronDown className="ml-1" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mr-1 max-w-32">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-normal truncate">
            {userEmail}
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
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LoginButton;
