import { Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAdminEdit } from "../context/AdminEditContext";

interface HoverEditWrapperProps {
  children: React.ReactNode;
  onEdit: () => void;
  label?: string;
}

export default function HoverEditWrapper({
  children,
  onEdit,
  label,
}: HoverEditWrapperProps) {
  const { isAdminLoggedIn } = useAdminEdit();
  const [isHovered, setIsHovered] = useState(false);

  if (!isAdminLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Edit button overlay */}
      {isHovered && (
        <button
          type="button"
          data-ocid="hover.edit_button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
          style={{
            background: "oklch(0.12 0.022 240 / 0.92)",
            border: "1px solid oklch(0.72 0.18 195 / 0.5)",
            color: "oklch(0.72 0.18 195)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 2px 12px oklch(0.72 0.18 195 / 0.20)",
          }}
          title={label ? `Edit ${label}` : "Edit"}
        >
          <Pencil className="w-3 h-3 shrink-0" />
          {label && <span>{label}</span>}
        </button>
      )}
    </div>
  );
}
