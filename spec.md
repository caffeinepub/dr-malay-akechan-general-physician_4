# Specification

## Summary
**Goal:** Fix mobile responsiveness across the entire public-facing site and update the admin login button label from "Admin" to "Login".

**Planned changes:**
- Make the Header (navigation, anchor links, admin panel link) fully responsive on mobile with adequate touch targets
- Fix the Home/Hero section (particle canvas, hero image, site title) layout on mobile
- Stack the two-column About section to a single column on mobile
- Collapse Services and Clinics grids to a single column on mobile
- Fix SocialMedia section and Footer layout/overflow on mobile
- Ensure no horizontal overflow, text overflow, or clipped content at 375px viewport width
- Change the admin login button label from "Admin" to "Login" in both the AdminPanel page and Header component (no changes to behavior, styling, or auth logic)

**User-visible outcome:** The public-facing site renders correctly and is fully usable on mobile devices, and the admin access button displays "Login" instead of "Admin".
