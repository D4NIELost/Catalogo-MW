import pandas as pd
import json
import os

# Convert CSV files to JSON
csv_files = {
    'smartphone': 'databases/database_smartphone.csv',
    'smartwatch': 'databases/database_smartwatch.csv',
    'tablet': 'databases/database_tablet.csv',
    'notebook': 'databases/database_notebook.csv',
    'services': 'databases/database_servizi.csv'
}

output_dir = 'data'
os.makedirs(output_dir, exist_ok=True)

for key, csv_file in csv_files.items():
    if os.path.exists(csv_file):
        df = pd.read_csv(csv_file)
        # Convert to JSON
        json_data = df.to_dict(orient='records')
        output_file = f'{output_dir}/{key}.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        print(f'Converted {csv_file} to {output_file}')
    else:
        print(f'File {csv_file} not found')

print('Conversion complete!')
