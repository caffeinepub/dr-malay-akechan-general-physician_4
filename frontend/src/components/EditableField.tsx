import React, { useState, useRef } from 'react';
import { Pencil, Check, X, Image as ImageIcon, Trash2, Upload, Link } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function getSessionToken(): string | null {
  return sessionStorage.getItem('adminSessionToken') || localStorage.getItem('adminSessionToken');
}

// ── EditableField ─────────────────────────────────────────────────────────────

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  /** New prop name */
  type?: 'text' | 'textarea' | 'url';
  /** Legacy prop name — alias for `type` */
  fieldType?: 'text' | 'textarea' | 'url';
  /** New prop name */
  label?: string;
  /** Legacy prop name — alias for `label` */
  fieldLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function EditableField({
  value,
  onSave,
  type,
  fieldType,
  label,
  fieldLabel,
  children,
  className = '',
}: EditableFieldProps) {
  const sessionToken = getSessionToken();
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);

  // Resolve aliases
  const resolvedType = type ?? fieldType ?? 'text';
  const resolvedLabel = label ?? fieldLabel;

  if (!sessionToken) return <>{children}</>;

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setEditValue(value);
    setOpen(isOpen);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editValue);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && resolvedType !== 'textarea') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <div
          className={`group relative inline-block cursor-pointer ${className}`}
          title={`Edit ${resolvedLabel || 'field'}`}
        >
          {children}
          <span className="absolute -top-2 -right-2 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white opacity-0 shadow-lg shadow-cyan-500/40 transition-all duration-200 group-hover:opacity-100 pointer-events-none">
            <Pencil className="h-3 w-3" />
          </span>
          <span className="absolute inset-0 rounded opacity-0 ring-2 ring-cyan-400/60 ring-offset-1 transition-all duration-200 group-hover:opacity-100 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4"
        side="top"
        align="start"
      >
        <div className="space-y-3">
          {resolvedLabel && (
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {resolvedLabel}
            </p>
          )}
          {resolvedType === 'textarea' ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] text-sm resize-none"
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              type={resolvedType === 'url' ? 'url' : 'text'}
              className="text-sm"
              autoFocus
            />
          )}
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={saving}
              className="h-7 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-7 px-3 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {saving ? (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                  Saving
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Save
                </span>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── EditableImageField ────────────────────────────────────────────────────────

interface EditableImageFieldProps {
  currentUrl?: string;
  currentBase64?: string;
  onSaveUrl?: (url: string) => Promise<void> | void;
  onSaveBase64?: (base64: string) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function EditableImageField({
  currentUrl,
  currentBase64,
  onSaveUrl,
  onSaveBase64,
  onDelete,
  label,
  children,
  className = '',
}: EditableImageFieldProps) {
  const sessionToken = getSessionToken();
  const [open, setOpen] = useState(false);
  const [urlValue, setUrlValue] = useState(currentUrl || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!sessionToken) return <>{children}</>;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('File too large (max 5MB)');
      return;
    }
    setUploadStatus('Converting...');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSaving(true);
      setUploadStatus('Saving...');
      try {
        await onSaveBase64?.(base64);
        setOpen(false);
        setUploadStatus('');
      } catch {
        setUploadStatus('Error saving');
      } finally {
        setSaving(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUrl = async () => {
    if (!urlValue.trim()) return;
    setSaving(true);
    try {
      await onSaveUrl?.(urlValue.trim());
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete?.();
      setOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const hasImage = !!(currentUrl || currentBase64);
  const previewSrc = currentBase64 || currentUrl;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={`group relative inline-block cursor-pointer ${className}`}
          title={`Edit ${label || 'image'}`}
        >
          {children}
          <span className="absolute inset-0 z-50 flex items-center justify-center rounded opacity-0 bg-black/40 transition-all duration-200 group-hover:opacity-100 pointer-events-none">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg">
              <ImageIcon className="h-4 w-4" />
            </span>
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="top" align="start">
        <div className="space-y-3">
          {label && (
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{label}</p>
          )}

          {previewSrc && (
            <div className="relative rounded overflow-hidden border border-border">
              <img src={previewSrc} alt="Preview" className="w-full h-24 object-cover" />
            </div>
          )}

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="w-full h-8 text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload Image
            </Button>

            {uploadStatus && (
              <p className={`text-xs ${uploadStatus.includes('Error') ? 'text-destructive' : 'text-muted-foreground'}`}>
                {uploadStatus}
              </p>
            )}

            <div className="flex gap-2">
              <Input
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="Or paste image URL..."
                className="flex-1 h-8 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveUrl()}
              />
              <Button
                size="sm"
                onClick={handleSaveUrl}
                disabled={saving || !urlValue.trim()}
                className="h-8 px-2 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Link className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {hasImage && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {deleting ? (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 animate-spin rounded-full border border-destructive border-t-transparent" />
                  Removing...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Trash2 className="h-3 w-3" />
                  Remove Image
                </span>
              )}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EditableField;
