import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HeroSettings, Images } from '../backend';

// ── Queries ──────────────────────────────────────────────────────────────────

export function useGetAllContent() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['allContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetHeroSettings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['heroSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHeroSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImages() {
  const { actor, isFetching } = useActor();
  return useQuery<Images | null>({
    queryKey: ['images'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getImages();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Auth Mutations ────────────────────────────────────────────────────────────

export function useLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.login(username, password);
    },
  });
}

// ── Site Title Mutations ──────────────────────────────────────────────────────

export function useUpdateSiteTitle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, sessionToken }: { title: string; sessionToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSiteTitle(title, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

// ── About Section Mutations ───────────────────────────────────────────────────

export function useUpdateAboutSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      text,
      imageUrl,
      sessionToken,
    }: {
      text: string;
      imageUrl: string;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAboutSection(text, imageUrl, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useUpdateAboutImageBase64() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      imageBase64,
      sessionToken,
    }: {
      imageBase64: string;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAboutImageBase64(imageBase64, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useDeleteAboutImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionToken }: { sessionToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAboutImage(sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

// ── Header Image Mutations ────────────────────────────────────────────────────

export function useUpdateHeaderImageBase64() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      imageBase64,
      sessionToken,
    }: {
      imageBase64: string;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHeaderImageBase64(imageBase64, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useDeleteHeaderImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionToken }: { sessionToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteHeaderImage(sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

// ── Hero Background Image Mutations ──────────────────────────────────────────

export function useUpdateHeroBackgroundImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      imageUrl,
      imageBase64,
      sessionToken,
    }: {
      imageUrl: string;
      imageBase64: string;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHeroBackgroundImage(imageUrl, imageBase64, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

export function useDeleteHeroBackgroundImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionToken }: { sessionToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteHeroBackgroundImage(sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
}

// ── Hero Settings Mutations ───────────────────────────────────────────────────

export function useUpdateHeroSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      settings,
      sessionToken,
    }: {
      settings: HeroSettings;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHeroSettings(settings, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      queryClient.invalidateQueries({ queryKey: ['heroSettings'] });
    },
  });
}

// ── Clinic Mutations ──────────────────────────────────────────────────────────

export function useAddClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clinic,
      sessionToken,
    }: {
      clinic: {
        name: string;
        address: string;
        phone: string;
        description: string;
        mapUrl: string;
        bookingUrl: string;
      };
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addClinic(clinic, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useUpdateClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      clinic,
      sessionToken,
    }: {
      id: bigint;
      clinic: {
        name: string;
        address: string;
        phone: string;
        description: string;
        mapUrl: string;
        bookingUrl: string;
      };
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClinic(id, clinic, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useDeleteClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sessionToken }: { id: bigint; sessionToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClinic(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

// ── Service Mutations ─────────────────────────────────────────────────────────

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      service,
      sessionToken,
    }: {
      service: {
        title: string;
        description: string;
        iconUrl: string;
        iconBase64: string;
      };
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addService(service, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      service,
      sessionToken,
    }: {
      id: bigint;
      service: {
        title: string;
        description: string;
        iconUrl: string;
        iconBase64: string;
      };
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateService(id, service, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sessionToken }: { id: bigint; sessionToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteService(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useUpdateServiceIconBase64() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serviceId,
      imageBase64,
      sessionToken,
    }: {
      serviceId: bigint;
      imageBase64: string;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateServiceIconBase64(serviceId, imageBase64, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useDeleteServiceIcon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serviceId,
      sessionToken,
    }: {
      serviceId: bigint;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteServiceIcon(serviceId, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

// ── Social Link Mutations ─────────────────────────────────────────────────────

export function useAddSocialLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      link,
      sessionToken,
    }: {
      link: { platform: string; url: string };
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSocialLink(link, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useUpdateSocialLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      link,
      sessionToken,
    }: {
      id: bigint;
      link: { platform: string; url: string };
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSocialLink(id, link, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

export function useDeleteSocialLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sessionToken }: { id: bigint; sessionToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSocialLink(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}

// ── Footer Mutations ──────────────────────────────────────────────────────────

export function useUpdateFooterContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      sessionToken,
    }: {
      content: string;
      sessionToken: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFooterContent(content, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
    },
  });
}
