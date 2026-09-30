# What is in this website package

Package prepared 30 September 2026 from the current Clean Heights Initiative repository, with the source images optimized in the package copy only.

## Present in this package

- Home page with the lighter hero photo overlay and a simple “Latest News” heading.
- About page with “Our Pillars” covering Environmental Conservation and Community Development.
- “Our Initiatives” navigation dropdown with Programs and Activities and Field Activities and Milestones.
- Corrected Team page data for Cynthia Jelagat and Roy Chumba; Roy is listed as Chief Information Officer and the biography uses the student information supplied by the organization. Roy's portrait has not been supplied, so a neutral placeholder is shown.
- CMS sign-in, one-time first-admin setup, programs, activities, and an image library. CMS image uploads are processed to WebP, capped at 8 MB per source image and resized up to 2,400 × 1,800 pixels.
- Cookie/storage notice and Privacy, Cookies, Terms, and Accessibility pages. These are drafts; see the legal-review note in `CMS-NAMECHEAP-SETUP.md`.
- Search metadata for each public route, canonical and social-share tags, organization/team structured data, and a generated sitemap with real local image references.
- Faster cPanel build settings and live/database health endpoints.

## Still not implemented or not verified

- The package does **not** include a looping homepage background video. There is no video asset or video player in the current source.
- The CMS does **not** control every photograph and background across the website. News images and the milestone gallery are still outside the CMS controls.
- News stories are still fetched from the separate blog subdomain. Their story URLs, metadata, and sitemap need a separate blog audit. The news system has not been replaced with CMS-managed article pages.
- Published programs do not yet have individual, stable page URLs. The public CMS currently lists programs and activities together on `/programs`.
- The favicon file itself has not been redrawn from the official logo. The HTML references it with a new cache version, but this alone does not change the icon artwork.
- The cookie notice explains currently used browser storage; it is not a reject/accept preference manager for analytics or advertising. Those trackers are not in the current app code.
- The administrator login email is not the same as the public contact email. The public contact email, news copy/photos, and all milestone-gallery photos are not editable through the current CMS; they remain code-managed.
- The legal pages are drafts and have not been reviewed by a Kenyan lawyer or checked against every provider and data-handling practice.
- Search performance, Google indexing, Bing indexing, rankings, and the live Namecheap deployment have not been verified from the organization's Search Console or hosting account. The latest deployment evidence showed a LiteSpeed 503.

## 1 October 2026 — lower-friction activity publishing

- Added **+ Add activity** on each CMS program card. It opens the activity form with the parent program preselected.
- Published activity cards now expose their full descriptions through a keyboard-accessible **Read activity details** disclosure, including activities nested inside programs.
- Made the cookie notice state its use of browser storage clearly and labeled the action **Close notice**. The footer **Cookie settings** link reopens it after it has been closed.
- Added `FILE-MANAGER-AND-CMS-GUIDE.md` with browser-only cPanel upload directions, first administrator setup, and beginner steps for programs, nested activities, standalone activities, and images.

## Photo-quality choice

This package uses JPEG copies up to 1,920 pixels on the long edge at quality 80. That preserves more detail than the earlier quality-64/1,280-pixel package. The source photographs in the repository are not overwritten. The package may exceed the earlier 30 MB target; visual quality was prioritized after feedback that the smaller copies looked poor.
