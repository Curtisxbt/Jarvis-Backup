# HISTORY.md

## 2026-03-15
- Skill created as a minimal test implementation.
- Scope v1: open the connected Google Business / Google reviews page for Nuit Blanche Production and read visible reviews only.
- Explicit non-goals: replying to reviews, editing profile data, posting anything, or using the isolated browser when the connected session is required.
- Correction validée : pour ce skill, l’usage réel est la lecture des **avis publics** de Nuit Blanche Production depuis Google Search / knowledge panel / URL publique d’avis. L’accès Google Business connecté n’est pas requis.
- Test public validé : la SERP Google publique permet de lire les avis visibles de Nuit Blanche Production, avec note affichée `5,0/5` et `12 avis` au moment du test.
- Étape 2 appliquée au skill : ajout de sections structurées `Preconditions`, `Preferred entry points` et `Known failure modes` pour rendre le skill plus robuste et explicite.

### Post-mortem 001
- Task wanted: lire les avis Google de Nuit Blanche Production.
- What happened: premier test lancé via `business.google.com` avec une hypothèse implicite d’accès Google Business connecté.
- Failure point: la page ouverte était la landing page marketing Business Profile, pas la surface publique ou admin utile pour les avis.
- Probable cause: mauvais point d’entrée + mauvaise hypothèse sur la nécessité d’un accès connecté au bon compte.
- Correction applied: recentrage du skill sur les **avis publics** Google ; priorité donnée aux URLs publiques / SERP locale / knowledge panel.
- Result after correction: lecture publique des avis validée avec succès.

### Amendment 001
- Hypothèse invalidée: “il faut passer par Google Business connecté pour lire les avis”.
- Changement durable appliqué à `SKILL.md`: usage public-first, connexion optionnelle, `business.google.com` non prioritaire.
