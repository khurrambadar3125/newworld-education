/**
 * utils/sindhBoardSyllabus.js — Sindh Textbook Board (STBB) Chapter Structure
 * ─────────────────────────────────────────────────────────────────
 * Source: STBB textbooks published by Sindh Textbook Board, Jamshoro
 * + BSEK (Board of Secondary Education Karachi) exam structure
 * + Verified from PDF extraction of actual STBB textbooks
 * + Cross-referenced with sabaq.pk video curriculum
 *
 * For: SSC (Matric) Classes 9-10, Science Group + Arts Group
 * Board: BSEK / BISE Hyderabad / BISE Sukkur / BISE Larkana / BISE Mirpurkhas
 * School: The Garage School, Karachi (and all Sindh Board schools)
 *
 * Note: STBB publishes combined IX-X textbooks for Science subjects.
 * The chapter split follows BSEK exam pattern: SSC-I (Class 9), SSC-II (Class 10).
 */

export const SINDH_SYLLABUS = {

  // ════════════════════════════════════════════════════════════
  // PHYSICS — STBB "A Text Book of Physics for Class IX-X"
  // Published by Royal Corporation, Karachi
  // Combined book: 18 chapters total
  // SSC-I (Class 9): Chapters 1-9, SSC-II (Class 10): Chapters 10-18+
  // Verified from actual PDF: Sindh Physics 09th_text.pdf (446 pages)
  // ════════════════════════════════════════════════════════════
  'Physics': {
    board: 'STBB', level: 'SSC', group: 'Science',
    class9: {
      label: 'SSC-I Physics',
      chapters: [
        { id: '1', name: 'Introduction', keywords: ['what is physics', 'importance of physics', 'islam and science', 'muslim scientists', 'pakistani scientists'] },
        { id: '2', name: 'Measurement', keywords: ['physical quantities', 'derived units', 'significant figures', 'measuring instruments'] },
        { id: '3', name: 'Kinematics of Linear Motion', keywords: ['rest', 'motion', 'types of motion', 'scalar', 'vector', 'distance', 'displacement', 'speed', 'velocity', 'acceleration', 'equations of motion', 'motion under gravity'] },
        { id: '4', name: 'Motion and Force', keywords: ['force', 'newton laws', 'mass', 'weight', 'tension', 'momentum', 'friction'] },
        { id: '5', name: 'Vectors', keywords: ['vector representation', 'multiplication', 'negative vector', 'trigonometric ratio', 'resolution of vectors'] },
        { id: '6', name: 'Equilibrium', keywords: ['parallel forces', 'torque', 'moment of force', 'centre of gravity', 'couple', 'coplanar forces', 'conditions of equilibrium', 'states of equilibrium'] },
        { id: '7', name: 'Circular Motion and Gravitation', keywords: ['centripetal force', 'centrifugal force', 'banking of roads', 'centrifuge', 'universal gravitation', 'gravitational constant', 'mass of earth', 'altitude', 'artificial satellites', 'orbital velocity'] },
        { id: '8', name: 'Work, Power and Energy', keywords: ['work', 'power', 'energy', 'kinetic energy', 'potential energy', 'interconversion', 'conservation of energy'] },
        { id: '9', name: 'Simple Machines', keywords: ['simple machine', 'mechanical advantage', 'kinds of simple machines'] },
      ],
    },
    class10: {
      label: 'SSC-II Physics',
      chapters: [
        { id: '10', name: 'Properties of Matter', keywords: ['pressure', 'atmospheric pressure', 'pascal law', 'archimedes principle', 'kinetic molecular theory'] },
        { id: '11', name: 'Heat', keywords: ['temperature', 'thermometer', 'thermal expansion', 'bimetallic strip', 'anomalous expansion', 'boyle law', 'charles law', 'gas equation', 'specific heat', 'latent heat', 'conduction', 'convection', 'radiation'] },
        { id: '12', name: 'Waves and Sound', keywords: ['oscillation', 'simple harmonic motion', 'resonance', 'wave motion', 'wave characteristics', 'sound waves', 'audible frequency', 'velocity of sound'] },
        { id: '13', name: 'Propagation and Reflection of Light', keywords: ['rectilinear propagation', 'pinhole camera', 'reflection', 'laws of reflection', 'plane mirror', 'spherical mirrors', 'concave mirror', 'convex mirror', 'mirror formula'] },
        { id: '14', name: 'Refraction of Light and Optical Instruments', keywords: ['refraction', 'prism', 'total internal reflection', 'lenses', 'thin lens formula', 'magnification', 'optical instruments', 'defects of vision'] },
        { id: '15', name: 'Nature of Light and Electromagnetic Spectrum', keywords: ['corpuscular theory', 'wave theory', 'quantum theory', 'dual nature', 'dispersion', 'emission of light', 'spectrum', 'greenhouse effect'] },
        { id: '16', name: 'Electricity', keywords: ['electrical nature of matter', 'conductors', 'insulators', 'electric field', 'electrostatic induction', 'potential', 'capacitor', 'emf', 'electric cells', 'current', 'resistance', 'circuit', 'dc', 'ac', 'joule law', 'household circuits'] },
        { id: '17', name: 'Magnetism and Electromagnetism', keywords: ['magnetic poles', 'magnetic force', 'magnetic field', 'earth magnetic field', 'making magnets', 'magnetic effect of current', 'electromagnets', 'galvanometer', 'ammeter', 'voltmeter', 'electric motor'] },
        { id: '18', name: 'Electronics', keywords: ['n-type', 'p-type', 'p-n junction diode', 'transistor', 'telecommunications', 'satellite communication'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // CHEMISTRY — STBB "Chemistry for Class IX-X"
  // SSC-I (Class 9): 8 chapters, SSC-II (Class 10): 8 chapters
  // Verified from sabaq.pk Sindh Board curriculum
  // ════════════════════════════════════════════════════════════
  'Chemistry': {
    board: 'STBB', level: 'SSC', group: 'Science',
    class9: {
      label: 'SSC-I Chemistry',
      chapters: [
        { id: '1', name: 'Fundamentals of Chemistry', keywords: ['fundamental', 'atom', 'molecule', 'element', 'compound', 'mixture', 'atomic mass', 'molecular formula'] },
        { id: '2', name: 'Atomic Structure', keywords: ['atomic structure', 'electron', 'proton', 'neutron', 'atomic number', 'mass number', 'isotopes', 'electronic configuration'] },
        { id: '3', name: 'Periodic Table and Periodicity of Properties', keywords: ['periodic table', 'periodicity', 'groups', 'periods', 'metals', 'non-metals', 'trends'] },
        { id: '4', name: 'Chemical Bonding', keywords: ['ionic bond', 'covalent bond', 'metallic bond', 'electronegativity', 'intermolecular forces'] },
        { id: '5', name: 'Physical States of Matter', keywords: ['solid', 'liquid', 'gas', 'kinetic molecular theory', 'diffusion', 'effusion', 'gas laws', 'boyle', 'charles'] },
        { id: '6', name: 'Solutions', keywords: ['solution', 'solute', 'solvent', 'concentration', 'dilution', 'solubility', 'saturated', 'unsaturated', 'supersaturated'] },
        { id: '7', name: 'Electrochemistry', keywords: ['electrochemistry', 'oxidation', 'reduction', 'electrolysis', 'electrochemical cell', 'electrolytic cell', 'corrosion'] },
        { id: '8', name: 'Chemical Reactivity', keywords: ['chemical reactivity', 'metals', 'non-metals', 'reactivity series', 'displacement reactions'] },
      ],
    },
    class10: {
      label: 'SSC-II Chemistry',
      chapters: [
        { id: '9', name: 'Chemical Equilibrium', keywords: ['equilibrium', 'reversible reaction', 'le chatelier', 'equilibrium constant', 'law of mass action'] },
        { id: '10', name: 'Acids, Bases and Salts', keywords: ['acid', 'base', 'salt', 'pH', 'indicator', 'neutralization', 'arrhenius', 'bronsted-lowry'] },
        { id: '11', name: 'Organic Chemistry', keywords: ['organic', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'functional group', 'isomerism', 'homologous series'] },
        { id: '12', name: 'Biochemistry', keywords: ['biochemistry', 'carbohydrates', 'proteins', 'lipids', 'nucleic acid', 'vitamins', 'dna', 'rna'] },
        { id: '13', name: 'Environmental Chemistry I: The Atmosphere', keywords: ['atmosphere', 'air pollution', 'ozone', 'greenhouse', 'acid rain', 'global warming', 'smog'] },
        { id: '14', name: 'Environmental Chemistry II: Water', keywords: ['water', 'water pollution', 'water treatment', 'waterborne diseases', 'soft water', 'hard water'] },
        { id: '15', name: 'Analytical Chemistry', keywords: ['analytical chemistry', 'qualitative analysis', 'quantitative analysis', 'chromatography', 'flame test'] },
        { id: '16', name: 'Industrial Chemistry', keywords: ['industrial chemistry', 'solvay process', 'haber process', 'contact process', 'petroleum', 'fertilizers'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // BIOLOGY — STBB "Biology for Class IX-X"
  // SSC-I (Class 9): 9 chapters, SSC-II (Class 10): 9 chapters
  // Verified from sabaq.pk Sindh Board curriculum
  // ════════════════════════════════════════════════════════════
  'Biology': {
    board: 'STBB', level: 'SSC', group: 'Science',
    class9: {
      label: 'SSC-I Biology',
      chapters: [
        { id: '1', name: 'Introduction to Biology', keywords: ['biology', 'branches', 'scientific method', 'biological organization'] },
        { id: '2', name: 'Solving a Biological Problem', keywords: ['biological problem', 'scientific method', 'hypothesis', 'theory', 'experiment', 'observation'] },
        { id: '3', name: 'Biodiversity', keywords: ['biodiversity', 'classification', 'kingdom', 'binomial nomenclature', 'virus', 'bacteria'] },
        { id: '4', name: 'Cells and Tissues', keywords: ['cell', 'cell theory', 'cell organelles', 'animal cell', 'plant cell', 'tissue', 'organ', 'organ system'] },
        { id: '5', name: 'Cell Cycle', keywords: ['cell cycle', 'mitosis', 'meiosis', 'cell division', 'interphase', 'prophase', 'metaphase', 'anaphase', 'telophase'] },
        { id: '6', name: 'Enzymes', keywords: ['enzyme', 'substrate', 'active site', 'lock and key', 'factors affecting enzymes', 'temperature', 'pH'] },
        { id: '7', name: 'Bioenergetics', keywords: ['bioenergetics', 'photosynthesis', 'respiration', 'ATP', 'aerobic', 'anaerobic', 'fermentation'] },
        { id: '8', name: 'Nutrition', keywords: ['nutrition', 'autotrophic', 'heterotrophic', 'digestion', 'absorption', 'assimilation', 'vitamins', 'minerals'] },
        { id: '9', name: 'Transport', keywords: ['transport', 'blood', 'heart', 'blood vessels', 'transpiration', 'xylem', 'phloem', 'circulation'] },
      ],
    },
    class10: {
      label: 'SSC-II Biology',
      chapters: [
        { id: '10', name: 'Gaseous Exchange', keywords: ['gaseous exchange', 'respiration', 'breathing', 'lungs', 'stomata', 'gill', 'trachea'] },
        { id: '11', name: 'Homeostasis', keywords: ['homeostasis', 'osmoregulation', 'thermoregulation', 'excretion', 'kidney', 'nephron', 'urine'] },
        { id: '12', name: 'Coordination', keywords: ['coordination', 'nervous system', 'brain', 'spinal cord', 'reflex arc', 'endocrine', 'hormones', 'sense organs'] },
        { id: '13', name: 'Support and Movement', keywords: ['support', 'movement', 'skeleton', 'bone', 'joint', 'cartilage', 'muscle', 'antagonistic'] },
        { id: '14', name: 'Reproduction', keywords: ['reproduction', 'asexual', 'sexual', 'flower', 'pollination', 'fertilization', 'embryo', 'seed', 'fruit'] },
        { id: '15', name: 'Inheritance', keywords: ['inheritance', 'genetics', 'gene', 'chromosome', 'DNA', 'genotype', 'phenotype', 'mendel', 'dominant', 'recessive'] },
        { id: '16', name: 'Man and His Environment', keywords: ['ecology', 'ecosystem', 'food chain', 'food web', 'carbon cycle', 'nitrogen cycle', 'pollution', 'conservation'] },
        { id: '17', name: 'Biotechnology', keywords: ['biotechnology', 'genetic engineering', 'fermentation', 'cloning', 'tissue culture', 'transgenic'] },
        { id: '18', name: 'Pharmacology', keywords: ['pharmacology', 'drugs', 'antibiotics', 'vaccines', 'drug addiction', 'medicinal plants'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MATHEMATICS — STBB "Mathematics for Class IX-X"
  // SSC-I (Class 9): 16 chapters, SSC-II (Class 10): 14 chapters
  // Verified from sabaq.pk Sindh Board curriculum
  // ════════════════════════════════════════════════════════════
  'Mathematics': {
    board: 'STBB', level: 'SSC', group: 'Science',
    class9: {
      label: 'SSC-I Mathematics',
      chapters: [
        { id: '1', name: 'Real and Complex Numbers', keywords: ['real numbers', 'complex numbers', 'rational', 'irrational', 'properties', 'number line'] },
        { id: '2', name: 'Logarithms', keywords: ['logarithm', 'common logarithm', 'natural logarithm', 'laws of logarithm', 'antilog'] },
        { id: '3', name: 'Algebraic Expressions and Formulas', keywords: ['algebraic expression', 'polynomial', 'formula', 'binomial', 'trinomial', 'expansion'] },
        { id: '4', name: 'Factorization', keywords: ['factorization', 'common factor', 'grouping', 'difference of squares', 'perfect square', 'cubic'] },
        { id: '5', name: 'Algebraic Manipulation', keywords: ['algebraic manipulation', 'HCF', 'LCM', 'simplification', 'algebraic fractions'] },
        { id: '6', name: 'Linear Equations and Inequalities', keywords: ['linear equation', 'inequality', 'simultaneous equations', 'elimination', 'substitution'] },
        { id: '7', name: 'Linear Graphs and Their Application', keywords: ['linear graph', 'coordinate', 'slope', 'intercept', 'straight line', 'application'] },
        { id: '8', name: 'Quadratic Equation', keywords: ['quadratic equation', 'quadratic formula', 'completing the square', 'factorization method', 'discriminant'] },
        { id: '9', name: 'Congruent Triangles', keywords: ['congruent', 'triangle', 'SSS', 'SAS', 'ASA', 'AAS', 'congruence'] },
        { id: '10', name: 'Parallelograms and Triangles', keywords: ['parallelogram', 'triangle', 'properties', 'mid-point theorem'] },
        { id: '11', name: 'Line Bisectors and Angle Bisectors', keywords: ['line bisector', 'angle bisector', 'perpendicular bisector', 'construction'] },
        { id: '12', name: 'Sides and Angles of a Triangle', keywords: ['sides', 'angles', 'triangle inequality', 'angle sum property', 'exterior angle'] },
        { id: '13', name: 'Practical Geometry — Triangles', keywords: ['practical geometry', 'construction', 'triangle construction', 'compass', 'ruler'] },
        { id: '14', name: 'Theorems Related with Area', keywords: ['area', 'theorem', 'parallelogram area', 'triangle area', 'equal areas'] },
        { id: '15', name: 'Projection of a Side of a Triangle', keywords: ['projection', 'side of triangle', 'cosine rule', 'altitude'] },
        { id: '16', name: 'Introduction to Coordinate Geometry', keywords: ['coordinate geometry', 'distance formula', 'mid-point', 'section formula', 'collinear'] },
      ],
    },
    class10: {
      label: 'SSC-II Mathematics',
      chapters: [
        { id: '17', name: 'Sets and Functions', keywords: ['set', 'subset', 'union', 'intersection', 'complement', 'function', 'domain', 'range'] },
        { id: '18', name: 'Variations', keywords: ['direct variation', 'inverse variation', 'joint variation', 'k-method'] },
        { id: '19', name: 'Matrices and Determinants', keywords: ['matrix', 'determinant', 'addition', 'multiplication', 'inverse', 'transpose', 'singular'] },
        { id: '20', name: 'Theory of Quadratic Equations', keywords: ['quadratic equation', 'roots', 'nature of roots', 'sum of roots', 'product of roots', 'discriminant'] },
        { id: '21', name: 'Partial Fractions', keywords: ['partial fraction', 'decomposition', 'proper fraction', 'improper fraction', 'linear factors', 'repeated factors'] },
        { id: '22', name: 'Basic Statistics', keywords: ['statistics', 'mean', 'median', 'mode', 'frequency distribution', 'grouped data', 'cumulative frequency'] },
        { id: '23', name: "Pythagoras' Theorem", keywords: ['pythagoras', 'right triangle', 'hypotenuse', 'converse', 'proof'] },
        { id: '24', name: 'Ratio and Proportion', keywords: ['ratio', 'proportion', 'similar triangles', 'proportional segments', 'cross multiplication'] },
        { id: '25', name: 'Chords of a Circle', keywords: ['chord', 'circle', 'perpendicular from centre', 'equal chords', 'congruent arcs'] },
        { id: '26', name: 'Tangent to a Circle', keywords: ['tangent', 'point of tangency', 'tangent properties', 'external point', 'tangent length'] },
        { id: '27', name: 'Chords and Arcs', keywords: ['chord', 'arc', 'central angle', 'inscribed angle', 'minor arc', 'major arc'] },
        { id: '28', name: 'Angle in a Segment of a Circle', keywords: ['segment', 'angle in segment', 'semicircle', 'cyclic quadrilateral', 'opposite angles'] },
        { id: '29', name: 'Practical Geometry — Circles', keywords: ['practical geometry', 'circle construction', 'tangent construction', 'circumscribed', 'inscribed'] },
        { id: '30', name: 'Introduction to Trigonometry', keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'trigonometric ratios', 'angle of elevation', 'angle of depression'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // PAKISTAN STUDIES — STBB "Pakistan Studies for Classes IX-X"
  // Published by Azam Sons, Karachi
  // Combined book: 10 chapters (split by BSEK exam pattern)
  // Verified from actual PDF: Sindh Pakistan Studies 09th_text.pdf (172 pages)
  // ════════════════════════════════════════════════════════════
  'Pakistan Studies': {
    board: 'STBB', level: 'SSC', group: 'Compulsory',
    class9: {
      label: 'SSC-I Pakistan Studies',
      chapters: [
        { id: '1', name: 'Ideological Basis of Pakistan', keywords: ['ideology', 'islamic ideology', 'two-nation theory', 'quaid-e-azam', 'allama iqbal', 'pakistan resolution'] },
        { id: '2', name: 'Making of Pakistan', keywords: ['pakistan movement', 'muslim league', 'congress', 'partition', 'independence', '1947', 'boundary commission'] },
        { id: '3', name: 'Constitutional Development in Islamic Republic of Pakistan', keywords: ['constitution', '1956', '1962', '1973', 'martial law', 'democracy', 'fundamental rights'] },
        { id: '4', name: 'Land and Climate of Pakistan', keywords: ['geography', 'mountains', 'rivers', 'plains', 'deserts', 'climate', 'monsoon', 'provinces'] },
        { id: '5', name: 'Resources of Pakistan', keywords: ['natural resources', 'minerals', 'water resources', 'forests', 'agriculture', 'livestock'] },
      ],
    },
    class10: {
      label: 'SSC-II Pakistan Studies',
      chapters: [
        { id: '6', name: 'Industrial Development in Pakistan', keywords: ['industry', 'industrial development', 'cotton', 'textile', 'sugar', 'cement', 'steel', 'small-scale industry'] },
        { id: '7', name: 'The Population of Pakistan', keywords: ['population', 'census', 'growth rate', 'urbanization', 'migration', 'demographic'] },
        { id: '8', name: 'Culture of Pakistan', keywords: ['culture', 'traditions', 'languages', 'festivals', 'arts', 'handicrafts', 'sindhi culture', 'punjabi culture', 'balochi culture', 'pashtun culture'] },
        { id: '9', name: 'Education in Pakistan', keywords: ['education', 'literacy', 'primary education', 'secondary education', 'higher education', 'madrassah', 'technical education'] },
        { id: '10', name: 'Pakistan — A Welfare State', keywords: ['welfare state', 'social welfare', 'health', 'housing', 'poverty', 'zakat', 'ushr', 'bait-ul-mal'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // ISLAMIAT — STBB "Islamiat for Class IX-X" (Compulsory/Elective)
  // Verified from actual PDF: Sindh Islamiat 09th_text.pdf (127 pages)
  // Note: This is in Urdu. Chapter structure follows BSEK standard.
  // ════════════════════════════════════════════════════════════
  'Islamiat': {
    board: 'STBB', level: 'SSC', group: 'Compulsory',
    class9: {
      label: 'SSC-I Islamiat',
      chapters: [
        { id: '1', name: 'Nazra Quran — Selected Surahs', keywords: ['quran', 'nazra', 'surah infitar', 'surah ahzab', 'surah mumtahina', 'tilawat', 'tajweed'] },
        { id: '2', name: 'Tarjuma and Tafseer — Selected Verses', keywords: ['translation', 'tafseer', 'quran translation', 'meaning', 'explanation'] },
        { id: '3', name: 'Ahadees — Selected Hadith', keywords: ['hadith', 'hadees', 'sunnah', 'prophet sayings', 'sahih'] },
        { id: '4', name: 'Seerat-un-Nabi (PBUH)', keywords: ['seerat', 'prophet muhammad', 'life of prophet', 'makkah', 'madinah', 'hijrah'] },
        { id: '5', name: 'Ibadat — Worship', keywords: ['ibadaat', 'namaz', 'prayer', 'roza', 'fasting', 'zakat', 'hajj', 'worship'] },
        { id: '6', name: 'Iman and Aqaid — Faith and Beliefs', keywords: ['iman', 'faith', 'tawheed', 'risalat', 'akhirat', 'angels', 'divine books'] },
        { id: '7', name: 'Akhlaq — Islamic Morals', keywords: ['akhlaq', 'morals', 'ethics', 'honesty', 'truthfulness', 'patience', 'justice', 'kindness'] },
      ],
    },
    class10: {
      label: 'SSC-II Islamiat',
      chapters: [
        { id: '8', name: 'Nazra Quran — Selected Surahs (Part II)', keywords: ['quran', 'nazra', 'tilawat', 'tajweed', 'recitation'] },
        { id: '9', name: 'Tarjuma and Tafseer — Selected Verses (Part II)', keywords: ['translation', 'tafseer', 'quran meaning', 'commentary'] },
        { id: '10', name: 'Ahadees — Selected Hadith (Part II)', keywords: ['hadith', 'sunnah', 'application', 'daily life'] },
        { id: '11', name: 'Muashra — Islamic Society', keywords: ['society', 'islamic society', 'rights', 'duties', 'neighbours', 'parents', 'community'] },
        { id: '12', name: 'Huqooq-ul-Ibad — Rights of People', keywords: ['human rights', 'rights of people', 'huqooq', 'justice', 'equality', 'brotherhood'] },
        { id: '13', name: 'Jihad and Defence of Islam', keywords: ['jihad', 'defence', 'islamic history', 'battles', 'ghazwat', 'badr', 'uhud'] },
        { id: '14', name: 'Muslim Scientists and Scholars', keywords: ['muslim scientists', 'scholars', 'contributions', 'ibn sina', 'al-khwarizmi', 'al-biruni', 'islamic golden age'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // COMPUTER SCIENCE — STBB "Computer Science for Class IX-X"
  // SSC-I (Class 9): 7 chapters, SSC-II (Class 10): 7 chapters
  // Verified from sabaq.pk Sindh Board curriculum
  // ════════════════════════════════════════════════════════════
  'Computer Science': {
    board: 'STBB', level: 'SSC', group: 'Science',
    class9: {
      label: 'SSC-I Computer Science',
      chapters: [
        { id: '1', name: 'Fundamentals of Computer', keywords: ['computer', 'hardware', 'software', 'input', 'output', 'processing', 'memory', 'CPU', 'generations'] },
        { id: '2', name: 'Fundamentals of Operating System', keywords: ['operating system', 'windows', 'functions', 'file management', 'GUI', 'CLI'] },
        { id: '3', name: 'Office Automation', keywords: ['MS Word', 'MS Excel', 'MS PowerPoint', 'word processing', 'spreadsheet', 'presentation'] },
        { id: '4', name: 'Data Communication and Network', keywords: ['data communication', 'network', 'LAN', 'WAN', 'MAN', 'topology', 'protocol', 'internet'] },
        { id: '5', name: 'Computer Security and Ethics', keywords: ['security', 'virus', 'malware', 'firewall', 'ethics', 'cyber crime', 'password', 'backup'] },
        { id: '6', name: 'Web Development', keywords: ['web development', 'HTML', 'CSS', 'webpage', 'website', 'browser', 'URL', 'tags'] },
        { id: '7', name: 'Introduction to Database System', keywords: ['database', 'DBMS', 'table', 'record', 'field', 'query', 'SQL', 'primary key'] },
      ],
    },
    class10: {
      label: 'SSC-II Computer Science',
      chapters: [
        { id: '8', name: 'Problem Solving and Algorithm Designing', keywords: ['problem solving', 'algorithm', 'flowchart', 'pseudocode', 'logic', 'step by step'] },
        { id: '9', name: 'Basics of Programming C++', keywords: ['C++', 'programming', 'variable', 'data type', 'operator', 'syntax', 'program structure'] },
        { id: '10', name: 'Input/Output Handling in C++', keywords: ['cin', 'cout', 'input', 'output', 'iostream', 'formatting'] },
        { id: '11', name: 'Control Structure', keywords: ['control structure', 'if', 'else', 'switch', 'loop', 'for', 'while', 'do-while', 'nested'] },
        { id: '12', name: 'Functions', keywords: ['function', 'return type', 'parameter', 'argument', 'call', 'definition', 'prototype', 'recursion'] },
        { id: '13', name: 'Digital Logic and Design', keywords: ['digital logic', 'binary', 'logic gate', 'AND', 'OR', 'NOT', 'truth table', 'boolean'] },
        { id: '14', name: 'Introduction to Scratch', keywords: ['scratch', 'visual programming', 'sprite', 'block', 'animation', 'game', 'event'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // ENGLISH — STBB "English for Class IX-X"
  // Competency-based structure (BSEK pattern)
  // SSC-I (Class 9): 6 competency areas
  // SSC-II (Class 10): 6 competency areas
  // ════════════════════════════════════════════════════════════
  'English': {
    board: 'STBB', level: 'SSC', group: 'Compulsory',
    class9: {
      label: 'SSC-I English',
      chapters: [
        { id: '1', name: 'Reading Comprehension', keywords: ['reading', 'comprehension', 'passage', 'summary', 'main idea', 'inference', 'narrative', 'descriptive'] },
        { id: '2', name: 'Vocabulary', keywords: ['vocabulary', 'word meaning', 'synonym', 'antonym', 'contextual meaning', 'word formation'] },
        { id: '3', name: 'Grammar — Core Concepts', keywords: ['grammar', 'parts of speech', 'noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun'] },
        { id: '4', name: 'Grammar — Tenses', keywords: ['tenses', 'present', 'past', 'future', 'simple', 'continuous', 'perfect', 'perfect continuous'] },
        { id: '5', name: 'Grammar — Punctuation', keywords: ['punctuation', 'comma', 'full stop', 'question mark', 'exclamation', 'apostrophe', 'quotation marks'] },
        { id: '6', name: 'Writing Skills', keywords: ['writing', 'essay', 'letter', 'paragraph', 'dialogue', 'story', 'summary writing', 'application'] },
      ],
    },
    class10: {
      label: 'SSC-II English',
      chapters: [
        { id: '7', name: 'Reading — Advanced Comprehension', keywords: ['advanced reading', 'comprehension', 'persuasive', 'expository', 'analytical', 'critical reading'] },
        { id: '8', name: 'Vocabulary — Idioms and Figures of Speech', keywords: ['idioms', 'proverbs', 'figures of speech', 'simile', 'metaphor', 'personification'] },
        { id: '9', name: 'Grammar — Phrases and Clauses', keywords: ['phrase', 'clause', 'sentence types', 'simple sentence', 'compound sentence', 'complex sentence'] },
        { id: '10', name: 'Grammar — Tenses (Advanced)', keywords: ['active voice', 'passive voice', 'direct speech', 'indirect speech', 'reported speech', 'narration'] },
        { id: '11', name: 'Grammar — Advanced Punctuation', keywords: ['colon', 'semicolon', 'dash', 'brackets', 'hyphen', 'ellipsis'] },
        { id: '12', name: 'Writing — Essays and Composition', keywords: ['essay writing', 'descriptive essay', 'narrative essay', 'argumentative', 'paraphrasing', 'formal letter', 'report writing'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // GENERAL SCIENCE — STBB "General Science for Class IX-X"
  // For Arts Group students (alternative to Physics/Chemistry/Biology)
  // SSC-I (Class 9): 6 chapters, SSC-II (Class 10): 5 chapters
  // Verified from sabaq.pk Sindh Board curriculum
  // ════════════════════════════════════════════════════════════
  'General Science': {
    board: 'STBB', level: 'SSC', group: 'Arts',
    class9: {
      label: 'SSC-I General Science',
      chapters: [
        { id: '1', name: 'Introduction and Role of Science', keywords: ['science', 'scientific method', 'branches of science', 'role of science', 'technology'] },
        { id: '2', name: 'Our Life and Chemistry', keywords: ['chemistry', 'daily life', 'elements', 'compounds', 'mixtures', 'chemical changes'] },
        { id: '3', name: 'Biochemistry and Biotechnology', keywords: ['biochemistry', 'biotechnology', 'food', 'nutrition', 'DNA', 'genetic engineering'] },
        { id: '4', name: 'Man and Health', keywords: ['health', 'hygiene', 'balanced diet', 'vitamins', 'minerals', 'exercise', 'disease prevention'] },
        { id: '5', name: 'Diseases, Causes and Prevention', keywords: ['diseases', 'communicable', 'non-communicable', 'virus', 'bacteria', 'prevention', 'vaccination'] },
        { id: '6', name: 'Environment and Natural Resources', keywords: ['environment', 'natural resources', 'conservation', 'pollution', 'ecosystem', 'renewable', 'non-renewable'] },
      ],
    },
    class10: {
      label: 'SSC-II General Science',
      chapters: [
        { id: '7', name: 'Energy', keywords: ['energy', 'forms of energy', 'kinetic', 'potential', 'solar', 'wind', 'conversion', 'conservation'] },
        { id: '8', name: 'Current Electricity', keywords: ['electricity', 'current', 'voltage', 'resistance', 'ohm law', 'circuit', 'series', 'parallel'] },
        { id: '9', name: 'Basic Electronics', keywords: ['electronics', 'semiconductor', 'diode', 'transistor', 'integrated circuit', 'microprocessor'] },
        { id: '10', name: 'Science and Technology', keywords: ['technology', 'communication', 'computer', 'internet', 'satellite', 'space technology'] },
        { id: '11', name: 'The Space and Nuclear Program of Pakistan', keywords: ['space program', 'SUPARCO', 'nuclear program', 'PAEC', 'nuclear energy', 'Pakistan space'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // URDU — STBB "Urdu for Class IX-X" (Compulsory)
  // Competency-based: Prose (Nasr), Poetry (Nazm/Ghazal), Grammar (Qawaid)
  // Standard BSEK exam structure
  // ════════════════════════════════════════════════════════════
  'Urdu': {
    board: 'STBB', level: 'SSC', group: 'Compulsory',
    class9: {
      label: 'SSC-I Urdu',
      chapters: [
        { id: '1', name: 'Nasr — Prose Lessons (Part I)', keywords: ['prose', 'nasr', 'comprehension', 'urdu prose', 'essay', 'summary'] },
        { id: '2', name: 'Nazm — Poetry (Part I)', keywords: ['poetry', 'nazm', 'ghazal', 'urdu poetry', 'explanation', 'central idea'] },
        { id: '3', name: 'Qawaid — Grammar (Part I)', keywords: ['grammar', 'qawaid', 'urdu grammar', 'murakab', 'jumlah', 'fail', 'ism', 'harf'] },
        { id: '4', name: 'Insha — Writing (Part I)', keywords: ['writing', 'insha', 'essay writing', 'letter writing', 'application', 'story writing'] },
      ],
    },
    class10: {
      label: 'SSC-II Urdu',
      chapters: [
        { id: '5', name: 'Nasr — Prose Lessons (Part II)', keywords: ['prose', 'nasr', 'advanced comprehension', 'urdu literature'] },
        { id: '6', name: 'Nazm — Poetry (Part II)', keywords: ['poetry', 'nazm', 'ghazal', 'couplets', 'literary devices', 'urdu shayari'] },
        { id: '7', name: 'Qawaid — Grammar (Part II)', keywords: ['advanced grammar', 'muhawarat', 'zarb-ul-misal', 'idioms', 'proverbs', 'tenses'] },
        { id: '8', name: 'Insha — Writing (Part II)', keywords: ['advanced writing', 'formal letter', 'report', 'debate', 'summary', 'translation'] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // SINDHI — STBB "Sindhi for Class IX-X" (Compulsory in Sindh)
  // Same structure as Urdu: Prose, Poetry, Grammar, Writing
  // ════════════════════════════════════════════════════════════
  'Sindhi': {
    board: 'STBB', level: 'SSC', group: 'Compulsory',
    class9: {
      label: 'SSC-I Sindhi',
      chapters: [
        { id: '1', name: 'Nasar — Prose Lessons (Part I)', keywords: ['prose', 'nasar', 'sindhi prose', 'comprehension', 'sindhi literature'] },
        { id: '2', name: 'Nazm — Poetry (Part I)', keywords: ['poetry', 'nazm', 'shah abdul latif bhittai', 'sachal sarmast', 'sindhi poetry'] },
        { id: '3', name: 'Qawaid — Grammar (Part I)', keywords: ['sindhi grammar', 'qawaid', 'jumlah', 'fail', 'ism', 'sindhi script'] },
        { id: '4', name: 'Tahrir — Writing (Part I)', keywords: ['writing', 'essay', 'letter', 'application', 'sindhi writing'] },
      ],
    },
    class10: {
      label: 'SSC-II Sindhi',
      chapters: [
        { id: '5', name: 'Nasar — Prose Lessons (Part II)', keywords: ['advanced prose', 'sindhi literature', 'comprehension'] },
        { id: '6', name: 'Nazm — Poetry (Part II)', keywords: ['advanced poetry', 'sindhi poets', 'literary analysis'] },
        { id: '7', name: 'Qawaid — Grammar (Part II)', keywords: ['advanced grammar', 'muhawara', 'sindhi idioms'] },
        { id: '8', name: 'Tahrir — Writing (Part II)', keywords: ['advanced writing', 'formal letter', 'report writing'] },
      ],
    },
  },

};

// ════════════════════════════════════════════════════════════
// BSEK EXAM INFORMATION
// Board of Secondary Education Karachi
// ════════════════════════════════════════════════════════════
export const BSEK_INFO = {
  name: 'Board of Secondary Education Karachi',
  shortName: 'BSEK',
  textbookBoard: 'Sindh Textbook Board, Jamshoro (STBB)',
  website: 'https://bfriendsclass.com', // BSEK official site often down
  examPattern: {
    'SSC-I': {
      label: 'Class 9 (Matric Part I)',
      subjects: {
        science: ['English I', 'Urdu I', 'Mathematics I', 'Physics I', 'Chemistry I', 'Biology I', 'Computer Science I', 'Islamiat I', 'Sindhi I'],
        arts: ['English I', 'Urdu I', 'General Science I', 'Islamiat I', 'Sindhi I', 'Civics I', 'Elective I'],
      },
    },
    'SSC-II': {
      label: 'Class 10 (Matric Part II)',
      subjects: {
        science: ['English II', 'Urdu II', 'Mathematics II', 'Physics II', 'Chemistry II', 'Biology II', 'Computer Science II', 'Pakistan Studies', 'Sindhi II'],
        arts: ['English II', 'Urdu II', 'General Science II', 'Pakistan Studies', 'Sindhi II', 'Civics II', 'Elective II'],
      },
    },
  },
  pastPaperSources: [
    'BSEK official website (intermittent)',
    'bfriendsclass.com (archives)',
    'ilmkidunya.com/past-papers',
    'sabaq.pk solved board papers',
  ],
};

// ════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════

/**
 * Get chapters for a specific subject and class
 * @param {string} subject - e.g. 'Physics', 'Chemistry'
 * @param {number|string} classNum - 9 or 10
 * @returns {Array} chapters array or empty
 */
export function getSindhChapters(subject, classNum) {
  const subj = SINDH_SYLLABUS[subject];
  if (!subj) return [];
  const key = classNum == 9 ? 'class9' : 'class10';
  return subj[key]?.chapters || [];
}

/**
 * Get all chapters for a subject (both classes combined)
 */
export function getAllSindhChapters(subject) {
  const subj = SINDH_SYLLABUS[subject];
  if (!subj) return [];
  return [
    ...(subj.class9?.chapters || []),
    ...(subj.class10?.chapters || []),
  ];
}

/**
 * Get all Sindh Board subjects with metadata
 */
export function getSindhSubjectsWithMeta() {
  return Object.entries(SINDH_SYLLABUS).map(([name, data]) => ({
    name,
    board: data.board,
    level: data.level,
    group: data.group,
    class9Count: data.class9?.chapters?.length || 0,
    class10Count: data.class10?.chapters?.length || 0,
    totalChapters: (data.class9?.chapters?.length || 0) + (data.class10?.chapters?.length || 0),
  }));
}

/**
 * Find chapters matching a keyword across all Sindh subjects
 */
export function findSindhChaptersByKeyword(keyword) {
  const results = [];
  const kw = keyword.toLowerCase();
  for (const [subject, data] of Object.entries(SINDH_SYLLABUS)) {
    for (const classKey of ['class9', 'class10']) {
      const chapters = data[classKey]?.chapters || [];
      for (const ch of chapters) {
        if (ch.name.toLowerCase().includes(kw) || ch.keywords.some(k => k.includes(kw))) {
          results.push({
            subject,
            class: classKey === 'class9' ? 9 : 10,
            chapter: ch,
          });
        }
      }
    }
  }
  return results;
}

/**
 * Get subject group info (Science vs Arts vs Compulsory)
 */
export function getSindhSubjectsByGroup(group) {
  return Object.entries(SINDH_SYLLABUS)
    .filter(([_, data]) => data.group === group)
    .map(([name]) => name);
}
