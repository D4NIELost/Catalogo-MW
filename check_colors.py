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

# Combine all colors
all_colors = sorted(smartphone_colors | smartwatch_colors)

# Color map from app.js
color_map_keys = {
    'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
    'gray', 'grey', 'silver', 'gold', 'brown', 'beige', 'cream', 'ivory', 'lavender',
    'rose', 'obsidian', 'charcoal', 'titanium black', 'titanium gray', 'natural titanium',
    'blue titanium', 'deep purple', 'icy blue', 'flowy emerald', 'cool gray',
    'asteroid black', 'titanium charcoal', 'tundra umber', 'canyon orange', 'aurora white',
    'twilight black', 'aurora blue', 'dusk black', 'navy', 'mint', 'jetblack', 'icyblue',
    'silver shadow', 'black blue', 'cobalt violet', 'sky blue', 'titanium silverblue',
    'titanium whitesilver', 'light green', 'awesome charcoal', 'awesome lavender',
    'awesome white', 'awesome graygreen', 'awesome navy', 'awesome lilac', 'awesome icyblue',
    'awesome gray', 'violet shadow', 'graphite', 'pink gold', 'titanium silver',
    'crystal blue', 'crystal black', 'black purple', 'ice blue', 'aurora gold',
    'denim blue', 'forest green', 'arabesque', 'viola', 'oro', 'bronze green', 'lily pad',
    'scarab', 'pantone corsair', 'pantone regatta', 'pantone black oyster', 'pantone gray mist',
    'pantone carbon', 'pantone martini olive', 'pantone hematite', 'pantone sporting green',
    'pantone mountain view', 'pantone blackened blue', 'pantone lily white', 'blu', 'lavanda',
    'nero ossidiana', 'viola glicine', 'blu indaco', 'verde cedro', 'viola lavanda',
    'grigio nebbia', 'rosso lampone', 'verde pistacchio', 'rosa opaco', 'verde oliva',
    'glacier blue', 'titano', 'starlit green', 'violet', 'cyan', 'midnight black', 'nero',
    'matte silver', 'light gold', 'obsidian black', 'silver gray', 'juniper green',
    'mint green', 'sunset gold', 'dark grey', 'black (fluororubber strap)', 'mint green (fluororubber strap)',
    'sunset gold (milanese strap)', 'white (leather strap)', 'titanio', 'blueberry', 'burgundy', 'glacier',
    'pistachio', 'rosa ibisco'
}

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
