# MEMORY.md — Mémoire partagée inter-agents

Ce fichier contient les informations durables utiles à **plusieurs agents** (Elon + Jocko).
Ne pas y mettre les détails privés spécifiques à un seul agent.

## Jalons discipline (contexte global utile)
- **2022-07-10** : arrêt total de l’alcool (point de bascule discipline).
- **2023-02-18** : début du suivi quotidien des habitudes sur Excel.

## Références opératoires communes
- Compte Google principal par défaut pour tous les services : **curtismusicrec@gmail.com**.
- Protocole live update : annoncer le plan au début de chaque tâche complexe et éviter le silence prolongé (updates réguliers).
- Le streaming Telegram des réponses longues est désormais activé et validé sur le canal global + comptes `default` et `jocko` ; sur Telegram, les messages peuvent arriver en direct pendant l’écriture au lieu d’être livrés en bloc.
- **2026-03-14** : le mode navigateur partagé OpenClaw `profile="user"` a été validé sur Jarvis avec le **vrai Chrome principal** (session réelle), après activation de `chrome://inspect/#remote-debugging` dans Chrome ; Google a pu être ouvert avec succès dans le navigateur principal.
- Runtime OpenClaw stabilisé sur GPT-5.4 avec `agents.defaults.contextTokens = 1000000` ; les nouvelles sessions doivent partir avec une fenêtre de contexte de 1,0 M tokens (les anciennes sessions peuvent encore afficher 200k car créées avant le changement).
- Le backup cerveau ne doit plus être doublé dans les crons agents : la sauvegarde de référence reste le cron Linux quotidien de `03:00` via `/bin/bash /home/jarvis/backup_cerveau.sh`.
- Le merge automatique de transcripts/session vers la mémoire agent a déjà provoqué une pollution durable ; ne pas réintroduire de mécanisme équivalent de type import brut de résumés/transcripts dans les fichiers mémoire.

## Contrainte familiale hebdomadaire (saison 2025-2026)
- Mercredi 11:00–12:00 : Charly à la gym (Denis l'accompagne).
- Mercredi 14:00–15:00 : entraînement U7 (avec Lenny normalement).
- Mercredi vers 17:15 : Ghislaine part au sport, Denis garde les deux enfants.