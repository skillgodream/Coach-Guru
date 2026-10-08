import visualLibraryData from '../../public/Guruji_Real_Photo_Visual_Library_500/visualLibrary.json';

export interface VisualAsset {
  id: string;
  file: string;
  tags: string[];
  category: string;
  source_generated: boolean;
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'for', 'with', 'on', 'at', 
  'in', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 
  'these', 'those', 'you', 'your', 'yours', 'from', 'it', 'its', 'about', 'above', 
  'after', 'again', 'against', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 
  'other', 'some', 'such', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 
  'should', 'now', 'do', 'does', 'did', 'doing', 'how', 'what', 'why', 'where', 'when'
]);

/**
 * Micro-stemmer to normalize various word forms (plurals, nominalizations, active/passive voice, etc.)
 * into a single base form. This completely eliminates matching mismatches between things like 
 * "housekeeper" vs "housekeeping" or "clean" vs "cleaning".
 */
export function stem(word: string): string {
  const w = word.toLowerCase().trim();
  
  if (w.startsWith('housekeep')) return 'housekeep';
  if (w.startsWith('sanit')) return 'sanit';
  if (w.startsWith('clean')) return 'clean';
  if (w.startsWith('saf')) return 'safe';
  if (w.startsWith('scan')) return 'scan';
  if (w.startsWith('pack')) return 'pack';
  if (w.startsWith('pick')) return 'pick';
  if (w.startsWith('verify')) return 'verify';
  if (w.startsWith('verifi')) return 'verify';
  if (w.startsWith('prepar')) return 'prepare';
  if (w.startsWith('prepa')) return 'prepare';
  if (w.startsWith('dilut')) return 'dilute';
  if (w.startsWith('applic')) return 'apply';
  if (w.startsWith('appl')) return 'apply';
  if (w.startsWith('bottl')) return 'bottle';
  if (w.startsWith('glov')) return 'glove';
  
  // Trimming standard suffixes
  if (w.endsWith('ing')) return w.slice(0, -3);
  if (w.endsWith('ed')) return w.slice(0, -2);
  if (w.endsWith('er')) return w.slice(0, -2);
  if (w.endsWith('es')) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  
  return w;
}

/**
 * Tokenizes text, filters out stop words, and applies stemming to each word.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, ' ') // replace special chars with space
    .split(/[\s-_]+/)               // split by space, hyphen, or underscore
    .filter(word => word.length > 1 && !STOP_WORDS.has(word))
    .map(stem);
}

/**
 * Finds the absolute best real-photo visual asset matching a given step's textual context.
 * 
 * @param stepText A compilation of text fields from the step (title, question, action, instruction, etc.)
 * @param contextText Contextual fields from the overall SOP (lesson title, role, category)
 * @returns The best matching visual asset, its matched score, and its browser-ready URL path
 */
export function findBestVisualMatch(
  stepText: string,
  contextText: string = ''
): { asset: VisualAsset | null; score: number; url: string | null } {
  const stepTokens = tokenize(stepText);
  const contextTokens = tokenize(contextText);
  const allTokens = [...stepTokens, ...contextTokens];

  if (allTokens.length === 0) {
    // Return a random or default asset if no tokens are found
    const fallback = visualLibraryData.assets[0] as VisualAsset;
    return {
      asset: fallback,
      score: 0,
      url: `/Guruji_Real_Photo_Visual_Library_500/${fallback.file}`
    };
  }

  let bestAsset: VisualAsset | null = null;
  let highestScore = -1;

  for (const asset of visualLibraryData.assets as VisualAsset[]) {
    let score = 0;
    const assetTags = asset.tags.map(stem);

    // 1. Tag exact matches (highest weight)
    for (const tag of assetTags) {
      if (stepTokens.includes(tag)) {
        score += 15;
      } else if (contextTokens.includes(tag)) {
        score += 8;
      }
    }

    // 2. Tag partial matches or substring matches
    for (const tag of assetTags) {
      for (const token of allTokens) {
        if (token !== tag && (token.includes(tag) || tag.includes(token))) {
          score += 4;
        }
      }
    }

    // 3. Filename token matches (e.g. 059_hotel_chef_kitchen.webp contains "hotel", "chef", "kitchen")
    const filenameNoExt = asset.file.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
    const filenameTokens = tokenize(filenameNoExt);
    for (const fToken of filenameTokens) {
      if (stepTokens.includes(fToken)) {
        score += 10;
      } else if (contextTokens.includes(fToken)) {
        score += 5;
      }
    }

    // 4. Category relevance matches
    const category = asset.category.toLowerCase();
    
    // Hospitality category weights
    if (category === 'hospitality' && (
      allTokens.includes('hotel') || allTokens.includes('chef') || allTokens.includes('waiter') ||
      allTokens.includes('guest') || allTokens.includes('reception') || allTokens.includes('room') ||
      allTokens.includes('dining') || allTokens.includes('valet') || allTokens.includes('serv') ||
      allTokens.includes('waitress') || allTokens.includes('kitchen') || allTokens.includes('bell')
    )) {
      score += 6;
    }

    // People Safety category weights
    if (category === 'people_safety' && (
      allTokens.includes('safe') || allTokens.includes('hazard') || allTokens.includes('wet') ||
      allTokens.includes('floor') || allTokens.includes('fire') || allTokens.includes('extinguish') ||
      allTokens.includes('work') || allTokens.includes('glove') || allTokens.includes('ladd') ||
      allTokens.includes('ppe') || allTokens.includes('accid') || allTokens.includes('clean') ||
      allTokens.includes('sanit')
    )) {
      score += 6;
    }

    // Retail category weights
    if (category === 'retail' && (
      allTokens.includes('retail') || allTokens.includes('cashier') || allTokens.includes('checkout') ||
      allTokens.includes('shelf') || allTokens.includes('restock') || allTokens.includes('cash') ||
      allTokens.includes('custom') || allTokens.includes('store') || allTokens.includes('price') ||
      allTokens.includes('bag')
    )) {
      score += 6;
    }

    // Ecommerce category weights
    if (category === 'ecommerce' && (
      allTokens.includes('warehous') || allTokens.includes('pick') || allTokens.includes('pack') ||
      allTokens.includes('tote') || allTokens.includes('box') ||
      allTokens.includes('conveyor') || allTokens.includes('pallet') || allTokens.includes('ship') ||
      allTokens.includes('deliv') || allTokens.includes('inventori')
    )) {
      score += 6;
    }

    // Tools & Props category weights
    if (category === 'tools_props' && (
      allTokens.includes('termin') || allTokens.includes('payment') || allTokens.includes('scan') ||
      allTokens.includes('barcod') || allTokens.includes('cart') || allTokens.includes('tablet') ||
      allTokens.includes('devic') || allTokens.includes('tool') || allTokens.includes('prop')
    )) {
      score += 4;
    }

    if (score > highestScore) {
      highestScore = score;
      bestAsset = asset;
    }
  }

  // Fallback if score is extremely low or no matches found
  if (!bestAsset || highestScore <= 0) {
    let defaultCategory = 'people_safety';
    if (allTokens.some(t => ['hotel', 'chef', 'waiter', 'guest', 'restaurant', 'dining', 'valet'].includes(t))) {
      defaultCategory = 'hospitality';
    } else if (allTokens.some(t => ['retail', 'cashier', 'store', 'checkout', 'bag', 'counter'].includes(t))) {
      defaultCategory = 'retail';
    } else if (allTokens.some(t => ['warehouse', 'picker', 'packer', 'packing', 'tote', 'conveyor', 'delivery'].includes(t))) {
      defaultCategory = 'ecommerce';
    } else if (allTokens.some(t => ['terminal', 'scanner', 'barcode', 'device', 'payment'].includes(t))) {
      defaultCategory = 'tools_props';
    }

    const categoryAsset = (visualLibraryData.assets as VisualAsset[]).find(a => a.category === defaultCategory) || (visualLibraryData.assets[0] as VisualAsset);
    return {
      asset: categoryAsset,
      score: 0,
      url: `/Guruji_Real_Photo_Visual_Library_500/${categoryAsset.file}`
    };
  }

  return {
    asset: bestAsset,
    score: highestScore,
    url: `/Guruji_Real_Photo_Visual_Library_500/${bestAsset.file}`
  };
}
