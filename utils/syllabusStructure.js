/**
 * utils/syllabusStructure.js — Textbook-accurate syllabus structure
 * ─────────────────────────────────────────────────────────────────
 * Mirrors the ACTUAL Cambridge O Level and A Level textbook structure.
 * Each subject has: themes/papers → sections → topics
 *
 * Sources: Official Cambridge syllabuses + endorsed textbooks
 * This file is THE source of truth for /study page modules.
 *
 * NOTE: This needs to be expanded with actual textbook chapter data
 * as textbook PDFs are obtained and read.
 */

export const SYLLABUS = {
  // ════════════════════════════════════════════════════════════
  // GEOGRAPHY 2217
  // Source: Cambridge IGCSE & O Level Geography (Guinness & Nagle, 3rd Ed)
  // ════════════════════════════════════════════════════════════
  'Geography': {
    code: '2217', level: 'O Level',
    themes: [
      {
        name: 'Theme 1: Population and Settlement',
        sections: [
          { id: '1.1', name: 'Population Dynamics', keywords: ['population', 'birth rate', 'death rate', 'natural increase', 'growth'] },
          { id: '1.2', name: 'Migration', keywords: ['migration', 'immigration', 'emigration', 'refugee', 'push', 'pull'] },
          { id: '1.3', name: 'Population Structure', keywords: ['population structure', 'pyramid', 'age', 'dependency'] },
          { id: '1.4', name: 'Population Density and Distribution', keywords: ['density', 'distribution', 'sparsely', 'densely'] },
          { id: '1.5', name: 'Settlements and Service Provision', keywords: ['settlement', 'rural', 'service', 'hierarchy', 'function'] },
          { id: '1.6', name: 'Urban Settlements', keywords: ['urban', 'land use', 'cbd', 'zone', 'suburb'] },
          { id: '1.7', name: 'Urbanisation', keywords: ['urbanisation', 'squatter', 'shanty', 'megacity', 'rapid growth'] },
        ],
      },
      {
        name: 'Theme 2: The Natural Environment',
        sections: [
          { id: '2.1', name: 'Earthquakes and Volcanoes', keywords: ['earthquake', 'volcano', 'tectonic', 'plate', 'seismic', 'eruption', 'magma'] },
          { id: '2.2', name: 'Rivers', keywords: ['river', 'flood', 'erosion', 'deposition', 'meander', 'waterfall', 'delta', 'drainage'] },
          { id: '2.3', name: 'Coasts', keywords: ['coast', 'wave', 'cliff', 'beach', 'spit', 'erosion', 'deposition', 'coral', 'mangrove'] },
          { id: '2.4', name: 'Weather', keywords: ['weather', 'temperature', 'rainfall', 'wind', 'cloud', 'pressure', 'humidity'] },
          { id: '2.5', name: 'Climate and Natural Vegetation', keywords: ['climate', 'vegetation', 'tropical', 'rainforest', 'desert', 'equatorial', 'ecosystem'] },
        ],
      },
      {
        name: 'Theme 3: Economic Development',
        sections: [
          { id: '3.1', name: 'Development', keywords: ['development', 'indicator', 'hdi', 'gdp', 'inequality', 'employment'] },
          { id: '3.2', name: 'Food Production', keywords: ['food', 'agriculture', 'farming', 'subsistence', 'commercial', 'shortage', 'famine'] },
          { id: '3.3', name: 'Industry', keywords: ['industry', 'manufacturing', 'primary', 'secondary', 'tertiary', 'location', 'globalisation'] },
          { id: '3.4', name: 'Tourism', keywords: ['tourism', 'tourist', 'ecotourism', 'sustainable', 'national park'] },
          { id: '3.5', name: 'Energy', keywords: ['energy', 'fossil fuel', 'renewable', 'nuclear', 'solar', 'wind', 'hydroelectric'] },
          { id: '3.6', name: 'Water', keywords: ['water', 'supply', 'demand', 'dam', 'irrigation', 'shortage', 'pollution'] },
          { id: '3.7', name: 'Environmental Risks of Economic Development', keywords: ['pollution', 'deforestation', 'desertification', 'global warming', 'sustainable', 'conservation'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // PAKISTAN STUDIES 2059
  // Paper 1: History & Culture | Paper 2: Environment of Pakistan
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
  // HISTORY 2147
  // Source: Cambridge O Level History syllabus 2024-2026
  // ════════════════════════════════════════════════════════════
  'History': {
    code: '2147', level: 'O Level',
    themes: [
      {
        name: 'Section 1: Core Content',
        sections: [
          { id: '1', name: 'Was the Treaty of Versailles fair?', keywords: ['versailles', 'treaty', 'wilson', 'clemenceau', 'lloyd george', 'reparation'] },
          { id: '2', name: 'To what extent was the League of Nations a success?', keywords: ['league of nations', 'mandate', 'collective security', 'abyssinia', 'manchuria'] },
          { id: '3', name: 'Why had international peace collapsed by 1939?', keywords: ['hitler', 'appeasement', 'nazi', 'munich', 'sudetenland', 'rhineland', 'anschluss'] },
          { id: '4', name: 'Who was to blame for the Cold War?', keywords: ['cold war', 'truman', 'stalin', 'iron curtain', 'berlin blockade', 'nato', 'warsaw'] },
          { id: '5', name: 'How effectively did the USA contain communism?', keywords: ['containment', 'korea', 'vietnam', 'cuba', 'missile crisis', 'domino theory'] },
          { id: '6', name: 'How secure was the USSR\'s control over Eastern Europe?', keywords: ['hungary', 'czechoslovakia', 'solidarity', 'gorbachev', 'berlin wall', 'perestroika', 'glasnost'] },
        ],
      },
      {
        name: 'Section 2: Depth Studies',
        sections: [
          { id: 'A', name: 'The First World War, 1914-18', keywords: ['world war 1', 'trench', 'somme', 'gallipoli', 'stalemate'] },
          { id: 'B', name: 'Germany, 1918-45', keywords: ['weimar', 'nazi germany', 'hitler', 'reichstag', 'holocaust', 'propaganda'] },
          { id: 'C', name: 'Russia, 1905-41', keywords: ['russia', 'revolution', 'tsar', 'lenin', 'bolshevik', 'stalin', 'collectivisation'] },
          { id: 'D', name: 'The United States, 1919-41', keywords: ['america', 'roaring twenties', 'wall street', 'great depression', 'new deal', 'roosevelt'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ISLAMIYAT 2058
  // Paper 1 + Paper 2
  // ════════════════════════════════════════════════════════════
  'Islamiyat': {
    code: '2058', level: 'O Level',
    themes: [
      {
        name: 'Paper 1',
        sections: [
          { id: 'P1.1', name: 'Major Themes of the Quran', keywords: ['quran', 'surah', 'ayah', 'theme', 'tawhid', 'risalah', 'akhirah'] },
          { id: 'P1.2', name: 'History and Importance of the Quran', keywords: ['revelation', 'compilation', 'preservation', 'mushaf', 'uthman'] },
          { id: 'P1.3', name: 'Life and Importance of Prophet Muhammad (PBUH)', keywords: ['prophet', 'muhammad', 'makkah', 'madinah', 'hijrah', 'seerah', 'battle'] },
          { id: 'P1.4', name: 'The First Islamic Community', keywords: ['community', 'ummah', 'madinah', 'charter', 'brotherhood', 'mosque'] },
        ],
      },
      {
        name: 'Paper 2',
        sections: [
          { id: 'P2.1', name: 'Major Teachings in the Hadiths', keywords: ['hadith', 'hadis', 'teaching', 'saying', 'sunnah'] },
          { id: 'P2.2', name: 'History and Importance of the Hadiths', keywords: ['hadith collection', 'bukhari', 'muslim', 'chain', 'isnad', 'classification'] },
          { id: 'P2.3', name: 'The Rightly Guided Caliphs', keywords: ['caliph', 'abu bakr', 'umar', 'uthman', 'ali', 'rashidun', 'succession'] },
          { id: 'P2.4', name: 'Articles of Faith and Pillars of Islam', keywords: ['pillar', 'shahadah', 'salah', 'zakat', 'sawm', 'hajj', 'iman', 'tawhid', 'angels', 'books', 'prophets', 'qadr'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // URDU 3247
  // Paper 1: Language + Paper 2: Composition
  // ════════════════════════════════════════════════════════════
  'Urdu': {
    code: '3247', level: 'O Level',
    themes: [
      {
        name: 'Paper 1: Language',
        sections: [
          { id: 'P1.1', name: 'Comprehension (فہم و ادراک)', keywords: ['comprehension', 'passage', 'understanding', 'extract'] },
          { id: 'P1.2', name: 'Summary Writing (خلاصہ نویسی)', keywords: ['summary', 'خلاصہ', 'concise'] },
          { id: 'P1.3', name: 'Grammar (قواعد)', keywords: ['grammar', 'قواعد', 'verb', 'noun', 'sentence'] },
          { id: 'P1.4', name: 'Translation (ترجمہ)', keywords: ['translation', 'ترجمہ', 'english to urdu', 'urdu to english'] },
        ],
      },
      {
        name: 'Paper 2: Composition',
        sections: [
          { id: 'P2.1', name: 'Essay Writing (مضمون نگاری)', keywords: ['essay', 'مضمون', 'composition', 'writing'] },
          { id: 'P2.2', name: 'Letter Writing (خط نگاری)', keywords: ['letter', 'خط', 'formal', 'informal', 'application'] },
          { id: 'P2.3', name: 'Story Writing (کہانی نگاری)', keywords: ['story', 'کہانی', 'narrative', 'plot'] },
          { id: 'P2.4', name: 'Dialogue Writing (مکالمہ نگاری)', keywords: ['dialogue', 'مکالمہ', 'conversation'] },
          { id: 'P2.5', name: 'Poetry & Literary Devices (شاعری و ادبی صنائع)', keywords: ['poetry', 'شاعری', 'تشبیہ', 'استعارہ', 'literary', 'metaphor', 'simile'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ECONOMICS 2281
  // ════════════════════════════════════════════════════════════
  'Economics': {
    code: '2281', level: 'O Level',
    themes: [
      {
        name: 'Microeconomics',
        sections: [
          { id: '1', name: 'The Basic Economic Problem', keywords: ['economic problem', 'scarcity', 'opportunity cost', 'factor', 'production possibility'] },
          { id: '2', name: 'The Allocation of Resources', keywords: ['demand', 'supply', 'price', 'market', 'elasticity', 'equilibrium', 'allocation'] },
          { id: '3', name: 'Microeconomic Decision Makers', keywords: ['bank', 'household', 'worker', 'trade union', 'firm', 'money'] },
        ],
      },
      {
        name: 'Macroeconomics',
        sections: [
          { id: '4', name: 'Government and the Macroeconomy', keywords: ['fiscal', 'monetary', 'inflation', 'unemployment', 'growth', 'gdp', 'tax', 'government', 'budget'] },
          { id: '5', name: 'Economic Development', keywords: ['development', 'poverty', 'living standard', 'hdi'] },
          { id: '6', name: 'International Trade and Globalisation', keywords: ['trade', 'globalisation', 'tariff', 'exchange rate', 'balance of payment', 'multinational', 'protection'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ACCOUNTING 7707
  // ════════════════════════════════════════════════════════════
  'Accounting': {
    code: '7707', level: 'O Level',
    themes: [
      {
        name: 'Accounting Fundamentals',
        sections: [
          { id: '1', name: 'Introduction to Accounting', keywords: ['accounting equation', 'book-keeping', 'basic term', 'concept'] },
          { id: '2', name: 'Sources and Recording of Data', keywords: ['double entry', 'ledger', 'journal', 'prime entry', 'document', 'receipt'] },
          { id: '3', name: 'Verification of Records', keywords: ['trial balance', 'bank reconciliation', 'control account', 'correction', 'error', 'suspense'] },
        ],
      },
      {
        name: 'Financial Reporting',
        sections: [
          { id: '4', name: 'Accounting Procedures', keywords: ['depreciation', 'disposal', 'accrual', 'prepayment', 'bad debt', 'provision', 'inventory', 'capital', 'revenue'] },
          { id: '5', name: 'Financial Statements', keywords: ['income statement', 'balance sheet', 'financial statement', 'profit', 'loss', 'partnership', 'sole trader', 'club', 'incomplete'] },
          { id: '6', name: 'Analysis and Interpretation', keywords: ['ratio', 'analysis', 'interpret', 'gross profit', 'net profit', 'liquidity', 'return'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // COMPUTER SCIENCE 2210
  // ════════════════════════════════════════════════════════════
  'Computer Science': {
    code: '2210', level: 'O Level',
    themes: [
      {
        name: 'Computer Systems',
        sections: [
          { id: '1', name: 'Data Representation', keywords: ['binary', 'hexadecimal', 'data representation', 'ascii', 'unicode', 'image', 'sound', 'compression'] },
          { id: '2', name: 'Data Transmission', keywords: ['transmission', 'serial', 'parallel', 'error', 'check', 'protocol'] },
          { id: '3', name: 'Hardware', keywords: ['hardware', 'processor', 'memory', 'storage', 'input', 'output', 'cpu'] },
          { id: '4', name: 'Software', keywords: ['software', 'operating system', 'utility', 'application', 'compiler', 'interpreter'] },
          { id: '5', name: 'The Internet', keywords: ['internet', 'network', 'web', 'email', 'security', 'encryption', 'protocol'] },
          { id: '6', name: 'Automated and Emerging Technologies', keywords: ['automated', 'robot', 'artificial intelligence', 'emerging', 'sensor'] },
        ],
      },
      {
        name: 'Algorithms and Programming',
        sections: [
          { id: '7', name: 'Algorithm Design', keywords: ['algorithm', 'flowchart', 'pseudocode', 'problem-solving', 'trace table'] },
          { id: '8', name: 'Programming', keywords: ['programming', 'variable', 'loop', 'array', 'function', 'procedure', 'string', 'file'] },
          { id: '9', name: 'Databases', keywords: ['database', 'sql', 'query', 'record', 'field', 'table', 'primary key'] },
          { id: '10', name: 'Boolean Logic', keywords: ['boolean', 'logic gate', 'truth table', 'and', 'or', 'not', 'nand', 'nor'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BUSINESS STUDIES 7115
  // ════════════════════════════════════════════════════════════
  'Business Studies': {
    code: '7115', level: 'O Level',
    themes: [
      { name: 'Business Fundamentals', sections: [
        { id: '1', name: 'Understanding Business Activity', keywords: ['business', 'enterprise', 'stakeholder', 'objective', 'growth', 'sole trader', 'partnership', 'limited'] },
        { id: '2', name: 'People in Business', keywords: ['motivation', 'recruitment', 'training', 'organisation', 'communication', 'leadership'] },
      ]},
      { name: 'Business Operations', sections: [
        { id: '3', name: 'Marketing', keywords: ['marketing', 'market research', 'segmentation', 'product', 'price', 'promotion', 'place', 'brand'] },
        { id: '4', name: 'Operations Management', keywords: ['production', 'productivity', 'quality', 'stock', 'location', 'cost', 'break-even'] },
      ]},
      { name: 'Business Environment', sections: [
        { id: '5', name: 'Financial Information', keywords: ['finance', 'cash flow', 'income statement', 'balance sheet', 'source of finance', 'ratio'] },
        { id: '6', name: 'External Influences', keywords: ['government', 'economic', 'legal', 'environmental', 'ethical', 'globalisation', 'exchange rate'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ENGLISH LANGUAGE 1123
  // ════════════════════════════════════════════════════════════
  'English Language': {
    code: '1123', level: 'O Level',
    themes: [
      {
        name: 'Paper 1: Reading',
        sections: [
          { id: 'P1.1', name: 'Comprehension', keywords: ['comprehension', 'reading', 'passage', 'extract', 'meaning', 'inference', 'explicit', 'implicit'] },
          { id: 'P1.2', name: 'Writer\'s Effect and Language', keywords: ['language', 'technique', 'effect', 'imagery', 'metaphor', 'simile', 'tone', 'style'] },
          { id: 'P1.3', name: 'Summary Writing', keywords: ['summary', 'summarise', 'key points', 'concise'] },
        ],
      },
      {
        name: 'Paper 2: Writing',
        sections: [
          { id: 'P2.1', name: 'Directed Writing', keywords: ['directed', 'speech', 'letter', 'report', 'article', 'persuasive', 'argument'] },
          { id: 'P2.2', name: 'Composition: Narrative', keywords: ['narrative', 'story', 'creative', 'plot', 'character'] },
          { id: 'P2.3', name: 'Composition: Descriptive', keywords: ['descriptive', 'description', 'scene', 'atmosphere', 'senses'] },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════
  // SOCIOLOGY 2251
  // ════════════════════════════════════════════════════════════
  'Sociology': {
    code: '2251', level: 'O Level',
    themes: [
      { name: 'Core Concepts', sections: [
        { id: '1', name: 'Research Methods', keywords: ['research', 'method', 'survey', 'interview', 'questionnaire', 'observation', 'data'] },
        { id: '2', name: 'Identity and Social Control', keywords: ['identity', 'social control', 'socialisation', 'norms', 'values', 'culture'] },
        { id: '3', name: 'Social Stratification', keywords: ['stratification', 'class', 'inequality', 'poverty', 'wealth', 'gender', 'ethnicity'] },
      ]},
      { name: 'Social Institutions', sections: [
        { id: '4', name: 'Family', keywords: ['family', 'household', 'marriage', 'divorce', 'nuclear', 'extended'] },
        { id: '5', name: 'Education', keywords: ['education', 'school', 'curriculum', 'achievement', 'attainment'] },
        { id: '6', name: 'Crime and Deviance', keywords: ['crime', 'deviance', 'punishment', 'prison', 'law', 'police'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // COMMERCE 7100
  // ════════════════════════════════════════════════════════════
  'Commerce': {
    code: '7100', level: 'O Level',
    themes: [
      { name: 'Commerce and Trade', sections: [
        { id: '1', name: 'Commerce and Production', keywords: ['commerce', 'production', 'supply chain', 'trade', 'digital'] },
        { id: '2', name: 'Commercial Operations', keywords: ['retail', 'wholesale', 'enterprise', 'outsourcing', 'communication'] },
        { id: '3', name: 'Globalisation of Trade', keywords: ['international', 'global', 'import', 'export', 'supply chain risk'] },
      ]},
      { name: 'Supporting Commerce', sections: [
        { id: '4', name: 'Logistics', keywords: ['transport', 'warehouse', 'logistics', 'distribution'] },
        { id: '5', name: 'Aids to Trade', keywords: ['advertising', 'banking', 'insurance', 'finance'] },
        { id: '6', name: 'Sustainability and Ethics', keywords: ['sustainability', 'ethics', 'consumer protection', 'environment'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL MATHEMATICS 4037
  // ════════════════════════════════════════════════════════════
  'Additional Mathematics': {
    code: '4037', level: 'O Level',
    themes: [
      { name: 'Pure Mathematics', sections: [
        { id: '1', name: 'Algebra', keywords: ['algebra', 'equation', 'inequality', 'quadratic', 'polynomial', 'remainder', 'factor', 'binomial', 'simultaneous'] },
        { id: '2', name: 'Functions', keywords: ['function', 'inverse', 'composite', 'modulus', 'logarithm', 'exponential'] },
        { id: '3', name: 'Coordinate Geometry', keywords: ['coordinate', 'straight line', 'circle', 'gradient', 'midpoint', 'perpendicular'] },
        { id: '4', name: 'Trigonometry', keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'identity', 'radian', 'amplitude'] },
        { id: '5', name: 'Calculus', keywords: ['differentiation', 'integration', 'derivative', 'gradient', 'tangent', 'area under', 'stationary', 'maximum', 'minimum'] },
      ]},
      { name: 'Applied Mathematics', sections: [
        { id: '6', name: 'Vectors', keywords: ['vector', 'magnitude', 'direction', 'position', 'displacement'] },
        { id: '7', name: 'Kinematics', keywords: ['kinematics', 'velocity', 'displacement', 'acceleration', 'motion'] },
        { id: '8', name: 'Probability and Statistics', keywords: ['probability', 'permutation', 'combination', 'relative frequency'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // MATHEMATICS 4024
  // ════════════════════════════════════════════════════════════
  'Mathematics': {
    code: '4024', level: 'O Level',
    themes: [
      { name: 'Number and Algebra', sections: [
        { id: '1', name: 'Number', keywords: ['number', 'fraction', 'decimal', 'percentage', 'ratio', 'proportion', 'standard form', 'index', 'integer'] },
        { id: '2', name: 'Algebra and Graphs', keywords: ['algebra', 'equation', 'expression', 'formula', 'inequality', 'sequence', 'simultaneous', 'quadratic', 'graph', 'function'] },
      ]},
      { name: 'Geometry and Measurement', sections: [
        { id: '3', name: 'Geometry', keywords: ['geometry', 'angle', 'triangle', 'circle', 'polygon', 'pythagoras', 'symmetry', 'congruent', 'similar'] },
        { id: '4', name: 'Mensuration', keywords: ['area', 'volume', 'perimeter', 'surface area', 'arc', 'sector', 'cylinder', 'cone', 'sphere'] },
        { id: '5', name: 'Trigonometry', keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'bearing', 'elevation', 'depression'] },
        { id: '6', name: 'Vectors and Transformations', keywords: ['vector', 'transformation', 'translation', 'rotation', 'reflection', 'enlargement', 'matrix'] },
      ]},
      { name: 'Statistics and Probability', sections: [
        { id: '7', name: 'Statistics', keywords: ['statistics', 'mean', 'median', 'mode', 'histogram', 'pie chart', 'cumulative', 'frequency'] },
        { id: '8', name: 'Probability', keywords: ['probability', 'tree diagram', 'venn diagram', 'independent', 'conditional'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // CHEMISTRY 5070
  // ════════════════════════════════════════════════════════════
  'Chemistry': {
    code: '5070', level: 'O Level',
    themes: [
      { name: 'Physical Chemistry', sections: [
        { id: '1', name: 'Atomic Structure', keywords: ['atomic', 'atom', 'element', 'periodic', 'electron', 'proton', 'neutron', 'isotope'] },
        { id: '2', name: 'Bonding and Structure', keywords: ['bond', 'ionic', 'covalent', 'metallic', 'structure', 'alloy', 'giant'] },
        { id: '3', name: 'Stoichiometry', keywords: ['mole', 'stoichiometry', 'formula', 'equation', 'calculation', 'mass', 'concentration'] },
        { id: '4', name: 'States of Matter', keywords: ['state', 'solid', 'liquid', 'gas', 'diffusion', 'kinetic'] },
        { id: '5', name: 'Energy Changes', keywords: ['energy', 'exothermic', 'endothermic', 'enthalpy', 'combustion'] },
      ]},
      { name: 'Inorganic Chemistry', sections: [
        { id: '6', name: 'Acids, Bases and Salts', keywords: ['acid', 'base', 'salt', 'pH', 'neutrali', 'alkali', 'indicator'] },
        { id: '7', name: 'The Periodic Table', keywords: ['periodic', 'group', 'period', 'noble gas', 'halogen', 'alkali metal', 'transition'] },
        { id: '8', name: 'Metals', keywords: ['metal', 'reactivity', 'extraction', 'ore', 'rust', 'corrosion', 'redox', 'alloy'] },
        { id: '9', name: 'Electrolysis', keywords: ['electrolysis', 'electrode', 'electrolyte', 'anode', 'cathode'] },
      ]},
      { name: 'Organic Chemistry', sections: [
        { id: '10', name: 'Organic Chemistry', keywords: ['organic', 'alkane', 'alkene', 'polymer', 'hydrocarbon', 'ethanol', 'fermentation', 'cracking'] },
      ]},
      { name: 'Chemistry in Society', sections: [
        { id: '11', name: 'Rates of Reaction', keywords: ['rate', 'catalyst', 'collision', 'activation', 'surface area'] },
        { id: '12', name: 'Air and Water', keywords: ['air', 'water', 'pollution', 'rusting', 'nitrogen', 'oxygen', 'carbon dioxide'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // PHYSICS 5054
  // ════════════════════════════════════════════════════════════
  'Physics': {
    code: '5054', level: 'O Level',
    themes: [
      { name: 'General Physics', sections: [
        { id: '1', name: 'Measurement', keywords: ['measurement', 'length', 'time', 'mass', 'instrument', 'unit', 'error'] },
        { id: '2', name: 'Motion', keywords: ['motion', 'speed', 'velocity', 'acceleration', 'distance', 'time graph'] },
        { id: '3', name: 'Forces', keywords: ['force', 'newton', 'gravity', 'weight', 'friction', 'pressure', 'moment', 'turning'] },
        { id: '4', name: 'Energy, Work and Power', keywords: ['energy', 'work', 'power', 'efficiency', 'kinetic', 'potential', 'conservation'] },
      ]},
      { name: 'Thermal Physics', sections: [
        { id: '5', name: 'Thermal Effects', keywords: ['thermal', 'heat', 'temperature', 'specific heat', 'latent heat', 'expansion'] },
        { id: '6', name: 'Transfer of Thermal Energy', keywords: ['conduction', 'convection', 'radiation', 'insulation'] },
      ]},
      { name: 'Waves', sections: [
        { id: '7', name: 'Waves and Sound', keywords: ['wave', 'sound', 'frequency', 'wavelength', 'amplitude', 'echo', 'ultrasound'] },
        { id: '8', name: 'Light', keywords: ['light', 'reflection', 'refraction', 'lens', 'mirror', 'spectrum', 'total internal'] },
      ]},
      { name: 'Electricity and Magnetism', sections: [
        { id: '9', name: 'Electricity', keywords: ['electric', 'current', 'voltage', 'resistance', 'circuit', 'ohm', 'series', 'parallel'] },
        { id: '10', name: 'Magnetism and Electromagnetism', keywords: ['magnet', 'electromagnetic', 'motor', 'generator', 'transformer', 'induction'] },
      ]},
      { name: 'Atomic Physics', sections: [
        { id: '11', name: 'Radioactivity', keywords: ['nuclear', 'radioactiv', 'half-life', 'alpha', 'beta', 'gamma', 'fission', 'fusion'] },
      ]},
    ],
  },

  // ════════════════════════════════════════════════════════════
  // BIOLOGY 5090
  // ════════════════════════════════════════════════════════════
  'Biology': {
    code: '5090', level: 'O Level',
    themes: [
      { name: 'Cell Biology and Organisation', sections: [
        { id: '1', name: 'Cell Structure and Organisation', keywords: ['cell', 'organelle', 'microscop', 'tissue', 'organ', 'membrane'] },
        { id: '2', name: 'Diffusion, Osmosis and Active Transport', keywords: ['diffusion', 'osmosis', 'active transport', 'membrane', 'concentration'] },
        { id: '3', name: 'Enzymes', keywords: ['enzyme', 'catalyst', 'substrate', 'active site', 'denatured', 'pH'] },
      ]},
      { name: 'Nutrition and Transport', sections: [
        { id: '4', name: 'Nutrition in Plants', keywords: ['photosynthesis', 'chlorophyll', 'light', 'carbon dioxide', 'leaf', 'starch'] },
        { id: '5', name: 'Nutrition in Humans', keywords: ['nutrition', 'digestion', 'food', 'diet', 'vitamin', 'protein', 'carbohydrate', 'fat'] },
        { id: '6', name: 'Transport in Plants', keywords: ['xylem', 'phloem', 'transpiration', 'root', 'stem', 'water'] },
        { id: '7', name: 'Transport in Humans', keywords: ['blood', 'heart', 'circulation', 'artery', 'vein', 'capillary', 'plasma'] },
      ]},
      { name: 'Respiration and Coordination', sections: [
        { id: '8', name: 'Respiration', keywords: ['respiration', 'aerobic', 'anaerobic', 'glucose', 'oxygen', 'carbon dioxide', 'ATP'] },
        { id: '9', name: 'Gas Exchange', keywords: ['gas exchange', 'lung', 'alveoli', 'breathing', 'diaphragm', 'ribs'] },
        { id: '10', name: 'Coordination and Response', keywords: ['nervous', 'hormone', 'brain', 'reflex', 'synapse', 'receptor', 'effector', 'insulin'] },
        { id: '11', name: 'Homeostasis', keywords: ['homeostasis', 'temperature', 'blood sugar', 'kidney', 'excretion', 'skin'] },
      ]},
      { name: 'Reproduction and Ecology', sections: [
        { id: '12', name: 'Reproduction', keywords: ['reproduction', 'sexual', 'asexual', 'flower', 'pollination', 'fertilisation', 'germination'] },
        { id: '13', name: 'Inheritance', keywords: ['inherit', 'gene', 'DNA', 'chromosome', 'mitosis', 'meiosis', 'mutation', 'allele', 'dominant', 'recessive'] },
        { id: '14', name: 'Ecology', keywords: ['ecology', 'environment', 'ecosystem', 'food chain', 'food web', 'pollution', 'conservation', 'habitat'] },
      ]},
    ],
  },
};

/**
 * Get modules for /study page
 * Returns themes with sections, matching bank topics via keywords
 */
export function getStudyModules(subject) {
  return SYLLABUS[subject] || null;
}
