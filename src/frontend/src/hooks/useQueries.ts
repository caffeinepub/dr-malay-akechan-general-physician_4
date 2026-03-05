import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AboutImage,
  ClinicInput,
  HeroSettings,
  ServiceInput,
  SocialLinkInput,
} from "../backend";
import { useActor } from "./useActor";

// ── Content ──────────────────────────────────────────────────────────────────

export function useGetAllContent() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["allContent"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Authentication ────────────────────────────────────────────────────────────

export function useLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      if (!actor) throw new Error("Actor not available");
      const token = await actor.login(username, password);
      return token;
    },
  });
}

// ── Hero Settings ─────────────────────────────────────────────────────────────

export function useGetHeroSettings() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["heroSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getHeroSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHeroSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      settings,
      sessionToken,
    }: { settings: HeroSettings; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHeroSettings(settings, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroSettings"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── Site Title ────────────────────────────────────────────────────────────────

export function useUpdateSiteTitle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      sessionToken,
    }: { title: string; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSiteTitle(title, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── About Section ─────────────────────────────────────────────────────────────

export function useUpdateAboutSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      text,
      sessionToken,
    }: { text: string; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAboutSection(text, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

export function useUpdateAboutImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      newImage,
      sessionToken,
    }: { newImage: AboutImage; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAboutImage(newImage, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

export function useDeleteAboutImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionToken }: { sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAboutImage(sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── Header Image ──────────────────────────────────────────────────────────────

export function useUpdateHeaderImageBase64() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageBase64,
      sessionToken,
    }: { imageBase64: string; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHeaderImageBase64(imageBase64, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

export function useDeleteHeaderImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionToken }: { sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteHeaderImage(sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── Hero Background Image ─────────────────────────────────────────────────────

export function useGetImages() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHeroBackgroundImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageUrl,
      imageBase64,
      sessionToken,
    }: { imageUrl: string; imageBase64: string; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateHeroBackgroundImage(
        imageUrl,
        imageBase64,
        sessionToken,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

export function useDeleteHeroBackgroundImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionToken }: { sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteHeroBackgroundImage(sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── Clinics ───────────────────────────────────────────────────────────────────

export function useGetAllClinics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["clinics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllClinics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clinic,
      sessionToken,
    }: { clinic: ClinicInput; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addClinic(clinic, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
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
    }: { id: bigint; clinic: ClinicInput; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateClinic(id, clinic, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

export function useDeleteClinic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      sessionToken,
    }: { id: bigint; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteClinic(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── Services ──────────────────────────────────────────────────────────────────

export function useGetAllServices() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      service,
      sessionToken,
    }: { service: ServiceInput; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addService(service, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
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
    }: { id: bigint; service: ServiceInput; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateService(id, service, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      sessionToken,
    }: { id: bigint; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteService(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
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
    }: { serviceId: bigint; imageBase64: string; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateServiceIconBase64(
        serviceId,
        imageBase64,
        sessionToken,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
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
    }: { serviceId: bigint; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteServiceIcon(serviceId, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── Social Links ──────────────────────────────────────────────────────────────

export function useGetAllSocialLinks() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllSocialLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSocialLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      link,
      sessionToken,
    }: { link: SocialLinkInput; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addSocialLink(link, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
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
    }: { id: bigint; link: SocialLinkInput; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSocialLink(id, link, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

export function useDeleteSocialLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      sessionToken,
    }: { id: bigint; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteSocialLink(id, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function useUpdateFooterContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      sessionToken,
    }: { content: string; sessionToken: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateFooterContent(content, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allContent"] });
    },
  });
}
