import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-stone-200 border p-10 rounded-md card">{children}</div>
  );
};

export default AuthLayout;
