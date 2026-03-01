#!/usr/bin/env python3
"""
Script de chargement de contexte pour l'agent Elon.
Concatène tous les fichiers de configuration et mémoire en une seule sortie.
Usage : python3 load_elon.py
"""

import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# --- Configuration ---

# Résolution du répertoire workspace (2 niveaux au-dessus de ce script)
SCRIPT_DIR = Path(__file__).resolve().parent
WORKSPACE = SCRIPT_DIR.parent.parent  # agents/elon/ -> agents/ -> workspace/

# Dates
TODAY = datetime.now().strftime("%Y-%m-%d")
YESTERDAY = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

# Liste des fichiers à charger, dans l'ordre exact défini dans AGENTS.md
# Format : (chemin_relatif, obligatoire)
FILES = [
    ("agents/elon/SOUL.md", True),
    ("agents/elon/IDENTITY.md", True),
    ("USER.md", True),
    ("TOOLS.md", True),
    ("agents/elon/nuit-blanche.md", True),
    (f"agents/elon/memory/{TODAY}.md", False),
    (f"agents/elon/memory/{YESTERDAY}.md", False),
    ("agents/elon/MEMORY.md", True),
    ("agents/shared/MEMORY.md", True),
    (f"agents/shared/memory/{TODAY}.md", False),
    (f"agents/shared/memory/{YESTERDAY}.md", False),
]

# --- Fonctions ---

def load_file(filepath: Path, relative_name: str, required: bool) -> str:
    """Lit un fichier et retourne son contenu formaté avec séparateurs."""
    if not filepath.exists():
        if required:
            return f"⚠️ ERREUR : {relative_name} introuvable\n"
        else:
            return f"ℹ️ INFO : {relative_name} n'existe pas (optionnel, ignoré)\n"

    try:
        content = filepath.read_text(encoding="utf-8")
        separator_start = f"========== DÉBUT DU FICHIER : {relative_name} =========="
        separator_end = f"========== FIN DU FICHIER : {relative_name} =========="
        return f"{separator_start}\n{content}\n{separator_end}\n"
    except Exception as e:
        return f"⚠️ ERREUR : Impossible de lire {relative_name} — {e}\n"


def main():
    output_parts = []
    output_parts.append(f"🚀 Chargement du contexte pour l'agent ELON — {TODAY}")
    output_parts.append(f"📂 Workspace : {WORKSPACE}")
    output_parts.append("=" * 60)
    output_parts.append("")

    for relative_path, required in FILES:
        full_path = WORKSPACE / relative_path
        result = load_file(full_path, relative_path, required)
        output_parts.append(result)

    output_parts.append("=" * 60)
    output_parts.append("✅ Chargement terminé. Tous les fichiers ont été traités.")

    print("\n".join(output_parts))


if __name__ == "__main__":
    main()
