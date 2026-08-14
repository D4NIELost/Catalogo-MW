import requests
from bs4 import BeautifulSoup
import csv
import time
import re
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

BASE_URL = "https://www.mediaworld.it"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

BRANDS = {
    "Samsung": "it/brand/samsung",
    "Google": "it/search.html?query=google%20pixel&category=CAT_IT_MM_10//CAT_IT_MM_1001&marketplace=MediaWorld",
    "Xiaomi": "it/brand/xiaomi",
    "OPPO": "it/brand/oppo",
    "Honor": "it/brand/honor",
    "ZTE": "it/brand/zte",
    "Motorola": "it/brand/motorola"
}

CATEGORIES = {
    "Samsung": ["smartphone", "smartwatch", "tablet", "notebook"],
    "Google": ["search"],
    "Xiaomi": ["smartphone", "smartwatch", "smartband", "tablet"],
    "OPPO": None,
    "Honor": ["smartphone", "wearables", "tablet"],
    "ZTE": ["blade", "nubia"],
    "Motorola": None
}

# Blacklist (senza "bundle")
EXCLUDE_TERMS = [
    "asciugatrice", "lavatrice", "frigo", "frigorifero", "cucina", "piano cottura",
    "forno", "microonde", "cappa", "aspirapolvere", "robot aspirapolvere",
    "controller", "gamepad", "joystick", "cuffie", "auricolari", "earbuds",
    "caricabatterie", "charger", "power bank", "batteria",
    "cover", "case", "pellicola", "vetro", "protezione", "cavo", "cable",
    "adattatore", "adapter", "hub", "dock", "stilo", "penna",
    "fotocamera", "fot", "digitale", "obiettivo", "lente",
    "televisore", "tv", "monitor", "proiettore",
    "altoparlante", "speaker", "soundbar", "cassa",
    "orologio", "watch"
]

# ------------------------- FUNZIONI DI ESTRAZIONE -------------------------
def is_mediaworld_product(soup):
    text = soup.get_text()
    if "Venduto e spedito da MediaWorld" in text:
        return True
    if "Venduto e spedito da" in text and "MediaWorld" not in text:
        return False
    return True

def extract_pim_code(soup):
    patterns = [r"Art\.-No\.", r"Codice articolo", r"Cod\. Art\."]
    for pat in patterns:
        elem = soup.find(string=re.compile(pat))
        if elem:
            next_text = elem.find_next().get_text(strip=True) if elem.find_next() else ""
            m = re.search(r'\b(\d{6})\b', next_text)
            if m:
                return m.group(1)
    for meta in soup.find_all('meta'):
        content = meta.get('content', '')
        if 'pim' in (meta.get('name', '') + meta.get('property', '')).lower():
            m = re.search(r'\b(\d{6})\b', content)
            if m:
                return m.group(1)
    for script in soup.find_all('script'):
        text = script.text
        m = re.search(r'\b(\d{6})\b', text)
        if m:
            return m.group(1)
    return None


def extract_color(soup, url=""):
    """Extract color from product page - using old scraper logic"""
    exclude_terms = [
        'magnetic case', 'case inclusa', 'cover', 'caricabatteria', 
        'power adapter', 'inclusi', 'bundle', 'box', 'case', 'adapter'
    ]
    
    # For bundle/box products, extract color from title first (URL is complex)
    if 'bundle' in url.lower() or 'box' in url.lower():
        title = soup.find('h1')
        if title:
            title_text = title.get_text()
            # Try to extract color from title - pattern: "Model, Memory, Color, Bundle"
            # Extract the part after memory but before bundle text
            parts = [p.strip() for p in title_text.split(',')]
            for part in parts:
                # Skip parts that are memory sizes or contain bundle terms
                if re.match(r'^\d+\s*(GB|TB|MB)$', part, re.I):
                    continue
                if any(term.lower() in part.lower() for term in exclude_terms):
                    continue
                # Skip if it contains numbers (likely memory or specs)
                if any(char.isdigit() for char in part):
                    continue
                # If it looks like a color (short, no numbers, not excluded)
                if len(part) < 30 and len(part.split()) <= 3:
                    return part
    
    # Try to extract color from URL first (most reliable for MediaWorld)
    # URL pattern: .../product/_model-color-pim.html
    url_color_match = re.search(r'/product/_[^-]+-([^-]+)-\d+\.html', url)
    if url_color_match:
        url_color = url_color_match.group(1)
        # Clean up URL color (replace hyphens with spaces, capitalize)
        url_color = url_color.replace('-', ' ').strip()
        url_color = ' '.join(word.capitalize() for word in url_color.split())
        # Check if it's a valid color (not a bundle term)
        if url_color and len(url_color) < 30 and not any(term.lower() in url_color.lower() for term in exclude_terms):
            return url_color
    
    # Try multiple selectors for color from page
    selectors = [
        soup.find('span', string=re.compile(r"Colore|Color", re.I)),
        soup.find('div', string=re.compile(r"Colore|Color", re.I)),
        soup.find('label', string=re.compile(r"Colore|Color", re.I)),
        soup.find('dt', string=re.compile(r"Colore|Color", re.I)),
    ]
    
    for selector in selectors:
        if selector:
            # Try to get the next sibling or parent's next child
            next_elem = selector.find_next_sibling()
            if next_elem:
                color_text = next_elem.get_text(strip=True)
                # Clean up - remove common non-color text
                if color_text and len(color_text) < 50:  # Reasonable color name length
                    # Check if text contains excluded bundle terms
                    if not any(term.lower() in color_text.lower() for term in exclude_terms):
                        return color_text
    
    # Alternative: look for color in product title or specs
    title = soup.find('h1')
    if title:
        title_text = title.get_text()
        # Try to extract color from title (common pattern: "Model Name, Color")
        color_match = re.search(r',\s*([A-Za-z\s]+)$', title_text)
        if color_match:
            potential_color = color_match.group(1).strip()
            if len(potential_color) < 30 and not any(term.lower() in potential_color.lower() for term in exclude_terms):
                return potential_color
    
    return ""

def extract_color_from_model(model):
    patterns = [
        r'(Black|White|Blue|Green|Red|Yellow|Orange|Purple|Pink|Gray|Grey|Silver|Gold|Brown|Beige|Cream|Ivory|Lavender|Rose|Navy|Cobalt|Titanium|Obsidian|Charcoal|Natural|Deep|Icy|Flowy|Cook|Asteroid|Graphite|Mint|Shadow|Jetblack|Icyblue)$',
        r'(Light\s+\w+|Dark\s+\w+|Awesome\s+\w+|Stellar\s+\w+|Lunar\s+\w+|Sky\s+\w+|Titanium\s+\w+|Violet\s+\w+)$',
        r'(Cobalt\s+Violet|Jet\s+Black|Light\s+Green|Awesome\s+Navy|Silver\s+Blue|White\s+Silver|Titanium\s+Gray|Titanium\s+Silverblue|Titanium\s+Whitesilver)$',
        r'(Canyon\s+Orange|Tundra\s+Umber|Aurora\s+White|Aurora\s+Blue|Twilight\s+Black|Dusk\s+Black|Titanium\s+Charcoal)$'
    ]
    for pat in patterns:
        m = re.search(pat, model, re.I)
        if m:
            return m.group(1).strip()
    return ""

def extract_memory(soup, model="", url=""):
    if url:
        m = re.search(r'-(\d+)\s*[-_]?(gb|tb|mb)', url, re.I)
        if m:
            return f"{m.group(1)} {m.group(2).upper()}"
    for tag in ['span', 'div', 'label', 'dt']:
        elem = soup.find(tag, string=re.compile(r"Memoria|Storage|Capacità", re.I))
        if elem:
            sibling = elem.find_next_sibling()
            if sibling:
                txt = sibling.get_text(strip=True)
                m = re.search(r'(\d+)\s*(GB|TB|MB)', txt, re.I)
                if m:
                    return f"{m.group(1)} {m.group(2).upper()}"
    title = soup.find('h1')
    if title:
        txt = title.get_text()
        m = re.search(r'(\d+\+\d+|\d+)\s*(GB|TB)', txt, re.I)
        if m:
            return f"{m.group(1)} {m.group(2).upper()}"
    if model and re.search(r'\d+\s*mm', model, re.I):
        return re.search(r'(\d+)\s*mm', model, re.I).group(0)
    return "n/n"

def determine_product_type(model, category, soup=None):
    if soup:
        breadcrumb = soup.find('ul', class_=re.compile(r'breadcrumb'))
        if breadcrumb:
            items = breadcrumb.find_all('li')
            for li in items:
                txt = li.get_text(strip=True).lower()
                if 'smartphone' in txt or 'cellulari' in txt:
                    return 'Smartphone'
                if 'tablet' in txt:
                    return 'Tablet'
                if 'notebook' in txt or 'pc portatile' in txt:
                    return 'Notebook'
                if 'smartwatch' in txt or 'orologio' in txt:
                    return 'Smartwatch'
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                import json
                data = json.loads(script.string)
                if data.get('@type') == 'Product':
                    cat = data.get('category', '')
                    if 'smartphone' in cat.lower():
                        return 'Smartphone'
                    if 'tablet' in cat.lower():
                        return 'Tablet'
                    if 'notebook' in cat.lower():
                        return 'Notebook'
                    if 'smartwatch' in cat.lower():
                        return 'Smartwatch'
            except:
                pass

    model_lower = model.lower()
    if 'smartwatch' in model_lower or 'smartband' in model_lower or 'anello' in model_lower or 'ring' in model_lower:
        return 'Smartwatch'
    if category in ['smartwatch', 'wearables', 'smartband']:
        return 'Smartwatch'
    if category == 'tablet' or 'tablet' in model_lower:
        return 'Tablet'
    if category == 'notebook' or 'notebook' in model_lower:
        return 'Notebook'
    if 'smartphone' in model_lower or 'cellulare' in model_lower:
        return 'Smartphone'
    return 'Smartphone'

def extract_breadcrumb_category(soup):
    breadcrumb = soup.find('ul', class_=re.compile(r'breadcrumb'))
    if breadcrumb:
        items = breadcrumb.find_all('li')
        for li in items:
            txt = li.get_text(strip=True).lower()
            if 'smartphone' in txt or 'cellulari' in txt:
                return 'Smartphone'
            if 'tablet' in txt:
                return 'Tablet'
            if 'notebook' in txt or 'pc portatile' in txt:
                return 'Notebook'
            if 'smartwatch' in txt or 'orologio' in txt:
                return 'Smartwatch'
    return None

# ------------------------- SELENIUM DRIVER -------------------------
def get_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument(f"user-agent={HEADERS['User-Agent']}")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    driver = webdriver.Chrome(options=options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

# ------------------------- SCRAPING PRINCIPALE -------------------------
def scrape_with_selenium(brand, base_url, category=None, apply_filters=True):
    driver = get_driver()
    products = []
    seen_urls = set()
    seen_pims = set()

    try:
        driver.get(base_url)
        wait = WebDriverWait(driver, 15)

        # Cookie
        try:
            cookie_xpaths = [
                "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'accetta tutti')]",
                "//button[@id='pwa-consent-layer-accept-all-button']",
                "//button[contains(@class, 'cookie')]"
            ]
            for xp in cookie_xpaths:
                try:
                    btn = wait.until(EC.element_to_be_clickable((By.XPATH, xp)))
                    btn.click()
                    print("✓ Cookie accettato.")
                    time.sleep(1)
                    break
                except:
                    continue
        except:
            pass

        # Filtri
        if apply_filters:
            current_url = driver.current_url
            
            # Filtro categoria - skip se già presente nell'URL
            if category and category not in ['search']:
                if f"/{category}" in current_url:
                    print(f"✓ Categoria '{category}' già presente nell'URL, nessun filtro aggiuntivo.")
                else:
                    cat_variants = ['Smartphone', 'Cellulari', 'Telefoni', 'smartphone', 'cellulari']
                    found = False
                    for cat_text in cat_variants:
                        try:
                            xp = f"//span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{cat_text.lower()}')]/parent::label"
                            label = driver.find_element(By.XPATH, xp)
                            if not label.find_element(By.TAG_NAME, "input").is_selected():
                                label.click()
                                print(f"✓ Filtro categoria '{cat_text}' applicato.")
                                found = True
                                time.sleep(2)
                                break
                        except:
                            continue
                    if not found:
                        try:
                            current = driver.current_url
                            if 'category' not in current:
                                sep = '&' if '?' in current else '?'
                                new_url = f"{current}{sep}category=CAT_IT_MM_10//CAT_IT_MM_1001"
                                driver.get(new_url)
                                print("✓ Filtro categoria applicato via URL.")
                                time.sleep(3)
                        except:
                            print("⚠️ Impossibile applicare filtro categoria.")

            # Filtro brand - skip se già presente nell'URL
            if f"/brand/{brand.lower()}" in current_url:
                print(f"✓ Brand '{brand}' già presente nell'URL, nessun filtro aggiuntivo.")
            else:
                try:
                    xp = f"//span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{brand.lower()}')]/parent::label"
                    label = driver.find_element(By.XPATH, xp)
                    if not label.find_element(By.TAG_NAME, "input").is_selected():
                        label.click()
                        print(f"✓ Filtro brand '{brand}' applicato.")
                        time.sleep(2)
                except:
                    print(f"⚠️ Filtro brand '{brand}' non trovato.")

            # Filtro MediaWorld - SOLO click, mai aggiungere parametro URL
            try:
                # Selettori alternativi per maggiore robustezza
                xpaths = [
                    "//label[contains(., 'MediaWorld') and not(contains(., 'CONSIGLIA'))]",
                    "//span[text()='MediaWorld']/ancestor::label",
                    "//input[@value='MediaWorld']/parent::label"
                ]
                clicked = False
                for xp in xpaths:
                    try:
                        label = driver.find_element(By.XPATH, xp)
                        if not label.find_element(By.TAG_NAME, "input").is_selected():
                            label.click()
                            print("✓ Filtro MediaWorld applicato (click).")
                            clicked = True
                            time.sleep(2)
                            break
                    except:
                        continue
                if not clicked:
                    print("⚠️ Impossibile applicare filtro MediaWorld via click. Verrà filtrato in fase di scraping.")
            except Exception as e:
                print(f"⚠️ Errore nel filtro MediaWorld: {e}. Verrà filtrato in fase di scraping.")

        # "Mostra altri"
        max_clicks = 50
        click_count = 0
        no_change_count = 0
        prev_count = 0

        while click_count < max_clicks:
            # Scroll più aggressivo - scrolla in basso gradualmente
            for i in range(3):
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)
            time.sleep(2)

            soup = BeautifulSoup(driver.page_source, "html.parser")
            current_links = [a['href'] for a in soup.find_all('a', href=True) if '/it/product' in a['href']]
            current_count = len(set(current_links))
            print(f"Prodotti attuali: {current_count}")

            if current_count == prev_count and click_count > 0:
                no_change_count += 1
                if no_change_count >= 3:
                    print("Nessun nuovo prodotto dopo 3 tentativi, fine caricamento.")
                    break
            else:
                no_change_count = 0
                prev_count = current_count

            button = None
            selectors = [
                "//button[@data-test='mms-search-srp-loadmore']",
                "//button[contains(@class, 'load-more')]",
                "//span[contains(text(), 'Mostra')]/parent::button",
                "//button[contains(., 'Mostra altri')]",
                "//button[contains(., 'Carica')]",
                "//button[contains(., 'Mostra più')]"
            ]
            for xp in selectors:
                try:
                    button = driver.find_element(By.XPATH, xp)
                    if button.is_displayed():
                        break
                except:
                    continue
            if not button:
                print("Nessun pulsante 'Mostra altri' trovato, continuo a scorrere...")
                click_count += 1
                continue

            try:
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
                time.sleep(0.5)
                button.click()
                print(f"Click 'Mostra altri' #{click_count+1}")
                click_count += 1
                time.sleep(4)
            except Exception as e:
                print(f"Errore nel click: {e}")
                break

        # Raccogli link
        soup = BeautifulSoup(driver.page_source, "html.parser")
        all_links = []
        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/it/product' in href:
                full = href if href.startswith('http') else BASE_URL + href
                if full not in seen_urls:
                    all_links.append(full)
                    seen_urls.add(full)
        print(f"Trovati {len(all_links)} link prodotto.")

        # Scraping pagine
        for idx, prod_url in enumerate(all_links):
            print(f"  [{idx+1}/{len(all_links)}] {prod_url}")
            try:
                time.sleep(1)
                resp = requests.get(prod_url, headers=HEADERS, timeout=30)
                resp.raise_for_status()
                soup_prod = BeautifulSoup(resp.text, "html.parser")

                if not is_mediaworld_product(soup_prod):
                    print("    Skip: venditore terzo.")
                    continue

                pim = extract_pim_code(soup_prod)
                if not pim or not re.match(r'^\d{6}$', pim):
                    print(f"    Skip: PIM non valido ({pim})")
                    continue

                if pim in seen_pims:
                    print(f"    Skip: PIM {pim} già elaborato.")
                    continue
                seen_pims.add(pim)

                title = soup_prod.find('h1')
                model = title.get_text(strip=True) if title else "Unknown"

                brand_ok = brand.lower() in model.lower()
                if brand.lower() == 'google':
                    brand_ok = brand_ok or 'pixel' in model.lower()
                if not brand_ok:
                    print(f"    Skip: brand non corrisponde.")
                    continue

                # Categoria effettiva
                actual_category = extract_breadcrumb_category(soup_prod)
                if actual_category is None:
                    actual_category = determine_product_type(model, category if category else '', soup_prod)

                # Blacklist solo se non è smartphone
                if actual_category != 'Smartphone':
                    model_lower = model.lower()
                    if any(term in model_lower for term in EXCLUDE_TERMS):
                        print(f"    Skip: termine escluso nella blacklist (categoria: {actual_category}).")
                        continue

                allowed = ['Smartphone', 'Tablet', 'Notebook', 'Smartwatch']
                if actual_category not in allowed:
                    print(f"    Skip: categoria '{actual_category}' non ammessa.")
                    continue

                # Check if original title or URL contains "bundle" or "Box" - keep these in final name
                has_bundle = 'bundle' in model.lower() or 'bundle' in prod_url.lower()
                has_box = 'box' in model.lower() or 'box' in prod_url.lower()

                # Pulizia modello
                original_model = model

                model = re.sub(r'^' + re.escape(brand) + r'\s*', '', model, flags=re.I)
                model = re.sub(r'\s+' + re.escape(brand) + r'\s+', ' ', model, flags=re.I)
                
                # Extract color from ORIGINAL model name BEFORE cleaning it
                color_from_model = extract_color_from_model(original_model)
                
                # Extract PANTONE colors specifically from ORIGINAL model name
                pantone_match = re.search(r',\s*PANTONE\s+(\S+(?:\s+\S+)*)\s*$', original_model, re.I)
                if pantone_match and not color_from_model:
                    color_from_model = pantone_match.group(1)
                
                # Extract any other color-like patterns from the end of the ORIGINAL model name
                color_match = re.search(r',\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*$', original_model)
                if color_match and not color_from_model:
                    potential_color = color_match.group(1)
                    if len(potential_color) < 30 and not any(char.isdigit() for char in potential_color):
                        color_from_model = potential_color
                
                model = re.sub(r',\s*(Black|White|Green|Grey|Gray|Blue|Red|Yellow|Orange|Purple|Pink|Silver|Gold|Brown)\s*$', '', model, flags=re.I)
                model = re.sub(r'\s*\d+\+\d+\s*', '', model, flags=re.I)
                model = re.sub(r'^Tablet\s+', '', model, flags=re.I)
                model = re.sub(r'\s*\d+[,.]?\d*\s*["\']+\s*', '', model, flags=re.I)
                model = re.sub(r'\s*\d+/\d+\s*(GB|TB|MB)\s*', '', model, flags=re.I)
                model = re.sub(r'\s*\d+\+\d+\s*(GB|TB|MB)\s*', '', model, flags=re.I)
                model = re.sub(r'\s*\d+\s*(GB|TB|MB)\s*', '', model, flags=re.I)
                model = re.sub(r',\s*\d+\s*(GB|TB|MB)', '', model, flags=re.I)
                model = re.sub(r'\s*\d+\s*mm\s*', '', model, flags=re.I)
                model = re.sub(r',\s*,\s*', ', ', model)  # Fix double commas
                model = re.sub(r'\s*,\s*$', '', model)  # Remove trailing comma
                model = re.sub(r'^\s*,\s*', '', model)  # Remove leading comma
                model = model.strip()

                # Remove bundle text from model name AFTER color extraction
                # Keep "bundle" and "Box" in model name - only remove accessory descriptions
                bundle_patterns = [
                    r',\s*cover e caricabatteria \d+W inclusi\s*$',
                    r',\s*Magnetic Case \+ SUPERVOOC \d+W Power Adapter inclusi\s*$',
                    r',\s*Magnetic Case inclusa\s*$',
                    r',\s*cover e caric\s*$',
                    r',\s*cover e carica\s*$',
                    r',\s*Connettività:\s*\w+\s*$',
                    r',\s*Silver,\s*Connettività:\s*\w+\s*$',
                    r',\s*\w+,\s*Connettività:\s*\w+\s*$',
                    r',\s*Connettività:\s*No\s*$',
                    r',\s*PANTONE\s+\S+(?:\s+\S+)*\s*$',
                    r',\s*[A-Z]{2,}\s+[A-Z]{2,}\s*$',
                    r',\s*[A-Z]{2,}\s+[A-Z]{2,}\s+[A-Z]{2,}\s*$',
                    r',\s*(Bronze Green|Lily Pad|Arabesque|Denim Blue|Forest Green|Scarab|Midnight Blue|Hematite|Sporting Green|Lily White|Blackened Blue|Carbon|Dark Shadow|Blue Jewel|Poinciana|Grisaille)\s*$',
                    r',\s*(Graphite|Cream|Lavender|Violet Shadow|Titanium Gray|Titanium Silverblue|Titanium Whitesilver|Titanium Black|Silver Shadow|Sky Blue|Cobalt Violet|Jetblack|Icyblue|Mint|Navy|Pink Gold|Awesome Charcoal|Awesome Lavender|Awesome Graygreen|Awesome White|Awesome Navy|Awesome Gray|Awesome Lilac|Awesome Icyblue)\s*$',
                    r',\s*(Black|White|Blue|Green|Red|Yellow|Orange|Purple|Pink|Gray|Grey|Silver|Gold|Brown|Beige|Ivory|Rose|Navy|Titanium|Obsidian|Charcoal|Natural|Deep|Icy|Flowy|Cook|Asteroid|Mint|Shadow)\s*$',
                ]
                for pattern in bundle_patterns:
                    model = re.sub(pattern, '', model, flags=re.I)
                model = re.sub(r'\s*,\s*$', '', model)  # Remove trailing comma after bundle removal
                model = model.strip()
                
                # Add back "bundle" or "Box" if they were in the original model
                if has_bundle and 'bundle' not in model.lower():
                    model = model + ' Bundle'
                if has_box and 'box' not in model.lower():
                    model = model + ' Box'

                # Estrai colore
                color = extract_color(soup_prod, prod_url)
                # Use color from model as fallback if page extraction fails
                if not color and color_from_model:
                    color = color_from_model
                # Replace empty color with "n/n"
                if not color or color.strip() == '':
                    color = 'n/n'
                else:
                    color = color.title()

                # Estrai memoria
                memory = extract_memory(soup_prod, model, prod_url)

                # Tipo
                prod_type = actual_category

                # Smartwatch
                if prod_type == 'Smartwatch':
                    mm_match = re.search(r'(\d+)\s*mm', model, re.I)
                    if mm_match:
                        memory = mm_match.group(1) + " mm"
                    elif 'mm' not in memory.lower():
                        memory = 'n/n'

                # Notebook
                pollici = 'n/n'
                if prod_type == 'Notebook':
                    nums = re.findall(r'-(\d+)(?:\.?(\d+))?', prod_url)
                    for whole, dec in nums:
                        num = float(f"{whole}.{dec}") if dec else float(whole)
                        if num > 100:
                            num /= 10
                        if 10 <= num <= 20:
                            pollici = str(num).replace('.', ',') + '"'
                            break
                    storage_elems = soup_prod.find_all(['span','div','label','dt'], string=re.compile(r"Memoria|Storage|Capacità|SSD", re.I))
                    for el in storage_elems:
                        sibling = el.find_next_sibling()
                        if sibling:
                            txt = sibling.get_text(strip=True)
                            m = re.search(r'(\d+)\s*(GB|TB)', txt, re.I)
                            if m:
                                val = int(m.group(1))
                                unit = m.group(2).upper()
                                if unit == 'TB' or val > 64:
                                    memory = f"{val * 1000 if unit == 'TB' else val} GB"
                                    break
                    color = 'n/n'

                if prod_type == 'Tablet':
                    color = 'n/n'

                # Pulizia finale
                model = re.sub(r'\s+NOTEBOOK\s*', ' ', model, flags=re.I)
                model = re.sub(r'\s+CHROMEBOOK\s*', ' ', model, flags=re.I)
                model = re.sub(r'\s+CONVERTIBILE\s*', ' ', model, flags=re.I)
                model = re.sub(r'\s*,\s*processore.*$', '', model, flags=re.I)
                model = re.sub(r'\s+processore.*$', '', model, flags=re.I)
                if '360' not in model:
                    model = re.sub(r'\s+\d{1,2}\.?\d*\s*$', '', model, flags=re.I)
                model = re.sub(r'\s+N\d+[A-Z]*$', '', model, flags=re.I)
                model = re.sub(r'\s+X\d+-\d+-\d+$', '', model, flags=re.I)
                model = re.sub(r'\s+\d{3}[A-Z]$', '', model, flags=re.I)
                model = model.strip()

                # Dizionario
                prod_dict = {
                    "Marca": brand,
                    "Tipo": prod_type,
                    "Modello": model,
                    "Codice_PIM": pim
                }
                if prod_type == 'Smartwatch':
                    prod_dict["mm"] = memory
                    prod_dict["Colore"] = color
                elif prod_type == 'Notebook':
                    prod_dict["Memoria"] = memory
                    prod_dict["pollici"] = pollici
                elif prod_type == 'Tablet':
                    prod_dict["Memoria"] = memory
                else:
                    prod_dict["Memoria"] = memory
                    prod_dict["Colore"] = color

                products.append(prod_dict)
                print(f"    ✓ Aggiunto: {model} - PIM: {pim}")

            except Exception as e:
                print(f"    Errore: {e}")
                continue

    except Exception as e:
        print(f"Errore generale Selenium: {e}")
    finally:
        driver.quit()

    return products

# ------------------------- WRAPPER -------------------------
def scrape_category_products(brand, category):
    base_url = f"{BASE_URL}/{BRANDS[brand]}/{category}"
    # Aggiungi parametri per Samsung tablet (test con URL specifico)
    if brand == "Samsung" and category == "tablet":
        base_url = f"{base_url}?brand=SAMSUNG&marketplace=MediaWorld"
    print(f"Scraping {brand} - {category} da {base_url}")
    return scrape_with_selenium(brand, base_url, category=category, apply_filters=True)

def scrape_with_filters(brand):
    base_url = f"{BASE_URL}/{BRANDS[brand]}"
    print(f"Scraping {brand} con filtri da {base_url}")
    return scrape_with_selenium(brand, base_url, category="smartphone", apply_filters=True)

def scrape_brand_only(brand):
    base_url = f"{BASE_URL}/{BRANDS[brand]}"
    print(f"Scraping {brand} (solo brand) da {base_url}")
    return scrape_with_selenium(brand, base_url, category=None, apply_filters=False)

# ------------------------- IMPORT/EXPORT -------------------------
def import_from_csv(csv_file="mediaworld_products.csv"):
    if not os.path.exists(csv_file):
        print(f"File {csv_file} non trovato.")
        return
    products = []
    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            prod = {
                "Marca": row.get('Marca', ''),
                "Tipo": row.get('Tipo', ''),
                "Modello": row.get('Modello', ''),
                "Codice_PIM": row.get('Codice_PIM', '')
            }
            t = row.get('Tipo', '')
            if t == 'Smartwatch':
                prod["mm"] = row.get('mm', 'n/n')
                prod["Colore"] = row.get('Colore', 'n/n')
            elif t == 'Notebook':
                prod["Memoria"] = row.get('Memoria', 'n/n')
                prod["pollici"] = row.get('pollici', 'n/n')
            elif t == 'Tablet':
                prod["Memoria"] = row.get('Memoria', 'n/n')
            else:
                prod["Memoria"] = row.get('Memoria', 'n/n')
                prod["Colore"] = row.get('Colore', 'n/n')
            products.append(prod)
    print(f"Caricati {len(products)} prodotti da {csv_file}")
    import_to_database(products)

def import_to_database(new_products):
    category_files = {
        'Smartphone': {'file': 'databases/database_smartphone.csv', 'fieldnames': ['Marca','Tipo','Modello','Memoria','Colore','Codice_PIM']},
        'Smartwatch': {'file': 'databases/database_smartwatch.csv', 'fieldnames': ['Marca','Tipo','Modello','mm','Colore','Codice_PIM']},
        'Tablet': {'file': 'databases/database_tablet.csv', 'fieldnames': ['Marca','Tipo','Modello','Memoria','Codice_PIM']},
        'Notebook': {'file': 'databases/database_notebook.csv', 'fieldnames': ['Marca','Tipo','Modello','Memoria','pollici','Codice_PIM']}
    }
    total_added = 0
    for cat, config in category_files.items():
        db_file = config['file']
        fieldnames = config['fieldnames']
        existing = []
        if os.path.exists(db_file):
            with open(db_file, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                existing = list(reader)
        existing_pims = {p.get('Codice_PIM') for p in existing if p.get('Codice_PIM')}
        cat_prods = [p for p in new_products if p['Tipo'] == cat]
        added = 0
        for prod in cat_prods:
            if prod['Codice_PIM'] not in existing_pims:
                row = {}
                for field in fieldnames:
                    if field == 'mm' and cat == 'Smartwatch':
                        row[field] = prod.get('Memoria', 'n/n')
                    elif field == 'pollici' and cat == 'Notebook':
                        row[field] = prod.get('Colore', 'n/n')
                    elif field == 'Colore' and cat in ('Notebook', 'Tablet'):
                        row[field] = 'n/n'
                    else:
                        row[field] = prod.get(field, 'n/n')
                existing.append(row)
                existing_pims.add(prod['Codice_PIM'])
                added += 1
        if added:
            with open(db_file, "w", newline='', encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(existing)
            print(f"Importati {added} nuovi {cat} in {db_file} (totale {len(existing)})")
            total_added += added
    print(f"\nTotale importati: {total_added}")

# ------------------------- MAIN -------------------------
def main():
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == '--import':
        csv_file = sys.argv[2] if len(sys.argv) > 2 else "mediaworld_products.csv"
        import_from_csv(csv_file)
        return

    if len(sys.argv) > 1 and sys.argv[1] != '--import':
        brand = sys.argv[1]
        if brand not in BRANDS:
            print(f"Brand '{brand}' non trovato. Disponibili: {', '.join(BRANDS.keys())}")
            sys.exit(1)
        brands_to_scrape = [brand]
        if len(sys.argv) > 2:
            CATEGORIES[brand] = [sys.argv[2]]
    else:
        print("Brand disponibili:")
        for i, b in enumerate(BRANDS.keys(), 1):
            print(f"  {i}. {b}")
        choice = input("\nSeleziona numero brand (o 'all'): ").strip()
        if choice.lower() == 'all':
            brands_to_scrape = list(BRANDS.keys())
        else:
            try:
                idx = int(choice) - 1
                brands_to_scrape = [list(BRANDS.keys())[idx]]
            except:
                print("Scelta non valida.")
                sys.exit(1)

        if len(brands_to_scrape) == 1:
            b = brands_to_scrape[0]
            cats = CATEGORIES.get(b)
            if cats and len(cats) > 1:
                print(f"\nCategorie per {b}:")
                for i, c in enumerate(cats, 1):
                    print(f"  {i}. {c}")
                print(f"  {len(cats)+1}. Tutte")
                scelta = input("Seleziona numero (default: tutte): ").strip()
                if scelta:
                    try:
                        ci = int(scelta) - 1
                        if 0 <= ci < len(cats):
                            CATEGORIES[b] = [cats[ci]]
                        elif ci == len(cats):
                            pass
                        else:
                            print("Numero non valido, uso tutte.")
                    except:
                        print("Input non valido, uso tutte.")

    all_products = []
    for brand in brands_to_scrape:
        print(f"\n{'='*60}\nScraping: {brand}\n{'='*60}")
        cats = CATEGORIES.get(brand)
        if cats is None:
            prods = scrape_with_filters(brand)
        elif cats == ["search"]:
            prods = scrape_category_products(brand, "search")
        else:
            for cat in cats:
                prods = scrape_category_products(brand, cat)
                all_products.extend(prods)
        all_products.extend(prods)

    if all_products:
        unique = {}
        for p in all_products:
            pim = p['Codice_PIM']
            if pim not in unique:
                unique[pim] = p
        all_products = list(unique.values())
        all_products.sort(key=lambda x: x['Modello'])

        output_file = "mediaworld_products.csv"
        with open(output_file, "w", newline='', encoding="utf-8") as f:
            fieldnames = ['Marca','Tipo','Modello','Memoria','mm','pollici','Colore','Codice_PIM']
            writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
            writer.writeheader()
            for p in all_products:
                row = {
                    'Marca': p['Marca'],
                    'Tipo': p['Tipo'],
                    'Modello': p['Modello'],
                    'Memoria': p.get('Memoria', 'n/n'),
                    'mm': p.get('mm', 'n/n'),
                    'pollici': p.get('pollici', 'n/n'),
                    'Colore': p.get('Colore', 'n/n'),
                    'Codice_PIM': p['Codice_PIM']
                }
                writer.writerow(row)

        print(f"\n✅ Scraping completato! Trovati {len(all_products)} prodotti unici.")
        print(f"Salvati in {output_file}")
        try:
            imp = input("\nImportare nel database? (y/n): ").strip().lower()
            if imp == 'y':
                import_to_database(all_products)
        except:
            pass
    else:
        print("\nNessun prodotto trovato.")

if __name__ == "__main__":
    main()