# HISTORY.md

## 2026-03-15
- Skill created as a minimal test implementation.
- Scope v1: open the connected Google Business / Google reviews page for Nuit Blanche Production and read visible reviews only.
- Explicit non-goals: replying to reviews, editing profile data, posting anything, or using the isolated browser when the connected session is required.
- Test réel sur Jarvis : ouverture du Chrome principal OK, mais première hypothèse erronée sur le compte Google / l’accès admin. `https://business.google.com/` mène vers la landing page marketing Business Profile au lieu de l’interface de gestion des établissements / avis.
- Correction validée : pour ce skill, l’usage réel est la lecture des **avis publics** de Nuit Blanche Production depuis Google Search / knowledge panel / URL publique d’avis. L’accès Google Business connecté n’est pas requis.
- Test public validé : la SERP Google publique permet de lire les avis visibles de Nuit Blanche Production, avec note affichée `5,0/5` et `12 avis` au moment du test.
