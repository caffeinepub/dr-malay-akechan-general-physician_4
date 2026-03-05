import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

interface HeaderEditorProps {
  sessionToken: string;
  currentText: string;
  currentImageUrl: string;
  currentImageBase64: string;
}

export default function HeaderEditor({
  sessionToken,
  currentText,
  currentImageUrl,
  currentImageBase64,
}: HeaderEditorProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [siteTitle, setSiteTitle] = useState(currentText);
  const [imageBase64, setImageBase64] = useState(currentImageBase64);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setSiteTitle(currentText);
    setImageBase64(currentImageBase64);
  }, [currentText, currentImageBase64]);

  const saveTitleMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateSiteTitle(title, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Site title saved");
    },
    onError: (err: any) => {
      toast.error(`Failed to save title: ${err?.message ?? "Unknown error"}`);
    },
  });

  const saveImageMutation = useMutation({
    mutationFn: async (base64: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateHeaderImageBase64(base64, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Header image saved");
    },
    onError: (err: any) => {
      toast.error(`Failed to save image: ${err?.message ?? "Unknown error"}`);
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteHeaderImage(sessionToken);
    },
    onSuccess: () => {
      setImageBase64("");
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Header image removed");
    },
    onError: (err: any) => {
      toast.error(`Failed to delete image: ${err?.message ?? "Unknown error"}`);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("File too large. Please use an image under 1.5MB.");
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      setImageBase64(base64);
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const previewSrc = imageBase64
    ? imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`
    : currentImageUrl || null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-1">
          Header
        </h2>
        <p className="text-muted-foreground text-sm">
          Edit the site title and header/logo image.
        </p>
      </div>

      {/* Site Title */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Save size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-foreground">Site Title</h3>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="site-title"
          >
            Doctor / Practice Name
          </label>
          <input
            id="site-title"
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="e.g. Dr. John Smith"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => saveTitleMutation.mutate(siteTitle)}
          disabled={saveTitleMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saveTitleMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={15} />
              Save Title
            </>
          )}
        </button>
      </div>

      {/* Header Image */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-foreground">Header / Logo Image</h3>
        </div>

        <div className="flex items-start gap-6">
          <div className="shrink-0">
            {previewSrc ? (
              <div className="w-32 h-20 rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-lg">
                <img
                  src={previewSrc}
                  alt="Header preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/30">
                <ImageIcon size={24} className="text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground mt-1">
                  No image
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Upload Image
              </p>
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted/50 cursor-pointer text-sm text-foreground transition-colors w-fit">
                <Upload size={15} className="text-cyan-400" />
                {isUploading ? "Reading..." : "Choose File"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Max 1.5MB. JPG, PNG, WebP supported.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => saveImageMutation.mutate(imageBase64)}
            disabled={saveImageMutation.isPending || !imageBase64}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors disabled:opacity-50"
          >
            {saveImageMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Save Image
              </>
            )}
          </button>

          {(imageBase64 || currentImageUrl) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 font-medium text-sm transition-colors"
                >
                  <Trash2 size={15} />
                  Remove Image
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Header Image?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the header/logo image. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteImageMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteImageMutation.isPending ? "Removing..." : "Remove"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
