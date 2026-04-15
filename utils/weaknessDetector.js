/**
 * utils/weaknessDetector.js
 * Cambridge Weakness Detection System
 * Silently analyses conversations to identify mark-losing patterns.
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 15000 });

// ── Complete weakness taxonomy per subject ──────────────────────────

export const WEAKNESS_TAXONOMY = {
  'Chemistry': ['mechanism_arrows', 'reagent_specificity', 'state_symbols', 'stereochemistry', 'observation_vs_inference', 'equilibrium_language', 'organic_synthesis_steps'],
  'Biology': ['terminology_precision', 'process_sequencing', 'graph_reading', 'genetics_notation', 'enzyme_language', 'location_in_cell', 'ecological_units'],
  'Physics': ['definition_precision', 'unit_analysis', 'vector_vs_scalar', 'field_line_rules', 'significant_figures', 'formula_application'],
  'Mathematics': ['working_shown', 'constant_of_integration', 'premature_rounding', 'proof_structure', 'notation', 'formula_selection'],
  'Economics': ['diagram_missing', 'diagram_unlabelled', 'shift_vs_movement', 'transmission_mechanism', 'one_sided_analysis', 'definition_missing', 'nominal_vs_real'],
  'English': ['device_without_effect', 'register_mismatch', 'word_limit_breach', 'summary_lifting_text', 'feature_listing'],
  'Literature': ['narrative_retelling', 'quotation_without_analysis', 'generic_comment', 'one_stanza_only', 'no_personal_response'],
  'History': ['source_as_information', 'narrative_not_analysis', 'assertion_without_evidence', 'no_counter_argument'],
  'Business': ['no_application_to_context', 'one_sided_analysis', 'no_evaluation'],
  'Islamiat': ['no_textual_evidence', 'vague_claim', 'repetition'],
  'Pakistan Studies': ['no_specific_data', 'narrative_not_analysis', 'chronology_error'],
  'Computer Science': ['pseudocode_syntax', 'trace_table_error', 'algorithm_naming', 'loop_boundary'],
};

/**
 * Analyse the last 3 messages for Cambridge weakness signals.
 * Runs as a background call — never blocks the main chat response.
 *
 * @param {Array} messages — last 3 messages [{role, content}]
 * @param {string} subject — current subject
 * @param {string} studentId — student email
 * @returns {object|null} — weakness object or null
 */
export async function detectWeakness(messages, subject, studentId) {
  if (!messages?.length || !subject) return null;

  const subjectKey = Object.keys(WEAKNESS_TAXONOMY).find(k =>
    subject.toLowerCase().includes(k.toLowerCase())
  );
  const categories = subjectKey ? WEAKNESS_TAXONOMY[subjectKey] : [];

  try {
    const response = await client.messages.create({
      model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: `You are a Cambridge examiner analysing a tutoring conversation for mark-losing patterns. Subject: ${subject}. Possible weakness categories: ${categories.join(', ')}. Respond with ONLY valid JSON. If no weakness detected, respond: {"weakness_detected":false}`,
      messages: [{
        role: 'user',
        content: `Analyse this conversation for Cambridge mark-losing weaknesses:\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}\n\nRespond with JSON: {"weakness_detected":true/false,"weakness_category":"...","weakness_description":"...","cambridge_relevance":"...","severity":"high/medium/low"} or {"weakness_detected":false}`
      }],
    });

    const text = response.content?.[0]?.text || '';
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]);
    if (!result.weakness_detected) return null;

    return {
      student_id: studentId,
      subject: subjectKey || subject,
      syllabus_code: getSyllabusCode(subject),
      weakness_category: result.weakness_category || 'general',
      weakness_description: result.weakness_description || '',
      cambridge_relevance: result.cambridge_relevance || '',
      severity: result.severity || 'medium',
      timestamp: new Date().toISOString(),
    };
  } catch {
    return null; // Never block on failure
  }
}

/**
 * Save a weakness to Supabase. Increments frequency if same weakness exists.
 */
export async function saveWeakness(sb, weakness) {
  if (!sb || !weakness) return;

  try {
    // Check if this weakness already exists for this student
    const { data: existing } = await sb.from('cambridge_weaknesses')
      .select('id, frequency')
      .eq('student_id', weakness.student_id)
      .eq('weakness_category', weakness.weakness_category)
      .eq('subject', weakness.subject)
      .eq('resolved', false)
      .limit(1);

    if (existing?.length) {
      // Increment frequency
      await sb.from('cambridge_weaknesses')
        .update({
          frequency: (existing[0].frequency || 1) + 1,
          last_detected: weakness.timestamp,
          severity: weakness.severity,
        })
        .eq('id', existing[0].id);
    } else {
      // Insert new weakness
      await sb.from('cambridge_weaknesses').insert({
        student_id: weakness.student_id,
        subject: weakness.subject,
        syllabus_code: weakness.syllabus_code,
        weakness_category: weakness.weakness_category,
        weakness_description: weakness.weakness_description,
        cambridge_relevance: weakness.cambridge_relevance,
        severity: weakness.severity,
        frequency: 1,
        first_detected: weakness.timestamp,
        last_detected: weakness.timestamp,
        resolved: false,
      });
    }
  } catch {} // Never block on DB failure
}

/**
 * Check if a weakness has been resolved (correct in 3 consecutive sessions).
 */
export async function checkResolution(sb, studentId, weaknessCategory, subject) {
  if (!sb) return false;
  try {
    const { data } = await sb.from('cambridge_weaknesses')
      .select('id, frequency, consecutive_correct')
      .eq('student_id', studentId)
      .eq('weakness_category', weaknessCategory)
      .eq('subject', subject)
      .eq('resolved', false)
      .limit(1);

    if (data?.length && (data[0].consecutive_correct || 0) >= 3) {
      await sb.from('cambridge_weaknesses')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', data[0].id);
      return true;
    }
    return false;
  } catch { return false; }
}

/**
 * Increment consecutive_correct count for a weakness.
 */
export async function markCorrect(sb, studentId, weaknessCategory, subject) {
  if (!sb) return;
  try {
    const { data } = await sb.from('cambridge_weaknesses')
      .select('id, consecutive_correct')
      .eq('student_id', studentId)
      .eq('weakness_category', weaknessCategory)
      .eq('subject', subject)
      .eq('resolved', false)
      .limit(1);

    if (data?.length) {
      await sb.from('cambridge_weaknesses')
        .update({ consecutive_correct: (data[0].consecutive_correct || 0) + 1 })
        .eq('id', data[0].id);
    }
  } catch {}
}

function getSyllabusCode(subject) {
  const codes = {
    'chemistry': '9701', 'biology': '9700', 'physics': '9702',
    'mathematics': '9709', 'economics': '9708', 'english': '9093',
    'literature': '9695', 'history': '9389', 'business': '9609',
    'islamiat': '2058', 'pakistan studies': '2059', 'computer science': '9618',
  };
  const lower = (subject || '').toLowerCase();
  return Object.entries(codes).find(([k]) => lower.includes(k))?.[1] || '';
}

// ═══════════════════════════════════════════════════════════════════════════════
// NANO-TOPIC MASTERY MAPS
// Granularity upgrade: from "weak at Algebra" to "mastered factorisation but NOT
// the discriminant method for finding roots"
// Each nano-topic is the smallest testable unit of knowledge in Cambridge exams.
// ═══════════════════════════════════════════════════════════════════════════════

export const NANO_TOPIC_MAPS = {

  // ── MATHEMATICS O LEVEL (4024) ──────────────────────────────────
  Mathematics: {
    algebra: {
      indices: ['laws_of_indices', 'negative_indices', 'fractional_indices', 'zero_index'],
      algebraic_fractions: ['simplifying_fractions', 'adding_subtracting_fractions', 'multiplying_dividing_fractions'],
      factorisation: ['common_factor', 'difference_of_two_squares', 'quadratic_factorisation', 'grouping'],
      quadratics: ['factorisation_method', 'completing_the_square', 'quadratic_formula', 'discriminant', 'nature_of_roots'],
      simultaneous_equations: ['elimination_method', 'substitution_method', 'one_linear_one_quadratic'],
      inequalities: ['linear_inequalities', 'quadratic_inequalities', 'number_line_representation'],
      sequences: ['nth_term_linear', 'nth_term_quadratic', 'geometric_sequences'],
    },
    number: {
      fractions_decimals_percentages: ['fraction_operations', 'recurring_decimals', 'percentage_increase_decrease', 'reverse_percentage'],
      ratio_proportion: ['simplifying_ratios', 'dividing_in_ratio', 'direct_proportion', 'inverse_proportion'],
      standard_form: ['converting_to_standard_form', 'converting_from_standard_form', 'calculations_in_standard_form'],
      bounds: ['upper_bound', 'lower_bound', 'error_intervals', 'bounds_in_calculations'],
    },
    geometry: {
      angles: ['parallel_lines', 'polygon_angles', 'circle_theorems', 'bearings'],
      area_volume: ['prisms', 'cylinders', 'cones', 'spheres', 'composite_shapes'],
      transformations: ['reflection', 'rotation', 'translation', 'enlargement', 'combined_transformations'],
      similarity_congruence: ['similar_triangles', 'congruence_proofs', 'area_volume_scale_factors'],
      vectors: ['column_vectors', 'vector_addition', 'scalar_multiplication', 'position_vectors', 'geometric_proofs'],
    },
    trigonometry: {
      right_angle: ['sin_cos_tan_ratios', 'finding_angles', 'finding_sides', 'elevation_depression'],
      non_right_angle: ['sine_rule', 'cosine_rule', 'area_of_triangle_formula'],
      graphs: ['sin_cos_tan_graphs', 'transformations_of_trig_graphs', 'period_amplitude'],
    },
    statistics_probability: {
      data_presentation: ['histograms', 'cumulative_frequency', 'box_plots', 'stem_and_leaf'],
      averages: ['mean_from_table', 'median_from_grouped', 'modal_class', 'interquartile_range'],
      probability: ['theoretical_probability', 'tree_diagrams', 'conditional_probability', 'venn_diagrams'],
    },
    calculus: {
      differentiation: ['first_principles', 'power_rule', 'gradient_at_point', 'tangent_normal', 'stationary_points', 'second_derivative_test'],
      integration: ['reverse_of_differentiation', 'definite_integrals', 'area_under_curve', 'constant_of_integration'],
    },
  },

  // ── CHEMISTRY O LEVEL (5070) ──────────────────────────────────
  Chemistry: {
    atomic_structure: {
      particles: ['protons_neutrons_electrons', 'mass_number', 'atomic_number', 'isotopes', 'relative_atomic_mass'],
      electronic_configuration: ['shells_energy_levels', 'electron_arrangement', 'noble_gas_configuration', 'dot_and_cross_diagrams'],
    },
    bonding: {
      ionic: ['electron_transfer', 'ionic_lattice', 'properties_of_ionic', 'formulae_of_ionic'],
      covalent: ['electron_sharing', 'single_double_triple_bonds', 'giant_covalent', 'simple_molecular', 'properties'],
      metallic: ['sea_of_electrons', 'properties_of_metals', 'alloys'],
      intermolecular: ['van_der_waals', 'hydrogen_bonding', 'effect_on_boiling_point'],
    },
    stoichiometry: {
      moles: ['mole_concept', 'molar_mass', 'avogadro_number', 'mole_calculations'],
      equations: ['balancing_equations', 'state_symbols', 'ionic_equations'],
      calculations: ['reacting_masses', 'concentration', 'gas_volumes', 'percentage_yield', 'percentage_purity'],
    },
    acids_bases: {
      properties: ['acid_properties', 'base_properties', 'pH_scale', 'indicators'],
      reactions: ['acid_plus_metal', 'acid_plus_base', 'acid_plus_carbonate', 'neutralisation'],
      salts: ['soluble_salt_preparation', 'insoluble_salt_preparation', 'titration'],
    },
    rates_equilibrium: {
      rates: ['collision_theory', 'effect_of_temperature', 'effect_of_concentration', 'effect_of_surface_area', 'effect_of_catalyst'],
      equilibrium: ['reversible_reactions', 'le_chatelier_principle', 'effect_of_conditions_on_position'],
    },
    organic: {
      hydrocarbons: ['alkanes', 'alkenes', 'cracking', 'polymers', 'isomerism'],
      functional_groups: ['alcohols', 'carboxylic_acids', 'esters'],
      reactions: ['combustion', 'addition', 'substitution', 'fermentation', 'oxidation'],
    },
    electrochemistry: {
      electrolysis: ['molten_electrolysis', 'aqueous_electrolysis', 'selective_discharge', 'electroplating'],
      reactivity: ['reactivity_series', 'displacement_reactions', 'extraction_of_metals', 'rusting_and_prevention'],
    },
  },

  // ── PHYSICS O LEVEL (5054) ──────────────────────────────────
  Physics: {
    mechanics: {
      motion: ['speed_velocity_acceleration', 'distance_time_graphs', 'velocity_time_graphs', 'equations_of_motion', 'free_fall'],
      forces: ['types_of_forces', 'resultant_force', 'newtons_laws', 'friction', 'terminal_velocity'],
      moments: ['moment_definition', 'principle_of_moments', 'conditions_for_equilibrium', 'centre_of_gravity'],
      energy: ['kinetic_energy', 'potential_energy', 'conservation_of_energy', 'work_done', 'power', 'efficiency'],
      pressure: ['pressure_definition', 'pressure_in_liquids', 'atmospheric_pressure', 'manometers_barometers'],
    },
    thermal: {
      temperature: ['thermometers', 'fixed_points', 'thermal_equilibrium'],
      heat_transfer: ['conduction', 'convection', 'radiation', 'applications_insulation'],
      thermal_properties: ['specific_heat_capacity', 'latent_heat', 'melting_boiling_curves', 'evaporation_vs_boiling'],
      thermal_expansion: ['solids_liquids_gases', 'applications', 'bimetallic_strip'],
    },
    waves: {
      properties: ['transverse_vs_longitudinal', 'amplitude_frequency_wavelength', 'wave_equation', 'wavefronts'],
      light: ['reflection', 'refraction', 'snells_law', 'total_internal_reflection', 'lenses', 'dispersion'],
      sound: ['production_of_sound', 'speed_of_sound', 'pitch_loudness', 'echoes', 'ultrasound'],
      electromagnetic: ['em_spectrum_order', 'properties_of_each', 'uses_and_dangers'],
    },
    electricity: {
      circuits: ['current_voltage_resistance', 'ohms_law', 'series_parallel', 'potential_divider'],
      components: ['resistors', 'thermistors', 'ldrs', 'diodes', 'leds', 'transistors'],
      electrical_energy: ['power_formula', 'energy_calculations', 'cost_of_electricity', 'fuses_circuit_breakers'],
      electromagnetism: ['magnetic_fields', 'electromagnets', 'motor_effect', 'electromagnetic_induction', 'transformers'],
    },
    nuclear: {
      radioactivity: ['alpha_beta_gamma', 'properties_comparison', 'detection_methods', 'half_life'],
      nuclear_reactions: ['nuclear_fission', 'nuclear_fusion', 'nuclear_power', 'safety_precautions'],
    },
  },

  // ── BIOLOGY O LEVEL (5090) ──────────────────────────────────
  Biology: {
    cell_biology: {
      cell_structure: ['animal_cell', 'plant_cell', 'organelle_functions', 'cell_membrane', 'cell_wall'],
      microscopy: ['magnification_calculation', 'resolution', 'drawing_biological_diagrams'],
      cell_division: ['mitosis_stages', 'meiosis_stages', 'comparison_mitosis_meiosis', 'significance_of_each'],
      transport: ['diffusion', 'osmosis', 'active_transport', 'water_potential', 'turgor_plasmolysis'],
    },
    enzymes: {
      properties: ['biological_catalysts', 'lock_and_key_model', 'active_site', 'specificity'],
      factors: ['effect_of_temperature', 'effect_of_ph', 'denaturation', 'optimum_conditions'],
      applications: ['digestive_enzymes', 'industrial_uses'],
    },
    nutrition: {
      food_tests: ['starch_test', 'glucose_test', 'protein_test', 'fat_test'],
      balanced_diet: ['food_groups', 'deficiency_diseases', 'energy_requirements'],
      digestion: ['alimentary_canal', 'mechanical_digestion', 'chemical_digestion', 'absorption_villi', 'assimilation'],
      photosynthesis: ['equation', 'light_dependent_reactions', 'factors_affecting_rate', 'leaf_structure_adaptation'],
    },
    respiration: {
      aerobic: ['word_equation', 'chemical_equation', 'role_of_mitochondria', 'energy_release'],
      anaerobic: ['word_equation_animals', 'word_equation_yeast', 'oxygen_debt', 'fermentation'],
      gas_exchange: ['lungs_structure', 'alveoli_adaptations', 'breathing_mechanism', 'gas_exchange_surface'],
    },
    ecology: {
      ecosystems: ['habitat_population_community', 'food_chains_webs', 'trophic_levels', 'energy_flow'],
      cycles: ['carbon_cycle', 'nitrogen_cycle', 'water_cycle'],
      human_impact: ['deforestation', 'pollution', 'conservation', 'sustainable_development'],
    },
    genetics: {
      inheritance: ['genes_alleles', 'dominant_recessive', 'genotype_phenotype', 'punnett_squares', 'monohybrid_crosses'],
      variation: ['continuous_discontinuous', 'genetic_vs_environmental', 'mutations'],
      dna: ['dna_structure', 'base_pairing', 'protein_synthesis', 'genetic_engineering'],
    },
  },

  // ── ECONOMICS O LEVEL (2281) ──────────────────────────────────
  Economics: {
    microeconomics: {
      demand: ['law_of_demand', 'demand_curve_shift', 'movement_along_demand', 'price_elasticity_of_demand', 'factors_affecting_ped'],
      supply: ['law_of_supply', 'supply_curve_shift', 'movement_along_supply', 'price_elasticity_of_supply'],
      market_equilibrium: ['equilibrium_price', 'excess_demand_supply', 'price_mechanism', 'market_failure'],
      costs_revenue: ['fixed_variable_costs', 'total_average_marginal', 'economies_of_scale', 'diseconomies_of_scale'],
      market_structures: ['perfect_competition', 'monopoly', 'oligopoly', 'monopolistic_competition'],
    },
    macroeconomics: {
      gdp: ['measurement_methods', 'real_vs_nominal', 'gdp_limitations', 'standard_of_living'],
      inflation: ['causes_demand_pull', 'causes_cost_push', 'measurement_cpi', 'effects_on_groups', 'policies_to_control'],
      unemployment: ['types_frictional_structural_cyclical', 'measurement', 'effects', 'policies_to_reduce'],
      fiscal_policy: ['government_spending', 'taxation_types', 'budget_deficit_surplus', 'national_debt'],
      monetary_policy: ['interest_rates', 'money_supply', 'quantitative_easing', 'central_bank_role'],
    },
    international: {
      trade: ['absolute_advantage', 'comparative_advantage', 'free_trade_benefits', 'protectionism_methods'],
      balance_of_payments: ['current_account', 'capital_account', 'deficit_surplus', 'exchange_rates'],
      development: ['indicators_hdi', 'barriers_to_development', 'aid_types', 'sustainable_development'],
    },
  },

  // ── ENGLISH LANGUAGE O LEVEL (1123) ──────────────────────────────
  English: {
    reading: {
      comprehension: ['explicit_information', 'implicit_meaning', 'inference', 'writers_purpose'],
      summary: ['selecting_relevant_points', 'paraphrasing', 'conciseness', 'own_words_requirement'],
      language_analysis: ['word_choice_effect', 'imagery', 'tone_identification', 'structural_features'],
    },
    writing: {
      narrative: ['plot_structure', 'characterisation', 'setting_description', 'dialogue_use', 'narrative_perspective'],
      descriptive: ['sensory_detail', 'figurative_language', 'varied_sentence_structure', 'atmosphere_creation'],
      argumentative: ['thesis_statement', 'evidence_use', 'counter_argument', 'logical_structure', 'persuasive_techniques'],
      transactional: ['letter_format', 'report_format', 'speech_format', 'article_format', 'register_matching'],
    },
    grammar: {
      sentence_structure: ['simple_compound_complex', 'subordinate_clauses', 'sentence_variety', 'fragments_run_ons'],
      punctuation: ['commas', 'semicolons', 'colons', 'apostrophes', 'speech_marks'],
      vocabulary: ['precise_word_choice', 'formal_register', 'avoiding_repetition', 'subject_specific_terms'],
    },
  },

  // ── PAKISTAN STUDIES O LEVEL (2059) ──────────────────────────────
  'Pakistan Studies': {
    history: {
      independence_movement: ['aligarh_movement', 'partition_of_bengal', 'lucknow_pact', 'khilafat_movement', 'nehru_report', 'jinnah_fourteen_points', 'lahore_resolution', 'cabinet_mission', 'third_june_plan'],
      early_pakistan: ['constitution_making', 'one_unit_scheme', 'basic_democracies', 'ayub_khan_era', 'bhutto_era', 'zia_era'],
      foreign_relations: ['kashmir_dispute', 'relations_with_india', 'relations_with_china', 'relations_with_usa', 'relations_with_muslim_world'],
    },
    geography: {
      physical: ['mountains_north', 'indus_river_system', 'deserts', 'coastal_areas', 'climate_seasons'],
      human: ['population_distribution', 'urbanisation', 'agriculture', 'industry', 'transport_network'],
      resources: ['water_resources', 'mineral_resources', 'energy_sources', 'environmental_issues'],
    },
  },

  // ── COMPUTER SCIENCE O LEVEL (2210) ──────────────────────────────
  'Computer Science': {
    theory: {
      data_representation: ['binary_conversions', 'hexadecimal', 'two_complement', 'binary_arithmetic', 'ascii_unicode', 'image_representation', 'sound_representation'],
      hardware: ['cpu_architecture', 'fetch_decode_execute', 'primary_storage', 'secondary_storage', 'input_devices', 'output_devices'],
      networking: ['network_types', 'protocols_tcp_ip', 'packet_switching', 'network_security', 'internet_www_distinction'],
      security: ['encryption', 'firewalls', 'authentication', 'malware_types', 'social_engineering'],
    },
    programming: {
      fundamentals: ['variables_constants', 'data_types', 'selection_if_else', 'iteration_for_while', 'input_output'],
      data_structures: ['arrays_1d', 'arrays_2d', 'records', 'files_reading_writing'],
      algorithms: ['linear_search', 'binary_search', 'bubble_sort', 'merge_sort', 'pseudocode_flowcharts'],
      problem_solving: ['decomposition', 'abstraction', 'trace_tables', 'test_data_types', 'validation_verification'],
    },
  },
};

/**
 * Detect nano-level weakness from a conversation.
 * Returns the specific nano-topic where the student struggles,
 * not just the broad category.
 *
 * @param {Array} messages — last 3 messages [{role, content}]
 * @param {string} subject — current subject
 * @param {string} studentId — student email
 * @returns {object|null} — nano-weakness object or null
 */
export async function detectNanoWeakness(messages, subject, studentId) {
  if (!messages?.length || !subject) return null;

  const subjectKey = Object.keys(NANO_TOPIC_MAPS).find(k =>
    subject.toLowerCase().includes(k.toLowerCase())
  );
  if (!subjectKey) return null;

  const nanoMap = NANO_TOPIC_MAPS[subjectKey];
  // Build flat list of nano-topics for Claude to classify against
  const nanoTopics = [];
  for (const [area, topics] of Object.entries(nanoMap)) {
    for (const [topic, nanos] of Object.entries(topics)) {
      for (const nano of nanos) {
        nanoTopics.push(`${area}.${topic}.${nano}`);
      }
    }
  }

  try {
    const response = await client.messages.create({
      model: /* PERMANENT: Haiku 3 only */ 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: `You are a Cambridge examiner performing nano-level weakness detection. Subject: ${subject}.

Analyse the student's response for the SPECIFIC nano-topic they are struggling with. Do not give broad categories — identify the exact sub-skill.

Available nano-topics: ${nanoTopics.slice(0, 100).join(', ')}

Respond with ONLY valid JSON:
{"nano_weakness_detected":true,"nano_topic":"area.topic.specific_skill","score":0-10,"description":"what exactly the student got wrong","starky_insight":"precise diagnosis like: you know how to factorise but you consistently confuse b²-4ac with the quadratic formula"}
or {"nano_weakness_detected":false,"nano_topic":"area.topic.specific_skill","score":7-10}`,
      messages: [{
        role: 'user',
        content: `Analyse this conversation for nano-level weakness:\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}`
      }],
    });

    const text = response.content?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]);

    return {
      student_id: studentId,
      subject: subjectKey,
      nano_topic: result.nano_topic || '',
      score: typeof result.score === 'number' ? result.score : 5,
      weakness_detected: result.nano_weakness_detected || false,
      description: result.description || '',
      starky_insight: result.starky_insight || '',
      timestamp: new Date().toISOString(),
    };
  } catch {
    return null; // Never block on failure
  }
}

/**
 * Save nano-topic mastery score to Supabase.
 * Builds a per-student nano-topic mastery map over time.
 *
 * When score drops below 5 → flagged as weakness.
 * When score is 9+ three times → flagged as mastered.
 */
export async function saveNanoMastery(sb, nanoResult) {
  if (!sb || !nanoResult?.nano_topic) return;

  try {
    const { data: existing } = await sb.from('cambridge_weaknesses')
      .select('id, frequency, consecutive_correct, metadata')
      .eq('student_id', nanoResult.student_id)
      .eq('weakness_category', `nano:${nanoResult.nano_topic}`)
      .eq('subject', nanoResult.subject)
      .limit(1);

    const metadata = existing?.[0]?.metadata || {};
    const scores = metadata.nano_scores || [];
    scores.push(nanoResult.score);
    // Keep last 20 scores
    if (scores.length > 20) scores.shift();

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const lastThree = scores.slice(-3);
    const mastered = lastThree.length >= 3 && lastThree.every(s => s >= 9);

    if (existing?.length) {
      await sb.from('cambridge_weaknesses')
        .update({
          frequency: (existing[0].frequency || 1) + 1,
          last_detected: nanoResult.timestamp,
          severity: nanoResult.score < 3 ? 'high' : nanoResult.score < 5 ? 'medium' : 'low',
          weakness_description: nanoResult.starky_insight || nanoResult.description,
          consecutive_correct: mastered ? 3 : (nanoResult.score >= 7 ? (existing[0].consecutive_correct || 0) + 1 : 0),
          resolved: mastered,
          resolved_at: mastered ? new Date().toISOString() : null,
          metadata: { ...metadata, nano_scores: scores, avg_score: avgScore, mastered },
        })
        .eq('id', existing[0].id);
    } else if (nanoResult.score < 5) {
      // Only create new records for weaknesses (score < 5)
      await sb.from('cambridge_weaknesses').insert({
        student_id: nanoResult.student_id,
        subject: nanoResult.subject,
        weakness_category: `nano:${nanoResult.nano_topic}`,
        weakness_description: nanoResult.starky_insight || nanoResult.description,
        cambridge_relevance: `Nano-topic: ${nanoResult.nano_topic}`,
        severity: nanoResult.score < 3 ? 'high' : 'medium',
        frequency: 1,
        first_detected: nanoResult.timestamp,
        last_detected: nanoResult.timestamp,
        resolved: false,
        metadata: { nano_scores: [nanoResult.score], avg_score: nanoResult.score, mastered: false },
      });
    }
  } catch {} // Never block on DB failure
}

/**
 * Get a student's complete nano-topic mastery map.
 * Returns: { "maths_quadratic_factorisation": 8, "maths_quadratic_discriminant": 3, ... }
 */
export async function getNanoMasteryMap(sb, studentId, subject) {
  if (!sb || !studentId) return {};

  try {
    const query = sb.from('cambridge_weaknesses')
      .select('weakness_category, metadata, resolved')
      .eq('student_id', studentId)
      .like('weakness_category', 'nano:%');

    if (subject) {
      const subjectKey = Object.keys(NANO_TOPIC_MAPS).find(k =>
        subject.toLowerCase().includes(k.toLowerCase())
      );
      if (subjectKey) query.eq('subject', subjectKey);
    }

    const { data } = await query;
    if (!data?.length) return {};

    const map = {};
    for (const row of data) {
      const topic = row.weakness_category.replace('nano:', '');
      const scores = row.metadata?.nano_scores || [];
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      map[topic] = {
        score: Math.round(avg * 10) / 10,
        mastered: row.resolved || row.metadata?.mastered || false,
        dataPoints: scores.length,
      };
    }
    return map;
  } catch {
    return {};
  }
}
