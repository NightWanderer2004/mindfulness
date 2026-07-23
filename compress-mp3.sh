#!/usr/bin/env bash

set -u  # только undefined переменные считаем ошибкой

TARGET_DIR="$HOME/Projects/Ongoing/mindful-tab/apps/extension/assets/mono"
BITRATE="124k"  # можешь поменять на 80k или 96k

echo "Compressing mp3 files in (recursively): $TARGET_DIR"

# находим все mp3, безопасно обрабатываем пробелы и спецсимволы
find "$TARGET_DIR" -type f -name "*.mp3" -print0 | while IFS= read -r -d '' f; do
  tmp_file="${f%.mp3}.tmp.mp3"

  echo "→ $f  ->  $BITRATE"

  # НЕ роняем скрипт, если ffmpeg упал на конкретном файле
  if ffmpeg -y -i "$f" -map a -c:a libmp3lame -b:a "$BITRATE" "$tmp_file" >/dev/null 2>&1; then
    mv "$tmp_file" "$f"
  else
    echo "  ⚠️ ffmpeg error, skipping: $f"
    [ -f "$tmp_file" ] && rm -f "$tmp_file"
  fi
done

echo "Done."
