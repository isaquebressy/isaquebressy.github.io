#!/usr/bin/env bash
# Vetoriza mega/img/pwa/icon.png (posterizacao + potrace por cor) -> icon.svg
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="${ROOT}/icon.png"
OUT_SVG="${ROOT}/icon.svg"
TMP="${TMPDIR:-/tmp}/mega-pwa-trace-$$"
mkdir -p "$TMP"

magick "$SRC" -resize 512x512 PNG32:"${TMP}/q.png"
magick "${TMP}/q.png" -colors 10 PNG32:"${TMP}/q10.png"

path_d() {
	xmllint --xpath '//*[local-name()="path"][1]/@d' "$1" 2>/dev/null \
		| sed 's/^ d="//;s/"$//' | tr -s ' '
}

trace_mask() {
	local pbm="${TMP}/m.pbm"
	magick "$1" -monochrome PBM:"$pbm"
	# -t: remove manchas pequenas (anti-aliasing) antes do trace
	potrace -s -o "$2" -tight -t 80 -O 0.35 "$pbm"
}

# Mascara: pixels da cor -> preto (foreground potrace), resto branco
mask_color() {
	magick "${TMP}/q10.png" -fuzz 14% -fill black -opaque "$1" -fill white +opaque black -alpha off PNG:"${TMP}/mask.png"
}

mask_two() {
	magick "${TMP}/q10.png" -fuzz 14% -fill black -opaque "$1" -fill white +opaque black PNG:"${TMP}/a.png"
	magick "${TMP}/q10.png" -fuzz 14% -fill black -opaque "$2" -fill white +opaque black PNG:"${TMP}/b.png"
	magick "${TMP}/a.png" "${TMP}/b.png" -compose Darken -composite PNG:"${TMP}/mask.png"
}

mask_color "#076B38"
trace_mask "${TMP}/mask.png" "${TMP}/g.svg"
D_GREEN=$(path_d "${TMP}/g.svg")

mask_color "#27094D"
trace_mask "${TMP}/mask.png" "${TMP}/q.svg"
D_QUINA=$(path_d "${TMP}/q.svg")

mask_two "#BC562A" "#C34E17"
trace_mask "${TMP}/mask.png" "${TMP}/o.svg"
D_ORANGE=$(path_d "${TMP}/o.svg")

mask_two "#B10591" "#B662A8"
trace_mask "${TMP}/mask.png" "${TMP}/l.svg"
D_LOTO=$(path_d "${TMP}/l.svg")

cat >"$OUT_SVG" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" width="512" height="512">
	<title>Super Mega</title>
	<g transform="translate(0,512) scale(0.1,-0.1)" fill="none">
		<path fill="#076B38" d="${D_GREEN}"/>
		<path fill="#27094D" d="${D_QUINA}"/>
		<path fill="#C34E17" d="${D_ORANGE}"/>
		<path fill="#B10591" d="${D_LOTO}"/>
	</g>
</svg>
EOF

rm -rf "$TMP"
echo "Wrote $OUT_SVG"
