---
name: x-goats-recap
description: Open X/Twitter in the user’s real Chrome session, navigate to the GOATS list, inspect tweets from the last 24 hours, and produce a complete recap in French. Use when asked to review, summarize, recap, or scan the GOATS Twitter/X list over the last 24 hours.
---

# X GOATS Recap

Use the user’s real Chrome session (`profile="user"`).

## Preconditions

- X/Twitter must be accessible in the real connected browser.
- The user session must already have access to the GOATS feed/tab/list context.
- The browser must allow reading tweet timestamps and scrolling the feed.

## Preferred entry points

1. Open X home if the GOATS tab is already visible in the feed tabs.
2. If the GOATS tab is not immediately visible, navigate within the connected X session until the GOATS context is found.
3. Reuse the existing connected X context instead of opening unrelated pages first.

## Known failure modes

- The GOATS context may appear as a tab in the main feed rather than as a standalone list page.
- Some tweets are truncated and require `Voir plus`.
- Reposts and quoted tweets can pollute the recap if not separated from original posts.
- The 24h window may require scrolling because not all relevant tweets are visible at first load.
- Date labels may mix relative times (`45 min`, `8h`) and calendar dates (`14 mars`).

## Workflow

1. Open X/Twitter in the connected user browser.
2. Navigate to the GOATS list.
3. Read the visible tweets, then continue scrolling until the feed clearly passes beyond the last 24 hours.
4. Include tweets from the last 24 hours only.
5. Exclude tweets older than 24 hours.
6. Separate original tweets from reposts / quotes when needed to avoid overcounting the same idea.
7. Produce a complete recap in French as a single text block.
8. Summarize the main important ideas, repeated narratives, and notable signals instead of listing raw tweets one by one unless the user asks for that.

## Constraints

- Do not like, reply, repost, bookmark, or post.
- Do not modify the list.
- Stay in the real connected browser.
- Do not stop at the first visible screen if the request is for the last 24 hours.
- If the GOATS list cannot be found, say exactly what blocked access.

## Output style

Default output:
- one coherent French text block
- main ideas from the last 24h
- repeated narratives
- most important signals
- concise synthesis, not a raw feed dump
