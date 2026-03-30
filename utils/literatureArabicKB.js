/**
 * utils/literatureArabicKB.js
 * Arabic-Language Literature Support for IGCSE and IB English
 *
 * Pre-written Arabic explanations of English Literature set texts.
 * For Arabic-speaking UAE students who study these texts in English
 * but benefit from explanation in Modern Standard Arabic.
 *
 * STARKY RULES:
 * - Responds in MSA (فصحى) when Arab student asks about set texts
 * - Explains themes, characters, plot, literary devices clearly
 * - Helps with essay structure and examiner expectations in Arabic
 * - Does NOT translate full passages from texts (copyright)
 * - DOES explain what passages mean and their significance
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SHAKESPEARE — ARABIC EXPLANATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const SHAKESPEARE_ARABIC = {
  othello: {
    titleAr: 'عطيل',
    titleEn: 'Othello',
    author: 'William Shakespeare',
    summary: 'مأساة شكسبير عن الغيرة والتلاعب والعنصرية. عطيل جنرال مغربي يتزوج دزدمونة، لكن إياغو يدمر ثقته بزوجته حتى يقتلها ثم يكتشف براءتها.',
    themes: [
      { ar: 'الغيرة', en: 'Jealousy', explanation: 'إياغو يزرع بذور الشك في قلب عطيل. يصف شكسبير الغيرة بأنها "الوحش ذو العيون الخضراء" الذي يسخر من ضحيته.' },
      { ar: 'العنصرية', en: 'Racism', explanation: 'عطيل يعاني التمييز رغم مكانته العسكرية. برابانشيو يرفض زواج ابنته من عطيل بسبب لونه. المجتمع ينظر إليه كغريب دائماً.' },
      { ar: 'التلاعب', en: 'Manipulation', explanation: 'إياغو يستخدم الكذب أداةً للانتقام. يتظاهر بالصداقة والولاء بينما يحيك المؤامرات. هو أخطر شخصيات شكسبير لأنه يختبئ خلف قناع الأمانة.' },
      { ar: 'الثقة والخيانة', en: 'Trust and betrayal', explanation: 'كيف تنهار العلاقات حين تغيب الثقة. عطيل يثق بإياغو أكثر من زوجته — وهذا هو الخطأ المأساوي.' },
    ],
    characters: [
      { name: 'عطيل (Othello)', description: 'بطل نبيل لكنه عُرضة للشك. جنرال عظيم في ساحة المعركة لكنه ضعيف أمام ألاعيب إياغو. خطؤه المأساوي: ثقته العمياء بإياغو.' },
      { name: 'إياغو (Iago)', description: 'الشرير الحقيقي في المسرحية. يتظاهر بالولاء والأمانة. دوافعه: الحسد والانتقام وحب السيطرة. يقول عن نفسه: "لست ما أبدو عليه".' },
      { name: 'دزدمونة (Desdemona)', description: 'رمز البراءة والوفاء. تحبّ عطيل حباً حقيقياً رغم معارضة أبيها. تموت وهي تدافع عن زوجها.' },
      { name: 'كاسيو (Cassio)', description: 'ضحية مؤامرة إياغو. جندي شريف يُستخدم كأداة لإثارة غيرة عطيل.' },
    ],
    discussionQs: [
      'كيف يستخدم شكسبير شخصية إياغو لاستكشاف موضوع الشر؟',
      'هل عطيل ضحية أم مذنب؟ ناقش.',
      'ما دور العنصرية في المسرحية؟ هل تبرر أفعال عطيل؟',
      'كيف تتغير شخصية عطيل من بداية المسرحية إلى نهايتها؟',
    ],
  },

  midsummer: {
    titleAr: 'حلم ليلة منتصف الصيف',
    titleEn: 'A Midsummer Night\'s Dream',
    author: 'William Shakespeare',
    summary: 'كوميديا رومانسية تدور في غابة سحرية حيث يتحول الحب إلى فوضى. أربعة عشاق يضيعون في الغابة، والجنيات تتلاعب بمشاعرهم.',
    themes: [
      { ar: 'الحب والعقل', en: 'Love vs reason', explanation: 'الحب يجعل الناس يتصرفون بجنون. شكسبير يسخر من فكرة أن الحب عقلاني — في الغابة، الجميع يحبون الشخص الخطأ.' },
      { ar: 'الواقع والخيال', en: 'Reality vs illusion', explanation: 'ما الحقيقي وما الوهم؟ الشخصيات لا تعرف إن كانت تحلم أم مستيقظة. السحر يطمس الخط بين الحقيقة والخيال.' },
      { ar: 'القوة والسيطرة', en: 'Power and control', explanation: 'العلاقات بين الحكام والمحكومين — بين أوبيرون وتيتانيا، بين ثيسيوس وهيبوليتا، بين الآباء والأبناء.' },
    ],
    characters: [
      { name: 'باك (Puck)', description: 'الروح المشاغبة التي تسبب الفوضى. مضحك ومؤذٍ. يمثل عبثية الحب.' },
      { name: 'تيتانيا وأوبيرون', description: 'ملك وملكة الجنيات في نزاع على صبي. صراعهما يؤثر على العالم الطبيعي.' },
      { name: 'الشباب الأربعة', description: 'هيرميا، ليساندر، هيلينا، ديميتريوس — ضحايا الحب المتقلب والسحر.' },
    ],
    discussionQs: [
      'كيف يصور شكسبير الحب في هذه المسرحية — هل هو شيء جميل أم سخيف؟',
      'ما دور الغابة كمكان في المسرحية؟',
      'هل باك شخصية شريرة أم مضحكة؟ ناقش.',
    ],
  },

  romeo: {
    titleAr: 'روميو وجولييت',
    titleEn: 'Romeo and Juliet',
    author: 'William Shakespeare',
    summary: 'أشهر قصة حب في التاريخ الأدبي. روميو وجولييت من عائلتين متعاديتين يقعان في الحب، لكن العداء يؤدي إلى مأساة.',
    themes: [
      { ar: 'الحب والكراهية', en: 'Love and hate', explanation: 'كيف يتعايشان في آنٍ واحد. الحب ينبت في تربة الكراهية. شكسبير يستخدم المتناقضات (oxymorons): "حب كراهيتي" و"كراهية حبي".' },
      { ar: 'القدر والصدفة', en: 'Fate and chance', explanation: 'هل كان مصيرهما محتوماً منذ البداية؟ المقدمة تصفهما بـ"العاشقين التعيسين" — الجمهور يعرف النهاية قبل أن تبدأ.' },
      { ar: 'الشباب والتهور', en: 'Youth and impulsiveness', explanation: 'قرارات متسرعة تؤدي إلى الكارثة. الزواج السري، القتل، السم — كل شيء يحدث في أيام قليلة.' },
    ],
    discussionQs: [
      'هل روميو وجولييت مسؤولان عن مصيرهما أم أن القدر هو المسؤول؟',
      'كيف يصور شكسبير الصراع بين الحب والواجب العائلي؟',
      'ما دور الراهب لورنس — حكيم أم متهور؟',
    ],
  },

  macbeth: {
    titleAr: 'ماكبث',
    titleEn: 'Macbeth',
    author: 'William Shakespeare',
    summary: 'مأساة الطموح المفرط. ماكبث يقتل الملك دنكان طمعاً في العرش، فتطارده الذنوب حتى يدمر نفسه.',
    themes: [
      { ar: 'الطموح والفساد', en: 'Ambition and corruption', explanation: 'الطموح الأعمى يقود إلى الهلاك. ماكبث كان بطلاً نبيلاً لكن الطموح حوّله إلى طاغية قاتل.' },
      { ar: 'الذنب والضمير', en: 'Guilt and conscience', explanation: 'كيف يعذب الذنبُ ماكبث وزوجته. ماكبث يرى أشباحاً. الليدي ماكبث تغسل يديها دون توقف — الدم الخيالي لا يزول.' },
      { ar: 'الخير والشر', en: 'Good and evil', explanation: 'الصراع الأزلي داخل النفس البشرية. "جميل هو القبيح، وقبيح هو الجميل" — العالم ينقلب رأساً على عقب.' },
      { ar: 'القدر والإرادة', en: 'Fate and free will', explanation: 'هل قرر ماكبث مصيره أم كان محتوماً بنبوءات الساحرات؟ الساحرات أخبرته، لكنه هو من اختار القتل.' },
    ],
    characters: [
      { name: 'ماكبث (Macbeth)', description: 'بطل تحول إلى طاغية بسبب الطموح. في البداية متردد، ثم يصبح قاتلاً بلا رحمة. خطؤه المأساوي: الطموح المفرط.' },
      { name: 'الليدي ماكبث (Lady Macbeth)', description: 'أقوى من زوجها في البداية — هي من تدفعه للقتل. لكنها تنهار تحت وطأة الذنب في النهاية. مشهد غسل اليدين من أشهر مشاهد شكسبير.' },
      { name: 'الساحرات الثلاث (The Witches)', description: 'يمثلن القدر والغموض والشر. نبوءاتهن تحرك الأحداث لكنهن لا يجبرن ماكبث — يختار بنفسه.' },
    ],
    discussionQs: [
      'هل ماكبث شرير أم ضحية؟ ناقش.',
      'كيف تتغير العلاقة بين ماكبث وزوجته عبر المسرحية؟',
      'ما دور الساحرات — هل هن السبب الحقيقي للمأساة؟',
      'كيف يستخدم شكسبير صور الدم والظلام لبناء الجو المخيف؟',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// IGCSE PROSE — ARABIC EXPLANATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const IGCSE_PROSE_ARABIC = {
  greatExpectations: {
    titleAr: 'توقعات عظيمة',
    titleEn: 'Great Expectations',
    author: 'Charles Dickens',
    summary: 'رواية نشأة الصبي بيب في إنجلترا الفيكتورية. رحلة من الفقر إلى الثروة ثم إلى الفهم الحقيقي لمعنى الخير.',
    themes: [
      { ar: 'الطبقية الاجتماعية', en: 'Social class', explanation: 'كيف تحكم الطبقة المجتمعَ وتقيّد الأفراد. بيب يخجل من أصوله المتواضعة ويسعى للارتقاء — لكنه يكتشف أن الثروة لا تصنع الإنسان.' },
      { ar: 'الهوية الحقيقية', en: 'True identity', explanation: 'من أنت بعيداً عن ثروتك ومظهرك؟ بيب يقضي الرواية كلها يبحث عن هويته الحقيقية.' },
      { ar: 'الخير في الطبيعة البشرية', en: 'Goodness in human nature', explanation: 'ماغويتش المجرم يتحول إلى أكرم شخصية في الرواية. ديكنز يقول: لا تحكم على الناس من مظهرهم.' },
    ],
    characters: [
      { name: 'بيب (Pip)', description: 'الراوي والبطل. يتغير عبر الرواية من صبي بريء إلى شاب متكبر ثم إلى رجل ناضج يفهم الحياة.' },
      { name: 'الآنسة هافيشام (Miss Havisham)', description: 'رمز الجمود والانتقام. تعيش في فستان زفافها منذ عقود. تستخدم إستيلا لتنتقم من الرجال.' },
      { name: 'إستيلا (Estella)', description: 'جمال بلا قلب — ربّتها الآنسة هافيشام لتحطم قلوب الرجال. بيب يحبها رغم قسوتها.' },
      { name: 'ماغويتش (Magwitch)', description: 'المجرم الذي يتحول إلى مُحسِن بيب السري. يمثل فكرة أن الخير يأتي من أماكن غير متوقعة.' },
    ],
  },

  lifeOfPi: {
    titleAr: 'حياة باي',
    titleEn: 'Life of Pi',
    author: 'Yann Martel',
    summary: 'الصبي الهندي باي ينجو من غرق السفينة محاصراً في قارب نجاة مع نمر بنغالي اسمه ريتشارد باركر.',
    themes: [
      { ar: 'الإيمان والبقاء', en: 'Faith and survival', explanation: 'باي يتبع ثلاثة أديان (الإسلام والمسيحية والهندوسية) — إيمانه هو ما يبقيه حياً وسط المحيط.' },
      { ar: 'الحقيقة والقصة', en: 'Truth and storytelling', explanation: 'باي يروي قصتين مختلفتين لنفس الأحداث. أيهما الحقيقية؟ مارتل يسأل: هل نختار القصة التي نؤمن بها؟' },
      { ar: 'الطبيعة والإنسان', en: 'Nature and humanity', explanation: 'النمر يمثل الجانب الوحشي في الإنسان — الغريزة التي تبقينا أحياء.' },
    ],
  },

  purpleHibiscus: {
    titleAr: 'الكركديه البنفسجي',
    titleEn: 'Purple Hibiscus',
    author: 'Chimamanda Ngozi Adichie',
    summary: 'كامبيلي تعيش تحت سيطرة أبيها يوجين — رجل متدين لكنه عنيف. زيارتها لعمتها إيفيانوا تفتح عينيها على حياة أخرى.',
    themes: [
      { ar: 'الصمت والصوت', en: 'Silence and voice', explanation: 'كامبيلي صامتة في البداية — تخاف من أبيها. تدريجياً تجد صوتها. الكركديه البنفسجي يرمز إلى الحرية والتعبير.' },
      { ar: 'الدين والتطرف', en: 'Religion and extremism', explanation: 'يوجين يستخدم الدين لتبرير العنف. أديتشي تفرّق بين الإيمان الحقيقي والتطرف.' },
      { ar: 'ما بعد الاستعمار', en: 'Post-colonialism', explanation: 'نيجيريا بعد الاستقلال — الفساد السياسي والاضطراب. يوجين يفضل الثقافة الغربية على ثقافته الإيغبو.' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// IB WORLD LITERATURE — ARABIC EXPLANATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const IB_LITERATURE_ARABIC = {
  nineteenEightyFour: {
    titleAr: '١٩٨٤',
    titleEn: '1984',
    author: 'George Orwell',
    summary: 'رواية مستقبلية تصور دولة شمولية (أوشينيا) تراقب كل شيء وتتحكم في الفكر واللغة والتاريخ. وينستون سميث يحاول التمرد لكنه يُقمع.',
    themes: [
      { ar: 'السلطة والاستبداد', en: 'Power and totalitarianism', explanation: 'الحزب يسيطر على كل شيء — الحقيقة، التاريخ، اللغة، حتى المشاعر. "من يسيطر على الماضي يسيطر على المستقبل".' },
      { ar: 'الحرية والمراقبة', en: 'Freedom and surveillance', explanation: '"الأخ الأكبر يراقبك" — كاميرات في كل مكان. لا خصوصية ولا حرية تفكير.' },
      { ar: 'اللغة والفكر', en: 'Language and thought', explanation: 'نيوسبيك (اللغة الجديدة) صُممت لتقليص الكلمات — إذا لم تكن هناك كلمة للتمرد، لا يمكنك التفكير في التمرد.' },
    ],
    ibDiscussion: [
      'كيف يستخدم أورويل اللغة أداةً للسيطرة؟ (سؤال IO ممتاز)',
      'ما العلاقة بين الذاكرة والهوية في الرواية؟',
      'هل يمكن أن يحدث ما يصفه أورويل في عالمنا اليوم؟ (سؤال عن القضايا العالمية)',
    ],
  },

  thingsFallApart: {
    titleAr: 'الأشياء تتداعى',
    titleEn: 'Things Fall Apart',
    author: 'Chinua Achebe',
    summary: 'أوكونكوو محارب قوي في مجتمع الإيغبو بنيجيريا. حياته تنهار مع وصول المستعمرين البريطانيين والمبشرين المسيحيين.',
    themes: [
      { ar: 'الاستعمار وتدمير الهوية', en: 'Colonialism', explanation: 'المستعمرون لا يدمرون الأرض فحسب بل يدمرون الثقافة والهوية. أتشيبي يكتب الرواية رداً على الصورة النمطية لأفريقيا في الأدب الغربي.' },
      { ar: 'الذكورة والمجتمع', en: 'Masculinity', explanation: 'أوكونكوو يخاف من أن يُعتبر ضعيفاً مثل أبيه. خوفه من الضعف يقوده إلى العنف والقسوة.' },
      { ar: 'البطل المأساوي', en: 'Tragic hero', explanation: 'أوكونكوو رجل عظيم لكن عيبه — كبرياءه وعناده — يدمره. تعريف أرسطو الكلاسيكي للبطل المأساوي.' },
    ],
  },

  gatsby: {
    titleAr: 'غاتسبي العظيم',
    titleEn: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    summary: 'غاتسبي الثري يحاول استعادة حبه القديم دايزي في أمريكا العشرينيات. الرواية تكشف فراغ الحلم الأمريكي.',
    themes: [
      { ar: 'الحلم الأمريكي', en: 'The American Dream', explanation: 'غاتسبي يعتقد أن المال يمكن أن يشتري السعادة والحب. فيتزجيرالد يقول: الحلم الأمريكي وهم جميل لكنه فارغ.' },
      { ar: 'الثروة والفراغ الروحي', en: 'Wealth and emptiness', explanation: 'الأثرياء في الرواية تعساء رغم ثرواتهم. الحفلات الباذخة تخفي وحدة غاتسبي.' },
      { ar: 'الماضي والحاضر', en: 'Past and present', explanation: '"لا يمكنك تكرار الماضي؟ بالطبع يمكنك!" — غاتسبي يرفض قبول أن الزمن قد مضى.' },
    ],
  },

  handmaidsTale: {
    titleAr: 'حكاية الخادمة',
    titleEn: 'The Handmaid\'s Tale',
    author: 'Margaret Atwood',
    summary: 'في جمهورية جلعاد المستقبلية، تُستعبد النساء. أوفريد "خادمة" مهمتها الإنجاب فقط. تروي قصتها بين الخضوع والمقاومة الصامتة.',
    themes: [
      { ar: 'المرأة والسلطة', en: 'Women and power', explanation: 'النساء مُصنّفات: خادمات (للإنجاب)، زوجات (للمكانة)، مارثات (للخدمة). لا امرأة تملك حريتها.' },
      { ar: 'الجسد والسيطرة', en: 'Body and control', explanation: 'الدولة تتحكم في أجساد النساء. الحمل واجب وليس اختياراً. أتوود تحذر: السيطرة على الجسد هي أقصى أشكال الاستبداد.' },
      { ar: 'المقاومة والصمود', en: 'Resistance', explanation: 'أوفريد تقاوم بالذاكرة — تتذكر اسمها الحقيقي وحياتها السابقة. الكتابة نفسها شكل من أشكال المقاومة.' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ESSAY WRITING — ARABIC GUIDANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const ESSAY_GUIDANCE_ARABIC = {
  introduction: {
    ar: 'مقدمة الإجابة',
    instruction: 'ابدأ بإجابة مباشرة على السؤال، ثم اذكر النص واسم المؤلف، ثم اعرض الأفكار الرئيسية التي ستناقشها. لا تكتب مقدمة طويلة — المصحح يريد أن يرى إجابتك فوراً.',
  },
  paragraphStructure: {
    ar: 'بناء الفقرة — طريقة PEA',
    instruction: 'كل فقرة تتبع هذا النمط: النقطة (Point) — اذكر فكرتك الرئيسية. الدليل (Evidence) — اقتبس من النص مباشرة. التحليل (Analysis) — اشرح كيف يدعم الاقتباس فكرتك وكيف يستخدم الكاتب اللغة لخلق المعنى.',
  },
  literaryTerms: [
    { ar: 'الاستعارة', en: 'metaphor', explanation: 'مقارنة مباشرة بدون "مثل" أو "كـ"' },
    { ar: 'التشبيه', en: 'simile', explanation: 'مقارنة باستخدام "مثل" أو "كـ"' },
    { ar: 'الرمز', en: 'symbol', explanation: 'شيء يمثل فكرة أكبر منه' },
    { ar: 'التناقض', en: 'paradox', explanation: 'عبارة تبدو متناقضة لكنها تحمل حقيقة عميقة' },
    { ar: 'التشخيص', en: 'personification', explanation: 'إعطاء صفات إنسانية لأشياء غير إنسانية' },
    { ar: 'السرد', en: 'narrative', explanation: 'أسلوب رواية القصة' },
    { ar: 'الراوي', en: 'narrator', explanation: 'من يروي القصة — قد يكون شخصية أو صوتاً خارجياً' },
    { ar: 'الحبكة', en: 'plot', explanation: 'تسلسل الأحداث في القصة' },
    { ar: 'التنبؤ', en: 'foreshadowing', explanation: 'تلميحات مبكرة لأحداث ستقع لاحقاً' },
    { ar: 'المفارقة', en: 'irony', explanation: 'عندما يكون المعنى عكس ما يُقال أو يُتوقع' },
  ],
  examinerExpectations: {
    ao1: 'AO1 — فهم النص: أظهر أنك قرأت النص وفهمته. استخدم اقتباسات دقيقة.',
    ao2: 'AO2 — تحليل اللغة: لا تقل "الكاتب يستخدم استعارة" فقط — اشرح لماذا هذه الاستعارة بالذات وما تأثيرها.',
    ao3: 'AO3 — السياق: متى كُتب النص؟ ما الظروف التاريخية والاجتماعية التي أثرت على الكاتب؟',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ARABIC_SET_TEXT_KNOWLEDGE = {
  shakespeare: SHAKESPEARE_ARABIC,
  igcseProse: IGCSE_PROSE_ARABIC,
  ibLiterature: IB_LITERATURE_ARABIC,
  essayGuidance: ESSAY_GUIDANCE_ARABIC,
};

/**
 * Check if an Arabic-speaking student is asking about English Literature
 */
export function isArabicLiteratureRequest(message) {
  if (!message) return false;
  const hasArabic = /[\u0600-\u06FF]/.test(message);
  if (!hasArabic) return false;
  const lower = message.toLowerCase();
  const textTriggers = [
    'othello', 'macbeth', 'romeo', 'juliet', 'midsummer', 'hamlet', 'lear',
    'great expectations', 'pip', 'life of pi', 'purple hibiscus', 'rebecca', 'kite runner',
    '1984', 'things fall apart', 'gatsby', 'handmaid', 'mockingbird',
    'shakespeare', 'dickens', 'orwell', 'achebe', 'atwood', 'fitzgerald',
    'igcse literature', 'ib english', 'english literature',
    'عطيل', 'ماكبث', 'روميو', 'غاتسبي', 'شكسبير',
  ];
  return textTriggers.some(t => lower.includes(t));
}

/**
 * Get Arabic literature support prompt for Starky.
 */
export function getLiteratureArabicPrompt(message) {
  let prompt = `\nARABIC LITERATURE SUPPORT — Arab student asking about English Literature set texts.\n`;
  prompt += `\nRULES: Respond in Modern Standard Arabic (فصحى). Explain themes, characters, plot, literary devices clearly in Arabic. Help with essay structure in Arabic. Do NOT translate full passages (copyright). DO explain what passages mean and their significance.`;
  prompt += `\nEssay structure: ${ESSAY_GUIDANCE_ARABIC.introduction.instruction}`;
  prompt += `\nParagraph method: ${ESSAY_GUIDANCE_ARABIC.paragraphStructure.instruction}`;
  prompt += `\nExaminer wants: ${ESSAY_GUIDANCE_ARABIC.examinerExpectations.ao1} ${ESSAY_GUIDANCE_ARABIC.examinerExpectations.ao2} ${ESSAY_GUIDANCE_ARABIC.examinerExpectations.ao3}`;

  // Find matching text
  const lower = (message || '').toLowerCase();
  const allTexts = [
    ...Object.values(SHAKESPEARE_ARABIC),
    ...Object.values(IGCSE_PROSE_ARABIC),
    ...Object.values(IB_LITERATURE_ARABIC),
  ];
  for (const text of allTexts) {
    if (lower.includes(text.titleEn.toLowerCase()) || lower.includes(text.titleAr)) {
      prompt += `\n\nالنص المطلوب: ${text.titleAr} (${text.titleEn}) — ${text.author}`;
      prompt += `\nالملخص: ${text.summary}`;
      if (text.themes) {
        prompt += `\nالموضوعات:`;
        text.themes.forEach(t => { prompt += `\n- ${t.ar} (${t.en}): ${t.explanation.split('.')[0]}.`; });
      }
      if (text.characters) {
        prompt += `\nالشخصيات:`;
        text.characters.slice(0, 3).forEach(c => { prompt += `\n- ${c.name}: ${c.description.split('.')[0]}.`; });
      }
      if (text.discussionQs) {
        prompt += `\nأسئلة للنقاش: ${text.discussionQs[0]}`;
      }
      break;
    }
  }

  prompt += `\n\nالمصطلحات الأدبية: ${ESSAY_GUIDANCE_ARABIC.literaryTerms.slice(0, 5).map(t => `${t.ar} = ${t.en}`).join('، ')}`;

  return prompt;
}
