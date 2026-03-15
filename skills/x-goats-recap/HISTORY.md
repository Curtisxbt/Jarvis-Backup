# HISTORY.md

## 2026-03-15
- Skill created as a minimal test implementation.
- Scope v1: open X/Twitter in the connected browser, navigate to the GOATS list, inspect tweets from the last 24 hours, and return a French recap.
- Explicit non-goals: liking, replying, reposting, bookmarking, posting, or modifying the list.
- Test réel validé partiellement : accès à X OK, liste `GOATS` accessible directement depuis les tabs du feed, et plusieurs posts de moins de 24h sont visibles/lisibles.
- Étape 2 appliquée au skill : ajout de sections structurées `Preconditions`, `Preferred entry points` et `Known failure modes`.

### Post-mortem 001
- Task wanted: ouvrir la liste GOATS et lire les tweets des 24 dernières heures.
- What happened: la liste GOATS était directement accessible dans les tabs, sans devoir chercher une page de liste dédiée.
- Failure point: aucun blocage d’accès majeur sur l’ouverture ou la navigation initiale.
- Probable cause: n/a.
- Correction applied: ajout des prérequis, points d’entrée préférés et modes d’échec connus dans `SKILL.md`.
- Result after correction: skill plus explicite et mieux cadré pour le prochain test complet.

### Amendment 001
- Hypothèse validée: la liste GOATS peut exister comme tab visible dans le feed principal X, pas forcément comme page de liste dédiée.
- Changement durable appliqué à `SKILL.md`: priorité donnée au contexte X existant et à la tab GOATS visible avant toute autre navigation.

### Post-mortem 002
- Task wanted: lire tous les tweets des 24 dernières heures et produire un recap en bloc.
- What happened: un premier rendu a été fait à partir des tweets visibles seulement, donc partiel.
- Failure point: arrêt trop tôt au viewport initial au lieu de parcourir toute la fenêtre temporelle demandée.
- Probable cause: skill trop flou sur l’exigence de scroll exhaustif jusqu’à sortir de la fenêtre 24h.
- Correction applied: `SKILL.md` exige maintenant explicitement de scroller jusqu’à dépasser 24h, filtrer les tweets hors fenêtre, et rendre un recap texte en bloc.
- Result after correction: le skill est aligné avec la vraie attente utilisateur.

### Amendment 002
- Hypothèse invalidée: “lire les tweets visibles suffit pour un recap 24h”.
- Changement durable appliqué à `SKILL.md`: obligation de balayer l’intégralité de la fenêtre 24h avant synthèse.
