# Dr. Malay Akechan - General Physician

## Current State
- Single-page app with sections: Hero, About, Services, Clinics, Social Media, Footer
- Backend: Motoko with full CRUD for site content (siteTitle, about, services, clinics, socialLinks, footerContent, images, heroSettings)
- Authentication: username "malay" / password "duke46" via session token stored in sessionStorage/localStorage
- Admin panel at /admin with sidebar navigation and section editors
- Existing admin editors: AboutEditor, ClinicsManager, ServicesManager, SocialLinksManager, FooterEditor, HeaderEditor, HeroSettingsEditor, ImagesManager
- Universal hover-to-edit partially implemented via EditableField component
- Some default text / placeholder content still renders when fields are empty
- About section layout is basic two-column
- Service and Clinic cards have basic glass-card styling but not fully high-tech
- Admin panel uses different visual language than the main site
- Footer is duplicated in some render paths (bug was partially fixed)

## Requested Changes (Diff)

### Add
- Universal hover-to-edit overlay system: when admin is logged in (sessionToken in sessionStorage/localStorage), hovering over ANY editable element on the main page shows a pencil/edit icon overlay, clicking it opens an inline or modal edit form without navigating away
- EditOverlay context provider that wraps the entire app, exposes `isAdminLoggedIn` and edit dispatch
- High-tech card redesign for both Service cards and Clinic cards with: gradient border shimmer, glassmorphism surface, animated top/bottom accent lines on hover, glow effect, multicolor gradient badge/icon area
- Structured About section: left column = profile image in a premium bordered frame with corner accents and status badge; right column = structured bio with labeled sections (Name, Specialization, Experience, Bio text), each as its own styled panel inside a glass container
- Rebuilt AdminDashboard with consistent styling matching main site (same dark background, glass cards, gradient accents, Space Grotesk typography, cyan/violet color palette)
- "Return to Site" link in admin that goes back to homepage with hover-to-edit mode active

### Modify
- ALL sections: remove every default/fallback text and image — if content is empty string or empty array, render nothing (section becomes invisible/zero-height or returns null)
- Hero section: siteTitle only shown if non-empty; subtitle text only shown if non-empty (no hardcoded fallback like "Dr. Malay Parekh"); stats row only shown if at least one stat has a non-empty value
- About section: only render if aboutText OR aboutImage is present; restructure layout into premium two-panel layout with structured fields
- Services section: only render section if services array is non-empty; remove "No services listed yet." message
- Clinics section: only render if clinics array is non-empty (already partially done)
- Footer: remove hardcoded "Dedicated to providing exceptional medical care..." fallback text; only show footerContent if non-empty; keep structural footer (quick links, copyright) always visible but content columns only if data present
- SocialMedia section: only render if socialLinks array is non-empty
- AdminDashboard sidebar: match main site visual language (same dark glass sidebar, gradient active states, consistent icon colors)
- AdminLogin: preserve exact login logic (username: malay, password: duke46, session token storage)

### Remove
- All hardcoded fallback strings and placeholder content in all page sections
- Skeleton loading placeholders that show default shapes (replace with empty/null renders)
- Any duplicate Footer render

## Implementation Plan
1. Create `src/frontend/src/context/AdminEditContext.tsx` — context that reads sessionToken from storage, exposes `isAdminLoggedIn: boolean`, and a `triggerEdit(section, id?)` function
2. Create `src/frontend/src/components/HoverEditWrapper.tsx` — a wrapper component that, when `isAdminLoggedIn` is true, shows a pencil icon overlay on hover with a click handler
3. Rewrite `src/frontend/src/pages/Home.tsx` — strip all fallback text; only render content if non-empty
4. Rewrite `src/frontend/src/pages/About.tsx` — structured two-panel layout; only render if content present; add HoverEditWrapper on image and bio text
5. Rewrite `src/frontend/src/pages/Services.tsx` — high-tech card design; return null if empty; add HoverEditWrapper on each card
6. Rewrite `src/frontend/src/pages/Clinics.tsx` — high-tech card design; return null if empty; add HoverEditWrapper on each card
7. Rewrite `src/frontend/src/pages/SocialMedia.tsx` — return null if empty social links
8. Update `src/frontend/src/components/Footer.tsx` — remove fallback content; preserve structure
9. Rewrite `src/frontend/src/components/AdminDashboard.tsx` — rebuild UI to match main site dark glass aesthetic
10. Wrap App.tsx root with AdminEditContext provider
11. Integrate HoverEditWrapper triggers that open inline modals or navigate to admin with deep-link to correct section
