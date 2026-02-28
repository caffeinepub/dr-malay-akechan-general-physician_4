import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useGetAllContent,
  useAddService,
  useUpdateService,
  useDeleteService,
  useUpdateServiceIconBase64,
  useDeleteServiceIcon,
} from '../../hooks/useQueries';
import type { Service } from '../../backend';
import ImageUploadField from './ImageUploadField';

interface ServicesManagerProps {
  sessionToken: string;
}

const emptyForm = { title: '', description: '', iconUrl: '', iconBase64: '' };

export default function ServicesManager({ sessionToken }: ServicesManagerProps) {
  const { data: content } = useGetAllContent();
  const services = content?.services || [];

  const addService = useAddService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const updateServiceIcon = useUpdateServiceIconBase64();
  const deleteServiceIcon = useDeleteServiceIcon();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const handleEdit = (id: bigint, service: Service) => {
    setEditingId(id);
    setForm({
      title: service.title,
      description: service.description,
      iconUrl: service.iconUrl,
      iconBase64: service.iconBase64,
    });
    setShowForm(true);
    setFormError('');
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setFormError('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setFormError('Title is required');
      return;
    }
    setFormError('');
    try {
      if (editingId !== null) {
        await updateService.mutateAsync({
          id: editingId,
          service: {
            title: form.title,
            description: form.description,
            iconUrl: form.iconUrl,
            iconBase64: form.iconBase64,
          },
          sessionToken,
        });
      } else {
        await addService.mutateAsync({
          service: {
            title: form.title,
            description: form.description,
            iconUrl: form.iconUrl,
            iconBase64: form.iconBase64,
          },
          sessionToken,
        });
      }
      handleCancel();
    } catch (e: any) {
      setFormError(e?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this service?')) return;
    try {
      await deleteService.mutateAsync({ id, sessionToken });
    } catch (e: any) {
      alert(e?.message || 'Failed to delete');
    }
  };

  const isPending = addService.isPending || updateService.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="w-4 h-4 text-amber-400" />
          Services ({services.length})
        </div>
        {!showForm && (
          <Button size="sm" onClick={handleAdd} className="gap-2 bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="w-3.5 h-3.5" />
            Add Service
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-amber-500/30 rounded-xl p-4 space-y-4 bg-amber-500/5">
          <h4 className="font-semibold text-sm text-amber-400">
            {editingId !== null ? 'Edit Service' : 'New Service'}
          </h4>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Service title"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Service description"
                rows={3}
                className="resize-none"
              />
            </div>
            <ImageUploadField
              label="Service Icon"
              currentImageBase64={form.iconBase64}
              currentImageUrl={form.iconUrl}
              onUpload={async (base64) => {
                if (editingId !== null) {
                  await updateServiceIcon.mutateAsync({ serviceId: editingId, imageBase64: base64, sessionToken });
                }
                setForm({ ...form, iconBase64: base64 });
              }}
              onUpdateUrl={async (url) => {
                setForm({ ...form, iconUrl: url });
              }}
              onDelete={async () => {
                if (editingId !== null) {
                  await deleteServiceIcon.mutateAsync({ serviceId: editingId, sessionToken });
                }
                setForm({ ...form, iconBase64: '', iconUrl: '' });
              }}
              isUploading={updateServiceIcon.isPending}
              isDeleting={deleteServiceIcon.isPending}
            />
          </div>
          {formError && <p className="text-xs text-destructive">{formError}</p>}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              size="sm"
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isPending ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {editingId !== null ? 'Update' : 'Add'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-2">
              <X className="w-3.5 h-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-2">
        {services.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No services yet. Add one above.</p>
        )}
        {services.map(([id, service]) => {
          const iconSrc = service.iconBase64
            ? `data:image/jpeg;base64,${service.iconBase64}`
            : service.iconUrl;
          return (
            <div
              key={id.toString()}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              {iconSrc ? (
                <img src={iconSrc} alt={service.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-amber-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{service.title}</p>
                <p className="text-xs text-muted-foreground truncate">{service.description}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-muted-foreground hover:text-foreground"
                  onClick={() => handleEdit(id, service)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(id)}
                  disabled={deleteService.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
