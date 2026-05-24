#!/bin/bash

set -e

BASE_DIR="./src/assets"

LANGUAGES=(
  "pt-BR"
  # "de-DE"
  # "en-US"
  # "es-ES"
  "fr-FR"
  # "hi-IN"
  # "id-ID"
  # "it-IT"
  # "ja-JP"
  # "ko-KR"
  # "nl-NL"
  # "pl-PL"
  # "ru-RU"
  # "zh-TW"
  "cs-CZ"
)

echo "Creating language assets structure..."

mkdir -p "$BASE_DIR"

for LANG in "${LANGUAGES[@]}"
do
  echo "Creating structure for $LANG"

  mkdir -p "$BASE_DIR/$LANG/lessons"
  mkdir -p "$BASE_DIR/$LANG/grammar"
  mkdir -p "$BASE_DIR/$LANG/vocabulary"
  mkdir -p "$BASE_DIR/$LANG/exercises/fill-in-the-blank"
  mkdir -p "$BASE_DIR/$LANG/exercises/listening"
  mkdir -p "$BASE_DIR/$LANG/exercises/pronunciation"
  mkdir -p "$BASE_DIR/$LANG/exercises/matching"
  mkdir -p "$BASE_DIR/$LANG/audio/words"
  mkdir -p "$BASE_DIR/$LANG/audio/sentences"

  cat > "$BASE_DIR/$LANG/metadata.json" <<EOF
{
  "code": "$LANG",
  "name": "$LANG",
  "nativeName": "$LANG",
  "direction": "ltr",
  "voice": "$LANG",
  "flag": "",
  "createdAt": "$(date -Iseconds)"
}
EOF

  cat > "$BASE_DIR/$LANG/grammar/pronouns.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/grammar/verbs.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/grammar/adjectives.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/grammar/prepositions.json" <<EOF
[]
EOF

cat > "$BASE_DIR/$LANG/grammar/possessives.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/grammar/articles.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/vocabulary/food.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/vocabulary/travel.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/vocabulary/emotions.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/vocabulary/business.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/vocabulary/surfing.json" <<EOF
[]
EOF

  cat > "$BASE_DIR/$LANG/lessons/beginner-001.json" <<EOF
{
  "id": "beginner-001",
  "title": {
    "en-US": "Basic Greetings"
  },
  "difficulty": "beginner",
  "topics": [
    "greetings"
  ],
  "items": []
}
EOF


done

mkdir -p "$BASE_DIR/shared"

echo ""
echo "Done."
echo ""
echo "Created:"
echo "- language metadata"
echo "- grammar files"
echo "- vocabulary files"
echo "- exercises structure"
echo "- audio folders"
echo "- translations"
echo "- starter lesson"
