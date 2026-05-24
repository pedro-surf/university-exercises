#!/bin/bash

BASE_DIR="./src/assets"

find "$BASE_DIR" -name "*.json" | while read file; do
  filename=$(basename "$file" .json)

  first_char=$(grep -o '^[[:space:]]*.' "$file" | tail -c 1)

  if [ "$first_char" = "[" ]; then
    echo "Fixing $file"

    temp_file=$(mktemp)

    {
      echo "{"
      echo "  \"$filename\":"
      cat "$file"
      echo "}"
    } > "$temp_file"

    mv "$temp_file" "$file"
  fi
done

echo "Done."