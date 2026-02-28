import { useRef, useState } from 'react';
import { Upload, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadFieldProps {
  label: string;
  currentImageBase64?: string;
  currentImageUrl?: string;
  onUpload: (base64: string) => Promise<void>;
  onUpdateUrl: (url: string) => Promise<void>;
  onDelete: () => Promise<void>;
  isUploading?: boolean;
  isDeleting?: boolean;
}

export default function ImageUploadField({
  label,
  currentImageBase64,
  currentImageUrl,
  onUpload,
  onUpdateUrl,
  onDelete,
  isUploading,
  isDeleting,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [localError, setLocalError] = useState('');

  const previewSrc = currentImageBase64
    ? `data:image/jpeg;base64,${currentImageBase64}`
    : currentImageUrl || '';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setLocalError('Image must be under 1.5 MB');
      return;
    }
    setLocalError('');
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      // Strip the data URL prefix to get pure base64
      const base64 = result.split(',')[1];
      try {
        await onUpload(base64);
      } catch (err: any) {
        setLocalError(err?.message || 'Upload failed');
      }
    };
    reader.readAsDataURL(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSave = async () => {
    setLocalError('');
    try {
      await onUpdateUrl(urlInput);
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to update URL');
    }
  };

  const handleDelete = async () => {
    setLocalError('');
    try {
      await onDelete();
      setUrlInput('');
    } catch (err: any) {
      setLocalError(err?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>

      {/* Preview */}
      <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 overflow-hidden flex items-center justify-center">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="w-8 h-8 opacity-40" />
            <span className="text-xs">No image set</span>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
        >
          {isUploading ? (
            <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
          onClick={handleDelete}
          disabled={isUploading || isDeleting || (!currentImageBase64 && !currentImageUrl)}
        >
          {isDeleting ? (
            <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Or paste image URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUrlSave}
          disabled={isUploading || isDeleting}
        >
          Set URL
        </Button>
      </div>

      {localError && (
        <p className="text-xs text-destructive">{localError}</p>
      )}
      <p className="text-xs text-muted-foreground">Max file size: 1.5 MB. Uploaded images take priority over URL.</p>
    </div>
  );
}
