import csv

# Read smartphone colors
with open('databases/database_smartphone.csv', 'r') as f:
    reader = csv.DictReader(f)
    smartphone_colors = set()
    for row in reader:
        color = row['Colore'].strip()
        if color:
            smartphone_colors.add(color)

# Read smartwatch colors
with open('databases/database_smartwatch.csv', 'r') as f:
    reader = csv.DictReader(f)
    smartwatch_colors = set()
    for row in reader:
        color = row['Colore'].strip()
        if color:
            smartwatch_colors.add(color)

# Read applewatch colors
with open('databases/database_applewatch.csv', 'r') as f:
    reader = csv.DictReader(f)
    applewatch_colors = set()
    for row in reader:
        color = row['Colore'].strip()
        if color:
            applewatch_colors.add(color)

# Combine all colors
all_colors = sorted(smartphone_colors | smartwatch_colors | applewatch_colors)

# Color map from app.js - read dynamically
import re
color_map_keys = set()
with open('app.js', 'r') as f:
    content = f.read()
    # Extract color keys from the colorMap object
    pattern = r"'([^']+)':\s*'#[0-9A-Fa-f]+'"
    matches = re.findall(pattern, content)
    color_map_keys = set(matches)

# Check for missing colors
missing_colors = []
for color in all_colors:
    color_lower = color.lower().strip()
    if color_lower not in color_map_keys:
        missing_colors.append(color)

print('Colori mancanti nella color map:')
for color in sorted(missing_colors):
    print(f'  - {color}')

print(f'\nTotale colori nei database: {len(all_colors)}')
print(f'Totale colori nella color map: {len(color_map_keys)}')
print(f'Colori mancanti: {len(missing_colors)}')
