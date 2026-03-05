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
import { Image as ImageIcon, Link, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

interface AboutEditorProps {
  sessionToken: string;
  currentText: string;
  currentImageUrl: string;
  currentImageBase64: string;
}

function getImageSrc(
  imageType: string,
  imageUrl: string,
  imageBase64: string,
): string | null {
  if (imageType === "base64" && imageBase64) {
    if (imageBase64.startsWith("data:")) return imageBase64;
    return `data:image/jpeg;base64,${imageBase64}`;
  }
  if (imageType === "url" && imageUrl) return imageUrl;
  if (imageBase64) {
    if (imageBase64.startsWith("data:")) return imageBase64;
    return `data:image/jpeg;base64,${imageBase64}`;
  }
  if (imageUrl) return imageUrl;
  return null;
}

export default function AboutEditor({
  sessionToken,
  currentText,
  currentImageUrl,
  currentImageBase64,
}: AboutEditorProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [bioText, setBioText] = useState(currentText);
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [imageBase64, setImageBase64] = useState(currentImageBase64);
  const [imageType, setImageType] = useState<"url" | "base64">(
    currentImageBase64 ? "base64" : "url",
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setBioText(currentText);
    setImageUrl(currentImageUrl);
    setImageBase64(currentImageBase64);
    setImageType(currentImageBase64 ? "base64" : "url");
  }, [currentText, currentImageUrl, currentImageBase64]);

  const previewSrc = getImageSrc(imageType, imageUrl, imageBase64);

  const saveBioMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateAboutSection(text, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Biography saved successfully");
    },
    onError: (err: any) => {
      toast.error(
        `Failed to save biography: ${err?.message ?? "Unknown error"}`,
      );
    },
  });

  const saveImageMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateAboutImage(
        {
          imageType: imageType,
          imageUrl: imageType === "url" ? imageUrl : "",
          imageBase64: imageType === "base64" ? imageBase64 : "",
        },
        sessionToken,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Profile image saved successfully");
    },
    onError: (err: any) => {
      toast.error(`Failed to save image: ${err?.message ?? "Unknown error"}`);
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteAboutImage(sessionToken);
    },
    onSuccess: () => {
      setImageUrl("");
      setImageBase64("");
      setImageType("url");
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Profile image removed");
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
      const base64Data = result.includes(",") ? result.split(",")[1] : result;
      setImageBase64(base64Data);
      setImageType("base64");
      setImageUrl("");
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-1">
          About Doctor
        </h2>
        <p className="text-muted-foreground text-sm">
          Edit the doctor's biography and profile photo.
        </p>
      </div>

      {/* Biography section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Save size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-foreground">Biography</h3>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="bio-text"
          >
            Doctor's Bio
          </label>
          <textarea
            id="bio-text"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            rows={8}
            placeholder="Enter the doctor's biography..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-y text-sm leading-relaxed"
          />
        </div>
        <button
          type="button"
          onClick={() => saveBioMutation.mutate(bioText)}
          disabled={saveBioMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveBioMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={15} />
              Save Biography
            </>
          )}
        </button>
      </div>

      {/* Profile Image section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-foreground">Profile Image</h3>
        </div>

        <div className="flex items-start gap-6">
          {/* Preview */}
          <div className="shrink-0">
            {previewSrc ? (
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-lg">
                <img
                  src={previewSrc}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/30">
                <ImageIcon size={28} className="text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground mt-2">
                  No image
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            {/* Upload file */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Upload Image File
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted/50 cursor-pointer text-sm text-foreground transition-colors">
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
                {imageType === "base64" && imageBase64 && (
                  <span className="text-xs text-cyan-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    File loaded
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Max 1.5MB. JPG, PNG, WebP supported.
              </p>
            </div>

            {/* URL input */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="image-url"
              >
                Or Enter Image URL
              </label>
              <div className="flex items-center gap-2">
                <Link size={15} className="text-muted-foreground shrink-0" />
                <input
                  id="image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value) {
                      setImageType("url");
                      setImageBase64("");
                    }
                  }}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => saveImageMutation.mutate()}
            disabled={
              saveImageMutation.isPending || (!imageUrl && !imageBase64)
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          {(imageUrl || imageBase64) && (
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
                  <AlertDialogTitle>Remove Profile Image?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the doctor's profile image from
                    the website. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteImageMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteImageMutation.isPending
                      ? "Removing..."
                      : "Remove Image"}
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
