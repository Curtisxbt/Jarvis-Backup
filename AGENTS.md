# AGENTS.md - Workspace Operating Manual

This workspace now runs **multi-agent identity isolation**.

## Agent Roots

- Elon: `agents/elon/`
- Jocko: `agents/jocko/`
- Shared: `agents/shared/`

## Session Startup (mandatory)

Before doing anything else, detect current agent from session metadata (ex: `agent:main`, `agent:jocko`).

- If current agent is **Jocko**:
  1. Read `agents/jocko/SOUL.md`
  2. Read `agents/jocko/IDENTITY.md`
  3. Read `agents/jocko/LIFE.md`
  4. Read `USER.md`
  5. Read `TOOLS.md`
  6. In direct chat with Denis: read `agents/jocko/MEMORY.md`
  7. Read `agents/jocko/memory/` notes for **today** (`YYYY-MM-DD.md`)
  8. Read `agents/jocko/memory/` notes for **yesterday** if they exist
  9. Read shared memory systematically at startup:
     - `agents/shared/MEMORY.md`
     - `agents/shared/memory/YYYY-MM-DD.md` (today + yesterday if exists)

- Otherwise (default = **Elon / main agent**):
  1. Read `agents/elon/SOUL.md`
  2. Read `agents/elon/IDENTITY.md`
  3. Read `USER.md`
  4. Read `TOOLS.md`
  5. Read `agents/elon/nuit-blanche.md`
  6. Read `agents/elon/memory/YYYY-MM-DD.md` (today + yesterday if exists)
  7. In direct chat with Denis: read `agents/elon/MEMORY.md`
  8. Read shared memory systematically at startup:
     - `agents/shared/MEMORY.md`
     - `agents/shared/memory/YYYY-MM-DD.md` (today + yesterday if exists)

Don't ask permission. Just do it.

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
