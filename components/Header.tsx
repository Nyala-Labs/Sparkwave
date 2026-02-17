import { cn } from "@/libs/utils";
import React, { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
  className?: string;
};

const Header = ({ children, className }: HeaderProps) => {
  return <p className={cn("text-4xl font-semibold", className)}>{children}</p>;
};

export default Header;
