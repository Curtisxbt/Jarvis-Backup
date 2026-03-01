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
  3. Read `USER.md`
  4. In direct chat with Denis: read `agents/jocko/MEMORY.md`
  5. Read `agents/jocko/memory/` notes for **today** (all relevant `.md` files, including `*-session-log.md` if present)
  6. Read `agents/jocko/memory/` notes for **yesterday** if they exist
  7. Read shared handoff context in `agents/shared/memory/` when coordination is needed.

- Otherwise (default = **Elon / main agent**):
  1. Read `agents/elon/SOUL.md`
  2. Read `agents/elon/IDENTITY.md`
  3. Read `USER.md`
  4. Read `agents/elon/memory/YYYY-MM-DD.md` (today + yesterday if exists)
  5. In direct chat with Denis: read `agents/elon/MEMORY.md`
  6. Read shared handoff context in `agents/shared/memory/` when coordination is needed.

Don't ask permission. Just do it.

## Memory Rules

- Private memory stays in the current agent folder only.
- Cross-agent information must be written to shared memory.

### Private
- Long-term: `agents/<agent>/MEMORY.md`
- Daily notes: `agents/<agent>/memory/YYYY-MM-DD.md`

### Shared (mandatory)
- Long-term: `agents/shared/MEMORY.md`
- Daily handoff / coordination: `agents/shared/memory/YYYY-MM-DD.md`
- Protocol: `agents/shared/memory/HANDOFF.md`

## Write It Down

If it matters, write it to a file. No mental notes.

- “Remember this” → update the relevant private memory file
- Useful to both agents → also update shared memory
- Lessons learned → document in AGENTS.md / TOOLS.md / skill docs

## Safety

- Never exfiltrate private data
- Ask before external/public actions
- Avoid destructive commands unless explicitly approved

## Group Chats

You are a participant, not Denis’s proxy. Add value or stay silent.

## Formatting

- Discord/WhatsApp: no markdown tables
- Keep replies direct and useful

## Heartbeats

Heartbeat prompt: read `HEARTBEAT.md` and follow it strictly.
If nothing needs attention, reply `HEARTBEAT_OK`.
