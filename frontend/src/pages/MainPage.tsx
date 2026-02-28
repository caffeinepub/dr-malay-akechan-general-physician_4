import React from 'react';
import {
  useGetAllContent,
  useUpdateSiteTitle,
  useUpdateAboutSection,
  useUpdateClinic,
  useUpdateService,
  useUpdateSocialLink,
  useUpdateFooterContent,
} from '../hooks/useQueries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from './Home';
import About from './About';
import Services from './Services';
import Clinics from './Clinics';
import SocialMedia from './SocialMedia';

export default function MainPage() {
  const { data: content, isLoading } = useGetAllContent();
  const updateTitleMutation = useUpdateSiteTitle();
  const updateAboutMutation = useUpdateAboutSection();
  const updateClinicMutation = useUpdateClinic();
  const updateServiceMutation = useUpdateService();
  const updateSocialLinkMutation = useUpdateSocialLink();
  const updateFooterMutation = useUpdateFooterContent();

  // Read from both storages for compatibility
  const sessionToken =
    sessionStorage.getItem('adminSessionToken') ||
    localStorage.getItem('adminSessionToken');

  const handleUpdateTitle = (title: string) => {
    if (!sessionToken) return;
    updateTitleMutation.mutate({ title, sessionToken });
  };

  const handleUpdateAbout = (text: string) => {
    if (!sessionToken || !content) return;
    updateAboutMutation.mutate({
      text,
      imageUrl: content.aboutImageUrl,
      sessionToken,
    });
  };

  const handleUpdateClinicName = (id: bigint, name: string) => {
    if (!sessionToken || !content) return;
    const clinic = content.clinics.find(([cid]) => cid === id)?.[1];
    if (!clinic) return;
    updateClinicMutation.mutate({ id, clinic: { ...clinic, name }, sessionToken });
  };

  const handleUpdateClinicDescription = (id: bigint, description: string) => {
    if (!sessionToken || !content) return;
    const clinic = content.clinics.find(([cid]) => cid === id)?.[1];
    if (!clinic) return;
    updateClinicMutation.mutate({ id, clinic: { ...clinic, description }, sessionToken });
  };

  const handleUpdateServiceTitle = (id: bigint, title: string) => {
    if (!sessionToken || !content) return;
    const service = content.services.find(([sid]) => sid === id)?.[1];
    if (!service) return;
    updateServiceMutation.mutate({ id, service: { ...service, title }, sessionToken });
  };

  const handleUpdateServiceDescription = (id: bigint, description: string) => {
    if (!sessionToken || !content) return;
    const service = content.services.find(([sid]) => sid === id)?.[1];
    if (!service) return;
    updateServiceMutation.mutate({ id, service: { ...service, description }, sessionToken });
  };

  const handleUpdateSocialPlatform = (id: bigint, platform: string) => {
    if (!sessionToken || !content) return;
    const link = content.socialLinks.find(([lid]) => lid === id)?.[1];
    if (!link) return;
    updateSocialLinkMutation.mutate({ id, link: { ...link, platform }, sessionToken });
  };

  const handleUpdateSocialUrl = (id: bigint, url: string) => {
    if (!sessionToken || !content) return;
    const link = content.socialLinks.find(([lid]) => lid === id)?.[1];
    if (!link) return;
    updateSocialLinkMutation.mutate({ id, link: { ...link, url }, sessionToken });
  };

  const handleUpdateFooter = (text: string) => {
    if (!sessionToken) return;
    updateFooterMutation.mutate({ content: text, sessionToken });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-body text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-800">
      <Header siteTitle={content?.siteTitle} />

      <main>
        <Home
          siteTitle={content?.siteTitle}
          heroSettings={content?.heroSettings}
          heroBackgroundUrl={content?.images?.heroBackgroundUrl}
          heroBackgroundBase64={content?.images?.heroBackgroundBase64}
          onUpdateTitle={handleUpdateTitle}
        />

        {content?.aboutSection && (
          <About
            aboutSection={content.aboutSection}
            aboutImageUrl={content.aboutImageUrl}
            aboutImageBase64={content.aboutImageBase64}
            onUpdateAbout={handleUpdateAbout}
          />
        )}

        {content?.services && content.services.length > 0 && (
          <Services
            services={content.services}
            onUpdateTitle={handleUpdateServiceTitle}
            onUpdateDescription={handleUpdateServiceDescription}
          />
        )}

        {content?.clinics && content.clinics.length > 0 && (
          <Clinics
            clinics={content.clinics}
            onUpdateName={handleUpdateClinicName}
            onUpdateDescription={handleUpdateClinicDescription}
          />
        )}

        {content?.socialLinks && content.socialLinks.length > 0 && (
          <SocialMedia
            socialLinks={content.socialLinks}
            onUpdatePlatform={handleUpdateSocialPlatform}
            onUpdateUrl={handleUpdateSocialUrl}
          />
        )}
      </main>

      <Footer
        siteTitle={content?.siteTitle}
        footerContent={content?.footerContent}
        socialLinks={content?.socialLinks}
        onUpdateFooter={handleUpdateFooter}
      />
    </div>
  );
}
