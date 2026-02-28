import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import {
  useGetAllContent,
  useAddService,
  useUpdateService,
  useDeleteService,
  useUpdateServiceIconBase64,
  useDeleteServiceIcon,
} from '../../hooks/useQueries';

interface ServicesManagerProps {
  sessionToken: string;
}

interface ServiceForm {
  title: string;
  description: string;
  iconUrl: string;
  iconBase64: string;
}

const emptyForm: ServiceForm = { title: '', description: '', iconUrl: '', iconBase64: '' };

export default function ServicesManager({ sessionToken }: ServicesManagerProps) {
  const { data: content, isLoading } = useGetAllContent();
  const addService = useAddService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const updateIcon = useUpdateServiceIconBase64();
  const deleteIcon = useDeleteServiceIcon();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editForm, setEditForm] = useState<ServiceForm>(emptyForm);

  const handleAdd = async () => {
    await addService.mutateAsync({ service: form, sessionToken });
    setForm(emptyForm);
    setShowAddForm(false);
  };

  const handleUpdate = async (id: bigint) => {
    await updateService.mutateAsync({ id, service: editForm, sessionToken });
    setEditingId(null);
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this service?')) return;
    await deleteService.mutateAsync({ id, sessionToken });
  };

  const handleUploadIcon = async (id: bigint, base64: string) => {
    await updateIcon.mutateAsync({ serviceId: id, imageBase64: base64, sessionToken });
  };

  const handleDeleteIcon = async (id: bigint) => {
    await deleteIcon.mutateAsync({ serviceId: id, sessionToken });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Services</h2>
          <p className="text-sm text-muted-foreground">Manage your medical services.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-primary/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">New Service</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Service title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Icon URL (optional)</label>
              <input
                type="url"
                value={form.iconUrl}
                onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
              placeholder="Service description"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={addService.isPending || !form.title}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {addService.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Add Service
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : content?.services.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No services yet. Add your first service above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {content?.services.map(([id, service]) => (
            <div key={id.toString()} className="bg-white rounded-xl border border-border p-5">
              {editingId === id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Icon URL</label>
                      <input
                        type="url"
                        value={editForm.iconUrl}
                        onChange={(e) => setEditForm({ ...editForm, iconUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Service Icon</label>
                    <ImageUploadField
                      currentImageBase64={service.iconBase64}
                      currentImageUrl={service.iconUrl}
                      onUpload={(base64) => handleUploadIcon(id, base64)}
                      onDelete={() => handleDeleteIcon(id)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(id)}
                      disabled={updateService.isPending}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {updateService.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {(service.iconBase64 || service.iconUrl) && (
                      <img
                        src={service.iconBase64 ? `data:image/jpeg;base64,${service.iconBase64}` : service.iconUrl}
                        alt={service.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground">{service.title}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(id);
                        setEditForm({
                          title: service.title,
                          description: service.description,
                          iconUrl: service.iconUrl,
                          iconBase64: service.iconBase64,
                        });
                      }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deleteService.isPending}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
