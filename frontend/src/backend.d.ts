import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Clinic {
    name: string;
    description: string;
    address: string;
    mapUrl: string;
    phone: string;
    bookingUrl: string;
}
export interface ClinicInput {
    name: string;
    description: string;
    address: string;
    mapUrl: string;
    phone: string;
    bookingUrl: string;
}
export interface GlowEffectSetting {
    color: string;
    enabled: boolean;
    style: string;
    intensity: bigint;
}
export interface SocialLink {
    url: string;
    platform: string;
}
export interface Service {
    title: string;
    description: string;
    iconBase64: string;
    iconUrl: string;
}
export interface Images {
    heroBackgroundUrl: string;
    heroBackgroundBase64: string;
}
export interface HeroSettings {
    showConnectionLines: boolean;
    backgroundEffect: string;
    footerGlowEffect: GlowEffectSetting;
    particleColor: string;
    particleCount: bigint;
    heroGradientStart: string;
    particleSpeed: number;
    heroGradientEnd: string;
    mouseInteraction: boolean;
    heroGlowEffect: GlowEffectSetting;
    particleSize: number;
    glassmorphismEnabled: boolean;
}
export interface AboutImage {
    imageType: string;
    imageUrl: string;
    imageBase64: string;
}
export interface ServiceInput {
    title: string;
    description: string;
    iconBase64: string;
    iconUrl: string;
}
export interface SocialLinkInput {
    url: string;
    platform: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addClinic(clinic: ClinicInput, sessionToken: string): Promise<void>;
    addService(service: ServiceInput, sessionToken: string): Promise<void>;
    addSocialLink(link: SocialLinkInput, sessionToken: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAboutImage(sessionToken: string): Promise<void>;
    deleteClinic(id: bigint, sessionToken: string): Promise<void>;
    deleteHeaderImage(sessionToken: string): Promise<void>;
    deleteHeroBackgroundImage(sessionToken: string): Promise<void>;
    deleteService(id: bigint, sessionToken: string): Promise<void>;
    deleteServiceIcon(serviceId: bigint, sessionToken: string): Promise<void>;
    deleteSocialLink(id: bigint, sessionToken: string): Promise<void>;
    getAboutSection(): Promise<[string, AboutImage]>;
    getAllClinics(): Promise<Array<[bigint, Clinic]>>;
    getAllContent(): Promise<{
        clinics: Array<[bigint, Clinic]>;
        headerImageUrl: string;
        heroSettings: HeroSettings;
        siteTitle: string;
        aboutImage: AboutImage;
        aboutSection: string;
        socialLinks: Array<[bigint, SocialLink]>;
        headerImageBase64: string;
        services: Array<[bigint, Service]>;
        footerContent: string;
        images: Images;
    }>;
    getAllServices(): Promise<Array<[bigint, Service]>>;
    getAllSocialLinks(): Promise<Array<[bigint, SocialLink]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFooterContent(): Promise<string>;
    getHeaderImageBase64(): Promise<string>;
    getHeroSettings(): Promise<HeroSettings>;
    getImages(): Promise<Images>;
    getServiceIconBase64(serviceId: bigint): Promise<string>;
    getSiteTitle(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Login with username/password; returns a session token on success.
     */
    login(username: string, password: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAboutImage(newImage: AboutImage, sessionToken: string): Promise<void>;
    updateAboutSection(text: string, sessionToken: string): Promise<void>;
    updateClinic(id: bigint, newClinicInput: ClinicInput, sessionToken: string): Promise<void>;
    updateFooterContent(content: string, sessionToken: string): Promise<void>;
    updateHeaderImageBase64(imageBase64: string, sessionToken: string): Promise<void>;
    updateHeroBackgroundImage(imageUrl: string, imageBase64: string, sessionToken: string): Promise<void>;
    updateHeroSettings(newSettings: HeroSettings, sessionToken: string): Promise<void>;
    updateService(id: bigint, newServiceInput: ServiceInput, sessionToken: string): Promise<void>;
    updateServiceIconBase64(serviceId: bigint, imageBase64: string, sessionToken: string): Promise<void>;
    updateSiteTitle(title: string, sessionToken: string): Promise<void>;
    updateSocialLink(id: bigint, newLinkInput: SocialLinkInput, sessionToken: string): Promise<void>;
    upgradePersistentContent(heroBgUrl: string, heroBgBase64: string, siteTitleValue: string, aboutSectionText: string, aboutImgUrl: string, aboutImgBase64: string, headerImgUrl: string, headerImgBase64: string, footerContentText: string, clinicEntries: Array<[bigint, ClinicInput]>, serviceEntries: Array<[bigint, ServiceInput]>, sessionToken: string): Promise<void>;
    /**
     * / Validates a session token (public, read-only check).
     */
    validateSessionToken(sessionToken: string): Promise<void>;
}
