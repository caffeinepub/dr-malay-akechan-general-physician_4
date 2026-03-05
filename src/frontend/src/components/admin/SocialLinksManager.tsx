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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Pencil, Plus, Save, Share2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SocialLinkInput } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface SocialLinksManagerProps {
  sessionToken: string;
}

const emptyLink: SocialLinkInput = { platform: "", url: "" };

const PLATFORM_SUGGESTIONS = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "WhatsApp",
  "Telegram",
  "TikTok",
  "Pinterest",
  "Snapchat",
];

export default function SocialLinksManager({
  sessionToken,
}: SocialLinksManagerProps) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [newLink, setNewLink] = useState<SocialLinkInput>(emptyLink);
  const [editLink, setEditLink] = useState<SocialLinkInput>(emptyLink);

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSocialLinks();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (link: SocialLinkInput) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addSocialLink(link, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      setNewLink(emptyLink);
      setShowAddForm(false);
      toast.success("Social link added");
    },
    onError: (err: any) => {
      toast.error(`Failed to add link: ${err?.message ?? "Unknown error"}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, link }: { id: bigint; link: SocialLinkInput }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateSocialLink(id, link, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      setEditingId(null);
      toast.success("Social link updated");
    },
    onError: (err: any) => {
      toast.error(`Failed to update link: ${err?.message ?? "Unknown error"}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteSocialLink(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Social link deleted");
    },
    onError: (err: any) => {
      toast.error(`Failed to delete link: ${err?.message ?? "Unknown error"}`);
    },
  });

  const LinkForm = ({
    value,
    onChange,
    onSave,
    onCancel,
    isSaving,
    title,
  }: {
    value: SocialLinkInput;
    onChange: (v: SocialLinkInput) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
    title: string;
  }) => (
    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 space-y-4">
      <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-foreground/80">
            Platform Name
          </p>
          <input
            type="text"
            list="platform-suggestions"
            value={value.platform}
            onChange={(e) => onChange({ ...value, platform: e.target.value })}
            placeholder="e.g. Facebook"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
          />
          <datalist id="platform-suggestions">
            {PLATFORM_SUGGESTIONS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-foreground/80">Profile URL</p>
          <div className="flex items-center gap-2">
            <Link size={14} className="text-muted-foreground shrink-0" />
            <input
              type="url"
              value={value.url}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
              placeholder="https://..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
            />
          </div>
          {value.url && !value.url.startsWith("http") && (
            <p className="text-xs text-amber-400">
              ⚠ URL should start with https://
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !value.platform.trim() || !value.url.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={14} />
              Save Link
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm transition-colors"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-1">
            Social Links
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage social media profile links.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          Add Link
        </button>
      </div>

      {showAddForm && (
        <LinkForm
          value={newLink}
          onChange={setNewLink}
          onSave={() => addMutation.mutate(newLink)}
          onCancel={() => {
            setShowAddForm(false);
            setNewLink(emptyLink);
          }}
          isSaving={addMutation.isPending}
          title="Add New Social Link"
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <Share2 size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">
            No social links added yet.
          </p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            Add your first link →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map(([id, link]) => (
            <div key={id.toString()}>
              {editingId === id ? (
                <LinkForm
                  value={editLink}
                  onChange={setEditLink}
                  onSave={() => updateMutation.mutate({ id, link: editLink })}
                  onCancel={() => setEditingId(null)}
                  isSaving={updateMutation.isPending}
                  title="Edit Social Link"
                />
              ) : (
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Share2 size={14} className="text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        {link.platform}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(id);
                        setEditLink({ ...link });
                        setShowAddForm(false);
                      }}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="p-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Social Link?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the{" "}
                            <strong>{link.platform}</strong> link? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteMutation.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
