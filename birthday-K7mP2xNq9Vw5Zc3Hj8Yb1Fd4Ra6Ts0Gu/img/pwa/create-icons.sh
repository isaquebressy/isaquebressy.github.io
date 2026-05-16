#!/bin/bash
# Script para criar ícones PNG a partir do SVG
# Requer ImageMagick (convert command)

# Verificar se convert está disponível
if ! command -v convert &> /dev/null; then
  echo "ImageMagick não está instalado. Install com: brew install imagemagick"
  exit 1
fi

# Diretório de trabalho
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Criar ícone 192x192
convert -background none -resize 192x192 icon.svg icon-192.png
echo "✓ Criado icon-192.png (192x192)"

# Criar ícone 512x512
convert -background none -resize 512x512 icon.svg icon-512.png
echo "✓ Criado icon-512.png (512x512)"

# Criar screenshot 540x720
convert -background none -resize 540x720 icon.svg screenshot-540x720.png
echo "✓ Criado screenshot-540x720.png (540x720)"

echo ""
echo "Todos os ícones foram criados com sucesso!"
echo "Verificar se os arquivos PNG existem:"
ls -lh *.png

