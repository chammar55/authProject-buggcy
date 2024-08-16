import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { GoogleLogin } from "@react-oauth/google";
import { baseurl } from "../../baseUrl/baseUrl";
interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => {
    console.log("Login with google");
    window.open(`${baseurl}/auth/google`, "_self");
  };
  return (
    <>
      <Button onClick={loginWithGoogle} className="w-full">
        {children}
      </Button>
    </>
  );
};

export default GoogleSignInButton;
