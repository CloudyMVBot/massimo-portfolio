#!/bin/bash
# Script to organize images in Massimo Vendola portfolio

cd /root/.openclaw/workspace/massimo-portfolio

echo "=== Images found in root directory ==="
ls -1 *.png *.jpg *.jpeg *.gif *.webp *.svg 2>/dev/null

echo ""
echo "=== Moving and renaming images to assets/ ==="

# Move and rename to match HTML references
mv "logo-cropped-small.png" assets/mv-logo.png
echo "Moved: logo-cropped-small.png -> assets/mv-logo.png"

mv "NASA_logo.svg.png" assets/nasa.png
echo "Moved: NASA_logo.svg.png -> assets/nasa.png"

mv "Polycam Logo.png" assets/polycam.png
echo "Moved: Polycam Logo.png -> assets/polycam.png"

mv "SmalRig.jpg" assets/smallrig.png
echo "Moved: SmalRig.jpg -> assets/smallrig.png"

mv "Kiri Engine.png" assets/kiri.png
echo "Moved: Kiri Engine.png -> assets/kiri.png"

mv "Motion-Array-logo.jpg" assets/motionarray.png
echo "Moved: Motion-Array-logo.jpg -> assets/motionarray.png"

mv "kwik learning.png" assets/kwik.png
echo "Moved: kwik learning.png -> assets/kwik.png"

mv "looking glass.png" assets/lookingglass.png
echo "Moved: looking glass.png -> assets/lookingglass.png"

mv "nohlab.png" assets/nohlab.png
echo "Moved: nohlab.png -> assets/nohlab.png"

mv "jalc.jpg" assets/jalc.png
echo "Moved: jalc.jpg -> assets/jalc.png"

# Move marshmello.jpg (no HTML reference found yet)
mv "marshmello.jpg" assets/marshmello.jpg
echo "Moved: marshmello.jpg -> assets/marshmello.jpg"

echo ""
echo "=== Files remaining in root ==="
ls -1 *.png *.jpg *.jpeg *.gif *.webp *.svg 2>/dev/null || echo "(none)"

echo ""
echo "=== Files now in assets/ ==="
ls -1 assets/

echo ""
echo "=== Done! ==="
