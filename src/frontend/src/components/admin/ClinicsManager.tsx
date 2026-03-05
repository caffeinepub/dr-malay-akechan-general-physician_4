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
import {
  Building2,
  Calendar,
  Globe,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClinicInput } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface ClinicsManagerProps {
  sessionToken: string;
}

const emptyClinic: ClinicInput = {
  name: "",
  address: "",
  phone: "",
  description: "",
  mapUrl: "",
  bookingUrl: "",
};

export default function ClinicsManager({ sessionToken }: ClinicsManagerProps) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [newClinic, setNewClinic] = useState<ClinicInput>(emptyClinic);
  const [editClinic, setEditClinic] = useState<ClinicInput>(emptyClinic);

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["clinics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClinics();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (clinic: ClinicInput) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addClinic(clinic, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      setNewClinic(emptyClinic);
      setShowAddForm(false);
      toast.success("Clinic added successfully");
    },
    onError: (err: any) => {
      toast.error(`Failed to add clinic: ${err?.message ?? "Unknown error"}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, clinic }: { id: bigint; clinic: ClinicInput }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateClinic(id, clinic, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      setEditingId(null);
      toast.success("Clinic updated successfully");
    },
    onError: (err: any) => {
      toast.error(
        `Failed to update clinic: ${err?.message ?? "Unknown error"}`,
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteClinic(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
      toast.success("Clinic deleted");
    },
    onError: (err: any) => {
      toast.error(
        `Failed to delete clinic: ${err?.message ?? "Unknown error"}`,
      );
    },
  });

  const ClinicForm = ({
    value,
    onChange,
    onSave,
    onCancel,
    isSaving,
    title,
  }: {
    value: ClinicInput;
    onChange: (v: ClinicInput) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
    title: string;
  }) => (
    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 space-y-4">
      <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            key: "name",
            label: "Clinic Name",
            placeholder: "e.g. Main Street Clinic",
            icon: <Building2 size={14} />,
          },
          {
            key: "phone",
            label: "Phone Number",
            placeholder: "e.g. +1 (555) 000-0000",
            icon: <Phone size={14} />,
          },
          {
            key: "mapUrl",
            label: "Map URL",
            placeholder: "Google Maps link",
            icon: <Globe size={14} />,
          },
          {
            key: "bookingUrl",
            label: "Booking URL",
            placeholder: "Appointment booking link",
            icon: <Calendar size={14} />,
          },
        ].map(({ key, label, placeholder, icon }) => (
          <div key={key} className="space-y-1.5">
            <p className="text-xs font-medium text-foreground/80">{label}</p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0">{icon}</span>
              <input
                type="text"
                value={(value as any)[key]}
                onChange={(e) => onChange({ ...value, [key]: e.target.value })}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
              />
            </div>
          </div>
        ))}
        <div className="sm:col-span-2 space-y-1.5">
          <p className="text-xs font-medium text-foreground/80">Address</p>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={value.address}
              onChange={(e) => onChange({ ...value, address: e.target.value })}
              placeholder="Full address"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
            />
          </div>
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <p className="text-xs font-medium text-foreground/80">Description</p>
          <textarea
            value={value.description}
            onChange={(e) =>
              onChange({ ...value, description: e.target.value })
            }
            placeholder="Brief description"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !value.name.trim()}
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
              Save Clinic
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
            Clinics
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage clinic locations and contact information.
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
          Add Clinic
        </button>
      </div>

      {showAddForm && (
        <ClinicForm
          value={newClinic}
          onChange={setNewClinic}
          onSave={() => addMutation.mutate(newClinic)}
          onCancel={() => {
            setShowAddForm(false);
            setNewClinic(emptyClinic);
          }}
          isSaving={addMutation.isPending}
          title="Add New Clinic"
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <Building2
            size={40}
            className="mx-auto text-muted-foreground/30 mb-3"
          />
          <p className="text-muted-foreground text-sm">No clinics added yet.</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            Add your first clinic →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {clinics.map(([id, clinic]) => (
            <div key={id.toString()}>
              {editingId === id ? (
                <ClinicForm
                  value={editClinic}
                  onChange={setEditClinic}
                  onSave={() =>
                    updateMutation.mutate({ id, clinic: editClinic })
                  }
                  onCancel={() => setEditingId(null)}
                  isSaving={updateMutation.isPending}
                  title="Edit Clinic"
                />
              ) : (
                <div className="rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={15} className="text-cyan-400 shrink-0" />
                      <h4 className="font-semibold text-foreground text-sm truncate">
                        {clinic.name}
                      </h4>
                    </div>
                    {clinic.address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin size={11} className="shrink-0" />
                        {clinic.address}
                      </p>
                    )}
                    {clinic.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Phone size={11} className="shrink-0" />
                        {clinic.phone}
                      </p>
                    )}
                    {clinic.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {clinic.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(id);
                        setEditClinic({ ...clinic });
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
                          <AlertDialogTitle>Delete Clinic?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{clinic.name}</strong>? This action cannot
                            be undone.
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
