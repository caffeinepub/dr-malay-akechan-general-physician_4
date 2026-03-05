import { Check, Pencil, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

function getSessionToken(): string | null {
  return (
    sessionStorage.getItem("adminSessionToken") ||
    localStorage.getItem("adminSessionToken")
  );
}

interface EditableFieldProps {
  currentValue: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

export function EditableField({
  currentValue,
  onSave,
  placeholder = "Click to edit",
  multiline = false,
  className = "",
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsAdmin(!!getSessionToken());
  }, []);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (!isAdmin) {
    return <span className={className}>{currentValue || placeholder}</span>;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(currentValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <span className="inline-flex items-start gap-1 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 text-sm border border-primary rounded px-2 py-1 bg-white text-foreground resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 text-sm border border-primary rounded px-2 py-1 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
          title="Save"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1 text-muted-foreground hover:bg-muted rounded transition-colors"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`group inline-flex items-center gap-1 cursor-pointer hover:text-primary transition-colors ${className}`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      <span>
        {currentValue || (
          <span className="text-muted-foreground italic">{placeholder}</span>
        )}
      </span>
      <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
    </button>
  );
}

interface EditableImageFieldProps {
  currentImageUrl?: string;
  currentImageBase64?: string;
  onUpload?: (base64: string) => Promise<void>;
  onUpdateUrl?: (url: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  placeholder?: string;
}

export function EditableImageField({
  currentImageUrl,
  currentImageBase64,
  onUpload,
  onUpdateUrl,
  onDelete,
  placeholder = "Add image",
}: EditableImageFieldProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [urlInput, setUrlInput] = useState(currentImageUrl || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsAdmin(!!getSessionToken());
  }, []);

  const displayUrl = currentImageBase64
    ? `data:image/jpeg;base64,${currentImageBase64}`
    : currentImageUrl || null;

  if (!isAdmin) {
    return displayUrl ? (
      <img
        src={displayUrl}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await onUpload(base64);
        setShowPanel(false);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {displayUrl ? (
        <img
          src={displayUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
          {placeholder}
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowPanel(!showPanel)}
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium rounded-full"
      >
        Edit Image
      </button>
      {showPanel && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-border rounded-lg shadow-card-hover p-4 z-50 w-64 space-y-3">
          {onUpload && (
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">
                Upload file
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="mt-1 block w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </label>
          )}
          {onUpdateUrl && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Or enter URL
              </span>
              <div className="flex gap-1 mt-1">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 text-xs border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await onUpdateUrl(urlInput);
                    setShowPanel(false);
                  }}
                  className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90"
                >
                  Set
                </button>
              </div>
            </div>
          )}
          {onDelete && displayUrl && (
            <button
              type="button"
              onClick={async () => {
                await onDelete();
                setShowPanel(false);
              }}
              className="w-full text-xs text-destructive hover:bg-destructive/10 py-1 rounded transition-colors"
            >
              Remove image
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowPanel(false)}
            className="w-full text-xs text-muted-foreground hover:bg-muted py-1 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
