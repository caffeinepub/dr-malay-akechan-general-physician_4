import React from 'react';
import Home from './Home';
import About from './About';
import Services from './Services';
import Clinics from './Clinics';
import SocialMedia from './SocialMedia';
import {
  useGetAllContent,
  useUpdateSiteTitle,
  useUpdateAboutSection,
  useUpdateClinic,
  useUpdateService,
} from '../hooks/useQueries';

export default function MainPage() {
  const { data: content } = useGetAllContent();

  const updateTitleMutation = useUpdateSiteTitle();
  const updateAboutMutation = useUpdateAboutSection();
  const updateClinicMutation = useUpdateClinic();
  const updateServiceMutation = useUpdateService();

  const sessionToken =
    sessionStorage.getItem('adminSessionToken') ||
    localStorage.getItem('adminSessionToken');

  const handleUpdateTitle = async (title: string) => {
    if (!sessionToken) return;
    await updateTitleMutation.mutateAsync({ title, sessionToken });
  };

  const handleUpdateAbout = async (text: string, imageUrl: string) => {
    if (!sessionToken) return;
    await updateAboutMutation.mutateAsync({ text, imageUrl, sessionToken });
  };

  const handleUpdateClinicName = async (id: bigint, name: string) => {
    if (!sessionToken || !content) return;
    const clinic = content.clinics.find(([cid]) => cid === id)?.[1];
    if (!clinic) return;
    await updateClinicMutation.mutateAsync({ id, clinic: { ...clinic, name }, sessionToken });
  };

  const handleUpdateClinicDescription = async (id: bigint, description: string) => {
    if (!sessionToken || !content) return;
    const clinic = content.clinics.find(([cid]) => cid === id)?.[1];
    if (!clinic) return;
    await updateClinicMutation.mutateAsync({ id, clinic: { ...clinic, description }, sessionToken });
  };

  const handleUpdateServiceTitle = async (id: bigint, title: string) => {
    if (!sessionToken || !content) return;
    const service = content.services.find(([sid]) => sid === id)?.[1];
    if (!service) return;
    await updateServiceMutation.mutateAsync({ id, service: { ...service, title }, sessionToken });
  };

  const handleUpdateServiceDescription = async (id: bigint, description: string) => {
    if (!sessionToken || !content) return;
    const service = content.services.find(([sid]) => sid === id)?.[1];
    if (!service) return;
    await updateServiceMutation.mutateAsync({ id, service: { ...service, description }, sessionToken });
  };

  return (
    <>
      <Home onUpdateSiteTitle={sessionToken ? handleUpdateTitle : undefined} />
      <About onUpdateAbout={sessionToken ? handleUpdateAbout : undefined} />
      <Services
        onUpdateServiceTitle={sessionToken ? handleUpdateServiceTitle : undefined}
        onUpdateServiceDescription={sessionToken ? handleUpdateServiceDescription : undefined}
      />
      <Clinics
        onUpdateClinicName={sessionToken ? handleUpdateClinicName : undefined}
        onUpdateClinicDescription={sessionToken ? handleUpdateClinicDescription : undefined}
      />
      <SocialMedia />
    </>
  );
}
