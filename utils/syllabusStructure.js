/**
 * utils/syllabusStructure.js — EXACT textbook chapter structure
 * ─────────────────────────────────────────────────────────────────
 * Source: Actual Cambridge IGCSE/O Level Coursebooks
 * Photographed from Yusuf Khurram's O2 textbooks (Haque Academy, Karachi)
 * + Dina Khurram's O1 textbooks
 *
 * Every chapter name and sub-topic is EXACTLY as printed in the textbook.
 * This is the source of truth for /study page modules.
 */

export const SYLLABUS = {

  // ════════════════════════════════════════════════════════════
  // CHEMISTRY 5070 — Cambridge IGCSE Chemistry Coursebook
  // 22 Chapters
  // ════════════════════════════════════════════════════════════
  'Chemistry': {
    code: '5070', level: 'O Level',
    themes: [
      { name: 'Physical Chemistry', sections: [
        { id: '1', name: 'States of matter', keywords: ['state', 'solid', 'liquid', 'gas', 'kinetic', 'diffusion', 'mixture'] },
        { id: '2', name: 'Atomic structure', keywords: ['atomic', 'atom', 'element', 'isotope', 'electron', 'proton', 'neutron', 'configuration'] },
        { id: '3', name: 'Chemical bonding', keywords: ['bond', 'ionic', 'covalent', 'metallic', 'giant', 'structure'] },
        { id: '4', name: 'Chemical formulae and equations', keywords: ['formula', 'equation', 'chemical name', 'symbol'] },
        { id: '5', name: 'Chemical calculations', keywords: ['mole', 'avogadro', 'chemical equation', 'solution chemistry', 'calculation'] },
        { id: '6', name: 'Electrochemistry', keywords: ['electrolysis', 'electrical conductivity', 'hydrogen', 'fuel'] },
        { id: '7', name: 'Chemical energetics', keywords: ['energetics', 'exothermic', 'endothermic', 'physical', 'chemical change'] },
        { id: '8', name: 'Rates of reaction', keywords: ['rate', 'factor', 'collision theory', 'catalyst'] },
        { id: '9', name: 'Reversible reactions and equilibrium', keywords: ['reversible', 'equilibrium', 'haber', 'contact', 'fertiliser'] },
        { id: '10', name: 'Redox reactions', keywords: ['redox', 'combustion', 'oxidation', 'reduction'] },
      ]},
      { name: 'Inorganic Chemistry', sections: [
        { id: '11', name: 'Acids and bases', keywords: ['acid', 'base', 'alkali', 'pH', 'neutralisation', 'characteristic'] },
        { id: '12', name: 'Preparation of salts', keywords: ['salt', 'preparation', 'importance'] },
        { id: '13', name: 'The Periodic Table', keywords: ['periodic', 'classifying', 'trend', 'group', 'period'] },
        { id: '14', name: 'Metallic elements and alloys', keywords: ['metallic', 'property', 'use', 'alloy'] },
        { id: '15', name: 'Reactivity of metals', keywords: ['reactivity', 'series', 'metal displacement'] },
        { id: '16', name: 'Extraction and corrosion of metals', keywords: ['extraction', 'corrosion', 'rusting'] },
        { id: '17', name: 'Chemistry of our environment', keywords: ['air quality', 'carbon dioxide', 'methane', 'climate', 'water'] },
      ]},
      { name: 'Organic Chemistry', sections: [
        { id: '18', name: 'Introduction to organic chemistry', keywords: ['organic', 'compound', 'structural', 'homologous', 'isomerism'] },
        { id: '19', name: 'Reactions of organic compounds', keywords: ['characteristic reaction', 'ethanol', 'carboxylic', 'ester'] },
        { id: '20', name: 'Petrochemicals and polymers', keywords: ['petroleum', 'product', 'polymer', 'plastic'] },
      ]},
      { name: 'Experimental Chemistry', sections: [
        { id: '21', name: 'Experimental design and separation techniques', keywords: ['experimental', 'separation', 'purification', 'chromatography'] },
        { id: '22', name: 'Chemical analysis', keywords: ['analysis', 'cation', 'anion', 'gas', 'titration', 'quantitative'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // PHYSICS 5054 — Cambridge IGCSE Physics Coursebook
  // 25 Chapters
  // ════════════════════════════════════════════════════════════
  'Physics': {
    code: '5054', level: 'O Level',
    themes: [
      { name: 'General Physics', sections: [
        { id: '1', name: 'Making measurements', keywords: ['measurement', 'length', 'volume', 'density', 'time'] },
        { id: '2', name: 'Describing motion', keywords: ['speed', 'distance-time', 'acceleration', 'motion'] },
        { id: '3', name: 'Forces and motion', keywords: ['force', 'mass', 'weight', 'gravity', 'falling', 'acceleration', 'momentum', 'scalar', 'vector'] },
        { id: '4', name: 'Turning effects', keywords: ['moment', 'calculating moment', 'stability', 'centre of gravity'] },
        { id: '5', name: 'Forces and matter', keywords: ['solid', 'stretching', 'spring', 'spring constant', 'pressure'] },
        { id: '6', name: 'Energy stores and transfers', keywords: ['energy store', 'energy transfer', 'conservation', 'energy calculation'] },
        { id: '7', name: 'Energy resources', keywords: ['energy resource', 'energy from the sun'] },
        { id: '8', name: 'Work and power', keywords: ['work', 'calculating work', 'power', 'calculating power'] },
      ]},
      { name: 'Thermal Physics', sections: [
        { id: '9', name: 'The kinetic particle model of matter', keywords: ['kinetic', 'particle', 'state of matter', 'gas', 'temperature', 'celsius', 'gas law'] },
        { id: '10', name: 'Thermal properties of matter', keywords: ['thermal expansion', 'specific heat', 'changing state', 'latent heat'] },
        { id: '11', name: 'Thermal energy transfers', keywords: ['conduction', 'convection', 'radiation', 'thermal energy transfer'] },
      ]},
      { name: 'Waves', sections: [
        { id: '12', name: 'Sound', keywords: ['sound', 'making sound', 'how does sound travel', 'speed of sound', 'hearing'] },
        { id: '13', name: 'Light', keywords: ['light', 'reflection', 'refraction', 'total internal reflection', 'lens', 'dispersion'] },
        { id: '14', name: 'Properties of waves', keywords: ['wave', 'describing wave', 'speed frequency wavelength', 'wave phenomena'] },
        { id: '15', name: 'The electromagnetic spectrum', keywords: ['electromagnetic', 'wave', 'hazard', 'communicating'] },
      ]},
      { name: 'Electricity and Magnetism', sections: [
        { id: '16', name: 'Magnetism', keywords: ['permanent magnet', 'magnetic field'] },
        { id: '17', name: 'Static electricity', keywords: ['charging', 'discharging', 'static', 'electric field'] },
        { id: '18', name: 'Electrical quantities', keywords: ['current', 'electric circuit', 'voltage', 'resistance', 'electrical energy', 'work', 'power'] },
        { id: '19', name: 'Electrical circuits', keywords: ['circuit component', 'combination', 'electrical safety'] },
        { id: '20', name: 'Electromagnetic forces', keywords: ['magnetic effect', 'current-carrying conductor', 'electric motor', 'beam', 'charged particle'] },
        { id: '21', name: 'Electromagnetic induction', keywords: ['generating electricity', 'power line', 'transformer'] },
      ]},
      { name: 'Atomic Physics', sections: [
        { id: '22', name: 'The nuclear atom', keywords: ['nuclear', 'atomic structure', 'proton', 'neutron', 'electron'] },
        { id: '23', name: 'Radioactivity', keywords: ['radioactivity', 'radioactive decay', 'activity', 'half-life', 'radioisotope'] },
      ]},
      { name: 'Space Physics', sections: [
        { id: '24', name: 'Earth and the Solar System', keywords: ['earth', 'sun', 'moon', 'solar system'] },
        { id: '25', name: 'Stars and the Universe', keywords: ['star', 'galaxy', 'universe'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // MATHEMATICS 4024 — Cambridge O Level Mathematics Coursebook
  // 10 Chapters
  // ════════════════════════════════════════════════════════════
  'Mathematics': {
    code: '4024', level: 'O Level',
    themes: [
      { name: 'Number and Algebra', sections: [
        { id: '1', name: 'Number', keywords: ['number', 'practical arithmetic', 'types of number', 'sequence', 'pattern', 'fraction', 'decimal', 'percentage', 'ordering', 'estimation', 'standard form', 'index', 'ratio', 'proportion', 'limit', 'accuracy', 'surd'] },
        { id: '2', name: 'Algebra', keywords: ['algebra', 'formula', 'bracket', 'simplifying', 'linear equation', 'simultaneous', 'factorising', 'quadratic', 'completing the square', 'algebraic fraction', 'changing the subject', 'inequality', 'indices in algebra', 'proportion'] },
      ]},
      { name: 'Measurement and Geometry', sections: [
        { id: '3', name: 'Mensuration', keywords: ['area', 'perimeter', 'circle', 'arc', 'sector', 'volume', 'prism', 'surface area'] },
        { id: '4', name: 'Geometry', keywords: ['angle', 'constructing triangle', 'polygon', 'parallel line', 'pythagoras', 'symmetry', 'similarity', 'area of similar figure', 'volume of similar figure', 'tangent', 'circle theorem'] },
        { id: '5', name: 'Trigonometry', keywords: ['right-angled triangle', 'elevation', 'depression', 'bearing', 'scale drawing', 'sine rule', 'cosine rule', 'area of triangle', 'trigonometry in three dimensions'] },
      ]},
      { name: 'Data and Functions', sections: [
        { id: '6', name: 'Graphs', keywords: ['line segment', 'straight-line graph', 'parallel', 'perpendicular', 'travel graph', 'quadratic function', 'gradient', 'graphical solution'] },
        { id: '7', name: 'Transformations and vectors', keywords: ['single transformation', 'combined transformation', 'column vector', 'position vector', 'vector geometry'] },
        { id: '8', name: 'Sets and functions', keywords: ['set', 'notation', 'symbol', 'venn diagram', 'function', 'inverse function', 'composite function'] },
        { id: '9', name: 'Statistics', keywords: ['collecting', 'organising', 'displaying data', 'scatter diagram', 'mean', 'median', 'mode', 'grouping data', 'estimating mean', 'grouped', 'continuous'] },
        { id: '10', name: 'Probability', keywords: ['probability', 'event', 'outcome', 'experimental', 'relative frequency', 'independent', 'tree diagram', 'dependent'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // COMPUTER SCIENCE 2210 — Cambridge IGCSE & O Level CS Coursebook
  // 11 Chapters (Paper 1: Ch 1-6, Paper 2: Ch 7-11)
  // ════════════════════════════════════════════════════════════
  'Computer Science': {
    code: '2210', level: 'O Level',
    themes: [
      { name: 'Paper 1: Computer Systems', sections: [
        { id: '1', name: 'Data representation', keywords: ['binary', 'hexadecimal', 'negative number', 'text', 'image', 'sound', 'data storage', 'data compression'] },
        { id: '2', name: 'Data transmission', keywords: ['data packet', 'packet switching', 'method of transmission', 'usb', 'detecting error', 'encryption'] },
        { id: '3', name: 'Hardware', keywords: ['cpu', 'fetch stage', 'decode stage', 'execute stage', 'performance', 'input', 'output', 'data storage', 'virtual memory', 'cloud storage', 'network hardware'] },
        { id: '4', name: 'Software', keywords: ['types of software', 'operating system', 'interrupt', 'programming language', 'translator', 'ide'] },
        { id: '5', name: 'The internet and its uses', keywords: ['internet', 'world wide web', 'web page', 'web browser', 'digital currency', 'cyber security'] },
        { id: '6', name: 'Automated and emerging technologies', keywords: ['automated system', 'robotics', 'robots in context', 'artificial intelligence'] },
      ]},
      { name: 'Paper 2: Algorithms and Programming', sections: [
        { id: '7', name: 'Algorithm design and problem solving', keywords: ['program development', 'life cycle', 'analysis', 'design', 'pseudocode', 'coding', 'testing', 'common algorithm', 'trace table', 'finding purpose', 'finding error'] },
        { id: '8', name: 'Programming', keywords: ['programming concept', 'data type', 'input', 'output', 'arithmetic operator', 'sequence', 'selection', 'iteration', 'totalling', 'counting', 'string manipulation', 'nested statement', 'subroutine', 'library routine', 'maintainable program', 'array', 'file handling'] },
        { id: '9', name: 'Databases', keywords: ['database structure', 'sql', 'select', 'from', 'where', 'order by', 'sum', 'count'] },
        { id: '10', name: 'Boolean logic', keywords: ['logic gate', 'not', 'and', 'or', 'nand', 'nor', 'xor', 'logic expression', 'truth table', 'problem statement'] },
        { id: '11', name: 'Programming scenarios practice', keywords: ['programming scenario', 'method', 'identifying input', 'process', 'output', 'writing code', 'practically carrying out'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ACCOUNTING 7707 — Cambridge O Level Accounting Coursebook
  // 4 Sections, 22 Chapters
  // ════════════════════════════════════════════════════════════
  'Accounting': {
    code: '7707', level: 'O Level',
    themes: [
      { name: 'Section 1: Introduction', sections: [
        { id: '1', name: 'Introduction to accounting', keywords: ['introduction', 'accounting', 'purpose'] },
        { id: '2', name: 'Double entry book-keeping – Part A', keywords: ['double entry', 'book-keeping', 'ledger', 'debit', 'credit'] },
        { id: '3', name: 'The trial balance', keywords: ['trial balance'] },
        { id: '4', name: 'Double entry book-keeping – Part B', keywords: ['double entry', 'part b', 'returns', 'discount'] },
        { id: '5', name: 'Petty cash books', keywords: ['petty cash', 'imprest'] },
      ]},
      { name: 'Section 2: Business Documents', sections: [
        { id: '6', name: 'Business documents', keywords: ['business document', 'invoice', 'receipt', 'credit note'] },
        { id: '7', name: 'Books of prime entry', keywords: ['prime entry', 'day book', 'journal'] },
      ]},
      { name: 'Section 3: Financial Statements', sections: [
        { id: '8', name: 'Financial statements – Part A', keywords: ['financial statement', 'income statement', 'trading account'] },
        { id: '9', name: 'Financial statements – Part B', keywords: ['financial statement', 'balance sheet', 'statement of financial position'] },
        { id: '10', name: 'Accounting rules', keywords: ['accounting rule', 'concept', 'convention', 'principle'] },
        { id: '11', name: 'Other payables and other receivables', keywords: ['payable', 'receivable', 'accrual', 'prepayment'] },
        { id: '12', name: 'Accounting for depreciation and disposal of non-current assets', keywords: ['depreciation', 'disposal', 'non-current asset'] },
        { id: '13', name: 'Irrecoverable debts and provisions for doubtful debts', keywords: ['irrecoverable', 'bad debt', 'doubtful debt', 'provision'] },
      ]},
      { name: 'Section 4: Advanced Topics', sections: [
        { id: '14', name: 'Bank reconciliation statements', keywords: ['bank reconciliation', 'bank statement'] },
        { id: '15', name: 'Journal entries and correction of errors', keywords: ['journal', 'correction', 'error', 'suspense'] },
        { id: '16', name: 'Control accounts', keywords: ['control account', 'sales ledger', 'purchase ledger'] },
        { id: '17', name: 'Incomplete records', keywords: ['incomplete record', 'single entry', 'margin', 'mark-up'] },
        { id: '18', name: 'Accounts of clubs and societies', keywords: ['club', 'society', 'subscription', 'receipts and payments'] },
        { id: '19', name: 'Partnerships', keywords: ['partnership', 'profit sharing', 'appropriation', 'capital account', 'current account'] },
        { id: '20', name: 'Manufacturing accounts', keywords: ['manufacturing', 'prime cost', 'factory overhead', 'production cost'] },
        { id: '21', name: 'Limited companies', keywords: ['limited company', 'share', 'dividend', 'retained earnings'] },
        { id: '22', name: 'Analysis and interpretation', keywords: ['ratio', 'analysis', 'interpretation', 'gross profit', 'net profit', 'liquidity', 'efficiency'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ENGLISH LANGUAGE 1123 — Cambridge O Level English Language Coursebook
  // Part 1: Reading (5 chapters) + Part 2: Writing (5 chapters)
  // ════════════════════════════════════════════════════════════
  'English Language': {
    code: '1123', level: 'O Level',
    themes: [
      { name: 'Part 1: Reading', sections: [
        { id: '1', name: 'Reading skills and strategies', keywords: ['reading skill', 'reading strategy', 'types of text'] },
        { id: '2', name: 'Reading for comprehension', keywords: ['vocabulary', 'reading strategy', 'own words', 'explicit', 'implicit', 'opinion', 'attitude'] },
        { id: '3', name: 'Analysing and explaining writers\' effects', keywords: ['writer\'s effect', 'language', 'meaning', 'idea', 'figurative', 'atmosphere', 'setting', 'sensory language'] },
        { id: '4', name: 'Summary writing', keywords: ['reading for ideas', 'remodelling', 'coherent writing', 'summary'] },
        { id: '5', name: 'Reading practice', keywords: ['reading practice', 'comprehension practice'] },
      ]},
      { name: 'Part 2: Writing', sections: [
        { id: '6', name: 'Writing skills', keywords: ['writing skill', 'audience', 'purpose', 'voice', 'vocabulary', 'grammar', 'structure', 'plan'] },
        { id: '7', name: 'Directed writing', keywords: ['directed writing', 'key evaluation', 'evaluate', 'discursive', 'point of view', 'letter', 'email', 'speech'] },
        { id: '8', name: 'Descriptive writing', keywords: ['descriptive', 'describing place', 'describing event', 'describing people'] },
        { id: '9', name: 'Narrative writing', keywords: ['narrative', 'story', 'planning', 'story opening', 'character', 'situation', 'art of storytelling', 'narration', 'ending'] },
        { id: '10', name: 'Writing practice', keywords: ['writing practice'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // PAKISTAN STUDIES 2059
  // Paper 1: History | Paper 2: Geography
  // ════════════════════════════════════════════════════════════
  'Pakistan Studies': {
    code: '2059', level: 'O Level',
    themes: [
      {
        name: 'Paper 1: History and Culture of Pakistan',
        sections: [
          { id: 'S1', name: 'Section 1: Culture and the Making of Pakistan', keywords: ['mughal', 'shah waliullah', 'syed ahmad', 'islam', 'subcontinent', 'thinker', 'reformer'] },
          { id: 'S2', name: 'Section 2: The Emergence of Pakistan 1906-47', keywords: ['movement', 'congress', 'league', 'jinnah', 'iqbal', 'khilafat', 'lahore resolution', 'partition', 'mountbatten'] },
          { id: 'S3', name: 'Section 3: Nationhood 1947-99', keywords: ['constitution', 'government', 'martial law', 'ayub', 'bhutto', 'zia', 'benazir', 'nawaz', 'musharraf', 'bangladesh', '1971'] },
        ],
      },
      {
        name: 'Paper 2: The Environment of Pakistan',
        sections: [
          { id: 'P2.1', name: 'The Land of Pakistan', keywords: ['land', 'topography', 'climate', 'mountain', 'plain', 'plateau', 'desert', 'location'] },
          { id: 'P2.2', name: 'Natural Resources', keywords: ['water', 'forest', 'mineral', 'fish', 'natural resource', 'irrigation'] },
          { id: 'P2.3', name: 'Power and Energy', keywords: ['power', 'energy', 'electricity', 'hydroelectric', 'thermal', 'nuclear', 'renewable', 'gas', 'oil'] },
          { id: 'P2.4', name: 'Agricultural Development', keywords: ['agriculture', 'crop', 'wheat', 'rice', 'cotton', 'sugarcane', 'livestock', 'farming'] },
          { id: 'P2.5', name: 'Industrial Development', keywords: ['industry', 'textile', 'manufacturing', 'cottage', 'factory', 'steel'] },
          { id: 'P2.6', name: 'Trade and Commerce', keywords: ['trade', 'export', 'import', 'trading partner', 'balance'] },
          { id: 'P2.7', name: 'Transport and Telecommunications', keywords: ['transport', 'road', 'railway', 'airport', 'port', 'telecommunication'] },
          { id: 'P2.8', name: 'Population', keywords: ['population', 'employment', 'unemployment', 'migration', 'urbanisation', 'census'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BIOLOGY 5090
  // ════════════════════════════════════════════════════════════
  'Biology': {
    code: '5090', level: 'O Level',
    themes: [
      { name: 'Cell Biology', sections: [
        { id: '1', name: 'Cell structure and organisation', keywords: ['cell', 'organelle', 'microscop', 'tissue', 'organ', 'membrane'] },
        { id: '2', name: 'Diffusion, osmosis and active transport', keywords: ['diffusion', 'osmosis', 'active transport', 'membrane', 'concentration'] },
        { id: '3', name: 'Enzymes', keywords: ['enzyme', 'catalyst', 'substrate', 'active site', 'denatured'] },
      ]},
      { name: 'Nutrition and Transport', sections: [
        { id: '4', name: 'Nutrition in plants', keywords: ['photosynthesis', 'chlorophyll', 'light', 'carbon dioxide', 'leaf'] },
        { id: '5', name: 'Nutrition in humans', keywords: ['nutrition', 'digestion', 'food', 'diet', 'vitamin', 'protein'] },
        { id: '6', name: 'Transport in plants', keywords: ['xylem', 'phloem', 'transpiration', 'root', 'stem'] },
        { id: '7', name: 'Transport in humans', keywords: ['blood', 'heart', 'circulation', 'artery', 'vein'] },
      ]},
      { name: 'Respiration and Coordination', sections: [
        { id: '8', name: 'Respiration', keywords: ['respiration', 'aerobic', 'anaerobic', 'glucose', 'oxygen'] },
        { id: '9', name: 'Gas exchange', keywords: ['gas exchange', 'lung', 'alveoli', 'breathing'] },
        { id: '10', name: 'Coordination and response', keywords: ['nervous', 'hormone', 'brain', 'reflex', 'synapse', 'insulin'] },
        { id: '11', name: 'Homeostasis', keywords: ['homeostasis', 'temperature', 'blood sugar', 'kidney', 'excretion'] },
      ]},
      { name: 'Reproduction and Ecology', sections: [
        { id: '12', name: 'Reproduction', keywords: ['reproduction', 'sexual', 'asexual', 'flower', 'pollination'] },
        { id: '13', name: 'Inheritance', keywords: ['inherit', 'gene', 'DNA', 'chromosome', 'mitosis', 'meiosis', 'mutation'] },
        { id: '14', name: 'Ecology', keywords: ['ecology', 'environment', 'ecosystem', 'food chain', 'pollution'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // GEOGRAPHY 2217
  // ════════════════════════════════════════════════════════════
  'Geography': { code: '2217', level: 'O Level', themes: [
    { name: 'Theme 1: Population and Settlement', sections: [
      { id: '1.1', name: 'Population Dynamics', keywords: ['population', 'birth rate', 'death rate', 'natural increase'] },
      { id: '1.2', name: 'Migration', keywords: ['migration', 'immigration', 'emigration', 'refugee'] },
      { id: '1.3', name: 'Population Structure', keywords: ['population structure', 'pyramid', 'age', 'dependency'] },
      { id: '1.4', name: 'Population Density and Distribution', keywords: ['density', 'distribution', 'sparse', 'dense'] },
      { id: '1.5', name: 'Settlements and Service Provision', keywords: ['settlement', 'rural', 'service', 'hierarchy'] },
      { id: '1.6', name: 'Urban Settlements', keywords: ['urban', 'land use', 'cbd', 'suburb'] },
      { id: '1.7', name: 'Urbanisation', keywords: ['urbanisation', 'squatter', 'shanty', 'megacity'] },
    ]},
    { name: 'Theme 2: The Natural Environment', sections: [
      { id: '2.1', name: 'Earthquakes and Volcanoes', keywords: ['earthquake', 'volcano', 'tectonic', 'plate'] },
      { id: '2.2', name: 'Rivers', keywords: ['river', 'flood', 'erosion', 'deposition', 'meander'] },
      { id: '2.3', name: 'Coasts', keywords: ['coast', 'wave', 'cliff', 'beach', 'spit'] },
      { id: '2.4', name: 'Weather', keywords: ['weather', 'temperature', 'rainfall', 'wind', 'cloud'] },
      { id: '2.5', name: 'Climate and Natural Vegetation', keywords: ['climate', 'vegetation', 'tropical', 'rainforest', 'desert'] },
    ]},
    { name: 'Theme 3: Economic Development', sections: [
      { id: '3.1', name: 'Development', keywords: ['development', 'indicator', 'hdi', 'inequality'] },
      { id: '3.2', name: 'Food Production', keywords: ['food', 'agriculture', 'farming', 'shortage'] },
      { id: '3.3', name: 'Industry', keywords: ['industry', 'manufacturing', 'primary', 'secondary'] },
      { id: '3.4', name: 'Tourism', keywords: ['tourism', 'tourist', 'ecotourism'] },
      { id: '3.5', name: 'Energy', keywords: ['energy', 'fossil fuel', 'renewable', 'nuclear'] },
      { id: '3.6', name: 'Water', keywords: ['water', 'supply', 'demand', 'dam'] },
      { id: '3.7', name: 'Environmental Risks', keywords: ['pollution', 'deforestation', 'global warming', 'sustainable'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // ECONOMICS 2281
  // ════════════════════════════════════════════════════════════
  'Economics': { code: '2281', level: 'O Level', themes: [
    { name: 'Microeconomics', sections: [
      { id: '1', name: 'The Basic Economic Problem', keywords: ['economic problem', 'scarcity', 'opportunity cost'] },
      { id: '2', name: 'The Allocation of Resources', keywords: ['demand', 'supply', 'price', 'market', 'elasticity'] },
      { id: '3', name: 'Microeconomic Decision Makers', keywords: ['bank', 'household', 'worker', 'trade union', 'firm'] },
    ]},
    { name: 'Macroeconomics', sections: [
      { id: '4', name: 'Government and the Macroeconomy', keywords: ['fiscal', 'monetary', 'inflation', 'unemployment', 'growth'] },
      { id: '5', name: 'Economic Development', keywords: ['development', 'poverty', 'living standard'] },
      { id: '6', name: 'International Trade', keywords: ['trade', 'globalisation', 'tariff', 'exchange rate'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // ISLAMIYAT 2058
  // ════════════════════════════════════════════════════════════
  'Islamiyat': { code: '2058', level: 'O Level', themes: [
    { name: 'Paper 1', sections: [
      { id: 'P1.1', name: 'Major Themes of the Quran', keywords: ['quran', 'surah', 'ayah', 'theme', 'tawhid'] },
      { id: 'P1.2', name: 'History and Importance of the Quran', keywords: ['revelation', 'compilation', 'preservation'] },
      { id: 'P1.3', name: 'Life and Importance of Prophet Muhammad (PBUH)', keywords: ['prophet', 'muhammad', 'makkah', 'madinah', 'hijrah'] },
      { id: 'P1.4', name: 'The First Islamic Community', keywords: ['community', 'ummah', 'brotherhood'] },
    ]},
    { name: 'Paper 2', sections: [
      { id: 'P2.1', name: 'Major Teachings in the Hadiths', keywords: ['hadith', 'teaching', 'sunnah'] },
      { id: 'P2.2', name: 'History and Importance of the Hadiths', keywords: ['hadith collection', 'bukhari', 'muslim'] },
      { id: 'P2.3', name: 'The Rightly Guided Caliphs', keywords: ['caliph', 'abu bakr', 'umar', 'uthman', 'ali'] },
      { id: 'P2.4', name: 'Articles of Faith and Pillars of Islam', keywords: ['pillar', 'shahadah', 'salah', 'zakat', 'hajj', 'iman'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // HISTORY 2147
  // ════════════════════════════════════════════════════════════
  'History': { code: '2147', level: 'O Level', themes: [
    { name: 'Section 1: Core Content', sections: [
      { id: '1', name: 'Was the Treaty of Versailles fair?', keywords: ['versailles', 'treaty', 'wilson'] },
      { id: '2', name: 'To what extent was the League of Nations a success?', keywords: ['league of nations', 'mandate'] },
      { id: '3', name: 'Why had international peace collapsed by 1939?', keywords: ['hitler', 'appeasement', 'nazi'] },
      { id: '4', name: 'Who was to blame for the Cold War?', keywords: ['cold war', 'truman', 'stalin'] },
      { id: '5', name: 'How effectively did the USA contain communism?', keywords: ['containment', 'korea', 'vietnam', 'cuba'] },
      { id: '6', name: 'How secure was the USSR\'s control over Eastern Europe?', keywords: ['hungary', 'czechoslovakia', 'berlin wall'] },
    ]},
    { name: 'Section 2: Depth Studies', sections: [
      { id: 'A', name: 'The First World War', keywords: ['world war 1', 'trench', 'somme'] },
      { id: 'B', name: 'Germany, 1918-45', keywords: ['weimar', 'nazi', 'hitler', 'holocaust'] },
      { id: 'C', name: 'Russia, 1905-41', keywords: ['russia', 'revolution', 'tsar', 'lenin', 'stalin'] },
      { id: 'D', name: 'The United States, 1919-41', keywords: ['america', 'roaring twenties', 'great depression'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // URDU 3247
  // ════════════════════════════════════════════════════════════
  'Urdu': { code: '3247', level: 'O Level', themes: [
    { name: 'Paper 1: Language', sections: [
      { id: 'P1.1', name: 'Comprehension (فہم و ادراک)', keywords: ['comprehension', 'passage'] },
      { id: 'P1.2', name: 'Summary Writing (خلاصہ نویسی)', keywords: ['summary', 'خلاصہ'] },
      { id: 'P1.3', name: 'Grammar (قواعد)', keywords: ['grammar', 'قواعد'] },
      { id: 'P1.4', name: 'Translation (ترجمہ)', keywords: ['translation', 'ترجمہ'] },
    ]},
    { name: 'Paper 2: Composition', sections: [
      { id: 'P2.1', name: 'Essay Writing (مضمون نگاری)', keywords: ['essay', 'مضمون'] },
      { id: 'P2.2', name: 'Letter Writing (خط نگاری)', keywords: ['letter', 'خط'] },
      { id: 'P2.3', name: 'Story Writing (کہانی نگاری)', keywords: ['story', 'کہانی'] },
      { id: 'P2.4', name: 'Dialogue Writing (مکالمہ نگاری)', keywords: ['dialogue', 'مکالمہ'] },
      { id: 'P2.5', name: 'Poetry & Literary Devices (شاعری)', keywords: ['poetry', 'شاعری', 'literary'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // BUSINESS STUDIES 7115
  // ════════════════════════════════════════════════════════════
  'Business Studies': { code: '7115', level: 'O Level', themes: [
    { name: 'Business Fundamentals', sections: [
      { id: '1', name: 'Understanding Business Activity', keywords: ['business', 'enterprise', 'stakeholder'] },
      { id: '2', name: 'People in Business', keywords: ['motivation', 'recruitment', 'training'] },
    ]},
    { name: 'Business Operations', sections: [
      { id: '3', name: 'Marketing', keywords: ['marketing', 'market research', 'product', 'price'] },
      { id: '4', name: 'Operations Management', keywords: ['production', 'productivity', 'quality'] },
    ]},
    { name: 'Business Environment', sections: [
      { id: '5', name: 'Financial Information', keywords: ['finance', 'cash flow', 'income statement'] },
      { id: '6', name: 'External Influences', keywords: ['government', 'economic', 'legal', 'globalisation'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // COMMERCE 7100
  // ════════════════════════════════════════════════════════════
  'Commerce': { code: '7100', level: 'O Level', themes: [
    { name: 'Commerce and Trade', sections: [
      { id: '1', name: 'Commerce and Production', keywords: ['commerce', 'production', 'supply chain'] },
      { id: '2', name: 'Commercial Operations', keywords: ['retail', 'wholesale', 'enterprise'] },
      { id: '3', name: 'Globalisation of Trade', keywords: ['international', 'global', 'import', 'export'] },
    ]},
    { name: 'Supporting Commerce', sections: [
      { id: '4', name: 'Logistics', keywords: ['transport', 'warehouse', 'logistics'] },
      { id: '5', name: 'Aids to Trade', keywords: ['advertising', 'banking', 'insurance'] },
      { id: '6', name: 'Sustainability and Ethics', keywords: ['sustainability', 'ethics', 'consumer'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // SOCIOLOGY 2251
  // ════════════════════════════════════════════════════════════
  'Sociology': { code: '2251', level: 'O Level', themes: [
    { name: 'Core Concepts', sections: [
      { id: '1', name: 'Research Methods', keywords: ['research', 'method', 'survey'] },
      { id: '2', name: 'Identity and Social Control', keywords: ['identity', 'social control', 'socialisation'] },
      { id: '3', name: 'Social Stratification', keywords: ['stratification', 'class', 'inequality'] },
    ]},
    { name: 'Social Institutions', sections: [
      { id: '4', name: 'Family', keywords: ['family', 'household', 'marriage'] },
      { id: '5', name: 'Education', keywords: ['education', 'school', 'achievement'] },
      { id: '6', name: 'Crime and Deviance', keywords: ['crime', 'deviance', 'punishment'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL MATHEMATICS 4037
  // ════════════════════════════════════════════════════════════
  'Additional Mathematics': { code: '4037', level: 'O Level', themes: [
    { name: 'Pure Mathematics', sections: [
      { id: '1', name: 'Algebra', keywords: ['algebra', 'equation', 'inequality', 'quadratic', 'polynomial'] },
      { id: '2', name: 'Functions', keywords: ['function', 'inverse', 'composite', 'modulus', 'logarithm'] },
      { id: '3', name: 'Coordinate Geometry', keywords: ['coordinate', 'straight line', 'circle', 'gradient'] },
      { id: '4', name: 'Trigonometry', keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'identity'] },
      { id: '5', name: 'Calculus', keywords: ['differentiation', 'integration', 'derivative', 'gradient'] },
    ]},
    { name: 'Applied Mathematics', sections: [
      { id: '6', name: 'Vectors', keywords: ['vector', 'magnitude', 'direction'] },
      { id: '7', name: 'Kinematics', keywords: ['kinematics', 'velocity', 'displacement', 'acceleration'] },
      { id: '8', name: 'Probability and Statistics', keywords: ['probability', 'permutation', 'combination'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════════
  //  A LEVEL SUBJECTS
  // ════════════════════════════════════════════════════════════════

  // ════════════════════════════════════════════════════════════
  // A LEVEL CHEMISTRY 9701
  // ════════════════════════════════════════════════════════════
  'A Level Chemistry': { code: '9701', level: 'A Level', themes: [
    { name: 'AS Physical Chemistry', sections: [
      { id: 'AS1', name: 'Atoms, molecules and stoichiometry', keywords: ['atom', 'molecule', 'stoichiometry', 'mole', 'avogadro', 'formula'] },
      { id: 'AS2', name: 'Atomic structure', keywords: ['atomic structure', 'electron', 'orbital', 'ionisation energy', 'shell'] },
      { id: 'AS3', name: 'Chemical bonding', keywords: ['bond', 'ionic', 'covalent', 'dative', 'metallic', 'intermolecular', 'electronegativity', 'shape'] },
      { id: 'AS4', name: 'States of matter', keywords: ['state', 'gas law', 'ideal gas', 'liquid', 'solid', 'boiling'] },
      { id: 'AS5', name: 'Chemical energetics', keywords: ['enthalpy', 'hess', 'bond energy', 'calorimetry', 'exothermic', 'endothermic'] },
      { id: 'AS6', name: 'Electrochemistry', keywords: ['electrochemistry', 'redox', 'electrode', 'cell potential', 'electrolysis'] },
      { id: 'AS7', name: 'Equilibria', keywords: ['equilibrium', 'le chatelier', 'kc', 'kp', 'position'] },
      { id: 'AS8', name: 'Reaction kinetics', keywords: ['rate', 'order', 'rate constant', 'activation energy', 'catalyst', 'boltzmann'] },
    ]},
    { name: 'AS Inorganic Chemistry', sections: [
      { id: 'AS9', name: 'The Periodic Table: chemical periodicity', keywords: ['periodic', 'trend', 'group', 'period', 'oxide', 'chloride'] },
      { id: 'AS10', name: 'Group 2', keywords: ['group 2', 'alkaline earth', 'magnesium', 'calcium', 'barium', 'thermal stability'] },
      { id: 'AS11', name: 'Group 17', keywords: ['group 17', 'halogen', 'chlorine', 'bromine', 'iodine', 'displacement', 'disproportionation'] },
      { id: 'AS12', name: 'Nitrogen and sulfur', keywords: ['nitrogen', 'sulfur', 'oxide', 'acid rain', 'pollution'] },
    ]},
    { name: 'AS Organic Chemistry', sections: [
      { id: 'AS13', name: 'Introduction to organic chemistry', keywords: ['organic', 'nomenclature', 'isomerism', 'functional group', 'homologous'] },
      { id: 'AS14', name: 'Hydrocarbons', keywords: ['alkane', 'alkene', 'substitution', 'addition', 'cracking', 'polymer'] },
      { id: 'AS15', name: 'Halogenoalkanes', keywords: ['halogenoalkane', 'nucleophilic', 'substitution', 'elimination', 'sn1', 'sn2'] },
      { id: 'AS16', name: 'Alcohols, esters and carboxylic acids', keywords: ['alcohol', 'ester', 'carboxylic', 'oxidation', 'dehydration', 'fermentation'] },
      { id: 'AS17', name: 'Carbonyl compounds', keywords: ['carbonyl', 'aldehyde', 'ketone', 'tollens', 'fehling', 'reduction'] },
    ]},
    { name: 'A2 Physical Chemistry', sections: [
      { id: 'A2.1', name: 'Further equilibria', keywords: ['ksp', 'solubility product', 'buffer', 'ph', 'acid dissociation', 'ka', 'partition'] },
      { id: 'A2.2', name: 'Further kinetics', keywords: ['rate equation', 'order', 'half-life', 'mechanism', 'rate determining'] },
      { id: 'A2.3', name: 'Further energetics', keywords: ['lattice energy', 'born-haber', 'entropy', 'gibbs', 'free energy'] },
    ]},
    { name: 'A2 Inorganic Chemistry', sections: [
      { id: 'A2.4', name: 'Transition elements', keywords: ['transition', 'd-block', 'complex', 'ligand', 'oxidation state', 'colour', 'catalytic'] },
    ]},
    { name: 'A2 Organic Chemistry', sections: [
      { id: 'A2.5', name: 'Further organic chemistry', keywords: ['benzene', 'phenol', 'amine', 'amide', 'amino acid', 'protein', 'polyester', 'polyamide'] },
      { id: 'A2.6', name: 'Analytical chemistry', keywords: ['mass spectrometry', 'infrared', 'nmr', 'chromatography'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL PHYSICS 9702
  // ════════════════════════════════════════════════════════════
  'A Level Physics': { code: '9702', level: 'A Level', themes: [
    { name: 'AS Mechanics', sections: [
      { id: 'AS1', name: 'Physical quantities and units', keywords: ['quantity', 'unit', 'si', 'homogeneity', 'estimation'] },
      { id: 'AS2', name: 'Kinematics', keywords: ['kinematics', 'displacement', 'velocity', 'acceleration', 'projectile'] },
      { id: 'AS3', name: 'Dynamics', keywords: ['force', 'newton', 'momentum', 'impulse', 'conservation'] },
      { id: 'AS4', name: 'Forces, density and pressure', keywords: ['density', 'pressure', 'upthrust', 'archimedes', 'moment', 'equilibrium'] },
      { id: 'AS5', name: 'Work, energy and power', keywords: ['work', 'energy', 'kinetic', 'potential', 'power', 'efficiency'] },
    ]},
    { name: 'AS Waves and Electricity', sections: [
      { id: 'AS6', name: 'Deformation of solids', keywords: ['stress', 'strain', 'young modulus', 'elastic', 'plastic', 'hooke'] },
      { id: 'AS7', name: 'Waves', keywords: ['wave', 'progressive', 'transverse', 'longitudinal', 'doppler', 'intensity'] },
      { id: 'AS8', name: 'Superposition', keywords: ['superposition', 'interference', 'diffraction', 'stationary wave'] },
      { id: 'AS9', name: 'Current electricity', keywords: ['current', 'pd', 'resistance', 'resistivity', 'emf', 'internal resistance'] },
      { id: 'AS10', name: 'DC circuits', keywords: ['kirchhoff', 'potential divider', 'potentiometer', 'series', 'parallel'] },
      { id: 'AS11', name: 'Particle physics', keywords: ['particle', 'quark', 'lepton', 'baryon', 'meson', 'antimatter'] },
    ]},
    { name: 'A2 Fields', sections: [
      { id: 'A2.1', name: 'Motion in a circle', keywords: ['circular', 'centripetal', 'angular velocity', 'radian'] },
      { id: 'A2.2', name: 'Gravitational fields', keywords: ['gravitational', 'field strength', 'potential', 'orbit', 'satellite'] },
      { id: 'A2.3', name: 'Temperature', keywords: ['temperature', 'thermal equilibrium', 'thermometer', 'celsius', 'kelvin'] },
      { id: 'A2.4', name: 'Ideal gases', keywords: ['ideal gas', 'kinetic theory', 'pressure', 'boltzmann', 'rms'] },
      { id: 'A2.5', name: 'Thermodynamics', keywords: ['first law', 'internal energy', 'specific heat', 'specific latent'] },
      { id: 'A2.6', name: 'Oscillations', keywords: ['oscillation', 'shm', 'simple harmonic', 'damping', 'resonance'] },
    ]},
    { name: 'A2 Electromagnetism and Nuclear', sections: [
      { id: 'A2.7', name: 'Electric fields', keywords: ['electric field', 'coulomb', 'field strength', 'potential', 'capacitance'] },
      { id: 'A2.8', name: 'Capacitance', keywords: ['capacitor', 'charge', 'discharge', 'time constant', 'energy stored'] },
      { id: 'A2.9', name: 'Magnetic fields', keywords: ['magnetic', 'flux', 'flux density', 'force on conductor', 'hall effect'] },
      { id: 'A2.10', name: 'Alternating currents', keywords: ['ac', 'alternating', 'rms', 'transformer', 'rectification'] },
      { id: 'A2.11', name: 'Quantum physics', keywords: ['photon', 'photoelectric', 'wave-particle', 'de broglie', 'energy level'] },
      { id: 'A2.12', name: 'Nuclear physics', keywords: ['nuclear', 'radioactive', 'decay', 'mass defect', 'binding energy', 'fission', 'fusion'] },
      { id: 'A2.13', name: 'Medical physics', keywords: ['x-ray', 'ultrasound', 'pet', 'mri', 'diagnostic'] },
      { id: 'A2.14', name: 'Astronomy and cosmology', keywords: ['star', 'hertzsprung-russell', 'hubble', 'redshift', 'big bang'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL MATHEMATICS 9709
  // ════════════════════════════════════════════════════════════
  'A Level Mathematics': { code: '9709', level: 'A Level', themes: [
    { name: 'Pure Mathematics 1', sections: [
      { id: 'P1.1', name: 'Quadratics', keywords: ['quadratic', 'completing the square', 'discriminant', 'roots'] },
      { id: 'P1.2', name: 'Functions', keywords: ['function', 'domain', 'range', 'composite', 'inverse'] },
      { id: 'P1.3', name: 'Coordinate geometry', keywords: ['coordinate', 'straight line', 'circle', 'intersection'] },
      { id: 'P1.4', name: 'Circular measure', keywords: ['radian', 'arc length', 'sector area', 'circular'] },
      { id: 'P1.5', name: 'Trigonometry', keywords: ['trigonometry', 'identity', 'equation', 'amplitude', 'period'] },
      { id: 'P1.6', name: 'Series', keywords: ['binomial', 'arithmetic', 'geometric', 'series', 'sequence', 'sum to infinity'] },
      { id: 'P1.7', name: 'Differentiation', keywords: ['differentiation', 'gradient', 'tangent', 'normal', 'stationary', 'chain rule'] },
      { id: 'P1.8', name: 'Integration', keywords: ['integration', 'definite', 'indefinite', 'area', 'volume of revolution'] },
    ]},
    { name: 'Pure Mathematics 2 & 3', sections: [
      { id: 'P2.1', name: 'Algebra', keywords: ['modulus', 'polynomial', 'partial fraction', 'binomial expansion'] },
      { id: 'P2.2', name: 'Logarithmic and exponential functions', keywords: ['logarithm', 'exponential', 'ln', 'natural log'] },
      { id: 'P2.3', name: 'Trigonometry', keywords: ['sec', 'cosec', 'cot', 'harmonic form', 'double angle', 'factor formulae'] },
      { id: 'P2.4', name: 'Further differentiation', keywords: ['implicit', 'parametric', 'product rule', 'quotient rule'] },
      { id: 'P2.5', name: 'Further integration', keywords: ['integration by parts', 'substitution', 'trapezium rule'] },
      { id: 'P2.6', name: 'Differential equations', keywords: ['differential equation', 'separable', 'general solution', 'particular'] },
      { id: 'P2.7', name: 'Numerical solutions', keywords: ['iteration', 'sign change', 'newton-raphson'] },
      { id: 'P2.8', name: 'Vectors', keywords: ['vector', 'scalar product', 'line', 'plane', 'intersection'] },
      { id: 'P2.9', name: 'Complex numbers', keywords: ['complex', 'argand', 'modulus', 'argument', 'loci'] },
    ]},
    { name: 'Mechanics', sections: [
      { id: 'M1', name: 'Forces and equilibrium', keywords: ['force', 'equilibrium', 'friction', 'inclined plane', 'resolve'] },
      { id: 'M2', name: 'Kinematics of motion in a straight line', keywords: ['suvat', 'displacement', 'velocity', 'acceleration', 'motion'] },
      { id: 'M3', name: "Newton's laws of motion", keywords: ['newton', 'connected particles', 'pulley', 'lift'] },
      { id: 'M4', name: 'Energy, work and power', keywords: ['work', 'energy', 'power', 'conservation'] },
    ]},
    { name: 'Probability & Statistics', sections: [
      { id: 'S1.1', name: 'Representation of data', keywords: ['histogram', 'cumulative frequency', 'box plot', 'stem and leaf'] },
      { id: 'S1.2', name: 'Permutations and combinations', keywords: ['permutation', 'combination', 'factorial', 'arrangement'] },
      { id: 'S1.3', name: 'Probability', keywords: ['probability', 'conditional', 'independent', 'mutually exclusive', 'tree diagram'] },
      { id: 'S1.4', name: 'Discrete random variables', keywords: ['discrete', 'expectation', 'variance', 'probability distribution'] },
      { id: 'S1.5', name: 'Normal distribution', keywords: ['normal', 'standard normal', 'z-score', 'probability tables'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL BIOLOGY 9700
  // ════════════════════════════════════════════════════════════
  'A Level Biology': { code: '9700', level: 'A Level', themes: [
    { name: 'AS Biology', sections: [
      { id: 'AS1', name: 'Cell structure', keywords: ['cell', 'organelle', 'microscope', 'eukaryote', 'prokaryote'] },
      { id: 'AS2', name: 'Biological molecules', keywords: ['carbohydrate', 'lipid', 'protein', 'enzyme', 'water'] },
      { id: 'AS3', name: 'Enzymes', keywords: ['enzyme', 'active site', 'inhibitor', 'vmax', 'km'] },
      { id: 'AS4', name: 'Cell membranes and transport', keywords: ['membrane', 'fluid mosaic', 'osmosis', 'diffusion', 'active transport'] },
      { id: 'AS5', name: 'The mitotic cell cycle', keywords: ['mitosis', 'cell cycle', 'chromosome', 'division', 'cytokinesis'] },
      { id: 'AS6', name: 'Nucleic acids and protein synthesis', keywords: ['dna', 'rna', 'transcription', 'translation', 'codon', 'mutation'] },
      { id: 'AS7', name: 'Transport in plants', keywords: ['xylem', 'phloem', 'transpiration', 'translocation', 'root pressure'] },
      { id: 'AS8', name: 'Transport in mammals', keywords: ['heart', 'blood', 'haemoglobin', 'circulation', 'artery', 'vein'] },
      { id: 'AS9', name: 'Gas exchange and smoking', keywords: ['lung', 'alveolus', 'gas exchange', 'ventilation', 'smoking'] },
      { id: 'AS10', name: 'Infectious disease', keywords: ['pathogen', 'immune', 'antibody', 'vaccination', 'hiv'] },
      { id: 'AS11', name: 'Immunity', keywords: ['immunity', 'b cell', 't cell', 'antigen', 'antibody', 'active', 'passive'] },
    ]},
    { name: 'A2 Biology', sections: [
      { id: 'A2.1', name: 'Energy and respiration', keywords: ['respiration', 'atp', 'glycolysis', 'krebs', 'oxidative phosphorylation'] },
      { id: 'A2.2', name: 'Photosynthesis', keywords: ['photosynthesis', 'light dependent', 'calvin cycle', 'rubisco', 'limiting factor'] },
      { id: 'A2.3', name: 'Homeostasis', keywords: ['homeostasis', 'negative feedback', 'blood glucose', 'insulin', 'kidney', 'nephron'] },
      { id: 'A2.4', name: 'Coordination', keywords: ['nervous', 'synapse', 'action potential', 'hormone', 'endocrine'] },
      { id: 'A2.5', name: 'Inherited change', keywords: ['meiosis', 'crossing over', 'independent assortment', 'genetic diagram', 'chi-squared'] },
      { id: 'A2.6', name: 'Selection and evolution', keywords: ['natural selection', 'speciation', 'evolution', 'hardy-weinberg', 'genetic drift'] },
      { id: 'A2.7', name: 'Biodiversity, classification and conservation', keywords: ['biodiversity', 'taxonomy', 'conservation', 'endangered', 'ecosystem'] },
      { id: 'A2.8', name: 'Genetic technology', keywords: ['gene technology', 'pcr', 'gel electrophoresis', 'genetic engineering', 'gmo', 'cloning'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL ECONOMICS 9708
  // ════════════════════════════════════════════════════════════
  'A Level Economics': { code: '9708', level: 'A Level', themes: [
    { name: 'AS Microeconomics', sections: [
      { id: 'AS1', name: 'Basic economic ideas', keywords: ['scarcity', 'opportunity cost', 'ppf', 'economic system'] },
      { id: 'AS2', name: 'The price system and the microeconomy', keywords: ['demand', 'supply', 'elasticity', 'market equilibrium', 'consumer surplus'] },
      { id: 'AS3', name: 'Government microeconomic intervention', keywords: ['maximum price', 'minimum price', 'tax', 'subsidy', 'market failure', 'externality'] },
    ]},
    { name: 'AS Macroeconomics', sections: [
      { id: 'AS4', name: 'The macroeconomy', keywords: ['gdp', 'aggregate demand', 'aggregate supply', 'national income', 'circular flow'] },
      { id: 'AS5', name: 'Government macroeconomic intervention', keywords: ['fiscal', 'monetary', 'supply-side', 'inflation', 'unemployment', 'trade'] },
    ]},
    { name: 'A2 Microeconomics', sections: [
      { id: 'A2.1', name: 'Theory of the firm', keywords: ['cost', 'revenue', 'profit', 'perfect competition', 'monopoly', 'oligopoly', 'monopolistic'] },
      { id: 'A2.2', name: 'Labour market', keywords: ['labour', 'wage', 'marginal revenue product', 'trade union', 'monopsony'] },
    ]},
    { name: 'A2 Macroeconomics', sections: [
      { id: 'A2.3', name: 'Economic growth and sustainability', keywords: ['economic growth', 'sustainable', 'hdi', 'inequality', 'poverty'] },
      { id: 'A2.4', name: 'International trade', keywords: ['comparative advantage', 'protectionism', 'wto', 'trading bloc', 'exchange rate', 'balance of payments'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL BUSINESS 9609
  // ════════════════════════════════════════════════════════════
  'A Level Business': { code: '9609', level: 'A Level', themes: [
    { name: 'AS Business', sections: [
      { id: 'AS1', name: 'Business and its environment', keywords: ['enterprise', 'stakeholder', 'business structure', 'size', 'objective'] },
      { id: 'AS2', name: 'People in organisations', keywords: ['motivation', 'leadership', 'management', 'recruitment', 'training'] },
      { id: 'AS3', name: 'Marketing', keywords: ['marketing', 'market research', 'segmentation', 'marketing mix', 'elasticity'] },
      { id: 'AS4', name: 'Operations and project management', keywords: ['operations', 'capacity', 'inventory', 'quality', 'lean'] },
      { id: 'AS5', name: 'Finance and accounting', keywords: ['finance', 'cash flow', 'budgeting', 'cost', 'break-even', 'investment appraisal'] },
    ]},
    { name: 'A2 Business', sections: [
      { id: 'A2.1', name: 'Strategic management', keywords: ['strategic', 'swot', 'pestle', 'ansoff', 'porter', 'corporate strategy'] },
      { id: 'A2.2', name: 'Business finance', keywords: ['ratio analysis', 'profitability', 'liquidity', 'gearing', 'efficiency'] },
      { id: 'A2.3', name: 'Global business', keywords: ['globalisation', 'multinational', 'emerging market', 'cultural difference'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL COMPUTER SCIENCE 9618
  // ════════════════════════════════════════════════════════════
  'A Level Computer Science': { code: '9618', level: 'A Level', themes: [
    { name: 'AS Computer Science', sections: [
      { id: 'AS1', name: 'Information representation', keywords: ['binary', 'hexadecimal', 'two complement', 'bcd', 'ascii', 'unicode'] },
      { id: 'AS2', name: 'Communication', keywords: ['network', 'protocol', 'tcp/ip', 'packet switching', 'circuit switching'] },
      { id: 'AS3', name: 'Hardware', keywords: ['processor', 'fetch-execute', 'cache', 'virtual memory', 'secondary storage'] },
      { id: 'AS4', name: 'Processor fundamentals', keywords: ['cpu', 'register', 'bus', 'instruction set', 'assembly'] },
      { id: 'AS5', name: 'System software', keywords: ['operating system', 'scheduling', 'memory management', 'interrupt'] },
      { id: 'AS6', name: 'Security, privacy and data integrity', keywords: ['encryption', 'firewall', 'malware', 'phishing', 'authentication'] },
      { id: 'AS7', name: 'Ethics and ownership', keywords: ['ethics', 'copyright', 'software licensing', 'ai ethics'] },
      { id: 'AS8', name: 'Algorithm design and problem-solving', keywords: ['algorithm', 'pseudocode', 'flowchart', 'trace table', 'abstraction'] },
      { id: 'AS9', name: 'Data types and structures', keywords: ['data type', 'array', 'record', 'linked list', 'stack', 'queue'] },
      { id: 'AS10', name: 'Programming and data representation', keywords: ['programming', 'oop', 'file handling', 'exception'] },
    ]},
    { name: 'A2 Computer Science', sections: [
      { id: 'A2.1', name: 'Data representation', keywords: ['floating point', 'normalisation', 'image', 'sound', 'compression'] },
      { id: 'A2.2', name: 'Communication and internet technologies', keywords: ['ip addressing', 'dns', 'web', 'client-server', 'cloud'] },
      { id: 'A2.3', name: 'Hardware and virtual machines', keywords: ['risc', 'cisc', 'pipelining', 'virtual machine', 'parallel'] },
      { id: 'A2.4', name: 'Security', keywords: ['ssl', 'digital certificate', 'quantum encryption'] },
      { id: 'A2.5', name: 'Artificial intelligence', keywords: ['artificial intelligence', 'machine learning', 'neural network', 'expert system'] },
      { id: 'A2.6', name: 'Computational thinking and problem-solving', keywords: ['big-o', 'recursion', 'divide and conquer', 'backtracking'] },
      { id: 'A2.7', name: 'Further programming', keywords: ['oop', 'inheritance', 'polymorphism', 'encapsulation', 'design pattern'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL PSYCHOLOGY 9990
  // ════════════════════════════════════════════════════════════
  'A Level Psychology': { code: '9990', level: 'A Level', themes: [
    { name: 'AS Psychology', sections: [
      { id: 'AS1', name: 'Research methods', keywords: ['experiment', 'observation', 'self-report', 'case study', 'ethics', 'sampling'] },
      { id: 'AS2', name: 'The biological approach', keywords: ['biological', 'brain', 'neurotransmitter', 'genetics', 'evolution'] },
      { id: 'AS3', name: 'The cognitive approach', keywords: ['cognitive', 'memory', 'perception', 'thinking', 'attention'] },
      { id: 'AS4', name: 'The learning approach', keywords: ['learning', 'classical conditioning', 'operant conditioning', 'social learning', 'behaviourism'] },
      { id: 'AS5', name: 'The social approach', keywords: ['social', 'obedience', 'conformity', 'group', 'prejudice'] },
    ]},
    { name: 'A2 Psychology', sections: [
      { id: 'A2.1', name: 'Psychology and abnormality', keywords: ['abnormality', 'diagnosis', 'treatment', 'schizophrenia', 'depression', 'anxiety'] },
      { id: 'A2.2', name: 'Psychology and consumer behaviour', keywords: ['consumer', 'advertising', 'persuasion', 'brand'] },
      { id: 'A2.3', name: 'Psychology and health', keywords: ['health', 'stress', 'adherence', 'pain', 'substance abuse'] },
      { id: 'A2.4', name: 'Psychology and organisations', keywords: ['organisation', 'motivation', 'leadership', 'satisfaction', 'group dynamics'] },
    ]},
  ]},

  // ════════════════════════════════════════════════════════════
  // A LEVEL ACCOUNTING 9706
  // ════════════════════════════════════════════════════════════
  'A Level Accounting': { code: '9706', level: 'A Level', themes: [
    { name: 'AS Accounting', sections: [
      { id: 'AS1', name: 'Financial accounting fundamentals', keywords: ['double entry', 'trial balance', 'accounting equation', 'books of prime entry'] },
      { id: 'AS2', name: 'Financial statements of sole traders', keywords: ['income statement', 'balance sheet', 'capital', 'drawings'] },
      { id: 'AS3', name: 'Adjustments to financial statements', keywords: ['depreciation', 'accrual', 'prepayment', 'bad debt', 'provision'] },
      { id: 'AS4', name: 'Bank reconciliation and control accounts', keywords: ['bank reconciliation', 'control account', 'sales ledger', 'purchase ledger'] },
      { id: 'AS5', name: 'Correction of errors and suspense accounts', keywords: ['correction', 'error', 'suspense', 'journal'] },
      { id: 'AS6', name: 'Incomplete records', keywords: ['incomplete', 'margin', 'mark-up', 'statement of affairs'] },
      { id: 'AS7', name: 'Partnership accounts', keywords: ['partnership', 'appropriation', 'capital account', 'current account', 'goodwill'] },
      { id: 'AS8', name: 'Manufacturing accounts', keywords: ['manufacturing', 'prime cost', 'factory overhead', 'production cost'] },
    ]},
    { name: 'A2 Accounting', sections: [
      { id: 'A2.1', name: 'Limited company accounts', keywords: ['company', 'share', 'debenture', 'retained earnings', 'dividend'] },
      { id: 'A2.2', name: 'Analysis and interpretation', keywords: ['ratio', 'profitability', 'liquidity', 'efficiency', 'investor', 'gearing'] },
      { id: 'A2.3', name: 'Statements of cash flows', keywords: ['cash flow', 'operating', 'investing', 'financing', 'ias 7'] },
      { id: 'A2.4', name: 'Budgeting and budgetary control', keywords: ['budget', 'variance', 'flexible budget', 'variance analysis'] },
      { id: 'A2.5', name: 'Marginal and absorption costing', keywords: ['marginal', 'absorption', 'contribution', 'break-even', 'make or buy'] },
      { id: 'A2.6', name: 'Investment appraisal', keywords: ['investment', 'npv', 'irr', 'payback', 'arr', 'discounting'] },
    ]},
  ]},
};

export function getStudyModules(subject) {
  return SYLLABUS[subject] || null;
}

/**
 * Get all subject names from SYLLABUS
 */
export function getSyllabusSubjects() {
  return Object.keys(SYLLABUS);
}

/**
 * Get flat list of section/chapter names for a subject — used by drill, nano, past-papers
 * Returns array of strings: ['States of matter', 'Atomic structure', ...]
 */
export function getTopicsForSubject(subject) {
  const entry = SYLLABUS[subject];
  if (!entry?.themes) return [];
  const topics = [];
  for (const theme of entry.themes) {
    for (const section of theme.sections) {
      topics.push(section.name);
    }
  }
  return topics;
}

/**
 * Get structured themes with sections for a subject — used by study, nano
 * Returns array: [{ theme: 'Physical Chemistry', sections: [{id, name, keywords}] }]
 */
export function getThemesForSubject(subject) {
  const entry = SYLLABUS[subject];
  if (!entry?.themes) return [];
  return entry.themes.map(t => ({
    theme: t.name,
    sections: t.sections,
  }));
}

/**
 * Get subject code (e.g. '5070' for Chemistry)
 */
export function getSubjectCode(subject) {
  return SYLLABUS[subject]?.code || null;
}

/**
 * Get all subjects with metadata — used by drill, mocks, nano subject grids
 * Returns array: [{ name: 'Chemistry', code: '5070', level: 'O Level', topicCount: 22 }]
 */
export function getAllSubjectsWithMeta() {
  return Object.entries(SYLLABUS).map(([name, data]) => ({
    name,
    code: data.code,
    level: data.level,
    topicCount: data.themes.reduce((sum, t) => sum + t.sections.length, 0),
  }));
}
