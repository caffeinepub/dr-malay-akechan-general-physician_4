import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { toast } from 'sonner';
import type { ServiceInput } from '../../backend';
import { Plus, Pencil, Trash2, Save, X, Stethoscope, Upload, Image as ImageIcon } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

interface ServicesManagerProps {
  sessionToken: string;
}

const emptyService: ServiceInput = {
  title: '',
  description: '',
  iconUrl: '',
  iconBase64: '',
};

export default function ServicesManager({ sessionToken }: ServicesManagerProps) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [newService, setNewService] = useState<ServiceInput>(emptyService);
  const [editService, setEditService] = useState<ServiceInput>(emptyService);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (service: ServiceInput) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addService(service, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      setNewService(emptyService);
      setShowAddForm(false);
      toast.success('Service added successfully');
    },
    onError: (err: any) => {
      toast.error(`Failed to add service: ${err?.message ?? 'Unknown error'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, service }: { id: bigint; service: ServiceInput }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateService(id, service, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      setEditingId(null);
      toast.success('Service updated successfully');
    },
    onError: (err: any) => {
      toast.error(`Failed to update service: ${err?.message ?? 'Unknown error'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteService(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      toast.success('Service deleted');
    },
    onError: (err: any) => {
      toast.error(`Failed to delete service: ${err?.message ?? 'Unknown error'}`);
    },
  });

  const uploadIconMutation = useMutation({
    mutationFn: async ({ id, base64 }: { id: bigint; base64: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateServiceIconBase64(id, base64, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      toast.success('Service icon updated');
    },
    onError: (err: any) => {
      toast.error(`Failed to upload icon: ${err?.message ?? 'Unknown error'}`);
    },
  });

  const deleteIconMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteServiceIcon(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      toast.success('Service icon removed');
    },
    onError: (err: any) => {
      toast.error(`Failed to delete icon: ${err?.message ?? 'Unknown error'}`);
    },
  });

  const handleIconUpload = (id: bigint, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error('Icon too large. Please use an image under 500KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      uploadIconMutation.mutate({ id, base64 });
    };
    reader.readAsDataURL(file);
  };

  const ServiceForm = ({
    value,
    onChange,
    onSave,
    onCancel,
    isSaving,
    title,
  }: {
    value: ServiceInput;
    onChange: (v: ServiceInput) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
    title: string;
  }) => (
    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 space-y-4">
      <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/80">Service Title</label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="e.g. General Consultation"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/80">Description</label>
          <textarea
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="Brief description of the service..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/80">Icon URL (optional)</label>
          <input
            type="url"
            value={value.iconUrl}
            onChange={(e) => onChange({ ...value, iconUrl: e.target.value })}
            placeholder="https://example.com/icon.svg"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={isSaving || !value.title.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isSaving
            ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
            : <><Save size={14} />Save Service</>}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm transition-colors"
        >
          <X size={14} />Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-1">Services</h2>
          <p className="text-muted-foreground text-sm">Manage the medical services you offer.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors"
        >
          <Plus size={16} />Add Service
        </button>
      </div>

      {showAddForm && (
        <ServiceForm
          value={newService}
          onChange={setNewService}
          onSave={() => addMutation.mutate(newService)}
          onCancel={() => { setShowAddForm(false); setNewService(emptyService); }}
          isSaving={addMutation.isPending}
          title="Add New Service"
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <Stethoscope size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">No services added yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            Add your first service →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(([id, service]) => (
            <div key={id.toString()}>
              {editingId === id ? (
                <ServiceForm
                  value={editService}
                  onChange={setEditService}
                  onSave={() => updateMutation.mutate({ id, service: editService })}
                  onCancel={() => setEditingId(null)}
                  isSaving={updateMutation.isPending}
                  title="Edit Service"
                />
              ) : (
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
                        {service.iconBase64 ? (
                          <img
                            src={`data:image/png;base64,${service.iconBase64}`}
                            alt="icon"
                            className="w-full h-full object-cover"
                          />
                        ) : service.iconUrl ? (
                          <img src={service.iconUrl} alt="icon" className="w-6 h-6 object-contain" />
                        ) : (
                          <Stethoscope size={18} className="text-cyan-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">{service.title}</h4>
                        {service.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Icon upload */}
                      <label
                        className="p-2 rounded-lg border border-border text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        title="Upload icon"
                      >
                        <Upload size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleIconUpload(id, e)}
                        />
                      </label>

                      {(service.iconBase64 || service.iconUrl) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-orange-400 hover:border-orange-400/40 transition-colors"
                              title="Remove icon"
                            >
                              <ImageIcon size={14} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Service Icon?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the icon for <strong>{service.title}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteIconMutation.mutate(id)}>
                                Remove Icon
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <button
                        onClick={() => { setEditingId(id); setEditService({ ...service }); setShowAddForm(false); }}
                        className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{service.title}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
