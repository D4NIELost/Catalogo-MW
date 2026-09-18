// App State
const state = {
    currentSection: 'phones', // 'phones' or 'services'
    selectedBrand: null,
    selectedCategory: null,
    selectedModel: null,
    selectedMemory: null,
    selectedVariant: null,
    modelHasSingleMemory: false,
    skippedColorSelection: false,
    servicesCategory: null,
    servicesSubcategory: null,
    selectedService: null,
    databases: {},
    // Apple Watch specific states
    selectedMaterial: null,
    selectedConnectivity: null
};

// Color mapping (same as Python version)
const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#00FF00',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'gray': '#808080',
    'grey': '#808080',
    'silver': '#C0C0C0',
    'gold': '#FFD700',
    'brown': '#A52A2A',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0',
    'ivory': '#FFFFF0',
    'lavender': '#E6E6FA',
    'rose': '#FF007F',
    'obsidian': '#0B0B0B',
    'charcoal': '#36454F',
    'titanium black': '#1A1A1A',
    'titanium gray': '#4A4A4A',
    'natural titanium': '#B8B8B8',
    'blue titanium': '#4169E1',
    'deep purple': '#4B0082',
    'icy blue': '#87CEEB',
    'flowy emerald': '#50C878',
    'cool gray': '#8C92AC',
    'asteroid black': '#1C1C1C',
    'titanium charcoal': '#2C2C2C',
    'tundra umber': '#5C4033',
    'canyon orange': '#E86A17',
    'aurora white': '#F0F8FF',
    'twilight black': '#1A1A2E',
    'aurora blue': '#87CEFA',
    'dusk black': '#2F2F2F',
    'navy': '#000080',
    'mint': '#98FF98',
    'jetblack': '#1A1A1A',
    'icyblue': '#87CEEB',
    'silver shadow': '#C0C0C0',
    'black blue': '#1A2A3A',
    'cobalt violet': '#6B2E9E',
    'sky blue': '#87CEEB',
    'titanium silverblue': '#708090',
    'titanium whitesilver': '#E8E8E8',
    'light green': '#90EE90',
    'awesome charcoal': '#36454F',
    'awesome lavender': '#E6E6FA',
    'awesome white': '#FFFFFF',
    'awesome graygreen': '#8FBC8F',
    'awesome navy': '#000080',
    'awesome lilac': '#C8A2C8',
    'awesome icyblue': '#87CEEB',
    'awesome gray': '#808080',
    'violet shadow': '#7B68EE',
    'graphite': '#383838',
    'pink gold': '#E6C8C8',
    'titanium silver': '#C0C0C0',
    'crystal blue': '#E0FFFF',
    'crystal black': '#1A1A1A',
    'black purple': '#4B0082',
    'ice blue': '#87CEEB',
    'aurora gold': '#fdd4be',
    'denim blue': '#1560BD',
    'forest green': '#228B22',
    'arabesque': '#8B4513',
    'viola': '#EE82EE',
    'oro': '#FFD700',
    'bronze green': '#5C7A68',
    'lily pad': '#4A7C59',
    'scarab': '#1A4D2E',
    'pantone corsair': '#006994',
    'pantone regatta': '#005F7F',
    'pantone black oyster': '#1C1C1C',
    'pantone gray mist': '#A9A9A9',
    'pantone carbon': '#36454F',
    'pantone martini olive': '#556B2F',
    'pantone hematite': '#2F2F2F',
    'pantone sporting green': '#2E8B57',
    'pantone mountain view': '#4A5D23',
    'pantone blackened blue': '#1A237E',
    'pantone lily white': '#F8F8FF',
    'blu': '#0000FF',
    'lavanda': '#E6E6FA',
    'nero ossidiana': '#0B0B0B',
    'viola glicine': '#CCCCFF',
    'blu indaco': '#6495ED',
    'verde cedro': '#ADFF2F',
    'viola lavanda': '#9370DB',
    'grigio nebbia': '#E0E6E9',
    'rosso lampone': '#E30B5D',
    'verde pistacchio': '#93C572',
    'rosa opaco': '#F8A591',
    'verde oliva': '#556B2F',
    'glacier blue': '#87CEEB',
    'titano': '#A9A9A9',
    'starlit green': '#4A6B5C',
    'violet': '#8B7B8B',
    'cyan': '#00FFFF',
    'midnight black': '#1A1A1A',
    'nero': '#000000',
    'matte silver': '#C0C0C0',
    'light gold': '#faf7f0',
    'obsidian black': '#0B0B0B',
    'silver gray': '#A9A9A9',
    'juniper green': '#2E8B57',
    'mint green': '#98FF98',
    'sunset gold': '#FFD700',
    'dark grey': '#696969',
    'black (fluororubber strap)': '#1A1A1A',
    'mint green (fluororubber strap)': '#98FF98',
    'sunset gold (milanese strap)': '#FFD700',
    'white (leather strap)': '#FFFFFF',
    'titanio': '#A9A9A9',
    'blueberry': '#4F86F7',
    'burgundy': '#800020',
    'glacier': '#E0FFFF',
    'pistachio': '#93C572',
    'rosa ibisco': '#F8A591',
    'bianco / pebble': '#FFF8F0',
    'blu ceramica': '#4169E1',
    'galassia': '#F5F5DC',
    'grigio chiaro': '#D3D3D3',
    'grigio siderale': '#708090',
    'marrone scuro': '#8B4513',
    'marrone scuro / basalto': '#5C4033',
    'mezzanotte': '#1A1A1A',
    'naturale': '#B8B8B8',
    'oro rosa': '#B76E79',
    'bianco / pebble (cinturino bianco taglia ml)': '#FFF8F0',
    'bianco / pebble (cinturino bianco taglia sm)': '#FFF8F0',
    'blu ceramica (cinturino blu taglia ml)': '#4169E1',
    'blu ceramica (cinturino blu taglia sm)': '#4169E1',
    'galassia (cinturino sport galassia taglia ml)': '#F5F5DC',
    'galassia (cinturino sport galassia taglia sm)': '#F5F5DC',
    'grigio chiaro (cinturino sport grigio taglia ml)': '#D3D3D3',
    'grigio chiaro (cinturino sport grigio taglia sm)': '#D3D3D3',
    'grigio siderale (cinturino sport nero taglia ml)': '#708090',
    'grigio siderale (cinturino sport nero taglia sm)': '#708090',
    'marrone scuro (cinturino maglia marrone medium/large)': '#8B4513',
    'marrone scuro (cinturino maglia marrone small)': '#8B4513',
    'marrone scuro (cinturino maglia marrone)': '#8B4513',
    'marrone scuro / basalto (cinturino sport scuro taglia ml)': '#5C4033',
    'marrone scuro / basalto (cinturino sport scuro taglia sm)': '#5C4033',
    'mezzanotte (cinturino sport mezzanotte taglia ml)': '#1A1A1A',
    'mezzanotte (cinturino sport mezzanotte taglia sm)': '#1A1A1A',
    'naturale (alpine loop color duna - large)': '#B8B8B8',
    'naturale (alpine loop color duna - medium)': '#B8B8B8',
    'naturale (cinturino alpine loop color duna - small)': '#B8B8B8',
    'naturale (cinturino maglia naturale medium/large)': '#B8B8B8',
    'naturale (cinturino maglia naturale small)': '#B8B8B8',
    'naturale (cinturino metallo/maglia naturale)': '#B8B8B8',
    'naturale (cinturino naturale taglia ml)': '#B8B8B8',
    'naturale (cinturino naturale taglia sm)': '#B8B8B8',
    'naturale (cinturino ocean grigio traslucido)': '#B8B8B8',
    'naturale (cinturino titanio/sport taglia ml)': '#B8B8B8',
    'naturale (cinturino titanio/sport taglia sm)': '#B8B8B8',
    'naturale (loop in maglia milanese in titanio naturale - medium)': '#B8B8B8',
    'naturale (loop in maglia milanese in titanio naturale - small)': '#B8B8B8',
    'naturale (loop maglia milanese in titanio naturale - large)': '#B8B8B8',
    'naturale (trail loop color sabbia - m/l)': '#B8B8B8',
    'naturale (trail loop color sabbia - s/m)': '#B8B8B8',
    'nero (alpine loop color borgogna - large)': '#000000',
    'nero (alpine loop color borgogna - medium)': '#000000',
    'nero (alpine loop color borgogna - small)': '#000000',
    'nero (cinturino ocean nero traslucido)': '#000000',
    'nero (cinturino sport nero taglia ml)': '#000000',
    'nero (cinturino sport nero taglia sm)': '#000000',
    'nero (loop maglia milanese in titanio nero - large)': '#000000',
    'nero (loop maglia milanese in titanio nero - medium)': '#000000',
    'nero (loop maglia milanese in titanio nero - small)': '#000000',
    'nero (trail loop color borgogna - m/l)': '#000000',
    'nero (trail loop color borgogna - s/m)': '#000000',
    'oro rosa (cinturino maglia oro rosa medium/large)': '#B76E79',
    'oro rosa (cinturino maglia oro rosa small)': '#B76E79',
    'oro rosa (cinturino maglia oro rosa)': '#B76E79',
    'oro rosa (cinturino oro rosa taglia ml)': '#B76E79',
    'oro rosa (cinturino oro rosa taglia sm)': '#B76E79'
};

// Load all databases
async function loadDatabases() {
    try {
        const response = await Promise.all([
            fetch('data/smartphone.json'),
            fetch('data/smartwatch.json'),
            fetch('data/applewatch.json'),
            fetch('data/tablet.json'),
            fetch('data/notebook.json'),
            fetch('data/services.json')
        ]);

        const [smartphone, smartwatch, applewatch, tablet, notebook, services] = await Promise.all(
            response.map(r => r.json())
        );

        state.databases = {
            smartphone,
            smartwatch,
            applewatch,
            tablet,
            notebook,
            services
        };

        console.log('Databases loaded:', {
            smartphone: smartphone.length,
            smartwatch: smartwatch.length,
            applewatch: applewatch.length,
            tablet: tablet.length,
            notebook: notebook.length,
            services: services.length
        });

        renderMainContent();
    } catch (error) {
        console.error('Error loading databases:', error);
        document.getElementById('mainContent').innerHTML = 
            '<p class="error">Errore nel caricamento del database</p>';
    }
}

// Render main content based on state
function renderMainContent() {
    const mainContent = document.getElementById('mainContent');
    
    if (state.currentSection === 'phones') {
        renderPhonesSection(mainContent);
    } else if (state.currentSection === 'services') {
        renderServicesSection(mainContent);
    }
}

// Render phones section
function renderPhonesSection(container) {
    if (state.selectedVariant) {
        renderVariantView(container);
    } else if (state.selectedMemory) {
        renderColorsView(container);
    } else if (state.selectedModel) {
        renderMemoriesView(container);
    } else if (state.selectedCategory) {
        renderModelsView(container);
    } else if (state.selectedBrand) {
        renderCategoriesView(container);
    } else {
        renderBrandsView(container);
    }
}

// Render services section
function renderServicesSection(container) {
    if (state.selectedService) {
        renderServiceView(container);
    } else if (state.servicesSubcategory) {
        renderServicesView(container);
    } else if (state.servicesCategory) {
        renderSubcategoriesView(container);
    } else {
        renderServicesCategoriesView(container);
    }
}

// Render brands view
function renderBrandsView(container) {
    const allProducts = [
        ...state.databases.smartphone,
        ...state.databases.smartwatch,
        ...state.databases.applewatch,
        ...state.databases.tablet,
        ...state.databases.notebook
    ];
    
    const brands = [...new Set(allProducts.map(p => p.Marca))];
    
    container.innerHTML = `
        <div class="content-section">
            <h2>Seleziona Marchio</h2>
            <div class="button-grid">
                ${brands.map(brand => {
                    const logoPath = `images/brands/${brand}.png`;
                    return `
                        <button class="button-item brand-button" onclick="selectBrand('${brand}')">
                            <div class="brand-content">
                                <img src="${logoPath}" alt="${brand}" class="brand-logo" onerror="this.style.display='none'">
                                <span class="brand-name">${brand}</span>
                            </div>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Render categories view
function renderCategoriesView(container) {
    const brand = state.selectedBrand;
    const categories = [];

    // Check which databases have this brand
    if (state.databases.smartphone.some(p => p.Marca === brand)) categories.push('Smartphone');
    if (state.databases.smartwatch.some(p => p.Marca === brand)) categories.push('Smartwatch');
    if (state.databases.applewatch.some(p => p.Marca === brand)) categories.push('Apple Watch');
    if (state.databases.tablet.some(p => p.Marca === brand)) categories.push('Tablet');
    if (state.databases.notebook.some(p => p.Marca === brand)) categories.push('Notebook');
    
    // If only one category, skip to models
    if (categories.length === 1) {
        state.selectedCategory = categories[0];
        renderMainContent();
        return;
    }
    
    const categoryEmojis = {
        'Smartphone': '📱',
        'Smartwatch': '⌚',
        'Apple Watch': '⌚',
        'Tablet': '📱',
        'Notebook': '💻'
    };
    
    container.innerHTML = `
        <div class="content-section">
            <h2>${brand} - Seleziona Categoria</h2>
            <div class="button-grid">
                ${categories.map(cat => 
                    `<button class="button-item" onclick="selectCategory('${cat}')">
                        ${categoryEmojis[cat] || '📱'} ${cat}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Render models view
function renderModelsView(container) {
    const brand = state.selectedBrand;
    const category = state.selectedCategory;

    let database;
    if (category === 'Smartphone') database = state.databases.smartphone;
    else if (category === 'Smartwatch') database = state.databases.smartwatch;
    else if (category === 'Apple Watch') database = state.databases.applewatch;
    else if (category === 'Tablet') database = state.databases.tablet;
    else if (category === 'Notebook') database = state.databases.notebook;
    
    const models = [...new Set(database.filter(p => p.Marca === brand).map(p => p.Modello))];
    
    const categoryEmojis = {
        'Smartphone': '📲',
        'Smartwatch': '⌚',
        'Apple Watch': '⌚',
        'Tablet': '📱',
        'Notebook': '💻'
    };
    
    container.innerHTML = `
        <div class="content-section">
            <h2>${brand} - ${category}</h2>
            <div class="button-grid">
                ${models.map((model, idx) => 
                    `<button class="button-item" onclick="selectModel('${model}')">
                        ${categoryEmojis[category] || '📲'} ${model}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Render memories view
function renderMemoriesView(container) {
    const category = state.selectedCategory;
    const brand = state.selectedBrand;
    const model = state.selectedModel;

    let database;
    if (category === 'Smartphone') database = state.databases.smartphone;
    else if (category === 'Smartwatch') database = state.databases.smartwatch;
    else if (category === 'Apple Watch') database = state.databases.applewatch;
    else if (category === 'Tablet') database = state.databases.tablet;
    else if (category === 'Notebook') database = state.databases.notebook;

    const products = database.filter(p => p.Marca === brand && p.Modello === model);

    // Special handling for Apple Watch - multi-step selection
    if (category === 'Apple Watch') {
        // Step 1: Select Material
        if (!state.selectedMaterial) {
            const materials = [...new Set(products.map(p => p.Materiale))]
                .filter(m => m && m.toString().trim() && m.toString().trim().toLowerCase() !== 'n/n');

            if (materials.length <= 1) {
                state.selectedMaterial = materials.length === 1 ? materials[0] : 'n/n';
                renderMainContent();
                return;
            }

            container.innerHTML = `
                <div class="content-section">
                    <h2>Modello: ${model}</h2>
                    <p><strong>Seleziona Materiale:</strong></p>
                    <div class="button-grid" id="materialSelection">
                        ${materials.map((material, idx) =>
                            `<button class="button-item" data-material="${String(material).replace(/"/g, '&quot;')}" data-idx="${idx}">
                                ⌚ ${material}
                            </button>`
                        ).join('')}
                    </div>
                </div>
            `;

            // Use event delegation for material selection
            const materialGrid = container.querySelector('#materialSelection');
            if (materialGrid) {
                materialGrid.addEventListener('click', (e) => {
                    if (e.target.classList.contains('button-item')) {
                        state.selectedMaterial = e.target.dataset.material;
                        renderMainContent();
                    }
                });
            }
            return;
        }

        // Step 2: Select Connectivity
        if (!state.selectedConnectivity) {
            const filteredByMaterial = products.filter(p => p.Materiale === state.selectedMaterial);
            const connectivities = [...new Set(filteredByMaterial.map(p => p.Connettività))]
                .filter(c => c && c.toString().trim() && c.toString().trim().toLowerCase() !== 'n/n');

            if (connectivities.length <= 1) {
                state.selectedConnectivity = connectivities.length === 1 ? connectivities[0] : 'n/n';
                renderMainContent();
                return;
            }

            container.innerHTML = `
                <div class="content-section">
                    <h2>Modello: ${model}</h2>
                    <p><strong>Materiale:</strong> ${state.selectedMaterial}</p>
                    <p><strong>Seleziona Connettività:</strong></p>
                    <div class="button-grid" id="connectivitySelection">
                        ${connectivities.map((conn, idx) =>
                            `<button class="button-item" data-connectivity="${String(conn).replace(/"/g, '&quot;')}" data-idx="${idx}">
                                📡 ${conn}
                            </button>`
                        ).join('')}
                    </div>
                </div>
            `;

            // Use event delegation for connectivity selection
            const connectivityGrid = container.querySelector('#connectivitySelection');
            if (connectivityGrid) {
                connectivityGrid.addEventListener('click', (e) => {
                    if (e.target.classList.contains('button-item')) {
                        state.selectedConnectivity = e.target.dataset.connectivity;
                        renderMainContent();
                    }
                });
            }
            return;
        }

        // Step 3: Select mm (this will use the standard flow)
        const filteredByMaterialAndConnectivity = products.filter(
            p => p.Materiale === state.selectedMaterial && p.Connettività === state.selectedConnectivity
        );
        const sizes = [...new Set(filteredByMaterialAndConnectivity.map(p => p.mm))]
            .filter(s => s && s.toString().trim() && s.toString().trim().toLowerCase() !== 'n/n');

        if (sizes.length <= 1) {
            state.selectedMemory = sizes.length === 1 ? sizes[0] : 'n/n';
            state.modelHasSingleMemory = true;
            renderMainContent();
            return;
        }

        container.innerHTML = `
            <div class="content-section">
                <h2>Modello: ${model}</h2>
                <p><strong>Materiale:</strong> ${state.selectedMaterial}</p>
                <p><strong>Connettività:</strong> ${state.selectedConnectivity}</p>
                <p><strong>Seleziona Dimensioni:</strong></p>
                <div class="button-grid" id="sizeSelection">
                    ${sizes.map((size, idx) =>
                        `<button class="button-item" data-spec="${String(size).replace(/"/g, '&quot;')}" data-idx="${idx}">
                            ⌚ ${size} mm
                        </button>`
                    ).join('')}
                </div>
            </div>
        `;

        // Use event delegation for size selection
        const sizeGrid = container.querySelector('#sizeSelection');
        if (sizeGrid) {
            sizeGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('button-item')) {
                    selectMemory(e.target.dataset.spec);
                }
            });
        }
        return;
    }

    // Standard flow for other categories
    let specColumn, specLabel, specEmoji;
    if (category === 'Smartwatch') {
        specColumn = 'mm';
        specLabel = 'Dimensioni';
        specEmoji = '⌚';
    } else if (category === 'Notebook') {
        specColumn = 'pollici';
        specLabel = 'Dimensioni';
        specEmoji = '💻';
    } else {
        specColumn = 'Memoria';
        specLabel = 'Memoria';
        specEmoji = '💾';
    }

    const specs = [...new Set(products.map(p => p[specColumn]))]
        .filter(s => s && s.toString().trim() && s.toString().trim().toLowerCase() !== 'n/n');

    // If no valid specs or only one, skip to colors
    if (specs.length <= 1) {
        state.selectedMemory = specs.length === 1 ? specs[0] : 'n/n';
        state.modelHasSingleMemory = true;
        renderMainContent();
        return;
    }

    container.innerHTML = `
        <div class="content-section">
            <h2>Modello: ${model}</h2>
            <div class="button-grid">
                ${specs.map((spec, idx) =>
                    `<button class="button-item" data-spec="${spec.replace(/"/g, '&quot;')}" data-idx="${idx}">
                        ${specEmoji} ${spec}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;

    // Add event listeners to buttons
    container.querySelectorAll('.button-item').forEach(btn => {
        btn.addEventListener('click', () => {
            selectMemory(btn.dataset.spec);
        });
    });
}

// Render colors view
function renderColorsView(container) {
    const category = state.selectedCategory;
    const brand = state.selectedBrand;
    const model = state.selectedModel;

    let database;
    if (category === 'Smartphone') database = state.databases.smartphone;
    else if (category === 'Smartwatch') database = state.databases.smartwatch;
    else if (category === 'Apple Watch') database = state.databases.applewatch;
    else if (category === 'Tablet') database = state.databases.tablet;
    else if (category === 'Notebook') database = state.databases.notebook;

    let products = database.filter(p => p.Marca === brand && p.Modello === model);

    // Filter by memory/pollici/mm if selected
    let filterColumn;
    if (category === 'Smartwatch' || category === 'Apple Watch') filterColumn = 'mm';
    else if (category === 'Notebook') filterColumn = 'pollici';
    else filterColumn = 'Memoria';

    if (state.selectedMemory && state.selectedMemory !== 'n/n') {
        products = products.filter(p => String(p[filterColumn]) === String(state.selectedMemory));
    }

    // Additional filters for Apple Watch
    if (category === 'Apple Watch') {
        if (state.selectedMaterial && state.selectedMaterial !== 'n/n') {
            products = products.filter(p => String(p.Materiale) === String(state.selectedMaterial));
        }
        if (state.selectedConnectivity && state.selectedConnectivity !== 'n/n') {
            products = products.filter(p => String(p.Connettività) === String(state.selectedConnectivity));
        }
    }

    // Check if products array is empty after filtering
    if (products.length === 0) {
        console.error('No products found after filtering for', category, brand, model);
        container.innerHTML = '<p class="error">Nessun prodotto trovato con le selezioni correnti</p>';
        return;
    }

    // For notebook, skip color selection
    if (category === 'Notebook') {
        state.selectedVariant = products[0];
        state.skippedColorSelection = true;
        renderMainContent();
        return;
    }

    // Check if color column exists
    if (!products[0].hasOwnProperty('Colore')) {
        state.selectedVariant = products[0];
        state.skippedColorSelection = true;
        renderMainContent();
        return;
    }
    
    const colors = [...new Set(products.map(p => p.Colore))];
    
    // Check if all colors are "n/n"
    if (colors.length === 1 && colors[0].toString().trim().toLowerCase() === 'n/n') {
        state.selectedVariant = products[0];
        state.skippedColorSelection = true;
        renderMainContent();
        return;
    }
    
    container.innerHTML = `
        <div class="content-section">
            <h2>Modello: ${model}</h2>
            ${category === 'Apple Watch' && state.selectedMaterial && state.selectedMaterial !== 'n/n' ?
                `<p><strong>Materiale:</strong> ${state.selectedMaterial}</p>` : ''}
            ${category === 'Apple Watch' && state.selectedConnectivity && state.selectedConnectivity !== 'n/n' ?
                `<p><strong>Connettività:</strong> ${state.selectedConnectivity}</p>` : ''}
            ${state.selectedMemory && state.selectedMemory !== 'n/n' ?
                `<p><strong>${category === 'Smartwatch' || category === 'Apple Watch' || category === 'Notebook' ? 'Dimensioni' : 'Memoria'}:</strong> ${state.selectedMemory}</p>` : ''}
            <div class="color-grid" id="colorSelection">
                ${colors.map(color => {
                    const colorLower = color.toString().toLowerCase().trim();
                    const bgColor = colorMap[colorLower] || '#cccccc';
                    return `
                        <div class="color-item" data-color="${String(color).replace(/"/g, '&quot;')}">
                            <div class="color-swatch" style="background-color: ${bgColor}"></div>
                            <span class="color-name">${color}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // Add event delegation for color selection
    const colorGrid = container.querySelector('#colorSelection');
    if (colorGrid) {
        colorGrid.addEventListener('click', (e) => {
            const colorItem = e.target.closest('.color-item');
            if (colorItem) {
                selectColor(colorItem.dataset.color);
            }
        });
    }
}

// Render variant view with barcode
function renderVariantView(container) {
    const variant = state.selectedVariant;
    const category = state.selectedCategory;

    let pimCode = variant.Codice_PIM ? variant.Codice_PIM.toString().replace(/[.,]/g, '') : '';

    container.innerHTML = `
        <div class="content-section barcode-section">
            <h2>Codice a Barre</h2>
            <div class="product-details">
                <p><strong>Marca:</strong> ${variant.Marca}</p>
                <p><strong>Modello:</strong> ${variant.Modello}</p>
                ${category === 'Apple Watch' && state.selectedMaterial && state.selectedMaterial !== 'n/n' ? `<p><strong>Materiale:</strong> ${state.selectedMaterial}</p>` : ''}
                ${category === 'Apple Watch' && state.selectedConnectivity && state.selectedConnectivity !== 'n/n' ? `<p><strong>Connettività:</strong> ${state.selectedConnectivity}</p>` : ''}
                ${category !== 'Tablet' ? `<p><strong>${category === 'Smartwatch' || category === 'Apple Watch' || category === 'Notebook' ? 'Dimensioni' : 'Memoria'}:</strong> ${state.selectedMemory || 'N/A'}</p>` : ''}
                ${variant.Colore && variant.Colore !== 'n/n' ? `<p><strong>Colore:</strong> ${variant.Colore}</p>` : ''}
                <p><strong>Codice PIM:</strong> ${variant.Codice_PIM}</p>
            </div>
            <div class="barcode-container">
                <svg id="barcode"></svg>
            </div>
        </div>
    `;
    
    // Generate barcode
    if (pimCode && typeof JsBarcode !== 'undefined') {
        try {
            JsBarcode("#barcode", pimCode, {
                format: "ITF",
                width: 2,
                height: 80,
                displayValue: true,
                fontSize: 16,
                textMargin: 5,
                margin: 10
            });
        } catch (e) {
            console.error('Barcode generation error:', e);
            document.getElementById('barcode').parentElement.innerHTML = 
                '<p style="color: red;">Errore nella generazione del codice a barre</p>';
        }
    }
}

// Render services categories view
function renderServicesCategoriesView(container) {
    const categories = [...new Set(state.databases.services.map(s => s.Categoria))];
    
    container.innerHTML = `
        <div class="content-section">
            <h2>Seleziona Categoria</h2>
            <div class="button-grid">
                ${categories.map(cat => 
                    `<button class="button-item" onclick="selectServicesCategory('${cat}')">${cat}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Render subcategories view
function renderSubcategoriesView(container) {
    const category = state.servicesCategory;
    const subcategories = [...new Set(
        state.databases.services
            .filter(s => s.Categoria === category)
            .map(s => s.Sottocategoria)
    )];
    
    // If only one subcategory, skip to services
    if (subcategories.length === 1) {
        state.servicesSubcategory = subcategories[0];
        renderMainContent();
        return;
    }
    
    container.innerHTML = `
        <div class="content-section">
            <h2>${category}</h2>
            <div class="button-grid">
                ${subcategories.map(sub => 
                    `<button class="button-item" onclick="selectServicesSubcategory('${sub}')">${sub}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Render services view
function renderServicesView(container) {
    const category = state.servicesCategory;
    const subcategory = state.servicesSubcategory;
    
    const services = state.databases.services.filter(
        s => s.Categoria === category && s.Sottocategoria === subcategory
    );
    
    container.innerHTML = `
        <div class="content-section">
            <h2>${category} - ${subcategory}</h2>
            <div class="button-grid">
                ${services.map(service => 
                    `<button class="button-item" onclick="selectService('${service.Servizio.replace(/"/g, '&quot;')}')">
                        ${service.Servizio} - €${service.Costo}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Render service view with barcode
function renderServiceView(container) {
    const service = state.databases.services.find(s => s.Servizio === state.selectedService);
    const pimCode = service.Codice ? service.Codice.toString().replace(/[.,]/g, '') : '';
    
    container.innerHTML = `
        <div class="content-section barcode-section">
            <h2>Codice a Barre</h2>
            <div class="product-details">
                <p><strong>Servizio:</strong> ${service.Servizio}</p>
                <p><strong>Categoria:</strong> ${service.Categoria}</p>
                <p><strong>Sottocategoria:</strong> ${service.Sottocategoria}</p>
                <p><strong>Codice:</strong> ${service.Codice}</p>
                <p><strong>Costo:</strong> €${service.Costo}</p>
            </div>
            <div class="barcode-container">
                <svg id="barcode"></svg>
            </div>
        </div>
    `;
    
    // Generate barcode
    if (pimCode && typeof JsBarcode !== 'undefined') {
        try {
            JsBarcode("#barcode", pimCode, {
                format: "ITF",
                width: 2,
                height: 80,
                displayValue: true,
                fontSize: 16,
                textMargin: 5,
                margin: 10
            });
        } catch (e) {
            console.error('Barcode generation error:', e);
            document.getElementById('barcode').parentElement.innerHTML = 
                '<p style="color: red;">Errore nella generazione del codice a barre</p>';
        }
    }
}

// Selection functions
function selectBrand(brand) {
    state.selectedBrand = brand;
    renderMainContent();
}

function selectCategory(category) {
    state.selectedCategory = category;
    renderMainContent();
}

function selectModel(model) {
    state.selectedModel = model;
    renderMainContent();
}

function selectMemory(memory) {
    state.selectedMemory = memory;
    state.modelHasSingleMemory = false;
    renderMainContent();
}

function selectColor(color) {
    const category = state.selectedCategory;
    let database;
    if (category === 'Smartphone') database = state.databases.smartphone;
    else if (category === 'Smartwatch') database = state.databases.smartwatch;
    else if (category === 'Apple Watch') database = state.databases.applewatch;
    else if (category === 'Tablet') database = state.databases.tablet;
    else if (category === 'Notebook') database = state.databases.notebook;
    
    let products = database.filter(p =>
        p.Marca === state.selectedBrand &&
        p.Modello === state.selectedModel &&
        String(p.Colore) === String(color)
    );
    
    // Filter by memory if selected
    let filterColumn;
    if (category === 'Smartwatch' || category === 'Apple Watch') filterColumn = 'mm';
    else if (category === 'Notebook') filterColumn = 'pollici';
    else filterColumn = 'Memoria';

    if (state.selectedMemory && state.selectedMemory !== 'n/n') {
        products = products.filter(p => String(p[filterColumn]) === String(state.selectedMemory));
    }

    // Additional filters for Apple Watch
    if (category === 'Apple Watch') {
        if (state.selectedMaterial && state.selectedMaterial !== 'n/n') {
            products = products.filter(p => String(p.Materiale) === String(state.selectedMaterial));
        }
        if (state.selectedConnectivity && state.selectedConnectivity !== 'n/n') {
            products = products.filter(p => String(p.Connettività) === String(state.selectedConnectivity));
        }
    }
    
    state.selectedVariant = products[0];
    state.skippedColorSelection = false;
    renderMainContent();
}

function selectServicesCategory(category) {
    state.servicesCategory = category;
    renderMainContent();
}

function selectServicesSubcategory(subcategory) {
    state.servicesSubcategory = subcategory;
    renderMainContent();
}

function selectService(service) {
    state.selectedService = service;
    renderMainContent();
}

// Navigation functions
function goBack() {
    if (state.selectedVariant) {
        state.selectedVariant = null;
        if (state.skippedColorSelection) {
            state.skippedColorSelection = false;
            if (state.modelHasSingleMemory) {
                state.selectedMemory = null;
                state.selectedModel = null;
            } else {
                state.selectedMemory = null;
            }
        }
    } else if (state.selectedCategory === 'Apple Watch') {
        // Apple Watch: handle multi-step navigation with auto-skipped steps
        // First check if we have any selections - if not, go back to categories
        if (!state.selectedModel && !state.selectedMemory && !state.selectedConnectivity && !state.selectedMaterial) {
            state.selectedCategory = null;
            state.modelHasSingleMemory = false;
            state.selectedMaterial = null;
            state.selectedConnectivity = null;
        } else {
            // We need to determine which step was actually shown to the user
            // by checking what would be shown in renderMemoriesView
        const brand = state.selectedBrand;
        const model = state.selectedModel;
        const database = state.databases.applewatch;
        const products = database.filter(p => p.Marca === brand && p.Modello === model);

        // Check which steps have multiple options (thus were shown to user)
        const materials = [...new Set(products.map(p => p.Materiale))]
            .filter(m => m && m.toString().trim() && m.toString().trim().toLowerCase() !== 'n/n');
        const materialsShown = materials.length > 1;

        let filteredByMaterial = products;
        if (state.selectedMaterial && state.selectedMaterial !== 'n/n') {
            filteredByMaterial = products.filter(p => p.Materiale === state.selectedMaterial);
        }

        const connectivities = [...new Set(filteredByMaterial.map(p => p.Connettività))]
            .filter(c => c && c.toString().trim() && c.toString().trim().toLowerCase() !== 'n/n');
        const connectivitiesShown = connectivities.length > 1;

        let filteredByMaterialAndConnectivity = filteredByMaterial;
        if (state.selectedConnectivity && state.selectedConnectivity !== 'n/n') {
            filteredByMaterialAndConnectivity = filteredByMaterial.filter(p => p.Connettività === state.selectedConnectivity);
        }

        const sizes = [...new Set(filteredByMaterialAndConnectivity.map(p => p.mm))]
            .filter(s => s && s.toString().trim() && s.toString().trim().toLowerCase() !== 'n/n');
        const sizesShown = sizes.length > 1;

        // Navigate back based on which steps were actually shown
        if (state.selectedMemory && sizesShown) {
            // User selected from size selection (sizes were shown)
            state.selectedMemory = null;
        } else if (state.selectedMemory && !sizesShown && connectivitiesShown) {
            // Sizes were auto-skipped, but connectivity was shown - go back to connectivity
            state.selectedMemory = null;
            state.selectedConnectivity = null;
        } else if (state.selectedMemory && !sizesShown && !connectivitiesShown && materialsShown) {
            // Both sizes and connectivity were auto-skipped, but material was shown - go back to material
            state.selectedMemory = null;
            state.selectedConnectivity = null;
            state.selectedMaterial = null;
        } else if (state.selectedConnectivity && connectivitiesShown) {
            // User selected from connectivity selection
            state.selectedConnectivity = null;
        } else if (state.selectedConnectivity && !connectivitiesShown && materialsShown) {
            // Connectivity was auto-skipped, but material was shown - go back to material
            state.selectedConnectivity = null;
            state.selectedMaterial = null;
        } else if (state.selectedMaterial && materialsShown) {
            // User selected from material selection
            state.selectedMaterial = null;
        } else if (state.selectedModel) {
            // No Apple Watch-specific selections active, go back to models list
            state.selectedMemory = null;
            state.selectedConnectivity = null;
            state.selectedMaterial = null;
            state.selectedModel = null;
        }
        }
    } else if (state.selectedMemory) {
        if (state.modelHasSingleMemory) {
            state.selectedMemory = null;
            state.selectedModel = null;
        } else {
            state.selectedMemory = null;
        }
    } else if (state.selectedModel) {
        state.selectedModel = null;
        state.modelHasSingleMemory = false;
        state.selectedMaterial = null;
        state.selectedConnectivity = null;
    } else if (state.selectedCategory) {
        state.selectedCategory = null;
        state.modelHasSingleMemory = false;
        state.selectedMaterial = null;
        state.selectedConnectivity = null;
    } else if (state.selectedBrand) {
        state.selectedBrand = null;
        state.modelHasSingleMemory = false;
        state.selectedMaterial = null;
        state.selectedConnectivity = null;
    }
    renderMainContent();
}

function goBackServices() {
    if (state.selectedService) {
        state.selectedService = null;
    } else if (state.servicesSubcategory) {
        const category = state.servicesCategory;
        const subcategories = [...new Set(
            state.databases.services
                .filter(s => s.Categoria === category)
                .map(s => s.Sottocategoria)
        )];
        
        if (subcategories.length === 1) {
            state.servicesSubcategory = null;
            state.servicesCategory = null;
        } else {
            state.servicesSubcategory = null;
        }
    } else if (state.servicesCategory) {
        state.servicesCategory = null;
    }
    renderMainContent();
}

function goHome() {
    state.selectedBrand = null;
    state.selectedCategory = null;
    state.selectedModel = null;
    state.selectedMemory = null;
    state.selectedVariant = null;
    state.modelHasSingleMemory = false;
    state.skippedColorSelection = false;
    state.selectedMaterial = null;
    state.selectedConnectivity = null;
    state.servicesCategory = null;
    state.servicesSubcategory = null;
    state.selectedService = null;
    renderMainContent();
}

// Search function with fuzzy matching
function searchProducts(query) {
    if (!query || query.trim() === '') {
        document.getElementById('searchResults').classList.add('hidden');
        return;
    }
    
    const queryLower = query.toLowerCase();
    
    // Create fuzzy matching patterns (remove vowels for abbreviation matching)
    const queryNoVowels = queryLower.replace(/[aeiou]/g, '');
    
    // Synonym dictionary for common search terms
    const synonyms = {
        'opaca': ['matt', 'matte'],
        'opaco': ['matt', 'matte'],
        'privacy': ['antispy'],
        'privato': ['antispy'],
    };
    
    // Get all search terms including synonyms
    const searchTerms = [queryLower];
    for (const key in synonyms) {
        if (queryLower.includes(key)) {
            searchTerms.push(...synonyms[key]);
        }
    }
    
    function fuzzyMatch(text) {
        // Check if text matches query - ALL query words must be present
        const textLower = String(text).toLowerCase();
        const textNoVowels = textLower.replace(/[aeiou]/g, '');
        
        // Split query into words
        const queryWords = queryLower.split();
        if (!queryWords.length) return false;
        
        // ALL words must be present in the text (AND logic)
        for (const word of queryWords) {
            let wordFound = false;
            
            // Check direct match
            if (textLower.includes(word)) {
                wordFound = true;
            } else {
                // Check abbreviation match
                const wordNoVowels = word.replace(/[aeiou]/g, '');
                if (wordNoVowels && textNoVowels.includes(wordNoVowels)) {
                    wordFound = true;
                }
            }
            
            // If word not found, check synonyms
            if (!wordFound) {
                for (const key in synonyms) {
                    if (word.includes(key)) {
                        for (const synonym of synonyms[key]) {
                            if (textLower.includes(synonym)) {
                                wordFound = true;
                                break;
                            }
                        }
                    }
                    if (wordFound) break;
                }
            }
            
            if (!wordFound) return false;
        }
        
        return true;
    }
    
    // Search in all phone databases
    const allProducts = [
        ...state.databases.smartphone.map(p => ({...p, category: 'Smartphone', type: 'device'})),
        ...state.databases.smartwatch.map(p => ({...p, category: 'Smartwatch', type: 'device'})),
        ...state.databases.applewatch.map(p => ({...p, category: 'Apple Watch', type: 'device'})),
        ...state.databases.tablet.map(p => ({...p, category: 'Tablet', type: 'device'})),
        ...state.databases.notebook.map(p => ({...p, category: 'Notebook', type: 'device'}))
    ];
    
    // Combine relevant columns for each product
    const phoneResults = allProducts.filter(p => {
        const combinedText = `${p.Marca} ${p.Modello} ${p.Codice_PIM}`;
        return fuzzyMatch(combinedText);
    }).slice(0, 20);
    
    // Search in services database
    const serviceResults = state.databases.services.filter(s => {
        return fuzzyMatch(s.Servizio) || 
               fuzzyMatch(s.Categoria) || 
               fuzzyMatch(s.Sottocategoria) || 
               fuzzyMatch(String(s.Codice));
    }).slice(0, 20);
    
    const resultsContainer = document.getElementById('searchResults');
    
    if (phoneResults.length === 0 && serviceResults.length === 0) {
        resultsContainer.innerHTML = '<p>Nessun prodotto o servizio trovato</p>';
    } else {
        let html = '';
        
        if (phoneResults.length > 0) {
            html += `<h3>📱 Dispositivi (${phoneResults.length})</h3>`;
            html += phoneResults.map(p => {
                const color = p.Colore && p.Colore !== 'n/n' ? p.Colore : '';
                const memory = p.Memoria && p.Memoria !== 'n/n' ? p.Memoria : (p.mm && p.mm !== 'n/n' ? p.mm : (p.pollici && p.pollici !== 'n/n' ? p.pollici : ''));
                const material = p.Materiale && p.Materiale !== 'n/n' ? p.Materiale : '';
                const connectivity = p.Connettività && p.Connettività !== 'n/n' ? p.Connettività : '';
                return `
                    <div class="search-result-item" onclick="selectSearchResult('${p.Marca}', '${p.category}', '${p.Modello}', '${p.Codice_PIM}')">
                        <h4>${p.Marca} ${p.Modello}</h4>
                        <p>${p.category} - PIM: ${p.Codice_PIM}</p>
                        ${material ? `<p class="search-color">Materiale: ${material}</p>` : ''}
                        ${connectivity ? `<p class="search-color">Connettività: ${connectivity}</p>` : ''}
                        ${color ? `<p class="search-color">Colore: ${color}</p>` : ''}
                        ${memory ? `<p class="search-memory">${p.category === 'Smartwatch' || p.category === 'Apple Watch' || p.category === 'Notebook' ? 'Dimensioni' : 'Memoria'}: ${memory}</p>` : ''}
                    </div>
                `;
            }).join('');
        }
        
        if (serviceResults.length > 0) {
            html += `<h3>🔧 Servizi (${serviceResults.length})</h3>`;
            html += serviceResults.map(s => `
                <div class="search-result-item" onclick="selectServiceSearchResult('${s.Servizio.replace(/"/g, '&quot;')}')">
                    <h4>${s.Servizio}</h4>
                    <p>${s.Categoria} - ${s.Sottocategoria} - Codice: ${s.Codice}</p>
                    <p>Costo: €${s.Costo}</p>
                </div>
            `).join('');
        }
        
        resultsContainer.innerHTML = html;
    }
    
    resultsContainer.classList.remove('hidden');
}

function selectSearchResult(brand, category, model, pim) {
    // Switch to phones section if not already there
    if (state.currentSection !== 'phones') {
        state.currentSection = 'phones';
        document.getElementById('navPhones').classList.add('active');
        document.getElementById('navServices').classList.remove('active');
    }

    state.selectedBrand = brand;
    state.selectedCategory = category;
    state.selectedModel = model;

    // Find the variant and select it
    let database;
    if (category === 'Smartphone') database = state.databases.smartphone;
    else if (category === 'Smartwatch') database = state.databases.smartwatch;
    else if (category === 'Apple Watch') database = state.databases.applewatch;
    else if (category === 'Tablet') database = state.databases.tablet;
    else if (category === 'Notebook') database = state.databases.notebook;

    const variant = database.find(p =>
        p.Marca === brand &&
        p.Modello === model &&
        p.Codice_PIM.toString() === pim.toString()
    );

    // For Apple Watch, extract material and connectivity from the variant
    if (category === 'Apple Watch' && variant) {
        state.selectedMaterial = variant.Materiale || 'n/n';
        state.selectedConnectivity = variant.Connettività || 'n/n';
    }
    
    if (variant) {
        state.selectedVariant = variant;
        if (category === 'Apple Watch') {
            state.selectedMemory = variant.mm || 'n/n';
        } else {
            state.selectedMemory = variant.Memoria || variant.mm || variant.pollici || 'n/n';
        }
        state.skippedColorSelection = true;
    }
    
    // Keep search results visible
    renderMainContent();
}

function selectServiceSearchResult(serviceName) {
    state.currentSection = 'services';
    state.selectedService = serviceName;
    
    // Update navigation buttons
    document.getElementById('navServices').classList.add('active');
    document.getElementById('navPhones').classList.remove('active');

    // Keep search results visible
    renderMainContent();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadDatabases();
    
    // Hard refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        location.reload(true);
    });
    
    // Navigation buttons
    document.getElementById('navPhones').addEventListener('click', () => {
        state.currentSection = 'phones';
        document.getElementById('navPhones').classList.add('active');
        document.getElementById('navServices').classList.remove('active');
        renderMainContent();
    });
    
    document.getElementById('navServices').addEventListener('click', () => {
        state.currentSection = 'services';
        document.getElementById('navServices').classList.add('active');
        document.getElementById('navPhones').classList.remove('active');
        renderMainContent();
    });
    
    document.getElementById('backBtn').addEventListener('click', () => {
        if (state.currentSection === 'services') {
            goBackServices();
        } else {
            goBack();
        }
    });
    
    document.getElementById('homeBtn').addEventListener('click', goHome);
    
    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
    
    document.getElementById('clearSearch').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').classList.add('hidden');
    });
    
    // QR Code button
    document.getElementById('qrBtn').addEventListener('click', showQRCode);
    
    // Close QR modal
    document.getElementById('closeQrModal').addEventListener('click', hideQRCode);
    
    // Close modal when clicking outside
    document.getElementById('qrModal').addEventListener('click', (e) => {
        if (e.target.id === 'qrModal') {
            hideQRCode();
        }
    });
});

// QR Code functions
function showQRCode() {
    const modal = document.getElementById('qrModal');
    const container = document.getElementById('qrCodeContainer');
    const urlDisplay = document.getElementById('qrUrl');
    
    // Use production URL
    const currentUrl = 'https://d4nielost.github.io/Catalogo-MW/';
    
    // Clear previous QR code
    container.innerHTML = '';
    
    // Generate QR code
    if (typeof QRCode !== 'undefined') {
        new QRCode(container, {
            text: currentUrl,
            width: 250,
            height: 250,
            colorDark: "#de2427",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        container.innerHTML = '<p style="color: red;">Libreria QR Code non caricata</p>';
    }
    
    // Display URL
    urlDisplay.textContent = currentUrl;
    
    // Show modal
    modal.classList.remove('hidden');
}

function hideQRCode() {
    document.getElementById('qrModal').classList.add('hidden');
}
