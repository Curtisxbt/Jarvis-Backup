#!/usr/bin/env python3
"""
Script de fusion des fichiers session-memory d'OpenClaw.

Le hook interne 'session-memory' d'OpenClaw crée des fichiers dans
workspace/memory/YYYY-MM-DD-slug.md à chaque reset de session.

Ce script :
1. Scanne workspace/memory/ pour trouver ces fichiers (exclut README.md)
2. Identifie l'agent source via le 'Session Key' dans le fichier
3. Append le contenu dans le fichier mémoire du jour de l'agent
   (agents/<agent>/memory/YYYY-MM-DD.md)
4. Supprime le fichier source après merge

Usage : python3 merge_session_memory.py
Cron  : 55 23 * * * python3 /home/jarvis/.openclaw/workspace/scripts/merge_session_memory.py
"""

import os
import re
import sys
from datetime import datetime
from pathlib import Path

# --- Configuration ---

WORKSPACE = Path("/home/jarvis/.openclaw/workspace")
MEMORY_INBOX = WORKSPACE / "memory"

# Mapping des session keys vers les dossiers mémoire agent
AGENT_MAP = {
    "agent:main": "agents/elon/memory",
    "agent:jocko": "agents/jocko/memory",
}

# Fichiers à ignorer dans le dossier memory/
IGNORED_FILES = {"README.md"}

# --- Fonctions ---

def detect_agent(content: str) -> str | None:
    """Détecte l'agent source via le Session Key dans le contenu du fichier."""
    match = re.search(r"\*\*Session Key\*\*:\s*(\S+)", content)
    if not match:
        return None

    session_key = match.group(1)

    # Cherche le préfixe le plus spécifique d'abord
    for prefix, agent_dir in sorted(AGENT_MAP.items(), key=lambda x: -len(x[0])):
        if session_key.startswith(prefix):
            return agent_dir

    return None


def detect_date_from_filename(filename: str) -> str | None:
    """Extrait la date YYYY-MM-DD depuis le nom du fichier."""
    match = re.match(r"(\d{4}-\d{2}-\d{2})", filename)
    return match.group(1) if match else None


def merge_file(source_path: Path) -> bool:
    """Fusionne un fichier session-memory dans le fichier mémoire du jour de l'agent."""
    try:
        content = source_path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"⚠️ ERREUR lecture {source_path.name} : {e}")
        return False

    # Identifier l'agent
    agent_dir = detect_agent(content)
    if agent_dir is None:
        print(f"⚠️ SKIP {source_path.name} : impossible d'identifier l'agent (pas de Session Key)")
        return False

    # Identifier la date
    date_str = detect_date_from_filename(source_path.name)
    if date_str is None:
        date_str = datetime.now().strftime("%Y-%m-%d")
        print(f"ℹ️ {source_path.name} : date non détectée dans le nom, utilisation de {date_str}")

    # Chemin cible
    target_dir = WORKSPACE / agent_dir
    target_dir.mkdir(parents=True, exist_ok=True)
    target_file = target_dir / f"{date_str}.md"

    # Préparer le bloc à ajouter
    separator = f"\n\n---\n\n## Session importée depuis : {source_path.name}\n\n"
    append_block = separator + content.strip() + "\n"

    # Append au fichier mémoire du jour
    try:
        with open(target_file, "a", encoding="utf-8") as f:
            f.write(append_block)
        print(f"✅ {source_path.name} → {target_file.relative_to(WORKSPACE)}")
    except Exception as e:
        print(f"⚠️ ERREUR écriture {target_file} : {e}")
        return False

    # Supprimer le fichier source
    try:
        source_path.unlink()
        print(f"🗑️ Supprimé : {source_path.name}")
    except Exception as e:
        print(f"⚠️ ERREUR suppression {source_path.name} : {e}")

    return True


def main():
    print(f"🔄 Merge session-memory — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📂 Inbox : {MEMORY_INBOX}")
    print("=" * 60)

    if not MEMORY_INBOX.exists():
        print("ℹ️ Dossier memory/ introuvable. Rien à faire.")
        return

    # Lister les fichiers à traiter
    files = [
        f for f in sorted(MEMORY_INBOX.iterdir())
        if f.is_file() and f.name not in IGNORED_FILES
    ]

    if not files:
        print("ℹ️ Aucun fichier session-memory à traiter.")
        return

    print(f"📋 {len(files)} fichier(s) à traiter\n")

    merged = 0
    for f in files:
        if merge_file(f):
            merged += 1
        print()

    print("=" * 60)
    print(f"✅ Terminé : {merged}/{len(files)} fichier(s) fusionné(s).")


if __name__ == "__main__":
    main()
