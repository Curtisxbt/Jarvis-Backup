# Protocole de passage de main — Elon ↔ Jocko

## Objectif
Permettre la continuité entre agents avec une mémoire collective.

## Dossier collectif
- `memory/shared/`

## Dossiers privés
- Elon : `memory/elon/`
- Jocko : `memory/jocko/`

## Règle de handoff
Quand un agent détecte une info utile à l'autre:
1. écrire une note structurée dans `memory/shared/` (fichier du jour),
2. inclure: date/heure, signal, impact, action attendue, échéance,
3. l'autre agent lit cette note au prochain passage et agit.

## Format recommandé
```md
- [YYYY-MM-DD HH:mm] Source: Elon|Jocko
  - Signal: ...
  - Impact: ...
  - Action attendue: ...
  - Deadline: ...
  - Statut: open|done
```

## Exemple (fatigue)
- [2026-02-27 14:15] Source: Elon
  - Signal: Denis dit qu'il est fatigué depuis 3 jours.
  - Impact: baisse discipline sport/sommeil.
  - Action attendue: Jocko fait un check-in demain matin + protocole recovery 24h.
  - Deadline: 2026-02-28 10:00
  - Statut: open
