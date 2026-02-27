export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: string;
  date: string;
  readTime: number;
  image: string;
  featured: boolean;
  tags: string[];
  level: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
}

export const categories: Category[] = [
  {
    slug: "climate-weather",
    name: "Climate & Weather",
    description:
      "Understand the forces that drive our atmosphere — from daily weather patterns to long-term climate change.",
    icon: "🌦️",
    color: "bg-sky-500",
    articleCount: 3,
  },
  {
    slug: "oceans-marine",
    name: "Oceans & Marine Life",
    description:
      "Dive into the world beneath the waves — coral reefs, deep sea ecosystems, and ocean conservation.",
    icon: "🌊",
    color: "bg-blue-500",
    articleCount: 3,
  },
  {
    slug: "forests-biodiversity",
    name: "Forests & Biodiversity",
    description:
      "Explore the lungs of our planet — rainforests, ecosystems, and the web of life that sustains us all.",
    icon: "🌿",
    color: "bg-emerald-500",
    articleCount: 3,
  },
  {
    slug: "earth-science",
    name: "Earth Science & Geology",
    description:
      "Journey to the core of our planet — volcanoes, tectonic plates, rocks, and the forces shaping Earth.",
    icon: "🌋",
    color: "bg-orange-500",
    articleCount: 3,
  },
  {
    slug: "wildlife-conservation",
    name: "Wildlife & Conservation",
    description:
      "Meet the incredible species we share this planet with and learn how to protect them.",
    icon: "🐾",
    color: "bg-amber-500",
    articleCount: 3,
  },
  {
    slug: "sustainability",
    name: "Sustainability & Green Living",
    description:
      "Discover how we can live in harmony with our planet — renewable energy, recycling, and sustainable futures.",
    icon: "♻️",
    color: "bg-teal-500",
    articleCount: 3,
  },
];

export const articles: Article[] = [
  // ──────────────────────────────────────────────
  // CLIMATE & WEATHER
  // ──────────────────────────────────────────────
  {
    slug: "understanding-climate-change",
    title: "Understanding Climate Change: The Science Behind a Warming World",
    excerpt:
      "What exactly is climate change, what causes it, and why does every fraction of a degree matter? A clear, evidence-based guide for students.",
    content: `
## What Is Climate Change?

Climate change refers to significant, long-term shifts in global temperatures and weather patterns. While climate has changed naturally throughout Earth's history, the current rapid warming is driven overwhelmingly by human activities.

## The Greenhouse Effect

Earth's atmosphere works like a blanket. Certain gases — called **greenhouse gases** — trap heat from the sun and keep our planet warm enough to support life. Without them, Earth's average temperature would be about -18°C instead of the comfortable 15°C we enjoy.

The main greenhouse gases are:
- **Carbon dioxide (CO₂)** — from burning fossil fuels, deforestation
- **Methane (CH₄)** — from livestock, rice paddies, landfills
- **Nitrous oxide (N₂O)** — from fertilisers and industrial processes
- **Water vapour** — increases as temperatures rise

## The Problem: Too Much of a Good Thing

Since the Industrial Revolution (around 1750), humans have released enormous quantities of greenhouse gases by:
- Burning coal, oil, and natural gas for energy
- Clearing forests that absorb CO₂
- Industrial agriculture and livestock farming
- Manufacturing cement and steel

Atmospheric CO₂ has risen from about **280 parts per million (ppm)** in 1750 to over **420 ppm** today — a level not seen in at least 800,000 years.

## The Evidence

### Temperature Records
- Global average temperature has risen by approximately **1.1°C** since pre-industrial times
- The 10 warmest years on record have all occurred since 2010
- Arctic regions are warming 2-3 times faster than the global average

### Ice and Sea Level
- Arctic sea ice has declined by about **13% per decade** since 1979
- The Greenland and Antarctic ice sheets are losing mass
- Global sea level has risen about **20 cm** since 1900 and is accelerating

### Extreme Weather
- More frequent and intense heatwaves
- Heavier rainfall events and flooding
- More severe droughts in some regions
- Stronger tropical cyclones

## Why Every Fraction of a Degree Matters

The Paris Agreement aims to limit warming to **1.5°C** above pre-industrial levels. The difference between 1.5°C and 2°C of warming may sound small, but the impacts are dramatic:

- At 1.5°C: 70-90% of coral reefs die. At 2°C: 99% die
- At 1.5°C: Sea level rises 0.4m by 2100. At 2°C: 0.46m — affecting 10 million more people
- At 2°C: Twice as many people face water scarcity compared to 1.5°C

## What Can Be Done?

### Mitigation (Reducing Emissions)
- Transition to renewable energy (solar, wind, hydroelectric)
- Improve energy efficiency in buildings and transport
- Protect and restore forests
- Shift to sustainable agriculture

### Adaptation (Preparing for Change)
- Build flood defences and resilient infrastructure
- Develop drought-resistant crops
- Create early warning systems for extreme weather
- Protect vulnerable communities

## Summary

Climate change is the defining challenge of our generation. The science is clear: human activities are warming the planet at an unprecedented rate. But the science also shows us the solutions. Every action matters, every fraction of a degree matters, and every voice matters.
    `,
    category: "Climate & Weather",
    categorySlug: "climate-weather",
    author: "Dr. Amara Perera",
    date: "2026-02-25",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80",
    featured: true,
    tags: ["climate change", "greenhouse effect", "global warming", "O/L"],
    level: "O/L",
  },
  {
    slug: "how-weather-works",
    title: "How Weather Works: Understanding the Atmosphere Around Us",
    excerpt:
      "From thunderstorms to gentle breezes — learn how the sun, air, and water create the weather we experience every day.",
    content: `
## What Is Weather?

Weather is the state of the atmosphere at a particular place and time. It includes temperature, humidity, precipitation, wind, cloud cover, and air pressure. Unlike climate (which is the average over decades), weather changes hour by hour.

## The Sun: Earth's Weather Engine

Almost all weather is powered by the **sun**. The sun heats Earth's surface unevenly because:
- The equator receives more direct sunlight than the poles
- Land heats and cools faster than water
- Mountains, forests, and cities absorb heat differently

This uneven heating creates **temperature differences**, which drive air movement — and air movement is what creates weather.

## Air Pressure and Wind

### What Is Air Pressure?
Air has weight. The column of air above you presses down with a force called **atmospheric pressure**. At sea level, this is about **1013 millibars (mb)**.

### High and Low Pressure
- **High pressure (anticyclone)**: Air sinks, compresses, and warms → clear skies, calm weather
- **Low pressure (depression)**: Air rises, expands, and cools → clouds, rain, storms

### Wind
Wind is air moving from high pressure to low pressure. The greater the difference, the stronger the wind.

## The Water Cycle and Precipitation

### The Water Cycle
1. **Evaporation**: Sun heats water in oceans, lakes, and rivers → water vapour rises
2. **Condensation**: Water vapour cools as it rises → forms tiny droplets → clouds
3. **Precipitation**: Droplets combine and grow heavy → fall as rain, snow, sleet, or hail
4. **Collection**: Water flows back to oceans via rivers and groundwater → cycle repeats

### Types of Rainfall
- **Convectional**: Hot ground heats air → air rises rapidly → heavy, often thundery (common in tropics)
- **Relief (orographic)**: Moist air forced over mountains → cools and rains on windward side
- **Frontal**: Warm air meets cold air → warm air rises over cold → widespread, steady rain

## Clouds

Clouds tell us about coming weather:
- **Cumulus** (fluffy, white): Fair weather, but can grow into storm clouds
- **Stratus** (flat, grey sheets): Overcast skies, light drizzle
- **Cirrus** (wispy, high): Fair weather now, but may signal approaching front
- **Cumulonimbus** (towering): Thunderstorms, heavy rain, possible hail

## Severe Weather

### Thunderstorms
Formed when warm, moist air rises rapidly. Lightning occurs when electrical charges build up in clouds. Thunder is the sound of air expanding from the heat of lightning.

### Tropical Cyclones (Hurricanes/Typhoons)
- Form over warm ocean water (above 26.5°C)
- Powered by evaporation and condensation
- Can bring winds over 250 km/h and devastating storm surges

### Tornadoes
- Violent rotating columns of air
- Form in severe thunderstorms
- Can have wind speeds over 400 km/h

## Weather Forecasting

Modern weather forecasting uses:
- **Weather stations** measuring temperature, pressure, humidity, and wind
- **Weather balloons** sampling the upper atmosphere
- **Satellites** providing images of cloud patterns from space
- **Radar** detecting precipitation
- **Supercomputers** running complex atmospheric models

## Summary

Weather is the daily drama of our atmosphere, powered by the sun and shaped by air, water, and geography. Understanding how weather works helps us prepare for storms, appreciate clear skies, and grasp the bigger picture of our changing climate.
    `,
    category: "Climate & Weather",
    categorySlug: "climate-weather",
    author: "Ms. Fathima Rizvi",
    date: "2026-02-18",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80",
    featured: false,
    tags: ["weather", "atmosphere", "water cycle", "Grade 7-9"],
    level: "Grade 7-9",
  },
  {
    slug: "el-nino-la-nina",
    title: "El Niño and La Niña: The Ocean-Atmosphere Dance That Shapes Global Weather",
    excerpt:
      "These two climate phenomena in the Pacific Ocean affect weather patterns worldwide — from droughts in Australia to floods in South America.",
    content: `
## Introduction

Every few years, the tropical Pacific Ocean undergoes dramatic temperature swings that ripple across the entire planet, altering weather patterns for billions of people. These swings are called **El Niño** and **La Niña**, and together they form the **El Niño-Southern Oscillation (ENSO)**.

## Normal Conditions

Under normal conditions in the tropical Pacific:
- **Trade winds** blow from east to west along the equator
- These winds push warm surface water toward **Australia and Southeast Asia**
- Cold, nutrient-rich water **upwells** along the coast of South America
- This upwelling supports rich fisheries off Peru and Ecuador

## El Niño ("The Boy")

During El Niño:
- Trade winds **weaken** or even reverse
- Warm water spreads **eastward** across the Pacific
- Upwelling off South America **weakens**, harming fisheries
- The name comes from South American fishermen who noticed warm water appearing around Christmas ("El Niño" means "The Christ Child")

### Global Effects of El Niño:
- **South America**: Heavy rainfall and flooding along the Pacific coast
- **Australia & Southeast Asia**: Drought, bushfires, crop failures
- **India**: Weaker monsoon, reduced rainfall
- **East Africa**: Increased rainfall and flooding
- **North America**: Warmer winters in Canada, wetter conditions in southern USA
- **Global**: Temporarily higher global average temperatures

## La Niña ("The Girl")

La Niña is essentially the opposite:
- Trade winds become **stronger** than normal
- More warm water is pushed toward the western Pacific
- **Stronger upwelling** of cold water off South America
- Often follows an El Niño event

### Global Effects of La Niña:
- **Australia**: Above-average rainfall, flooding
- **Southeast Asia**: Heavier monsoons
- **South America (Pacific coast)**: Cooler and drier conditions
- **North America**: Colder winters in northern states, more Atlantic hurricanes
- **East Africa**: Drought
- **Global**: Slightly lower global average temperatures

## How Often Do They Occur?

- El Niño events occur every **2-7 years**
- They typically last **9-12 months**
- La Niña often (but not always) follows El Niño
- Some events are mild, others extreme

### Notable Events:
- **1997-98 El Niño**: One of the strongest on record — caused $35 billion in damage worldwide
- **2015-16 El Niño**: Contributed to record global temperatures
- **2010-11 La Niña**: Caused severe flooding in Australia and Pakistan

## Monitoring ENSO

Scientists monitor ENSO using:
- **Sea surface temperature** measurements across the Pacific
- **Ocean buoys** (the TAO/TRITON array)
- **Satellites** measuring ocean height and temperature
- **Atmospheric pressure** differences between Tahiti and Darwin (the Southern Oscillation Index)

## ENSO and Climate Change

A critical question: How will climate change affect El Niño and La Niña?

Research suggests:
- **Extreme** El Niño events may become **more frequent**
- The impacts of both phases may intensify
- Sea surface temperatures are already higher, giving El Niño a "warmer starting point"
- This remains an active area of scientific research

## Why It Matters

ENSO affects:
- **Agriculture**: Crop yields across multiple continents
- **Water resources**: Drought and flood patterns
- **Health**: Disease outbreaks linked to flooding and temperature changes
- **Economies**: Billions of dollars in damage during extreme events
- **Ecosystems**: Coral bleaching, fishery collapses, wildlife disruption

## Summary

El Niño and La Niña demonstrate the remarkable interconnection between the ocean and atmosphere. A change in Pacific water temperature can alter weather patterns for people on the other side of the planet. Understanding ENSO helps us prepare for its impacts and appreciate how deeply connected our global climate system truly is.
    `,
    category: "Climate & Weather",
    categorySlug: "climate-weather",
    author: "Dr. Amara Perera",
    date: "2026-02-05",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    featured: false,
    tags: ["ENSO", "El Niño", "La Niña", "Pacific Ocean", "A/L"],
    level: "A/L",
  },

  // ──────────────────────────────────────────────
  // OCEANS & MARINE LIFE
  // ──────────────────────────────────────────────
  {
    slug: "coral-reefs-rainforests-of-the-sea",
    title: "Coral Reefs: The Rainforests of the Sea",
    excerpt:
      "Covering less than 1% of the ocean floor, coral reefs support 25% of all marine species. Discover these extraordinary ecosystems and why they're in danger.",
    content: `
## What Are Coral Reefs?

Coral reefs are massive underwater structures built by tiny animals called **coral polyps**. Each polyp is only a few millimetres across, but over thousands of years, colonies of polyps build reefs that can stretch for thousands of kilometres.

## How Corals Build Reefs

Coral polyps are related to jellyfish and sea anemones. They:
1. Extract **calcium carbonate** from seawater
2. Build hard, cup-like **limestone skeletons** around themselves
3. Live in colonies of thousands to millions of individuals
4. When polyps die, their skeletons remain, and new polyps build on top
5. Over centuries, this process creates massive reef structures

## The Secret Partnership

Most reef-building corals have a remarkable partnership with tiny algae called **zooxanthellae** that live inside their tissues:
- The algae **photosynthesise**, producing food and oxygen
- The coral provides the algae with **shelter and nutrients**
- This relationship gives corals their beautiful colours
- Up to **90%** of a coral's energy comes from these algae

## Types of Coral Reefs

### Fringing Reefs
- Grow directly from the shoreline
- Most common type of reef
- Example: Reefs along the coasts of the Maldives and Indonesia

### Barrier Reefs
- Separated from shore by a deep lagoon
- Example: The **Great Barrier Reef** (Australia) — 2,300 km long, visible from space

### Atolls
- Ring-shaped reefs surrounding a lagoon
- Form when volcanic islands sink below the surface
- Example: Maldives, Marshall Islands

## Why Coral Reefs Matter

### Biodiversity
- Support **25% of all marine species** despite covering less than 1% of the ocean floor
- Home to over 4,000 species of fish, 800 species of coral, and countless invertebrates

### Coastal Protection
- Break wave energy, reducing coastal erosion and flood damage
- Estimated to provide **$9 billion per year** in flood protection globally

### Food Security
- Support fisheries that feed **500 million people** worldwide
- Provide protein for many tropical coastal communities

### Economy
- Reef tourism generates **$36 billion per year** globally
- Support livelihoods for millions

### Medicine
- Compounds from reef organisms are used in treatments for cancer, HIV, and pain
- Coral skeleton structure is used in bone graft surgery

## Threats to Coral Reefs

### Coral Bleaching
When water temperatures rise just **1-2°C above normal** for several weeks:
- Corals become stressed and expel their zooxanthellae
- Without algae, corals turn white (**bleaching**)
- If temperatures don't return to normal, corals starve and die
- Mass bleaching events in 2016, 2017, and 2020 devastated reefs worldwide

### Ocean Acidification
- Oceans absorb about **30% of human CO₂ emissions**
- CO₂ dissolves in seawater, forming **carbonic acid**
- More acidic water makes it harder for corals to build skeletons
- Ocean pH has dropped by 0.1 since pre-industrial times (a 30% increase in acidity)

### Other Threats
- **Overfishing**: Disrupts reef ecosystems
- **Pollution**: Plastic, sewage, and agricultural runoff smother and poison corals
- **Destructive fishing**: Dynamite and cyanide fishing destroy reef structures
- **Coastal development**: Dredging and construction damage nearby reefs

## Conservation Efforts

- **Marine Protected Areas (MPAs)**: Restricting human activity in critical reef zones
- **Coral restoration**: Growing corals in nurseries and transplanting them
- **Reducing emissions**: The most important long-term action
- **Sustainable fishing**: Protecting herbivorous fish that keep reefs clean
- **Reef-safe sunscreen**: Avoiding chemicals toxic to corals

## Summary

Coral reefs are among the most valuable and biodiverse ecosystems on Earth. They protect our coasts, feed hundreds of millions, and harbour a quarter of all marine life. Yet they face an existential crisis from warming seas and ocean acidification. Protecting coral reefs isn't just an environmental issue — it's a matter of human survival.
    `,
    category: "Oceans & Marine Life",
    categorySlug: "oceans-marine",
    author: "Dr. Kasun Wickramasinghe",
    date: "2026-02-22",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80",
    featured: true,
    tags: ["coral reefs", "marine biodiversity", "ocean conservation", "O/L"],
    level: "O/L",
  },
  {
    slug: "deep-ocean-mysteries",
    title: "Mysteries of the Deep Ocean: Earth's Last Frontier",
    excerpt:
      "We've mapped more of Mars than our own ocean floor. Journey into the abyssal depths where bizarre creatures thrive in total darkness.",
    content: `
## The Unknown Depths

The ocean covers **71% of Earth's surface** and has an average depth of about **3,688 metres**. Yet we have explored less than **20%** of it. The deep ocean — below 200 metres where sunlight cannot reach — remains Earth's greatest unexplored frontier.

## Ocean Zones

### Sunlight Zone (Epipelagic): 0-200m
- Where sunlight penetrates
- Home to most familiar marine life
- Phytoplankton here produce 50% of Earth's oxygen

### Twilight Zone (Mesopelagic): 200-1,000m
- Dim light that fades to darkness
- Many creatures here have bioluminescence
- Home to the largest animal migration on Earth (the daily vertical migration)

### Midnight Zone (Bathypelagic): 1,000-4,000m
- Complete darkness
- Near-freezing temperatures (2-4°C)
- Enormous pressure (100-400 times surface pressure)
- Creatures rely on "marine snow" — falling organic particles from above

### Abyssal Zone (Abyssopelagic): 4,000-6,000m
- Vast, flat abyssal plains
- Sparse life, extreme conditions
- Temperature barely above freezing

### Hadal Zone (Hadopelagic): 6,000-11,000m
- Ocean trenches — the deepest places on Earth
- **Mariana Trench**: 10,994m deep (deeper than Everest is tall)
- Life still exists here, including amphipods and microorganisms

## Remarkable Deep-Sea Creatures

### Anglerfish
- Uses a bioluminescent lure to attract prey in total darkness
- Females are much larger than males
- Males permanently fuse to females for reproduction

### Giant Squid
- Can grow up to **13 metres** long
- Largest eyes in the animal kingdom (up to 27 cm diameter)
- Was only filmed alive in its natural habitat in 2012

### Vampire Squid
- Not actually a squid or an octopus — it's in its own order
- Turns "inside out" to avoid predators
- Feeds on marine snow, not blood

### Tube Worms
- Live near hydrothermal vents
- Can grow to **2 metres** long
- Have no mouth, stomach, or eyes
- Bacteria inside them convert chemicals into energy

## Hydrothermal Vents: Oases of the Deep

In 1977, scientists discovered something extraordinary on the ocean floor near the Galápagos Islands: **hydrothermal vents** — cracks in the seafloor where superheated, mineral-rich water erupts at temperatures up to **400°C**.

### Life Without Sunlight
Vent communities are powered not by photosynthesis but by **chemosynthesis**:
- Bacteria convert hydrogen sulfide and other chemicals into energy
- These bacteria form the base of the food chain
- Supports dense communities: tube worms, giant clams, shrimp, crabs

This discovery revolutionised biology — proving life doesn't require sunlight.

## Why the Deep Ocean Matters

### Climate Regulation
- Deep ocean currents distribute heat around the planet
- The ocean absorbs about **90% of excess heat** from climate change
- Deep water stores vast amounts of carbon

### Biodiversity
- Millions of species likely remain undiscovered
- Deep-sea organisms produce unique chemicals with potential medical applications

### Resources
- Deep-sea mining for metals and minerals is now being considered
- This raises serious environmental concerns about destroying ecosystems we barely understand

## Threats to the Deep Ocean

- **Climate change**: Warming waters, deoxygenation, acidification
- **Deep-sea mining**: Potential destruction of vent and seabed communities
- **Plastic pollution**: Microplastics found even in the Mariana Trench
- **Bottom trawling**: Fishing nets that scrape the ocean floor

## Summary

The deep ocean is a world of perpetual darkness, crushing pressure, and extraordinary life. From bioluminescent predators to ecosystems powered by Earth's internal heat, the deep sea challenges everything we thought we knew about life. As we begin to explore and exploit these depths, we must ensure we don't destroy this frontier before we even understand it.
    `,
    category: "Oceans & Marine Life",
    categorySlug: "oceans-marine",
    author: "Dr. Kasun Wickramasinghe",
    date: "2026-02-10",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80",
    featured: false,
    tags: ["deep ocean", "marine life", "hydrothermal vents", "Grade 9-11"],
    level: "Grade 9-11",
  },
  {
    slug: "ocean-plastic-crisis",
    title: "The Ocean Plastic Crisis: 8 Million Tonnes a Year",
    excerpt:
      "Every minute, a garbage truck's worth of plastic enters the ocean. Explore the scale of the crisis and what we can do about it.",
    content: `
## The Scale of the Problem

Every year, approximately **8 million tonnes** of plastic waste enters the oceans. That's equivalent to dumping a garbage truck of plastic into the sea every single minute. If current trends continue, by 2050 there could be **more plastic than fish** (by weight) in the ocean.

## Where Does It Come From?

### Land-Based Sources (80%)
- **Inadequate waste management**: Especially in countries with limited infrastructure
- **Rivers**: 10 rivers carry 90% of river-borne plastic to the sea
- **Stormwater runoff**: Carries litter from streets to waterways
- **Coastal littering**: Beaches, harbours, and coastal communities

### Ocean-Based Sources (20%)
- **Fishing industry**: Lost or abandoned nets, lines, and traps ("ghost gear")
- **Shipping**: Cargo loss and waste dumping
- **Offshore industries**: Oil rigs and marine installations

## Types of Ocean Plastic

### Macroplastics
Visible plastic items:
- Bottles, bags, packaging
- Fishing nets and gear
- Cigarette filters (the most common beach litter worldwide)
- Food wrappers

### Microplastics (< 5mm)
Tiny fragments that are everywhere:
- Broken-down larger plastics
- Microbeads from cosmetics and cleaning products
- Fibres from synthetic clothing (released during washing)
- Pre-production plastic pellets ("nurdles")

### Nanoplastics (< 1 micrometre)
- So small they can enter cells
- Emerging research area
- Found in human blood and organs

## The Great Pacific Garbage Patch

The most famous accumulation of ocean plastic is the **Great Pacific Garbage Patch**, located between Hawaii and California:
- Covers an area roughly **3 times the size of France**
- Contains an estimated **80,000 tonnes** of plastic
- Not a solid island — mostly a "soup" of microplastics
- Created by circular ocean currents (gyres) that trap floating debris

There are actually **5 major garbage patches** in the world's oceans, one in each major gyre.

## Impact on Marine Life

### Entanglement
- Over **100,000 marine mammals** die from entanglement each year
- Seals, turtles, whales, and seabirds get trapped in nets and plastic rings
- Ghost fishing nets continue killing for decades

### Ingestion
- **90% of seabirds** have plastic in their stomachs
- Sea turtles mistake plastic bags for jellyfish
- Whales have been found dead with stomachs full of plastic
- Microplastics are now found in virtually every marine species studied

### Chemical Contamination
- Plastics absorb toxic chemicals from seawater
- These chemicals concentrate as they move up the food chain
- Eventually reach humans through seafood consumption

## Impact on Humans

- **Seafood contamination**: We eat an estimated credit card's worth of microplastic per week
- **Economic costs**: Ocean plastic costs $13 billion per year in damage to marine ecosystems, tourism, and fisheries
- **Health concerns**: Research into microplastic health effects is ongoing

## Solutions

### Reduce
- Ban single-use plastics (bags, straws, cutlery)
- Design products with less packaging
- Choose reusable alternatives

### Improve Waste Management
- Invest in collection and recycling infrastructure
- Prevent plastic from reaching waterways
- Extended Producer Responsibility (make manufacturers pay for waste)

### Clean Up
- Beach and river clean-up programmes
- Technologies like The Ocean Cleanup project
- Ghost gear retrieval programmes

### Innovate
- Develop truly biodegradable alternatives
- Chemical recycling to break plastic back into raw materials
- Edible packaging and water-soluble materials

## What You Can Do

1. **Refuse** single-use plastic when possible
2. **Reduce** your plastic consumption
3. **Reuse** bags, bottles, and containers
4. **Recycle** correctly (check local guidelines)
5. **Join** beach clean-ups in your community
6. **Speak up** — support policies that reduce plastic pollution

## Summary

Ocean plastic is one of the most visible environmental crises of our time. It kills marine life, contaminates our food, and is found in the most remote corners of the planet. But it's a problem with solutions — and it starts with each of us making better choices about how we use and dispose of plastic.
    `,
    category: "Oceans & Marine Life",
    categorySlug: "oceans-marine",
    author: "Ms. Fathima Rizvi",
    date: "2026-01-28",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80",
    featured: false,
    tags: ["plastic pollution", "ocean conservation", "marine life", "All Levels"],
    level: "All Levels",
  },

  // ──────────────────────────────────────────────
  // FORESTS & BIODIVERSITY
  // ──────────────────────────────────────────────
  {
    slug: "amazon-rainforest",
    title: "The Amazon Rainforest: Earth's Green Heart",
    excerpt:
      "The Amazon is home to 10% of all species on Earth, produces vast amounts of oxygen, and regulates global climate. But it's under threat like never before.",
    content: `
## The Amazon by Numbers

The Amazon Rainforest is staggering in scale:
- **5.5 million km²** — larger than the entire European Union
- Spans **9 countries** (Brazil holds 60%)
- Contains **390 billion trees** from 16,000 species
- Home to **10% of all species on Earth**
- The Amazon River discharges **20% of all freshwater** entering the oceans

## Why the Amazon Matters

### The "Lungs of the Earth"
- Amazon trees absorb massive amounts of CO₂ and release oxygen
- The forest stores an estimated **150-200 billion tonnes of carbon**
- If released, this carbon would catastrophically accelerate climate change

### Water Cycle Engine
- Amazon trees release water vapour through **transpiration**
- A single large tree can release **1,000 litres of water** per day
- This creates "flying rivers" — atmospheric moisture that brings rainfall to distant regions
- The Amazon influences rainfall patterns across South America and beyond

### Biodiversity Hotspot
- **40,000+** plant species
- **1,300** bird species
- **3,000** freshwater fish species
- **400+** mammal species
- **2.5 million** insect species
- New species are still being discovered regularly

## Layers of the Rainforest

### Emergent Layer (above 45m)
- Tallest trees that tower above the canopy
- Home to eagles, butterflies, and bats
- Exposed to strong winds and intense sunlight

### Canopy Layer (25-45m)
- Dense, continuous "roof" of leaves
- Blocks 98% of sunlight from reaching the forest floor
- The richest layer for biodiversity

### Understorey (5-25m)
- Smaller trees and shrubs adapted to low light
- Frogs, snakes, and large insects
- Hot, still, and humid

### Forest Floor (0-5m)
- Receives less than 2% of sunlight
- Decomposition happens rapidly in the heat and humidity
- Home to fungi, giant anteaters, and jaguars

## Indigenous Peoples

- **400+ indigenous groups** live in the Amazon
- They have protected the forest for thousands of years
- Indigenous territories have **lower deforestation rates** than other areas
- Their knowledge of medicinal plants and sustainable forest management is invaluable

## Threats

### Deforestation
- About **17% of the Amazon** has been destroyed in the last 50 years
- Main drivers: cattle ranching (80%), soy farming, logging, mining
- Brazil lost 11,568 km² of Amazon forest in 2022 alone

### Tipping Point
Scientists warn the Amazon is approaching a **tipping point**:
- If 20-25% is deforested, the forest may begin converting to savanna
- This would release billions of tonnes of CO₂
- Current deforestation is at about 17%
- The transition may already be beginning in some areas

### Fire
- Fires are used to clear land and often spread out of control
- 2019 Amazon fires generated worldwide alarm
- Drought and climate change are making fires more frequent

## Conservation Efforts

- **Protected areas** and indigenous reserves
- **Satellite monitoring** of deforestation in real time
- **Sustainable forestry** and agroforestry programmes
- **International pressure** and consumer awareness
- **Payment for ecosystem services** — compensating forest protection

## Summary

The Amazon is not just a South American treasure — it's a planetary life-support system. Its trees regulate our climate, its rivers water a continent, and its biodiversity is unmatched. The fight to save the Amazon is one of the most important conservation battles of our time.
    `,
    category: "Forests & Biodiversity",
    categorySlug: "forests-biodiversity",
    author: "Prof. Nimal Silva",
    date: "2026-02-20",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    featured: true,
    tags: ["Amazon", "rainforest", "deforestation", "biodiversity", "O/L"],
    level: "O/L",
  },
  {
    slug: "what-is-biodiversity",
    title: "What Is Biodiversity and Why Does Every Species Matter?",
    excerpt:
      "From the smallest microbe to the largest whale, biodiversity is the variety of life that makes our planet habitable. Learn why losing it threatens us all.",
    content: `
## Defining Biodiversity

**Biodiversity** (biological diversity) is the variety of all living things on Earth. It operates at three levels:

### 1. Genetic Diversity
- Variation in genes within a species
- Enables adaptation to changing conditions
- Example: Different varieties of rice with different drought or pest resistance

### 2. Species Diversity
- The variety of different species in an area
- Earth is home to an estimated **8.7 million species**
- We have only identified about **1.5 million** so far

### 3. Ecosystem Diversity
- The variety of ecosystems: forests, coral reefs, wetlands, grasslands
- Each ecosystem provides different services
- Healthy ecosystems depend on the interactions between species within them

## Earth's Biodiversity: The Numbers

- **Plants**: ~400,000 known species
- **Insects**: ~1 million known (estimated 5.5 million total)
- **Fish**: ~35,000 species
- **Birds**: ~11,000 species
- **Mammals**: ~6,500 species
- **Fungi**: ~150,000 known (estimated 3.8 million total)
- **Bacteria**: Millions of species, most unknown

## Why Biodiversity Matters

### Ecosystem Services
Biodiversity provides essential services worth an estimated **$125-140 trillion per year** — more than global GDP:

- **Food**: All our food comes from biodiversity (crops, livestock, fisheries)
- **Clean water**: Wetlands and forests filter water naturally
- **Clean air**: Plants and phytoplankton produce oxygen
- **Pollination**: 75% of crop species depend on animal pollinators
- **Medicine**: 50% of modern medicines derived from natural compounds
- **Climate regulation**: Forests and oceans absorb carbon

### The Web of Life
Species are connected in complex food webs. Remove one and others are affected:
- Wolves were removed from Yellowstone → deer overgrazed → rivers changed course
- Wolves were reintroduced → vegetation recovered → entire ecosystem improved
- This is called a **trophic cascade**

### Resilience
- Biodiverse ecosystems recover better from disturbances
- Like a diversified investment portfolio — more variety means less risk
- Monocultures (single-species systems) are highly vulnerable

## The Biodiversity Crisis

We are in the midst of the **sixth mass extinction**:
- Species are going extinct **1,000 times faster** than the natural background rate
- **1 million species** face extinction in coming decades
- Wildlife populations have declined by **69%** since 1970 (WWF Living Planet Report)

### Main Drivers (HIPPO):
- **H**abitat loss and degradation (the #1 threat)
- **I**nvasive species
- **P**ollution
- **P**opulation growth and overconsumption
- **O**verharvesting (hunting, fishing, logging)

Climate change is an **accelerating threat** that compounds all others.

## Biodiversity Hotspots Around the World

Several regions have exceptionally rich biodiversity:
- **Amazon Basin** — the most biodiverse place on Earth
- **Southeast Asian islands** — high endemism in Borneo, Sumatra, and the Philippines
- **Madagascar** — 90% of its wildlife is found nowhere else
- **Western Ghats & East African mountains** — critical for endemic species
- All hotspots are threatened by deforestation, urbanisation, and climate change

## What Can Be Done?

### Protection
- Expand protected areas (target: 30% of Earth by 2030)
- Create wildlife corridors connecting habitats
- Enforce anti-poaching and anti-trafficking laws

### Restoration
- Reforest degraded land
- Restore wetlands and mangroves
- Rewild ecosystems with keystone species

### Sustainable Use
- Sustainable agriculture and fishing
- Reduce food waste (30% of food is wasted)
- Consume responsibly

### Education
- Understanding biodiversity is the first step to protecting it
- Citizen science projects help monitor species
- Support conservation organisations

## Summary

Biodiversity is not just about saving individual species — it's about maintaining the living systems that keep our planet habitable. Every species plays a role. Every extinction diminishes us. Protecting biodiversity is protecting our own future.
    `,
    category: "Forests & Biodiversity",
    categorySlug: "forests-biodiversity",
    author: "Dr. Amara Perera",
    date: "2026-02-08",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=800&q=80",
    featured: false,
    tags: ["biodiversity", "extinction", "conservation", "ecosystems", "O/L"],
    level: "O/L",
  },
  {
    slug: "mangrove-forests-coastal-guardians",
    title: "Mangrove Forests: The Coastal Guardians We're Losing",
    excerpt:
      "Mangroves protect shorelines, store carbon, and nurture fisheries. Yet we've lost half of them. Discover why these tidal forests are vital.",
    content: `
## What Are Mangroves?

Mangroves are trees and shrubs that thrive in the harsh boundary between land and sea — in salty, tidal, oxygen-poor mud. They are found along tropical and subtropical coastlines worldwide.

There are about **80 species** of mangrove, and they share remarkable adaptations:
- **Salt tolerance**: Some excrete salt through their leaves; others filter it at their roots
- **Aerial roots**: Prop roots and pneumatophores rise above the water for oxygen
- **Vivipary**: Seeds germinate while still attached to the parent tree, dropping as ready-made seedlings

## Where Are They Found?

- Found in **123 countries** across the tropics
- Largest mangrove forests: **Sundarbans** (India/Bangladesh), Niger Delta, Amazon coast
- Mangroves are found across tropical coastlines, from Southeast Asia to West Africa to the Caribbean
- Total global coverage: about **137,000 km²** (down from an estimated 260,000+ km²)

## Why Mangroves Matter

### Coastal Protection
- Mangrove roots **break wave energy**, reducing storm surge by up to 66%
- During the 2004 Indian Ocean tsunami, villages behind mangroves suffered significantly less damage
- Save an estimated **$65 billion per year** in flood damage prevention

### Carbon Storage
- Mangroves store **3-5 times more carbon** per hectare than tropical forests
- Carbon is stored in both biomass and deep, waterlogged soil
- When destroyed, this stored carbon is released as CO₂
- Known as **"blue carbon"** ecosystems

### Nursery Grounds
- **75% of commercially caught fish** spend part of their life cycle in mangroves
- Mangrove roots provide shelter for juvenile fish, shrimp, and crabs
- Support fisheries worth **billions of dollars** annually

### Biodiversity
- Home to hundreds of species of fish, birds, mammals, and reptiles
- Proboscis monkeys, Bengal tigers (Sundarbans), manatees, and crocodiles
- Critical stopover for migratory birds

### Water Quality
- Filter pollutants and sediment from runoff
- Trap sediment, preventing it from smothering coral reefs
- Process nutrients, improving water quality

## The Loss

We have lost approximately **50% of the world's mangroves** since the 1950s:

### Why?
- **Aquaculture**: Shrimp and fish farms (the #1 driver)
- **Coastal development**: Hotels, ports, housing
- **Agriculture**: Rice paddies, palm oil plantations
- **Logging**: Timber and charcoal
- **Pollution**: Oil spills, plastic, chemical runoff

### The Cost
- Loss of coastal protection → increased flood damage
- Collapse of fisheries → food insecurity
- Carbon release → accelerated climate change
- Biodiversity loss

## Conservation and Restoration

### Protection
- Create and enforce protected mangrove areas
- Integrate mangroves into coastal development planning
- Value mangrove ecosystem services economically

### Restoration
- Community-led planting programmes
- Allow natural regeneration where possible
- Restore tidal flow to degraded areas

### Success Stories
- **Pakistan**: Sindh province restored 30,000 hectares of mangroves
- **Thailand**: Community forests where locals manage and benefit from mangroves
- **Indian Ocean coasts**: Post-tsunami mangrove restoration across affected regions

## Summary

Mangroves are among the most valuable ecosystems on Earth — protecting coasts, storing carbon, feeding nations, and supporting biodiversity. We've already lost half of them, but restoration is possible and urgent. These humble tidal forests may be our best natural defence against both climate change and rising seas.
    `,
    category: "Forests & Biodiversity",
    categorySlug: "forests-biodiversity",
    author: "Prof. Nimal Silva",
    date: "2026-01-22",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1569974507005-6dc61f97fb75?w=800&q=80",
    featured: false,
    tags: ["mangroves", "coastal ecosystems", "blue carbon", "Grade 8-10"],
    level: "Grade 8-10",
  },

  // ──────────────────────────────────────────────
  // EARTH SCIENCE & GEOLOGY
  // ──────────────────────────────────────────────
  {
    slug: "plate-tectonics",
    title: "Plate Tectonics: The Moving Jigsaw Puzzle Beneath Our Feet",
    excerpt:
      "Earth's surface is broken into massive plates that constantly move — creating mountains, earthquakes, and volcanoes. Discover the engine that shapes our planet.",
    content: `
## A Restless Planet

The ground beneath your feet feels solid and permanent. But Earth's surface is actually broken into massive pieces called **tectonic plates** that are constantly moving — slowly, but with enormous power.

## Earth's Structure

To understand plate tectonics, we need to know Earth's layers:

### Inner Core
- Solid ball of iron and nickel
- Temperature: up to **5,400°C** (as hot as the Sun's surface)
- Under immense pressure

### Outer Core
- Liquid iron and nickel
- Creates Earth's magnetic field
- Temperature: 4,000-5,000°C

### Mantle
- Thick layer of semi-solid rock
- Makes up **84% of Earth's volume**
- The upper mantle flows very slowly (**convection currents**)

### Crust
- Thin outer shell (5-70 km thick)
- **Oceanic crust**: Thin (5-10 km), dense, made of basalt
- **Continental crust**: Thick (30-70 km), lighter, made of granite

## What Are Tectonic Plates?

The crust and upper mantle form the **lithosphere**, which is broken into about **15 major plates** and several minor ones. These plates "float" on the semi-fluid **asthenosphere** below.

### Major Plates Include:
- Pacific Plate (largest oceanic plate)
- North American Plate
- Eurasian Plate
- African Plate
- Indo-Australian Plate
- Antarctic Plate
- South American Plate

## What Drives the Plates?

**Convection currents** in the mantle are the main driver:
1. Hot rock rises from deep in the mantle
2. It spreads sideways beneath the plates, dragging them along
3. Cooled rock sinks back down
4. The cycle repeats continuously

Additional forces include:
- **Ridge push**: New crust formed at mid-ocean ridges pushes plates apart
- **Slab pull**: Dense oceanic crust sinking at subduction zones pulls the plate behind it

## Plate Boundaries

### Divergent (Constructive) Boundaries
Plates move **apart**:
- Magma rises to fill the gap, creating new crust
- **Mid-ocean ridges**: Underwater mountain chains (e.g., Mid-Atlantic Ridge)
- **Rift valleys**: On land (e.g., East African Rift)
- Iceland sits on the Mid-Atlantic Ridge — you can see both plates!

### Convergent (Destructive) Boundaries
Plates move **together**:

**Ocean-Ocean**: One plate subducts beneath the other → volcanic island arcs (e.g., Japan, Indonesia)

**Ocean-Continent**: Denser oceanic plate subducts → deep ocean trench + volcanic mountain chain (e.g., Andes)

**Continent-Continent**: Neither subducts → massive fold mountains (e.g., Himalayas — Indian plate hitting Eurasian plate)

### Transform (Conservative) Boundaries
Plates slide **past** each other:
- No crust is created or destroyed
- Causes powerful earthquakes
- Example: **San Andreas Fault** (California)

## Earthquakes and Volcanoes

Most earthquakes and volcanoes occur along plate boundaries:
- The **Ring of Fire** (Pacific Ocean rim) hosts 75% of the world's volcanoes and 90% of earthquakes
- Countries in the middle of tectonic plates, far from boundaries, experience relatively few earthquakes

## Evidence for Plate Tectonics

- **Continental fit**: South America and Africa fit together like puzzle pieces
- **Matching fossils**: Same species found on continents now separated by oceans
- **Rock matches**: Same rock formations on different continents
- **Seafloor spreading**: Magnetic stripes in ocean crust prove new rock is continuously formed
- **GPS measurements**: We can now directly measure plate movement (typically 2-10 cm/year)

## Summary

Plate tectonics is the grand unifying theory of Earth science. It explains why mountains rise, oceans open, volcanoes erupt, and earthquakes shake. Our planet is alive and dynamic — and the ground beneath us is always on the move.
    `,
    category: "Earth Science & Geology",
    categorySlug: "earth-science",
    author: "Dr. Kamal Fernando",
    date: "2026-02-15",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1507181179506-598491b53db4?w=800&q=80",
    featured: true,
    tags: ["plate tectonics", "earthquakes", "volcanoes", "geology", "O/L"],
    level: "O/L",
  },
  {
    slug: "volcanoes-explained",
    title: "Volcanoes: Earth's Spectacular and Destructive Force",
    excerpt:
      "From gentle lava flows to catastrophic eruptions — understand how volcanoes work, where they form, and how they shape our world.",
    content: `
## What Is a Volcano?

A volcano is an opening in Earth's crust through which **magma** (molten rock), **volcanic ash**, and **gases** escape from below the surface. When magma reaches the surface, it's called **lava**.

## How Volcanoes Form

Volcanoes form in three main settings:

### 1. Subduction Zones
- Where one tectonic plate sinks beneath another
- Water from the sinking plate lowers the melting point of rock above
- Magma rises to form explosive volcanoes
- Examples: Mount Fuji (Japan), Mount St. Helens (USA), Indonesian volcanoes

### 2. Mid-Ocean Ridges
- Where plates pull apart on the ocean floor
- Magma rises to fill the gap
- Creates underwater volcanic mountain chains
- Example: Mid-Atlantic Ridge, Iceland

### 3. Hotspots
- Plumes of unusually hot rock rise from deep in the mantle
- Can occur in the middle of plates
- As the plate moves over the hotspot, a chain of volcanoes forms
- Example: Hawaiian Islands, Yellowstone

## Types of Volcanoes

### Shield Volcanoes
- Broad, gentle slopes
- Formed by runny (low-viscosity) basaltic lava
- Less explosive, more effusive
- Example: Mauna Loa (Hawaii) — the world's largest active volcano

### Stratovolcanoes (Composite)
- Steep, cone-shaped
- Built from alternating layers of lava and ash
- Can be highly explosive
- Example: Mount Fuji, Mount Vesuvius, Mount Pinatubo

### Cinder Cones
- Small, steep-sided
- Built from fragments of lava blown into the air
- Usually short-lived
- Example: Parícutin (Mexico) — grew from a cornfield in 1943

### Calderas
- Massive craters formed when a volcano collapses after a huge eruption
- Can be tens of kilometres wide
- Example: Yellowstone Caldera, Krakatoa

## Famous Eruptions

### Mount Vesuvius, 79 AD
- Buried Pompeii and Herculaneum under volcanic ash
- Killed an estimated 2,000 people
- Preserved the cities remarkably for archaeologists

### Krakatoa, 1883
- One of the most violent eruptions in recorded history
- Explosion heard 4,800 km away
- Triggered tsunamis killing 36,000 people
- Lowered global temperatures by 1.2°C for a year

### Mount Pinatubo, 1991
- Second-largest eruption of the 20th century
- Ejected 10 billion tonnes of magma
- Cooled global temperatures by 0.5°C for 2 years
- Demonstrated how volcanoes affect climate

## Volcanoes and Climate

Large eruptions inject **sulfur dioxide** into the stratosphere, where it forms tiny droplets that reflect sunlight:
- **Short-term cooling**: Can last 1-3 years
- Historic eruptions have caused "years without summer"
- **1815 Tambora eruption** → 1816 "Year Without a Summer" → crop failures across Europe

## Benefits of Volcanoes

Despite their dangers, volcanoes also:
- Create **fertile soil** (volcanic ash is rich in minerals)
- Form new **land** (Hawaii is entirely volcanic)
- Provide **geothermal energy** (Iceland heats 90% of homes this way)
- Create **mineral deposits** (gold, silver, copper)
- Shape stunning **landscapes** that support tourism

## Living with Volcanoes

About **800 million people** live within 100 km of an active volcano. Risk is managed through:
- **Monitoring**: Seismographs, gas sensors, satellite imagery
- **Early warning systems**: Evacuation plans and alerts
- **Hazard mapping**: Identifying areas at risk from lava, ash, and lahars
- **Education**: Ensuring communities know what to do

## Summary

Volcanoes are reminders that Earth is a dynamic, living planet. They can be devastating, but they also create land, enrich soil, and provide energy. Understanding how they work helps us live alongside them and appreciate the powerful forces that shaped the world we see today.
    `,
    category: "Earth Science & Geology",
    categorySlug: "earth-science",
    author: "Dr. Kamal Fernando",
    date: "2026-01-30",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1562692723-e6dec5b2bfad?w=800&q=80",
    featured: false,
    tags: ["volcanoes", "eruptions", "geology", "natural hazards", "Grade 8-11"],
    level: "Grade 8-11",
  },
  {
    slug: "water-cycle-earth-plumbing",
    title: "The Water Cycle: Earth's Extraordinary Plumbing System",
    excerpt:
      "Every drop of water you drink has been recycled for billions of years. Explore the remarkable journey water takes around our planet.",
    content: `
## Water: Earth's Unique Treasure

Water makes Earth unique in the solar system. It's the only known planet with liquid water on its surface, and this water has been continuously recycled for **4.4 billion years**. The water you drink today may have once been drunk by a dinosaur.

## Earth's Water Budget

- **97.5%** of Earth's water is **saltwater** in the oceans
- **2.5%** is **freshwater**, but most of this is locked in ice caps and glaciers
- Only **0.3%** of all freshwater is in rivers, lakes, and accessible groundwater
- That tiny fraction supports all terrestrial life

## The Water Cycle (Hydrological Cycle)

### Evaporation
- The sun heats water in oceans, lakes, and rivers
- Water molecules gain energy and escape as **water vapour**
- Oceans provide **86% of all evaporation**
- Higher temperatures = more evaporation

### Transpiration
- Plants absorb water through roots and release it through leaves
- A single oak tree can transpire **150,000 litres** per year
- The Amazon rainforest releases so much water vapour it creates its own clouds
- Evaporation + transpiration = **evapotranspiration**

### Condensation
- Water vapour rises and cools at higher altitudes
- Cool vapour condenses onto tiny dust particles, forming water droplets
- Billions of droplets together form **clouds**
- The dew on grass is also condensation

### Precipitation
- Cloud droplets collide and grow heavier
- When too heavy to stay airborne, they fall as precipitation
- **Rain**: Most common form (above 0°C)
- **Snow**: When air temperature is below 0°C throughout
- **Sleet**: Rain that freezes as it falls
- **Hail**: Ice balls formed in powerful thunderstorm updrafts

### Collection
Water that falls as precipitation follows various paths:
- **Surface runoff**: Flows over land into streams, rivers, lakes, and eventually oceans
- **Infiltration**: Soaks into the ground, becoming groundwater
- **Groundwater flow**: Moves slowly through rock and soil to rivers, lakes, or the sea
- **Ice storage**: Accumulates as snow and ice in glaciers and ice caps

## How Much Water Moves?

- **505,000 km³** of water evaporates from Earth's surface each year
- **398,000 km³** evaporates from oceans
- **107,000 km³** evaporates from land
- All of it eventually returns as precipitation

The entire cycle — from evaporation to precipitation to return — takes an average of **9 days** for atmospheric water.

## Climate Change and the Water Cycle

Global warming is **supercharging** the water cycle:
- Warmer air holds **7% more moisture per 1°C** of warming
- More moisture → **heavier rainfall events** and flooding
- But also → **more intense droughts** as evaporation increases
- Glaciers are shrinking, threatening water supply for billions
- Changed rainfall patterns disrupt agriculture worldwide

## Water Scarcity

Despite the water cycle's reliability:
- **2 billion people** lack access to safely managed drinking water
- **4 billion people** experience severe water scarcity at least one month per year
- By 2025, **half the world's population** may face water stress
- Water scarcity is driven by population growth, pollution, and climate change

## Protecting Our Water

- Reduce water waste at home and in agriculture
- Protect wetlands and watersheds that filter water naturally
- Treat and reuse wastewater
- Reduce water pollution from industry and agriculture
- Address climate change to stabilise precipitation patterns

## Summary

The water cycle is Earth's life-support system — endlessly recycling a finite supply of water that sustains every living thing. Understanding it helps us appreciate why clean water is precious, why climate change threatens water security, and why protecting our waterways protects ourselves.
    `,
    category: "Earth Science & Geology",
    categorySlug: "earth-science",
    author: "Ms. Fathima Rizvi",
    date: "2026-01-15",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    featured: false,
    tags: ["water cycle", "hydrology", "freshwater", "precipitation", "Grade 6-8"],
    level: "Grade 6-8",
  },

  // ──────────────────────────────────────────────
  // WILDLIFE & CONSERVATION
  // ──────────────────────────────────────────────
  {
    slug: "endangered-species-red-list",
    title: "The Red List: Understanding Earth's Most Endangered Species",
    excerpt:
      "Over 44,000 species face extinction. Learn about the IUCN Red List, what drives species toward the brink, and the remarkable efforts to save them.",
    content: `
## What Is the IUCN Red List?

The **International Union for Conservation of Nature (IUCN) Red List** is the world's most comprehensive inventory of the conservation status of species. It's the global authority on which species are thriving and which are in trouble.

## The Categories

The Red List classifies species into categories:

- **Least Concern (LC)**: Widespread and abundant
- **Near Threatened (NT)**: Likely to qualify for a threatened category soon
- **Vulnerable (VU)**: Facing a high risk of extinction in the wild
- **Endangered (EN)**: Facing a very high risk of extinction
- **Critically Endangered (CR)**: Facing an extremely high risk of extinction
- **Extinct in the Wild (EW)**: Only survives in captivity
- **Extinct (EX)**: No known living individuals

## The Numbers

As of recent assessments:
- Over **157,000 species** have been assessed
- More than **44,000** are classified as **threatened with extinction**
- **41% of amphibians** are threatened
- **37% of sharks and rays** are threatened
- **26% of mammals** are threatened
- **13% of birds** are threatened

## Critically Endangered: On the Brink

### Sumatran Orangutan
- **Fewer than 14,000** remaining
- Losing habitat to palm oil plantations
- Found only on the island of Sumatra, Indonesia

### Hawksbill Sea Turtle
- Population declined by **80%** in the last century
- Hunted for their beautiful shells
- Nesting beaches threatened by development and climate change

### Amur Leopard
- Possibly the **rarest big cat** — fewer than 100 in the wild
- Found in far eastern Russia and northeast China
- Threatened by poaching and habitat loss

### Javan Rhino
- Fewer than **80 individuals** remain
- Found only in one national park in Indonesia
- One of the rarest large mammals on Earth

### Vaquita Porpoise
- Fewer than **10 remaining** — the most endangered marine mammal
- Found only in the Gulf of California, Mexico
- Killed as bycatch in illegal fishing nets

## What Drives Extinction?

### 1. Habitat Loss (Primary Driver)
- Deforestation, urbanisation, agriculture
- 75% of Earth's land surface has been significantly altered

### 2. Overexploitation
- Overhunting and overfishing
- Wildlife trade (legal and illegal)
- Illegal wildlife trade worth **$23 billion per year**

### 3. Climate Change
- Shifting habitats faster than species can adapt
- Coral bleaching, ice loss, changing seasons
- Species on mountaintops and polar regions have nowhere to go

### 4. Pollution
- Pesticides, plastics, chemicals
- Light and noise pollution disrupt wildlife

### 5. Invasive Species
- Non-native species introduced to new environments
- Compete with or prey on native species
- Rats, cats, and snakes have devastated island species

## Conservation Success Stories

### Giant Panda
- Downgraded from Endangered to **Vulnerable** in 2016
- Chinese conservation efforts: habitat protection, breeding programmes
- Population increased from 1,114 (1980s) to over 1,800

### Humpback Whale
- Hunted to near extinction (only ~5,000 remained in 1966)
- International whaling ban led to recovery
- Population now estimated at **80,000+**

### Arabian Oryx
- Declared **Extinct in the Wild** in 1972
- Captive breeding and reintroduction programmes
- Now upgraded to **Vulnerable** — back from extinction

### Southern White Rhino
- Fewer than **20 individuals** in early 1900s
- Now over **16,000** thanks to protection in South Africa
- One of conservation's greatest success stories

## What Can We Do?

- **Support conservation organisations** working on the ground
- **Reduce our footprint**: Consume sustainably, reduce waste
- **Avoid products** from endangered species
- **Speak up**: Support policies that protect wildlife and habitats
- **Learn and share**: Awareness is the first step to action

## Summary

The Red List is both a warning and a guide. It shows us the devastating rate at which we're losing species, but also points the way to recovery. Every species saved is a victory for the web of life that sustains us all. Extinction is forever — but conservation works when we commit to it.
    `,
    category: "Wildlife & Conservation",
    categorySlug: "wildlife-conservation",
    author: "Dr. Amara Perera",
    date: "2026-02-12",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80",
    featured: true,
    tags: ["endangered species", "IUCN Red List", "conservation", "extinction", "All Levels"],
    level: "All Levels",
  },
  {
    slug: "pollinators-world-depends-on",
    title: "Pollinators: The Tiny Workers the World Depends On",
    excerpt:
      "Bees, butterflies, and other pollinators are responsible for one in every three bites of food you eat. What happens if they disappear?",
    content: `
## What Is Pollination?

**Pollination** is the transfer of pollen from the male part (anther) of a flower to the female part (stigma), enabling fertilisation and the production of seeds and fruit. Without it, most flowering plants cannot reproduce.

## Types of Pollination

### Wind Pollination
- Grasses, wheat, rice, corn
- Pollen is light and produced in huge quantities
- No need for colourful flowers or nectar

### Animal Pollination
- **75% of flowering plants** depend on animal pollinators
- Plants attract pollinators with colourful petals, sweet nectar, and scent
- As the animal feeds, pollen sticks to its body and transfers to the next flower

## Who Are the Pollinators?

### Bees (The Champions)
- **20,000+ species** worldwide (not just honeybees!)
- Most efficient pollinators — their hairy bodies are perfect for collecting pollen
- A single honeybee colony can pollinate **300 million flowers per day**
- Wild bees (bumblebees, solitary bees) are often more effective than honeybees

### Butterflies and Moths
- Long tongues reach deep into flowers
- Moths are important night-time pollinators
- Hawk moths can hover like hummingbirds

### Birds
- Hummingbirds (Americas), sunbirds (Africa/Asia), honeyeaters (Australia)
- Attracted to red and orange tubular flowers
- Essential for many tropical plants

### Bats
- Pollinate over **500 plant species**
- Important for agave (tequila!), bananas, mangoes, and durian
- Most active at night

### Others
- Flies, wasps, beetles, ants
- Even some lizards and small mammals
- Each pollinator has evolved alongside specific plants

## What Do Pollinators Give Us?

### Food
- **75% of leading food crops** benefit from animal pollination
- Coffee, chocolate, apples, almonds, strawberries, tomatoes, avocados
- **1 in every 3 bites** of food depends on pollinators
- Global crop value attributable to pollinators: **$235-577 billion per year**

### Ecosystems
- Pollination maintains wild plant diversity
- Plants provide food and shelter for other wildlife
- Without pollinators, entire ecosystems would collapse

### Economy
- Pollination services to agriculture are worth more than the price of honey
- Almond industry alone depends entirely on bee pollination

## The Pollinator Crisis

Pollinator populations are declining worldwide:

### Causes
- **Habitat loss**: Wildflower meadows replaced by agriculture and development
- **Pesticides**: Neonicotinoids are especially harmful to bees
- **Monocultures**: Large fields of single crops offer poor nutrition
- **Disease and parasites**: Varroa mite devastates honeybee colonies
- **Climate change**: Mismatches between flower blooming and pollinator emergence
- **Invasive species**: Compete with native pollinators

### Evidence
- **40% of insect pollinator species** face extinction
- Wild bee diversity declining across Europe and North America
- Monarch butterfly migration numbers dropped by **80%**
- Some regions of China already **hand-pollinate** fruit trees because bees have vanished

## What Can We Do?

### In Our Gardens
- **Plant native wildflowers** — diversity of shapes and blooming times
- **Avoid pesticides** or use pollinator-safe alternatives
- **Leave some areas wild** — messy gardens are pollinator havens
- **Provide nesting sites**: Bee hotels, bare soil patches, log piles

### In Agriculture
- Reduce pesticide use, especially during flowering
- Plant flower strips along field edges
- Maintain hedgerows and wild areas
- Diversify crops

### At Policy Level
- Ban the most harmful pesticides
- Protect and restore pollinator habitats
- Fund pollinator monitoring and research
- Include pollinator health in agricultural policy

## Summary

Pollinators are among the most important yet underappreciated creatures on Earth. They sustain our food supply, maintain biodiversity, and make our world more colourful and fragrant. Protecting them isn't just about saving bees — it's about preserving the foundation of our food system and ecosystems.
    `,
    category: "Wildlife & Conservation",
    categorySlug: "wildlife-conservation",
    author: "Prof. Nimal Silva",
    date: "2026-01-25",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    featured: false,
    tags: ["pollinators", "bees", "biodiversity", "food security", "Grade 7-10"],
    level: "Grade 7-10",
  },
  {
    slug: "wildlife-migration-patterns",
    title: "The Great Migrations: Earth's Most Incredible Animal Journeys",
    excerpt:
      "From the Serengeti to the Arctic, millions of animals undertake epic journeys across our planet each year. Discover the science behind migration.",
    content: `
## What Is Migration?

Migration is the large-scale, seasonal movement of animals from one region to another. It's one of nature's most awe-inspiring phenomena — driven by the search for food, warmer climates, and breeding grounds.

## Greatest Migrations on Earth

### Wildebeest — The Serengeti (Africa)
- Over **1.5 million wildebeest** migrate in a circular route through Tanzania and Kenya
- Covering **3,000 km** annually
- Accompanied by 200,000 zebras and 500,000 gazelles
- One of the largest movements of land animals on Earth

### Arctic Tern — Pole to Pole
- Migrates from **Arctic to Antarctic and back** every year
- A round trip of approximately **70,000 km**
- Experiences two summers per year — more daylight than any other creature
- A single tern may travel **2.4 million km** in its lifetime

### Monarch Butterfly — North America
- Travels up to **4,800 km** from Canada and the USA to central Mexico
- Weighs less than a gram yet navigates using the sun and Earth's magnetic field
- Takes **4 generations** to complete the full round trip
- Millions cluster on trees in Mexican mountain forests

### Humpback Whale — Ocean Crossings
- Migrates up to **8,000 km** between polar feeding grounds and tropical breeding waters
- One of the longest migrations of any mammal
- Navigate using Earth's magnetic field, ocean currents, and possibly the stars

### Caribou — Arctic Herds
- North American caribou migrate up to **5,000 km** per year
- The longest land migration of any terrestrial animal
- Travel in herds of hundreds of thousands
- Following ancient routes through Alaska and Canada

## Why Do Animals Migrate?

### Food Availability
- Seasonal changes reduce food supply in one area
- Animals move to where resources are more abundant

### Breeding
- Some species travel to specific ancestral breeding grounds
- Salmon return to the exact river where they were born

### Climate
- Avoid harsh winters or extreme heat
- Seek optimal temperatures for survival and reproduction

### Daylight
- Longer days in polar summers provide more feeding time
- Birds especially are sensitive to changing day length

## How Do They Navigate?

Animals use remarkable navigation methods:
- **Sun compass**: Using the sun's position (and adjusting for time of day)
- **Star navigation**: Some birds navigate using star patterns
- **Magnetic field**: Many species detect Earth's magnetic field
- **Landmarks**: Mountains, rivers, coastlines
- **Smell**: Salmon can smell their home river from the ocean
- **Inherited memory**: Some routes are genetically encoded

## Threats to Migration

Migration routes are increasingly threatened:
- **Habitat loss**: Stopover sites destroyed by development
- **Climate change**: Disrupted timing — food peaks no longer match arrival
- **Barriers**: Fences, roads, dams, and urban sprawl block routes
- **Light pollution**: Confuses nocturnal navigators, especially birds
- **Hunting**: Along migration corridors

## Conservation

Protecting migratory species requires **international cooperation**:
- Preserving critical stopover habitats
- Creating wildlife corridors
- International treaties (Convention on Migratory Species)
- Reducing barriers along migration routes
- Monitoring populations using satellite tracking

## Summary

Animal migrations are among the most spectacular events in nature — proof that our planet is deeply interconnected. The wildebeest of Africa, the monarchs of North America, and the whales crossing our oceans remind us that nature knows no borders. Protecting their journeys means protecting the web of life itself.
    `,
    category: "Wildlife & Conservation",
    categorySlug: "wildlife-conservation",
    author: "Dr. Kasun Wickramasinghe",
    date: "2026-01-12",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1535338454528-1b22a21e1ffa?w=800&q=80",
    featured: false,
    tags: ["migration", "wildlife", "animal behavior", "conservation", "All Levels"],
    level: "All Levels",
  },

  // ──────────────────────────────────────────────
  // SUSTAINABILITY & GREEN LIVING
  // ──────────────────────────────────────────────
  {
    slug: "renewable-energy-future",
    title: "Renewable Energy: Powering a Sustainable Future",
    excerpt:
      "Solar, wind, hydro, and beyond — learn how renewable energy works, why it matters, and how it's transforming the way we power our world.",
    content: `
## Why Renewable Energy?

For over 200 years, human civilisation has been powered primarily by **fossil fuels**: coal, oil, and natural gas. But burning these fuels:
- Releases CO₂ that drives climate change
- Causes air pollution (7 million premature deaths per year)
- Will eventually run out (they're finite resources)

**Renewable energy** comes from sources that are naturally replenished: sunlight, wind, water, geothermal heat, and biomass.

## Solar Energy

### How It Works
- **Photovoltaic (PV) cells** convert sunlight directly into electricity
- Made from semiconductor materials (usually silicon)
- When photons hit the cell, they knock electrons free, creating electrical current

### Key Facts
- The sun delivers more energy to Earth in **one hour** than humanity uses in a year
- Solar panel costs have dropped **90%** since 2010
- China, USA, and India lead in solar capacity
- Can be installed on rooftops (small scale) or in solar farms (utility scale)

### Advantages
- Abundant, free fuel source
- No emissions during operation
- Low maintenance, long lifespan (25-30 years)
- Can be deployed anywhere with sunlight

### Challenges
- Intermittent (doesn't work at night or in heavy cloud)
- Requires battery storage or grid backup
- Manufacturing has some environmental impact
- Needs significant space for large installations

## Wind Energy

### How It Works
- Wind turns the blades of a **turbine**
- The spinning blades drive a **generator** that produces electricity
- Modern turbines can be **200+ metres tall** with blades longer than a football field

### Key Facts
- Wind power capacity has grown **75-fold** since 2000
- Offshore wind farms can generate power more consistently
- Denmark generates **50%** of its electricity from wind
- A single large turbine can power **1,500 homes**

### Advantages
- Clean, no emissions during operation
- Increasingly cost-competitive (now often cheaper than fossil fuels)
- Can coexist with agriculture (turbines on farmland)

### Challenges
- Intermittent (depends on wind)
- Noise and visual impact
- Can affect birds and bats
- Offshore installation is expensive

## Hydroelectric Power

### How It Works
- Falling or flowing water turns turbines
- Dams store water in reservoirs, releasing it through turbines on demand
- **Run-of-river** systems use natural river flow without large dams

### Key Facts
- Oldest and largest source of renewable electricity
- Provides **16% of global electricity**
- Norway generates 95% of its electricity from hydropower
- Countries like Norway, Brazil, and Canada have significant hydropower capacity

### Advantages
- Reliable and controllable (can adjust output quickly)
- Long lifespan (dams last 50-100+ years)
- Reservoirs can also provide water supply and flood control

### Challenges
- Large dams displace communities and flood ecosystems
- Disrupt river ecology and fish migration
- Dependent on rainfall (vulnerable to drought)
- Decomposing vegetation in reservoirs can release methane

## Other Renewables

### Geothermal
- Heat from Earth's interior drives turbines
- Available 24/7 (not intermittent!)
- Iceland generates 25% of electricity and 90% of heating from geothermal
- Limited to volcanically active regions

### Biomass
- Energy from organic materials (wood, crop waste, biogas)
- Can be carbon-neutral if managed sustainably
- Concerns about land use and air quality

### Tidal and Wave
- Harness the energy of ocean tides and waves
- Highly predictable
- Still in early stages of development
- UK and France are leaders in tidal energy

## The Energy Transition

The shift from fossil fuels to renewables is **accelerating**:
- In 2023, renewables accounted for **30% of global electricity** generation
- Solar and wind are now the **cheapest** new electricity sources in most countries
- Electric vehicles are rapidly replacing combustion engines
- Battery storage technology is improving and getting cheaper

## Challenges of the Transition

- **Energy storage**: Batteries needed for when sun doesn't shine and wind doesn't blow
- **Grid infrastructure**: Power grids need upgrading for distributed renewable sources
- **Mineral supply**: Solar panels and batteries need lithium, cobalt, rare earths
- **Political and economic inertia**: Fossil fuel industries resist change
- **Energy equity**: Ensuring developing nations can access clean energy

## Summary

Renewable energy is no longer a future dream — it's the present reality and it's growing fast. Solar, wind, and other clean sources can power our world while protecting our climate. The technology exists; the economics are favourable. What's needed now is the collective will to accelerate the transition.
    `,
    category: "Sustainability & Green Living",
    categorySlug: "sustainability",
    author: "Mr. Dinesh Rajapaksa",
    date: "2026-02-17",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    featured: true,
    tags: ["renewable energy", "solar", "wind", "sustainability", "O/L"],
    level: "O/L",
  },
  {
    slug: "carbon-footprint-guide",
    title: "Your Carbon Footprint: What It Is and How to Shrink It",
    excerpt:
      "Every action has a carbon cost. Learn what a carbon footprint is, how to calculate yours, and practical steps to reduce it.",
    content: `
## What Is a Carbon Footprint?

Your **carbon footprint** is the total amount of greenhouse gases (mainly CO₂) generated by your actions. It's measured in **tonnes of CO₂ equivalent (tCO₂e)** per year.

### Global Averages
- **World average**: ~4.7 tonnes per person per year
- **USA**: ~15.5 tonnes
- **UK**: ~5.5 tonnes
- **India**: ~1.9 tonnes
- **Many developing nations**: ~1.0 tonnes
- **Target for 2050**: Under **2 tonnes** per person to meet Paris Agreement goals

## What Makes Up Your Footprint?

### 1. Energy at Home (~25-30%)
- Electricity (from fossil fuel power plants)
- Gas or oil for heating/cooking
- Air conditioning

### 2. Transport (~25-30%)
- Cars (petrol/diesel)
- Flights (the biggest single-trip emissions)
- Public transport

### 3. Food (~20-25%)
- Meat production (especially beef — **27 kg CO₂** per kg of beef)
- Dairy products
- Food transport ("food miles")
- Food waste (rotting food in landfills produces methane)

### 4. Stuff We Buy (~15-20%)
- Clothing (fast fashion is a major emitter)
- Electronics
- Packaging
- Everything has embodied carbon from manufacturing and shipping

## The Big Emitters

### Flying
- A return flight London to New York: **~1.6 tonnes CO₂** per passenger
- That's roughly the entire annual footprint of someone in many developing nations
- Aviation accounts for **2.4% of global CO₂** but growing fast

### Beef
- Producing 1 kg of beef generates **27 kg CO₂e**
- 1 kg of chicken: 6.9 kg CO₂e
- 1 kg of lentils: 0.9 kg CO₂e
- If cattle were a country, they'd be the **3rd largest greenhouse gas emitter**

### Fast Fashion
- The fashion industry produces **10% of global emissions**
- The average garment is worn only **7 times** before being discarded
- Synthetic fabrics release microplastics when washed

## How to Shrink Your Footprint

### Energy
- Switch to a **renewable energy** provider
- Use **LED bulbs** (use 90% less energy than incandescent)
- Insulate your home
- Turn off appliances when not in use
- Use fans before reaching for air conditioning

### Transport
- **Walk or cycle** for short trips
- Use **public transport**
- If driving, consider an **electric vehicle**
- Reduce flying — especially short-haul flights
- Carpool when possible

### Food
- Eat **less meat** (especially beef and lamb)
- Buy **local and seasonal** produce
- **Reduce food waste** — plan meals, use leftovers
- Grow some of your own food
- Choose plant-based options more often

### Consumption
- **Buy less, buy better** — quality over quantity
- **Repair** before replacing
- Buy **secondhand**
- Avoid single-use items
- Choose products with less packaging

### Digital
- Streaming video generates CO₂ (data centres use energy)
- Delete unused files and emails (yes, cloud storage uses energy)
- Keep devices longer before upgrading

## Beyond Individual Action

Individual action matters, but systemic change is essential:
- **Vote** for climate-aware leaders
- **Support** businesses with genuine sustainability commitments
- **Advocate** for renewable energy and public transport investment
- **Divest** from fossil fuel companies
- **Educate** others — knowledge spreads action

## Calculating Your Footprint

Several free online calculators can estimate your footprint:
- Answer questions about your home, transport, diet, and consumption
- Get a personalised breakdown
- Identify your biggest areas for improvement

## Summary

Your carbon footprint is the environmental impact of your lifestyle, measured in greenhouse gas emissions. While systemic change is crucial, individual choices add up — especially in high-impact areas like flying, meat consumption, and energy use. Every tonne of CO₂ we avoid matters. Start where you can, do what you can, and encourage others to do the same.
    `,
    category: "Sustainability & Green Living",
    categorySlug: "sustainability",
    author: "Mr. Dinesh Rajapaksa",
    date: "2026-02-01",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    featured: false,
    tags: ["carbon footprint", "climate action", "sustainability", "Grade 8-11"],
    level: "Grade 8-11",
  },
  {
    slug: "circular-economy-explained",
    title: "The Circular Economy: Redesigning How We Make and Use Things",
    excerpt:
      "What if nothing was wasted? The circular economy reimagines our entire system of production and consumption for a sustainable future.",
    content: `
## The Problem: Our Linear Economy

Our current economy follows a **linear model**:

**Take → Make → Use → Throw Away**

- We extract raw materials from the Earth
- Manufacture them into products
- Use them (often briefly)
- Discard them as waste

This model is unsustainable because:
- Earth's resources are **finite**
- We generate **2 billion tonnes** of waste per year globally
- Waste pollutes land, water, and air
- Manufacturing is responsible for **21% of global emissions**

## What Is a Circular Economy?

A **circular economy** is an alternative system designed to eliminate waste and keep resources in use:

**Make → Use → Reuse → Repair → Recycle → Remake**

The core principles:
1. **Design out waste and pollution** from the start
2. **Keep products and materials in use** for as long as possible
3. **Regenerate natural systems** rather than depleting them

## Linear vs Circular: Examples

### Linear: Plastic Water Bottle
Oil extracted → Plastic manufactured → Bottle made → Water drunk → Bottle thrown away → Sits in landfill for 450 years

### Circular: Reusable Water System
Durable bottle manufactured → Used thousands of times → Eventually recycled into new products → Materials never become waste

### Linear: Fast Fashion T-Shirt
Cotton grown (water-intensive) → Manufactured → Worn 7 times → Thrown away → Landfill or incinerator

### Circular: Sustainable Fashion
Recycled/organic materials → Durable, timeless design → Worn for years → Repaired when needed → Eventually recycled into new fabric

## Key Strategies

### 1. Refuse
- Don't buy what you don't need
- Say no to unnecessary packaging and single-use items

### 2. Reduce
- Use less material in manufacturing
- Smaller, lighter products
- Digital alternatives to physical products

### 3. Reuse
- Design products for multiple uses
- Sharing economy (tool libraries, car sharing)
- Refill systems instead of single-use packaging

### 4. Repair
- Right to repair legislation (making products repairable)
- Repair cafés and community workshops
- Modular design (replace parts, not whole products)

### 5. Refurbish
- Restore used products to like-new condition
- Electronics refurbishment is a growing industry
- Saves resources and provides affordable alternatives

### 6. Remanufacture
- Take old products apart and rebuild them with new components
- Common in automotive and industrial equipment
- Uses **85% less energy** than manufacturing from scratch

### 7. Recycle
- Last resort when products can't be reused or repaired
- Break materials down to create new products
- Only works well with proper sorting and infrastructure

## Circular Economy in Action

### Netherlands
- Aims to be **fully circular by 2050**
- Amsterdam's Circular Strategy focuses on food, construction, and consumer goods

### Patagonia (Clothing)
- Repairs customer clothing for free
- Resells used items through "Worn Wear" programme
- Uses recycled materials in new products

### Fairphone (Electronics)
- Modular smartphone designed for easy repair
- Uses ethically sourced and recycled materials
- Users can replace individual components

### Loop (Packaging)
- Delivers products in reusable containers
- Empty containers are collected, cleaned, and refilled
- Partnered with major brands

## The Opportunity

The circular economy isn't just environmentally necessary — it's economically attractive:
- Could generate **$4.5 trillion** in economic benefits by 2030
- Creates new jobs in repair, remanufacturing, and recycling
- Reduces dependence on volatile raw material prices
- Builds more resilient local economies

## What Students Can Do

- **Choose reusable** over disposable (bags, bottles, containers)
- **Repair** clothes, electronics, and other items
- **Buy secondhand** when possible
- **Donate or sell** items you no longer need
- **Support circular businesses**
- **Learn about** product lifecycles and materials

## Summary

The circular economy is a fundamental reimagining of how we make, use, and dispose of things. Instead of the wasteful take-make-throw cycle, it keeps materials in use, designs out waste, and works with nature rather than against it. It's not just an environmental strategy — it's a smarter, more efficient economic model for the future.
    `,
    category: "Sustainability & Green Living",
    categorySlug: "sustainability",
    author: "Mrs. Priya Jayawardena",
    date: "2026-01-18",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
    featured: false,
    tags: ["circular economy", "sustainability", "waste reduction", "recycling", "A/L"],
    level: "A/L",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function searchArticles(query: string, category?: string): Article[] {
  const lower = query.toLowerCase();
  return articles.filter((a) => {
    const matchesQuery =
      a.title.toLowerCase().includes(lower) ||
      a.excerpt.toLowerCase().includes(lower) ||
      a.tags.some((t) => t.toLowerCase().includes(lower)) ||
      a.category.toLowerCase().includes(lower) ||
      a.content.toLowerCase().includes(lower);
    const matchesCategory = category ? a.categorySlug === category : true;
    return matchesQuery && matchesCategory;
  });
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
