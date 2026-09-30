# Clean Heights Initiative: search visibility plan

Updated 30 September 2026. This plan separates work already prepared in the code from actions that need the live hosting account or real organizational information.

## What this site is aiming to be found for

Start with searches that accurately describe the work and place: Clean Heights Initiative; community-led environmental conservation in Iten; water-source protection in Elgeyo Marakwet; community ecosystem restoration in Kenya; and the specific names of real programs and field activities. These are better initial targets than the broad, crowded query “NGOs in Kenya.” Do not claim NGO registration, results, partnerships, staff credentials, or locations that the organization cannot document.

## Changes prepared in the website

- Added individual page titles, descriptions, canonical links, and Open Graph/Twitter sharing metadata. The Node app places these values in the initial HTML response as well as updating them during client-side navigation.
- Added Organization structured data using the NGO type, the public contact details already displayed on the site, location information, and the organization's existing social profiles. The team page includes visible-person data for Cynthia Jelagat and Roy Chumba.
- Added a build-time sitemap generator that lists public pages and real local milestone images found in the site data. It avoids invented `lastmod` dates and excludes legal and admin pages.
- Allowed crawlers to read the admin route so that its `noindex` instruction can be seen; API routes remain disallowed. Admin pages are marked `noindex, nofollow` in server HTML.
- Redirected the obsolete `/projects` route to the current `/programs` page.
- Corrected the team data name and role shown on the Team page, added Roy's requested role and student information, and replaced the homepage news heading with “Latest News.”

Structured data helps identify an organization. It is not a ranking switch and does not guarantee a knowledge panel or rich result.

## Required after deployment

1. The website must return normal `200` responses to public pages, `/robots.txt`, and `/sitemap.xml`. Fix the current cPanel/Passenger `503` first; crawlers cannot index pages that are unavailable.
2. The organization owner should add and verify `cleanheightsinitiative.org` as a **Domain property** in Google Search Console. Google will provide a DNS TXT record; add that exact record in Namecheap's domain DNS settings. Then submit `https://cleanheightsinitiative.org/sitemap.xml` and inspect `/`, `/about`, `/team`, `/programs`, and `/milestones` with URL Inspection.
3. Add the site to Bing Webmaster Tools. Importing the verified Search Console property is the simplest start. Review crawl and indexing reports there.
4. Confirm that the phone number, email, Iten location, official name, social accounts, and descriptions in the site are current and consistently represented on the organization's real profiles and partner pages.
5. Only create a Google Business Profile if the organization meets Google's in-person eligibility rules and can accurately represent a staffed, authorized location. Do not create a false storefront or duplicate listing.

## Work that needs real content or access

- The CMS does not yet control every site image: news and milestone gallery media still need controls. Programs and activities can use their own uploaded images.
- Roy's actual portrait has not been supplied. The Team page currently uses a neutral placeholder, so the site cannot make Roy's photograph searchable yet. Upload a genuine, high-quality portrait with permission and descriptive alt text once the CMS is working.
- The program CMS currently produces one listing page rather than a stable, standalone page URL for each program. For durable search visibility, each published program needs its own crawlable URL, title, description, canonical link, image, and activity list.
- News stories are hosted on the separate blog subdomain and linked using query-string IDs. Review that blog for working public story URLs, unique page titles and descriptions, crawlability, canonical URLs, and a sitemap.
- Confirm the team bios, program dates, claimed outcomes, partner descriptions, and all photographs before publication. The site contains older narrative/statistic claims; use only figures supported by records and name the period and source for any impact number.
- A page about Cynthia or Roy should only include a verified profile link. Search results for people with these names can refer to different individuals; do not attach a possibly unrelated LinkedIn profile.

## Ongoing publishing routine

For each real program or activity, record its location, date or period, purpose, who participated, what actually happened, results that can be evidenced, and next steps. Add original photos with consent, useful filenames, accurate alt text, and a short caption explaining what the image shows. Link the story from the relevant program and location pages. Update old details when they change; do not refresh dates without changing the content.

Once a month, review Search Console queries, indexed pages, clicks, impressions, and mobile experience. Track branded searches separately from local non-branded searches. Use the data to improve a page that has impressions but weak clicks or a relevant page that gets no impressions. Ranking varies by location, query, competition, and time; nobody can promise first place for every broad keyword.

## What current guidance and practitioner discussions say

Google's current guidance says the same crawlability, useful content, and page-experience fundamentals apply to AI Overviews and AI Mode. It explicitly says `llms.txt`, special “AI schema,” forced content chunking, and rewritten AI-only copy are not required for Google AI visibility. Reddit threads discussing Google's 2026 guide reached the same practical conclusion, while practitioner anecdotes about other AI services are inconsistent and are not reliable evidence of a ranking factor. Stack Overflow discussions about React search visibility emphasize that client-rendered pages can be indexed but make crawl timing and per-route metadata harder; this implementation makes per-route metadata available in the first HTML response, but the page body is still React-rendered. Quora did not provide accessible, verifiable evidence in this review.

Further development should prioritize unique URLs and initial HTML for each published program and news story, site reliability, real first-hand reporting, correct names and image rights, and verified search-console data—not keyword stuffing, fake mentions, or paid “AI ranking” promises.
