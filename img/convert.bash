#!/bin/bash

# Set the directory containing the images
INPUT_DIR="./icon"
OUTPUT_DIR="./webp"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all PNG files in the input directory
for img in "$INPUT_DIR"/*.{png,jpg,jpeg}; do
  # Check if the file exists to prevent errors
  if [[ -f "$img" ]]; then
    # Get the base name of the image without the extension
    filename=$(basename -- "$img")
    filename_noext="${filename%.*}"
    
    # Convert the image to 100x100 WebP format
    convert "$img" -resize 100x100 "$OUTPUT_DIR/$filename_noext.webp"
    echo "Converted $img to $OUTPUT_DIR/$filename_noext.webp"
  fi
done

echo "Conversion complete!"