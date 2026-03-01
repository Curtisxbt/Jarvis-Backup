# Architecture agents

## Dossiers agents
- `agents/elon/` : identité + mémoire privée d'Elon
- `agents/jocko/` : identité + mémoire privée de Jocko
- `agents/shared/` : mémoire collective inter-agents
- `USER.md` (racine) : profil utilisateur unique partagé par tous les agents

## Mémoire
- Long terme privé : `agents/<agent>/MEMORY.md`
- Journal privé : `agents/<agent>/memory/YYYY-MM-DD.md`
- Long terme partagé : `agents/shared/MEMORY.md`
- Journal partagé : `agents/shared/memory/YYYY-MM-DD.md`
