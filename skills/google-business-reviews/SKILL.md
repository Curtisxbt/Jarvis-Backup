---
name: google-business-reviews
description: Read public Google reviews for Nuit Blanche Production from Google Search / local knowledge panel / public review pages. Use when asked to check, read, summarize, or inspect Google reviews / Google Business reviews / GBP reviews for Nuit Blanche Production. Prefer public review URLs first; connected Google Business access is optional, not required.
---

# Google Business Reviews

Prefer the user’s real Chrome session (`profile="user"`), but do not depend on Google Business admin access when the request is only to read public reviews.

## Preconditions

- A browser must be available on Jarvis.
- Public Google Search / knowledge panel access must load normally.
- Google Business admin access is **not required** for public review reading.

## Preferred entry points

1. A direct public Google review URL provided by the user.
2. A Google Search results page showing the local knowledge panel and public reviews.
3. A generic public Google query for Nuit Blanche Production reviews.

Avoid using `business.google.com` as the first entry point for this skill when the task is only to read public reviews.

## Known failure modes

- `business.google.com` opens the marketing / landing page instead of the real establishment review surface.
- The browser may be connected to an unrelated Google account; this does not matter for public review reading.
- Google may collapse or truncate some reviews, requiring “Voir tout l'avis” or “Afficher tous les avis”.
- Search result layouts may shift, so the local review block may appear in different positions.

## Workflow

1. Open the public Google Search / local reviews page for Nuit Blanche Production.
2. Read the visible public reviews.
3. Return a concise summary in French.
4. If asked for details, include reviewer names, ratings, dates, and notable themes.
5. If a public direct review URL is provided by the user, use it as the primary entry point.

## Constraints

- Do not post replies to reviews.
- Do not modify the business profile.
- Do not require Google Business admin access for public review reading.
- Use a connected session only as a browser context, not as proof of ownership or admin access.
- If the public review page is not accessible, say exactly what blocked access.

## Output style

Default output:
- overall rating if visible
- total number of reviews if visible
- number of visible reviews checked
- overall tone
- notable positive points
- notable negative points

If the user asks for a specific review, quote only the needed part.
