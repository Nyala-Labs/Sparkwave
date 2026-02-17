import { clsx, type ClassValue } from "clsx";
import { FileText, Folder, Link, Presentation, Sheet } from "lucide-react";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getResourceIcon(type: string) {
  switch (type) {
    case "docs":
      return <FileText size={20} />;
    case "sheet":
      return <Sheet size={20} />;
    case "slides":
      return <Presentation size={20} />;
    case "folder":
      return <Folder size={20} />;
    default:
      return <Link size={20} />;
  }
}
