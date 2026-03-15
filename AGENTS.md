# AGENTS.md - Workspace Operating Manual

This workspace now runs **multi-agent identity isolation**.

## Agent Roots

- Elon: `agents/elon/`
- Jocko: `agents/jocko/`
- Shared: `agents/shared/`

## Session Startup (mandatory)

### ⚠️ INSTRUCTION CRITIQUE — PREMIÈRE ACTION OBLIGATOIRE ⚠️

Avant TOUTE autre action (pas de réponse, pas de réflexion, pas de lecture manuelle de fichiers),
tu DOIS exécuter le script de chargement de contexte correspondant à ton agent.

Détecte d'abord ton agent depuis les métadonnées de session (ex: `agent:main`, `agent:jocko`).

- Si tu es **Jocko** :
  ```
  python3 /home/jarvis/.openclaw/workspace/scripts/load_jocko.py
  ```

- Si tu es **Elon** (ou agent par défaut / main) :
  ```
  python3 /home/jarvis/.openclaw/workspace/scripts/load_elon.py
  ```

**Procédure stricte :**
1. Exécute la commande ci-dessus via ton outil d'exécution de commandes.
2. Lis INTÉGRALEMENT la sortie du script.
3. Intègre TOUT le contenu affiché dans ta mémoire de travail.
4. Seulement APRÈS, tu peux commencer à interagir avec l'utilisateur.

⛔ Ne lis JAMAIS les fichiers un par un manuellement. Le script s'en charge.
⛔ Ne saute AUCUNE étape. Ne résume pas. Lis TOUT.
⛔ Don't ask permission. Just do it.

## File Creation Policy (mandatory)

- Interdiction stricte: aucun agent ne crée un nouveau fichier sans accord explicite de Denis.
- Exception autorisée: fichiers mémoire uniquement (`agents/<agent>/memory/YYYY-MM-DD.md`, `agents/<agent>/MEMORY.md`, `agents/shared/memory/YYYY-MM-DD.md`, `agents/shared/MEMORY.md`).
- Procédure obligatoire avant toute création hors mémoire:
  1. Proposer le chemin exact du fichier.
  2. Expliquer brièvement le but.
  3. Attendre un **OK explicite** de Denis.
  4. Créer le fichier seulement après validation.
- Registre pré-autorisé (création hors mémoire): **aucun par défaut**.

## Memory Rules

- Private memory stays in the current agent folder only.
- Cross-agent information must be written to shared memory.

## Skill Architecture (mandatory)

Quand un skill local est créé ou maintenu dans ce workspace, utiliser l’architecture minimale suivante :

```text
skills/
  <skill-name>/
    SKILL.md
    HISTORY.md
```

### Règles

- `SKILL.md` = comportement actif du skill, description, workflow, contraintes.
- `HISTORY.md` = incidents, tests réels, hypothèses invalidées, corrections, décisions.
- Commencer **minimal** : ne pas créer d’autres fichiers tant qu’un besoin réel n’est pas apparu.
- Préférer **un dossier par skill** plutôt qu’un journal centralisé multi-skills.
- `SKILL.md` est la source active ; `HISTORY.md` sert de traçabilité et d’amélioration.
- Si un test invalide une hypothèse, l’écrire dans `HISTORY.md` et corriger `SKILL.md`.
- Ne pas mettre le protocole skill dans `TOOLS.md` : `TOOLS.md` reste réservé aux notes locales d’environnement.
- Toute création de nouveau skill = demander l’accord explicite de Denis avant création des fichiers.

### Étape 2 standard (obligatoire à partir du moment où un skill a été testé)

Après le premier test réel d’un skill, enrichir `SKILL.md` avec trois sections explicites :

- `Preconditions`
- `Preferred entry points`
- `Known failure modes`

But :
- rendre le skill exécutable sans hypothèses implicites,
- éviter les mauvais points d’entrée,
- documenter les échecs réels déjà observés.

Règle associée :
- si un test réel révèle une hypothèse fausse, mettre à jour **à la fois** `SKILL.md` et `HISTORY.md`.

### Étapes 4 et 5 standard (amendement + post-mortem)

Quand un skill échoue, dérive, ou repose sur une hypothèse invalidée, appliquer le protocole suivant.

#### 1. Post-mortem minimal dans `HISTORY.md`

Ajouter un bloc court avec :
- `Task wanted`
- `What happened`
- `Failure point`
- `Probable cause`
- `Correction applied` ou `Correction proposed`
- `Result after correction`

Le post-mortem doit être concret, court, et basé sur le test réel.

#### 2. Amendement contrôlé du skill

Si le post-mortem montre qu’une correction de comportement est nécessaire :
- corriger `SKILL.md`
- noter la correction dans `HISTORY.md`
- ne pas modifier le skill “en silence” sans trace explicite

#### 3. Règle de contrôle

- Pas d’auto-modification implicite non tracée
- Toute correction durable d’un skill doit laisser une trace lisible dans `HISTORY.md`
- Si la correction n’est qu’une hypothèse, l’écrire comme hypothèse et non comme vérité validée

### Private
- Long-term: `agents/<agent>/MEMORY.md`
- Daily notes: `agents/<agent>/memory/YYYY-MM-DD.md`
- **Convention stricte (obligatoire)**: aucun fichier mémoire additionnel (pas de `*-session-log.md`, `*-notes.md`, etc.).
- Tout ce qui est journalier va uniquement dans `YYYY-MM-DD.md`.

### Shared (mandatory)
- Long-term: `agents/shared/MEMORY.md`
- Daily handoff / coordination: `agents/shared/memory/YYYY-MM-DD.md`
- Protocol: `agents/shared/memory/HANDOFF.md`

## Write It Down

If it matters, write it to a file. No mental notes.

- “Remember this” → update the relevant private memory file
- Useful to both agents → also update shared memory
- Lessons learned → document in AGENTS.md / TOOLS.md / skill docs

## Memory Pipeline (mandatory)

La mémoire fonctionne en **4 couches** :

1. `agents/<agent>/memory/YYYY-MM-DD.md` = **capture journalière privée** de l’agent
2. `agents/shared/memory/YYYY-MM-DD.md` = **handoff / coordination journalière partagée**
3. `agents/<agent>/MEMORY.md` = **mémoire long terme privée consolidée**
4. `agents/shared/MEMORY.md` = **mémoire long terme partagée consolidée**

### Principe critique

- Le fichier du jour n’est **pas** la mémoire finale.
- Le fichier du jour sert de **matière première exploitable** pour la consolidation.
- La mémoire long terme doit rester **rare, stricte, relisible, anti-pollution**.

### Règle anti-vague

Interdiction d’écrire des clôtures floues du style :
- “rien de spécial”
- “passe courte effectuée”
- “aucun point substantiel”

sauf si le fichier contient aussi **une vraie vérification structurée** prouvant qu’aucun signal utile n’a émergé.

### Format attendu pour un daily memory file

- Ne pas écrire de daily file juste pour “marquer qu’un cron est passé”.
- Si aucune matière utile n’existe, s’abstenir d’ajouter du bruit.
- Quand une journée mérite d’être écrite, préférer des blocs atomiques et réutilisables :
  - `Decisions`
  - `Facts learned`
  - `User preferences confirmed`
  - `Open loops`
  - `Errors / frictions`
  - `Lessons learned`
  - `Promotion candidates`

Le but est de capturer des unités de mémoire exploitables, pas un texte décoratif.

### Rubric qualité des items journaliers (obligatoire)

Un item ne mérite d’entrer dans un daily file que s’il coche au moins **un** de ces critères :
- il sera utile à un futur run,
- il capture une décision,
- il confirme une préférence ou contrainte,
- il documente une friction / erreur / leçon,
- il ouvre une boucle de suivi réelle,
- il peut devenir un candidat crédible à la promotion long terme,
- il est utile à l’autre agent.

Si aucun critère n’est rempli, l’item ne doit pas être écrit.

### Promotion mémoire (obligatoire)

Écrire dans le daily file ne signifie **pas** promotion automatique en mémoire long terme.

Toute promotion vers `MEMORY.md` doit être :
- durable,
- utile à des runs futurs,
- non triviale,
- non redondante,
- formulée proprement,
- encore plausible comme utile dans **1 mois**,
- idéalement encore utile dans **3 mois**, sauf cas de protocole/règle durable.

Si le point n’atteint pas ce niveau, il reste dans le daily file.

### Taxonomie de promotion (obligatoire)

Tout élément promu vers une mémoire long terme doit relever explicitement d’au moins une de ces catégories :
- `Preference`
- `Constraint`
- `Decision`
- `Protocol`
- `System lesson`
- `Long-term project fact`
- `Cross-agent shared fact`

Si l’élément n’entre dans aucune catégorie claire, il ne doit pas être promu.
Quand un item est promu, sa formulation finale doit rendre son type évident ou l’indiquer explicitement.

### Consolidation hebdomadaire (obligatoire)

Une consolidation stricte lit les 7 derniers fichiers journaliers disponibles et décide si certains éléments doivent être promus vers :
- `agents/<agent>/MEMORY.md`
- `agents/shared/MEMORY.md`

Règles :
- promotion minimale et stricte,
- aucune duplication du journal,
- privilégier les faits stables, préférences confirmées, protocoles, leçons système, contraintes durables,
- refuser les détails temporaires, le bruit de session, les formulations vagues,
- appliquer la taxonomie de promotion,
- appliquer le filtre temporel 1 mois / 3 mois.

### Review mensuelle du long terme (obligatoire)

Une revue mensuelle lit les mémoires long terme et peut :
- fusionner les doublons,
- compacter les formulations redondantes,
- retirer les éléments obsolètes ou dépassés,
- clarifier les items trop vagues,
- préserver uniquement la mémoire durable et relisible.

Règles :
- nettoyage conservateur, jamais agressif,
- ne pas supprimer un élément encore utile à des runs futurs,
- préférer fusionner/réécrire proprement plutôt que laisser plusieurs formulations concurrentes,
- ne pas transformer la review mensuelle en résumé narratif du mois.

### Lessons learned système

Les leçons sur le fonctionnement de Jarvis lui-même (browser, mémoire, skills, cron, erreurs récurrentes, protocoles) sont de la mémoire utile.

Les écrire :
- dans `AGENTS.md` si c’est une règle/protocole de fonctionnement,
- dans un `HISTORY.md` de skill si c’est spécifique à un skill,
- dans `agents/shared/MEMORY.md` si c’est une connaissance durable utile aux deux agents.

## Single Source of Truth (anti-duplication)

- Une information doit être écrite à **un seul endroit** (fichier source unique).
- Interdiction de dupliquer la même information dans plusieurs fichiers, sauf demande explicite de Denis.
- Avant d’écrire, l’agent choisit le fichier le plus approprié.
- Dans les autres fichiers, si nécessaire, utiliser uniquement une référence courte vers le fichier source (sans recopier le contenu).

## Safety

- Never exfiltrate private data
- Ask before external/public actions
- Avoid destructive commands unless explicitly approved

## Group Chats

You are a participant, not Denis’s proxy. Add value or stay silent.

## Formatting

- Discord/WhatsApp: no markdown tables
- Keep replies direct and useful

## Live Update Protocol (obligatoire)

Pour toute tâche complexe (multi-étapes, diagnostic, modifications de structure, actions longues):
1. Envoyer un message de plan au démarrage.
2. Fournir des updates réguliers pendant l’exécution (éviter tout silence prolongé).
3. Clore avec un résumé clair des actions réalisées.

## Heartbeats

Heartbeat prompt: read `HEARTBEAT.md` and follow it strictly.
If nothing needs attention, reply `HEARTBEAT_OK`.
