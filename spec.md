# Specification

## Summary
**Goal:** Enhance the Doctor Portfolio with an advanced footer, Roboto headings, expanded hero theme settings, and particle effect selection in the admin panel.

**Planned changes:**
- Redesign the Footer into a multi-column layout (branding/bio, quick navigation, contact/clinic info, social media) with a bottom bar, copyright text, divider, and full responsiveness — visually consistent with the rest of the UI (warm neutral tones, teal accents, card-based aesthetic)
- Import Roboto from Google Fonts and apply it as the primary font for all headings (h1–h6) across all pages and components; update Tailwind config accordingly
- Expand the HeroSettingsEditor admin panel with new controls: gradient start/end color pickers, overlay opacity slider, text color selector, background blur toggle, glassmorphism intensity slider, hero height selector (compact/normal/full-screen), animation speed control, mouse parallax toggle, and a live preview thumbnail; persist all new fields to the backend and apply them on the public Hero section
- Add an advanced particle effect selection system to HeroSettingsEditor: a grid of at least 10 named presets (None, Floating Dots, Stars, Snow, Bubbles, Geometric Shapes, DNA Helix, Medical Pulse, Confetti, Fireflies) with animated preview thumbnails, plus fine-tuning controls (particle count, size range, speed, color, opacity); implement particle rendering in the ParticleCanvas component using canvas or CSS animations

**User-visible outcome:** The site features a polished multi-column footer, Roboto headings throughout, and a greatly enhanced admin hero settings panel where admins can configure gradients, overlays, animations, and rich particle effects that are reflected live on the public hero section.
