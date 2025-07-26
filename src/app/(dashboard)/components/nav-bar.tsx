import LoginButton from "@/components/views/button/login-button";
import DialogProject from "./dialog/dialog-project";

const NavBar = () => {
  return (
    <nav className="grid grid-cols-3 bg-primary h-[40px] items-center">
      <div></div>
      <div className="w-full h-full flex items-center justify-center">
        <DialogProject />
      </div>
        <LoginButton />
    </nav>
  );
};

export default NavBar;
