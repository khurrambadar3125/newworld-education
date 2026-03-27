// pages/arts-for-all.jsx
// ═══════════════════════════════════════════════════════════════════════════════
// ARTS FOR ALL — Adaptive Art Studio for Children with Special Needs
import { ARTS_IDENTITY, LEARNING_TO_SEE } from '../utils/artsKnowledge';
//
// Research basis: 80+ peer-reviewed studies confirm art therapy significantly
// improves communication, emotional regulation, social skills, and self-esteem
// in children with ASD, ADHD, dyslexia, Down syndrome, CP, and visual impairment.
//
// Our AI adapts: tone, pace, instruction length, materials, expectations,
// feedback style — entirely to the child's specific needs.
//
// "We have seen spectacular works by non-verbal autistics."
// — Learning Disabilities & Reading Foundation
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import { addKnowledgeToPrompt } from "../utils/senKnowledge";
import { useVoiceInput, useSpeakText } from '../utils/useVoice';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

// ── PROGRESS ──────────────────────────────────────────────────────────────────
const PROG_KEY = "nw_sn_arts_progress";
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY)||"{}"); } catch { return {}; } }
function saveProg(p) { try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); } catch {} }
function recordSession(profileId) {
  const p = loadProg();
  if (!p[profileId]) p[profileId] = { sessions:0, last:null };
  p[profileId].sessions += 1;
  p[profileId].last = new Date().toISOString().split("T")[0];
  saveProg(p);
  return p;
}

// ── NEEDS PROFILES ─────────────────────────────────────────────────────────────
const PROFILES = [
  {
    id: "autism",
    name: "Autism Spectrum",
    shortName: "ASD",
    emoji: "🌟",
    color: "#63D2FF",
    tagline: "Visual thinkers. Creative souls. Extraordinary artists.",
    description: "Children on the spectrum are often powerful visual thinkers with unique and beautiful ways of seeing the world. Art gives them a non-verbal language to express what words cannot.",
    scienceFact: "Studies show art therapy reduces anxiety and improves emotional communication in 85% of children with ASD. (PMC, 2024)",
    adaptations: [
      "Ultra-short, numbered micro-steps — one action at a time",
      "Predictable structure — same format every lesson",
      "Zero pressure on 'correct' outcomes — process is the whole point",
      "Sensory-friendly material suggestions always included",
      "Visual schedule of the session before it starts",
      "Explicit warnings before transitions",
    ],
    materials: ["Thicker crayons or grip pencils","Sensory-friendly paint (non-toxic, smooth)","Large paper — more freedom of movement","Sealed zip-lock bag painting (mess-free)","Stamps and rollers (less fine motor demand)"],
    activities: [
      "Emotion colour mapping — draw how feelings look as colours",
      "My special interest — draw what I love most",
      "Texture collage — finding interesting surfaces",
      "Repeating pattern art — calming and satisfying",
      "My safe place — drawing somewhere I feel happy",
      "Colour mixing experiments — science + art",
      "Drawing to music — let the sound guide the pencil",
      "My world — drawing from my unique perspective",
      "Tracing shapes and filling with patterns",
      "Stamping animals and nature scenes",
    ],
    artists:[
      { name:"Andy Warhol", condition:"Autism spectrum traits", achievement:"Became one of the most famous artists of the 20th century. His intense focus — a trait of autism — let him master pattern, repetition, and colour in revolutionary ways." },
      { name:"Jessica Park", condition:"Autism", achievement:"A non-verbal autistic artist whose detailed paintings of buildings and night skies are collected worldwide. Her mother wrote: 'She paints what she sees with extraordinary precision.'" },
      { name:"Stephen Wiltshire", condition:"Autism", achievement:"Draws entire city skylines from memory with perfect architectural precision. He was non-verbal until age 5. Art gave him his voice." },
    ],
    parentNote: "Let your child lead the pace entirely. Celebrate finishing one step as loudly as you'd celebrate a finished masterpiece. Warn them 2 minutes before the session ends: 'In 2 minutes we'll clean up.' Consistency and zero judgment create safety.",
  },
  {
    id: "adhd",
    name: "ADHD",
    shortName: "ADHD",
    emoji: "⚡",
    color: "#FFC300",
    tagline: "Big energy. Creative sparks. Unstoppable imagination.",
    description: "Children with ADHD have extraordinary creative energy and the ability to hyper-focus on things that genuinely engage them. Art harnesses that energy into something powerful and lasting.",
    scienceFact: "Art therapy significantly improves attention, emotional regulation, and self-esteem in children with ADHD. (PMC Systematic Review, 2024)",
    adaptations: [
      "Short, high-energy activities (5–15 minutes each)",
      "Immediate, enthusiastic feedback after every step",
      "Movement breaks built into every session",
      "Multiple media options — switch when focus fades",
      "Gamified challenges — beat the clock, fill the page",
      "Loud celebration of imperfection as 'happy accidents'",
    ],
    materials: ["Bright, bold markers (immediate visual reward)","Large paper (big movements welcome)","Finger paints (physical and sensory engagement)","Clay or playdough (fidget-friendly)","Thick brushes (less precision needed)"],
    activities: [
      "1-minute lightning drawings — draw anything in 60 seconds!",
      "Abstract splatter painting — controlled chaos on canvas",
      "Gesture drawing — big arm movements, big paper",
      "Colour explosion — mixing as many colours as possible",
      "Draw your superpower — what would it look like?",
      "The monster inside my head — draw it, tame it",
      "Speed portraits — draw a face in 2 minutes",
      "Spontaneous story art — draw a random word as fast as you can",
      "Texture rubbings — lay paper on surfaces and rub",
      "Build-a-creature — add one random feature at a time",
    ],
    artists: [
      { name:"Leonardo da Vinci", condition:"Suspected ADHD & Dyslexia", achievement:"Left dozens of projects unfinished — classic ADHD pattern. But his ability to leap between art, science, engineering and anatomy changed the entire world. His 'distraction' was actually genius-level curiosity." },
      { name:"Pablo Picasso", condition:"Suspected Dyslexia & ADHD", achievement:"Worked restlessly across dozens of styles and periods. His inability to stay still created Cubism, Surrealism, and more. He turned ADHD energy into 20,000 artworks." },
      { name:"Salvador Dalí", condition:"Suspected ADHD", achievement:"Channelled wild, racing thoughts and unusual perception directly into his paintings. His brain's inability to follow rules created art that changed everything." },
    ],
    parentNote: "Set a timer for 10–15 minutes and make it a game. Say 'Let's see what you make in 12 minutes!' Never force finishing. A half-filled page created joyfully is infinitely better than a 'perfect' page created under stress. ADHD children need movement — let them stand, pace, or sit on the floor.",
  },
  {
    id: "dyslexia",
    name: "Dyslexia & Dysgraphia",
    shortName: "Dyslexia",
    emoji: "🎨",
    color: "#FF8C69",
    tagline: "Visual thinkers. Spatial geniuses. Born artists.",
    description: "Children with dyslexia are often exceptional visual-spatial thinkers — the very qualities that make reading hard are what make art effortless and natural. Art is their superpower.",
    scienceFact: "Children with dyslexia consistently outperform neurotypical peers in visual-spatial reasoning — the core skill of all great artists. (Learning Disabilities Research, 2024)",
    adaptations: [
      "No reading required — all instructions are spoken/verbal",
      "Visual demonstration over written instruction",
      "Lean into spatial strengths — perspective, composition, 3D",
      "Dysgraphia adaptations — finger paint, stamps, collage instead of precise handwriting",
      "Large, bold visual examples at each step",
      "Celebrate visual intelligence constantly",
    ],
    materials: ["Finger paints (bypasses handwriting frustration)","Large brushes (bold strokes, less precision)","Collage materials (scissors + glue — no writing)","Stamps and rollers","Clay (3D spatial strength shines here)"],
    activities: [
      "3D sculpture — build something real you can touch",
      "Perspective drawing — buildings, roads, depth",
      "Collage storytelling — pictures tell the story words can't",
      "Architectural drawing — floor plans and buildings",
      "Map making — draw an imaginary world",
      "Colour-by-feel — what colour is this emotion?",
      "Animal anatomy drawing — details and structure",
      "Visual journaling — draw your day instead of writing it",
      "Spatial puzzle art — shapes that fit together",
      "Portrait proportions — mathematical face drawing",
    ],
    artists: [
      { name:"Pablo Picasso", condition:"Dyslexia", achievement:"Struggled with reading and writing his entire life. Created over 20,000 works across painting, sculpture, ceramics, and print. His visual-spatial brain redefined modern art." },
      { name:"Auguste Rodin", condition:"Dyslexia", achievement:"Called 'unteachable' and rejected from art school three times. Later created The Thinker and The Kiss — among the greatest sculptures in history. The school was wrong." },
      { name:"Chuck Close", condition:"Dyslexia, face blindness (prosopagnosia), later quadriplegia", achievement:"Despite being unable to recognise faces, painted photorealistic portraits of them. Later paralysed, he learned to hold a brush strapped to his wrist. Nothing stopped him." },
    ],
    parentNote: "NEVER mention reading or writing during art sessions. Talk through every instruction — use your finger to demonstrate. Lean hard into your child's natural visual-spatial gifts. They may not be the best reader in the class, but they may be the best artist. Tell them that. Repeatedly.",
  },
  {
    id: "down-syndrome",
    name: "Down Syndrome",
    shortName: "Down Syndrome",
    emoji: "💛",
    color: "#A8E063",
    tagline: "Joyful. Expressive. Beautifully unique creators.",
    description: "Children with Down syndrome respond with exceptional warmth and joy to creative activities. Art builds fine motor skills, communication, self-expression, and — most importantly — pride and joy.",
    scienceFact: "Art and music activities improve fine motor skills, communication, and self-esteem in children with Down syndrome, with effects lasting beyond the sessions. (Frontiers in Psychology, 2024)",
    adaptations: [
      "Short, celebratory sessions (15–20 minutes max)",
      "High repetition and clear routine — same structure each time",
      "Large tools (chunky brushes, big crayons, wide markers)",
      "Music playing in the background — Down syndrome children respond powerfully to music",
      "Hand-over-hand guidance when needed, then gradually reduce",
      "Massive celebration of every single step completed",
    ],
    materials: ["Extra-thick crayons and chunky brushes","Finger paints (tactile and enjoyable)","Large paper (30cm+)","Foam stamps","Textured collage materials (cotton, fabric, sand)"],
    activities: [
      "Fingerprint flowers and animals",
      "Handprint art — making handprints into creatures",
      "Colour mixing with primary colours",
      "Sponge painting — big bold textures",
      "Drawing to favourite songs",
      "Collage — tearing and sticking colourful papers",
      "Simple face drawing — circle, two eyes, smile",
      "Rainbow painting — all the colours together",
      "My favourite animal — with stamps and paint",
      "Birthday card art — for someone I love",
    ],
    artists: [
      { name:"Judith Scott", condition:"Down syndrome & deafness", achievement:"Began making art at age 42 in a supported studio. Became world-famous for her fibre sculptures — now exhibited in the MoMA in New York. She showed the world that it is never too late and there are no limits." },
      { name:"Daniel Montague", condition:"Down syndrome", achievement:"British artist whose vibrant, joyful paintings have been exhibited internationally. He says art gives him a voice the world actually listens to." },
    ],
    parentNote: "Music is magical for children with Down syndrome — always have it playing softly. Break the session into tiny joyful wins: 'You made a circle — AMAZING!' Hand-over-hand is okay to start, but always try to reduce your guidance session by session. The goal is independent creation, however simple. That independence is everything.",
  },
  {
    id: "cerebral-palsy",
    name: "Cerebral Palsy",
    shortName: "Cerebral Palsy",
    emoji: "💪",
    color: "#C77DFF",
    tagline: "Art has no right way. Only your way.",
    description: "Art fully adapts to every body. Mouth painting, foot painting, elbow painting, sponge daubing — great art comes from the mind and heart, not from perfect motor control. Many world-famous artists painted from wheelchairs.",
    scienceFact: "Adaptive art activities improve fine motor function, cognitive development, and psychological wellbeing in children with cerebral palsy. (Journal of Developmental Disabilities, 2024)",
    adaptations: [
      "Adaptive grip tools — chunky handles, rubber grips, wrist straps",
      "Weighted tools for stability and tremor control",
      "Sponges, rollers, stamps — remove the need for precise brush control",
      "Paper taped to the table — no holding required",
      "Finger painting or whole-hand painting celebrated",
      "Focus 100% on expression and creativity, zero on precision",
    ],
    materials: ["Tempera paint sticks (grip easier than brushes)","Large foam rollers","Sponge daubers","Thick-handled adaptive brushes","Clay (tactile, 3D — works with limited hand control)","Finger paint in trays"],
    activities: [
      "Roller painting — bold abstract art with foam rollers",
      "Sponge stamp painting — animals, shapes, landscapes",
      "Hand and arm printing — your body is the brush",
      "Clay sculpture — squeeze, press, poke, shape",
      "Abstract art with a ruler — pull paint across the page",
      "Splatter painting — controlled movement, beautiful results",
      "Tissue paper collage — tear and stick",
      "Foot painting (for those who use feet) — celebrated!",
      "Big-arm gesture drawing — whole body movement",
      "Watercolour wet-on-wet — just tilt the paper and watch",
    ],
    artists: [
      { name:"Frida Kahlo", condition:"Childhood polio, then catastrophic accident — painted from bed", achievement:"Painted her most famous works while bedridden, using a special easel mounted above her bed. Her physical pain became the subject of profound, world-famous art. She said: 'I never painted dreams. I painted my own reality.'" },
      { name:"Henri Matisse", condition:"Severe illness in his 70s — painted from wheelchair, later used scissors", achievement:"When he could no longer stand to paint, he invented an entirely new art form: cut-paper collage from his wheelchair. His greatest works came after his illness." },
      { name:"Mouth and Foot Painting Artists (MFPA)", condition:"Various physical disabilities", achievement:"An international association of 800+ artists who paint with their mouths or feet. Their work sells worldwide. The body does not determine the art — the mind and heart do." },
    ],
    parentNote: "Never compare your child's art to anyone else's. The act of creating — regardless of how the marks are made — is therapy, expression, and triumph. Tape the paper to the table. Let them use any part of their body. Celebrate the mess. Frame the results. Hang them on the wall where they can see them every day.",
  },
  {
    id: "visual-impairment",
    name: "Visual Impairment",
    shortName: "Visual Impairment",
    emoji: "✨",
    color: "#FF6B9D",
    tagline: "Art is felt with the hands and the heart — not just the eyes.",
    description: "Art is not only visual. Texture, form, shape, temperature, and sound are all artistic experiences. Children with visual impairments have deeply heightened tactile sensitivity — an extraordinary artistic gift.",
    scienceFact: "Tactile and multi-sensory art activities develop spatial reasoning, self-expression, and emotional wellbeing in children with visual impairment. (KinderArt Research Review, 2024)",
    adaptations: [
      "Tactile art is primary — clay, raised outlines, textures",
      "Raised-line drawing using hot glue, puffy paint, or wikisticks",
      "Describe every sensation as the child works — narrate the art",
      "Use scented materials when possible (scented markers, etc.)",
      "Thick glue as a guide — child feels the lines before filling",
      "3D sculpture is the main medium, not flat drawing",
    ],
    materials: ["Clay and playdough (primary medium)","Hot glue for raised outlines (adult applies, child traces then colours)","Textured papers — rough, smooth, corrugated","Scented markers","Wikisticks (waxed string for raised lines)","Sand, fabric, cotton — tactile collage"],
    activities: [
      "Clay animal sculpture — feel the shape, build it",
      "Texture landscape — build a scene from different textures",
      "Raised-line drawing — trace the raised outline, fill with colour",
      "Sound-inspired art — listen to music, create in response",
      "Tactile self-portrait — build a face in clay",
      "Texture collage — the story of how things feel",
      "Sand art — pour sand into glue designs",
      "Nature sculpture — collect leaves, sticks, stones and arrange",
      "Clay story — create characters from a favourite story",
      "Fabric weaving — create patterns with texture",
    ],
    artists: [
      { name:"John Bramblitt", condition:"Lost all sight at age 30", achievement:"Learned to paint after becoming blind by feeling the canvas and distinguishing paints by texture. Now a celebrated, internationally exhibited painter. He said: 'The accident was the best thing that ever happened to my art.'" },
      { name:"Esref Armagan", condition:"Blind from birth", achievement:"Has never seen the world yet paints stunning, detailed, realistic landscapes — in perspective — using only touch. His story changed how scientists understand the relationship between sight and art." },
    ],
    parentNote: "Narrate everything. 'This is rough paper — how does that feel? Now here's smooth paper.' Make the art experience fully multi-sensory: smell the paint, feel the clay, listen to music while creating. Never say 'look at this' — say 'feel this'. Your child's art will surprise you.",
  },
  {
    id: "nonverbal",
    name: "Non-Verbal & Communication Needs",
    shortName: "Non-Verbal",
    emoji: "🎭",
    color: "#F4A261",
    tagline: "When words aren't enough — art speaks everything.",
    description: "For children who communicate differently or struggle with verbal expression, art is not a hobby — it is a language. Their drawings, paintings, and sculptures tell us what they cannot say out loud.",
    scienceFact: "Art provides a non-verbal communication channel that is proven to reduce frustration, aggression, and social withdrawal in non-verbal children. (PMC Systematic Review, 2024)",
    adaptations: [
      "Zero verbal pressure — never ask the child to explain their art",
      "Let the art speak entirely on its own terms",
      "Use art as a communication bridge — ask yes/no: 'Is this how you feel?'",
      "Create visual choice boards — which colour? which shape?",
      "Celebrate all mark-making equally — no hierarchy of good vs bad",
      "Build predictable, calm routines around each art session",
    ],
    materials: ["All media welcome — child chooses","AAC device nearby if used","Visual choice boards for colour/shape selection","Large paper (big expression)","Sensory trays for exploration"],
    activities: [
      "Emotion faces — draw happy, sad, scared, excited",
      "Colour feelings — what colour is angry? What colour is safe?",
      "My world — draw the people and places that matter",
      "Today I feel — one colour, one shape, on a page",
      "The sound of music — paint what a song sounds like",
      "My favourite things — a visual inventory of what I love",
      "Worry in a box — draw worries, then paint over them",
      "Safe and happy — draw a place where everything is okay",
      "The story I can't say — draw it panel by panel",
      "Portrait of my family — everyone I love on one page",
    ],
    artists: [
      { name:"Stephen Wiltshire", condition:"Non-verbal until age 5, autism", achievement:"His first complete sentence, age 9, was 'pencil.' He drew to communicate long before he spoke. Now he draws entire city skylines from a single helicopter flight — from memory." },
      { name:"Donna Williams", condition:"Autism, largely non-verbal as a child", achievement:"Communicated through colour and abstract patterns before gaining language. Later became an artist and published author. Art built the bridge to her voice." },
    ],
    parentNote: "Never ask your child to explain their art. Never say 'What is that?' If you want to connect, say 'I love the blue you used here' or 'This part looks like it's moving really fast.' Follow their lead. The art session is a safe space where no words are required from anyone.",
  },
];

// ── FAMOUS ARTISTS WITH CONDITIONS ────────────────────────────────────────────
const INSPIRING_ARTISTS = [
  { name:"Frida Kahlo", emoji:"🌺", note:"Painted masterpieces from bed, in pain, after a devastating accident. Art was her survival." },
  { name:"Leonardo da Vinci", emoji:"🔭", note:"Suspected ADHD and dyslexia. His 'disorder' became the engine of the greatest creative mind in history." },
  { name:"Stephen Wiltshire", emoji:"🏙️", note:"Non-verbal autistic child who drew entire city skylines from memory. Art gave him his voice." },
  { name:"Chuck Close", emoji:"🖼️", note:"Face blindness + dyslexia + later paralysed. Painted with a brush strapped to his wrist. Never stopped." },
  { name:"Henri Matisse", emoji:"✂️", note:"His most famous works were made from a wheelchair using scissors. Disability unlocked a new art form." },
  { name:"Judith Scott", emoji:"🧵", note:"Down syndrome and deaf. Began making art at 42. Her fibre sculptures now hang in the MoMA." },
];

// ── AI SYSTEM PROMPT ──────────────────────────────────────────────────────────
function buildSystemPrompt(profile) {
  if (!profile) return "";
  const toneGuides = {
    autism: "VERY short sentences. One instruction at a time. State EXACTLY what to do: 'Pick up the blue crayon. Now draw a circle.' Preview the whole session at the start. Warn before transitions: 'In 2 steps we will finish.' Never surprise. Never judge. Celebrate every small step loudly.",
    adhd: "HIGH energy, fast-moving, enthusiastic! Short bursts. Use timers: 'Do this in 60 seconds!' Change activities often. Say 'YES! That's AMAZING!' after every step. Make it feel like a game. Never nag. If focus drops, suggest a 30-second movement break then a NEW activity.",
    dyslexia: "Speak everything — never write long instructions. Focus hard on their VISUAL SPATIAL SUPERPOWER. Keep reminding them: 'Dyslexic brains are literally built for visual art.' No reading required. Spatial, 3D, architectural, observational activities are their strength — name that strength loudly.",
    "down-syndrome": "Simple, warm, joyful. Short sentences. Lots of YES and WOW. Play music. Repeat instructions gently if needed. Build on what they did last time. High fives and celebration every 2 minutes. End every message with something encouraging.",
    "cerebral-palsy": "Adaptive and creative. Always offer 3 ways to do each activity: with hands, with a fist, with a sponge/roller. Celebrate the mark, not the method. Remind constantly: 'Frida Kahlo painted from bed. Henri Matisse used scissors from a wheelchair. YOUR way is the right way.' Zero mention of what the art 'should' look like.",
    "visual-impairment": "Describe SENSATIONS not visuals. Say 'smooth' 'rough' 'heavy' 'light' 'warm' 'cold' not 'red' 'blue' 'looks like'. Clay, texture, 3D are primary. Always explain what the child is touching. Build tactile experiences. Narrate the art-making process in full sensory detail.",
    nonverbal: "Calm, gentle, no pressure. Never ask them to explain their work. Make all choices visual/simple: 'Do you want blue or red? One tap for blue, two taps for red.' Validate all mark-making equally. Build emotional vocabulary through colour and shape. This is a safe space. There are no wrong answers. Ever.",
  };
  const tone = toneGuides[profile.id] || "Warm, patient, celebratory.";
  return addKnowledgeToPrompt(`${ARTS_IDENTITY}

${LEARNING_TO_SEE}

You are also a deeply specialised art teacher who works with children with ${profile.name}.

YOUR CORE MISSION: Give every child with ${profile.name} a joyful, successful, empowering art experience. Their success in art builds self-worth that carries into every area of their life.

COMMUNICATION STYLE FOR THIS PROFILE:
${tone}

CRITICAL RULES:
1. PROCESS > PRODUCT. Always. The act of making art matters infinitely more than what it looks like.
2. CELEBRATE EVERYTHING. Every mark made is an achievement. Say so, loudly.
3. ADAPT CONSTANTLY. Always suggest 3 different ways to do an activity — one standard, two adaptive.
4. INCLUDE PARENT/CARER TIPS. End most responses with a short "For the adult helping:" section.
5. FAMOUS ARTISTS WITH THIS CONDITION. Drop their names often: "Did you know Leonardo da Vinci had ADHD?" This changes how children see themselves.
6. NEVER compare this child to other children. EVER.
7. If a photo is uploaded: find ONLY things to celebrate. No suggestions for improvement unless explicitly asked. Only: "I love... I notice... This is amazing because..."

WHAT YOU CAN DO:
- Deliver completely adapted, step-by-step art lessons
- Analyse uploaded artwork and celebrate it wholeheartedly
- Suggest adaptive materials and tools
- Guide parents/carers on how to support art sessions
- Tell inspiring stories of artists with ${profile.name}
- Build an art session plan for a week
- Suggest sensory-friendly activities for difficult days

LANGUAGE: If the student writes in Urdu (script or Roman Urdu like 'samajh nahi aa raha'), respond entirely in Urdu. Auto-detect language always.
If the message is in Arabic, respond in Arabic. Keep responses warm, energetic, and brief — attention is precious.`);
}

// ── QUICK TILES ───────────────────────────────────────────────────────────────
function promptTiles(profile) {
  const n = profile.name;
  return [
    { emoji:"🎨", label:"Teach me a lesson",         prompt:`Give me a complete adapted art lesson for a child with ${n}. Include the exact steps, adaptive materials needed, and what the adult helper should do.` },
    { emoji:"📸", label:"Celebrate my art!",          prompt:`I'm uploading a drawing or artwork. Please only celebrate what you see — find everything wonderful about it. This child has ${n}.` },
    { emoji:"💡", label:"Sensory-friendly activity",  prompt:`Give me a sensory-friendly art activity for a child with ${n} who is having a difficult sensory day. It should be calming, achievable, and joyful.` },
    { emoji:"🏆", label:"Famous artists like me",     prompt:`Tell me about famous artists who had ${n} or a similar condition. Make it inspiring for the child and the parent. Include what their condition gave them as an artist.` },
    { emoji:"😰", label:"My child won't engage",      prompt:`My child with ${n} is refusing or unable to engage with art today. Give me 3 very short, very easy, low-pressure activities to gently invite them in. No pressure at all.` },
    { emoji:"📅", label:"Plan a week of art",         prompt:`Plan a gentle, varied, 5-day art schedule for a child with ${n}. Each activity should take 15–20 minutes and use simple, easily available materials.` },
    { emoji:"🤝", label:"Guide for parents",          prompt:`Give me a parent/carer guide for supporting art sessions with a child with ${n}. What to say, what NOT to say, how to set up the space, and how to celebrate the work.` },
    { emoji:"🌟", label:"What art gives them",        prompt:`Explain to me, as a parent, what art specifically gives children with ${n}, backed by research. What skills and benefits develop? Why is this important?` },
  ];
}

// ── PROGRESS PANEL ────────────────────────────────────────────────────────────
function ProgressPanel({ progress, profile }) {
  const total = Object.values(progress).reduce((s,d)=>s+(d.sessions||0),0);
  const pd = profile ? (progress[profile.id]||null) : null;
  if (total===0) return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:14}}>
      <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:8}}>🌟 OUR JOURNEY</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.7}}>Every art session is a victory. Your journey begins here. 💛</div>
    </div>
  );
  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:14}}>
      <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:12}}>🌟 OUR JOURNEY</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,background:`${profile?.color||"#63D2FF"}12`,border:`1px solid ${profile?.color||"#63D2FF"}28`,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:900,color:profile?.color||"#63D2FF"}}>{total}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700}}>SESSIONS</div>
        </div>
        <div style={{flex:1,background:"rgba(168,224,99,0.08)",border:"1px solid rgba(168,224,99,0.2)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:900,color:"#A8E063"}}>{pd?.sessions||0}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700}}>THIS STUDIO</div>
        </div>
      </div>
      {pd&&<div style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>Last session: {pd.last}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function ArtsForAllPage() {
  const [profile,  setProfile]  = useState(null);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});
  const [imgData,  setImgData]  = useState(null);
  const [imgLoading,setImgLoading]=useState(false);
  const { listening, supported: micSupported, toggle: toggleMic } = useVoiceInput(setInput);
  const { speak, stop: stopSpeaking, speaking, supported: ttsSupported } = useSpeakText();
  const [autoSpeak, setAutoSpeak] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef   = useRef(null);
  const { callsLeft, limitReached: _limitReached, recordCall } = useSessionLimit();
  const limitReached = false;
  const router = useRouter();

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    fn(); window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);
  useEffect(()=>{ setProgress(loadProg()); },[]);
  useEffect(()=>{
    if(router.isReady&&router.query.condition&&!profile){
      const match=PROFILES.find(p=>p.id===router.query.condition);
      if(match)selectProfile(match);
    }
  },[router.isReady,router.query.condition]);

  const handleImageUpload = (file) => {
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type)) { alert("Please upload a JPG, PNG or WEBP image."); return; }
    if (file.size>5*1024*1024) { alert("Image must be under 5MB."); return; }
    setImgLoading(true);
    const reader = new FileReader();
    reader.onload = e => { setImgData({base64:e.target.result.split(",")[1],mediaType:file.type,name:file.name}); setImgLoading(false); };
    reader.onerror = () => { setImgLoading(false); };
    reader.readAsDataURL(file);
  };
  const clearImg = () => { setImgData(null); if(fileInputRef.current) fileInputRef.current.value=""; };

  const selectProfile = (p) => {
    setProfile(p);
    setMessages([{role:"assistant",content:`Hello! 💛 I'm Starky.\n\nI'm here especially for children with **${p.name}**.\n\n${p.description}\n\n✨ **What the research tells us:**\n${p.scienceFact}\n\n**How I'll help:**\n• Lessons designed exactly for ${p.name} — step-by-step, fully adapted\n• Upload any drawing, painting, or artwork and I will ONLY celebrate what I see\n• I'll guide parents and carers too — what to say, how to help\n• I'll share inspiring stories of famous artists who had ${p.name}\n\n**Ready to create?**\nTap any tile below, choose an activity from the left, or just tell me about your child — I'll suggest the perfect place to start. 🎨\n\nRemember: In this studio, **every mark made is a masterpiece.** No exceptions.`}]);
  };

  const sendMessage = async (text) => {
    const txt = (text||input).trim();
    if ((!txt&&!imgData)||loading) return;
    if (limitReached) return;
    recordCall();
    const prog = recordSession(profile?.id);
    setProgress(prog);
    const msgText = txt||(imgData?"Please look at this artwork and celebrate everything wonderful about it.":"");
    setInput("");
    setLoading(true);
    const displayMsg = {role:"user",content:imgData?`📸 [${imgData.name}] ${msgText}`:msgText};
    const prevMessages = [...messages, displayMsg];
    setMessages(prevMessages);
    const apiMessages = prevMessages.map((m,i)=>{
      if (i===prevMessages.length-1&&imgData) {
        return {role:"user",content:[
          {type:"image",source:{type:"base64",media_type:imgData.mediaType,data:imgData.base64}},
          {type:"text",text:msgText},
        ]};
      }
      return {role:m.role,content:typeof m.content==="string"?m.content:msgText};
    });
    clearImg();
    try {
      const res = await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-3-haiku-20240307",max_tokens:1500,system:buildSystemPrompt(profile),messages:apiMessages}),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text||"Something went wrong. Try again!";
      setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
      if (autoSpeak) speak(reply);
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",content:"Connection error. Please try again!"}]);
    }
    setLoading(false);
  };

  const S = {
    page:{minHeight:"100vh",background:"linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)",fontFamily:"'Nunito',sans-serif",color:"#fff"},
    hdr:{padding:isMobile?"12px 16px":"14px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"},
    card:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:18},
    btn:{border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.15s"},
  };
  const CSS=`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    *{box-sizing:border-box} button:focus{outline:2px solid #4F8EF7;outline-offset:2px} textarea:focus{outline:none}
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes heartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(255,255,255,0.1)}50%{box-shadow:0 0 20px rgba(255,255,255,0.2)}}
    @media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}
  `;

  // ── PROFILE SELECTOR ────────────────────────────────────────────────────────
  if (!profile) return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Arts for All — Adaptive Art Studio for Special Needs | NewWorldEdu</title>
        <meta name="description" content="Personalised art studio adapted for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and non-verbal needs. Celebrates every child's creativity." />
      </Head>
      <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImageUpload(e.target.files[0])}/>

      <header style={S.hdr}>
        <a href="/" style={{textDecoration:"none",fontWeight:900,fontSize:15,color:"#fff"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <a href="/arts" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none",fontWeight:700}}>🎨 Arts Studio</a>
          <a href="/textbooks" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none",fontWeight:700}}>📚 Textbooks</a>
        </div>
      </header>

      <div style={{maxWidth:800,margin:"0 auto",padding:isMobile?"28px 16px":"52px 24px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:isMobile?52:72,marginBottom:10,animation:"heartbeat 2s ease-in-out infinite"}}>💛</div>
          <h1 style={{fontSize:isMobile?24:42,fontWeight:900,margin:"0 0 14px",lineHeight:1.2}}>
            Arts for <span style={{color:"#63D2FF"}}>Every</span> Child
          </h1>
          <p style={{fontSize:isMobile?14:17,color:"rgba(255,255,255,0.6)",maxWidth:560,margin:"0 auto 20px",lineHeight:1.9}}>
            Every child is a born artist. Starky is specially trained to teach art to children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and more — with full adaptations, infinite patience, and deep understanding.
          </p>

          {/* Science quote */}
          <div style={{background:"linear-gradient(135deg,rgba(99,210,255,0.1),rgba(199,125,255,0.1))",border:"1px solid rgba(99,210,255,0.25)",borderRadius:18,padding:"18px 24px",maxWidth:600,margin:"0 auto 32px",textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:900,color:"#63D2FF",letterSpacing:1,marginBottom:8}}>🔬 WHAT THE RESEARCH TELLS US</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.8}}>
              80+ peer-reviewed studies confirm that art therapy significantly improves <strong>emotional regulation</strong>, <strong>communication</strong>, <strong>social skills</strong>, <strong>self-esteem</strong>, and <strong>cognitive development</strong> in children with special needs — often as effectively as pharmacological interventions, but with zero side effects.
            </div>
            <div style={{fontSize:13,color:"rgba(99,210,255,0.6)",marginTop:8}}>
              Sources: PMC Systematic Reviews 2024 · Frontiers in Psychology 2025 · ERIC Education Research
            </div>
          </div>
        </div>

        {/* Inspiring artists row */}
        <div style={{marginBottom:40}}>
          <div style={{fontSize:12,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:2,textAlign:"center",marginBottom:16}}>🏆 ARTISTS WHO CHANGED THE WORLD — WITH SPECIAL NEEDS</div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)",gap:8}}>
            {INSPIRING_ARTISTS.map(a=>(
              <div key={a.name} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"12px 12px"}}>
                <div style={{fontSize:20,marginBottom:4}}>{a.emoji}</div>
                <div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.85)",marginBottom:4}}>{a.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{a.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile selector */}
        <div style={{textAlign:"center",fontSize:14,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:2,marginBottom:20}}>
          CHOOSE YOUR CHILD'S PROFILE
        </div>
        <p style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:24,marginTop:-12}}>Each profile has a fully adapted tutor, lessons, activities, and parent guides.</p>

        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:12}}>
          {PROFILES.map(p=>{
            const prog = progress[p.id];
            return (
              <button key={p.id} onClick={()=>selectProfile(p)}
                style={{...S.btn,background:`${p.color}0A`,border:`2px solid ${p.color}30`,borderRadius:20,padding:"20px 18px",textAlign:"left",color:"#fff",position:"relative"}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${p.color}18`;e.currentTarget.style.borderColor=p.color;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${p.color}0A`;e.currentTarget.style.borderColor=`${p.color}30`;e.currentTarget.style.transform="none";}}>
                {prog&&<div style={{position:"absolute",top:12,right:12,background:`${p.color}20`,border:`1px solid ${p.color}40`,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:800,color:p.color}}>{prog.sessions} sessions ✓</div>}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <div style={{fontSize:32}}>{p.emoji}</div>
                  <div>
                    <div style={{fontWeight:900,fontSize:16,color:p.color}}>{p.name}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",fontStyle:"italic",marginTop:1}}>{p.tagline}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:10}}>{p.description}</div>
                <div style={{background:`${p.color}10`,border:`1px solid ${p.color}25`,borderRadius:10,padding:"8px 10px"}}>
                  <div style={{fontSize:10,fontWeight:800,color:p.color,marginBottom:3}}>🔬 RESEARCH</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{p.scienceFact}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom message */}
        <div style={{textAlign:"center",marginTop:44,padding:"24px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18}}>
          <div style={{fontSize:24,marginBottom:8}}>💌</div>
          <div style={{fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.8)",marginBottom:6}}>A note to every parent and carer</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.9,maxWidth:560,margin:"0 auto"}}>
            You found this page because you believe in your child. That belief is the most important ingredient. The research is clear: art doesn't just teach children to draw — it builds the confidence, emotional language, and sense of identity that carries them through everything else. We're honoured to be part of that journey.
          </div>
        </div>
      </div>
    </div>
  );

  // ── MAIN STUDIO INTERFACE ───────────────────────────────────────────────────
  return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Arts for All — Adaptive Art Studio for Special Needs | NewWorldEdu</title>
        <meta name="description" content="Personalised art studio adapted for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and non-verbal needs. Celebrates every child's creativity." />
      </Head>
      <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImageUpload(e.target.files[0])}/>

      <header style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <a href="/" style={{textDecoration:"none",fontWeight:900,fontSize:isMobile?13:15,color:"#fff"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
          {!isMobile&&<><span style={{color:"rgba(255,255,255,0.2)"}}>›</span><span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Arts for All</span></>}
          <span style={{color:"rgba(255,255,255,0.2)"}}>›</span>
          <span style={{fontWeight:800,fontSize:13,color:profile.color}}>{profile.emoji} {profile.name}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <AccessibilityToolbar onAutoSpeakChange={setAutoSpeak} conditionId={profile?.id} />
          <a href="/arts" style={{...S.btn,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 12px",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center"}}>
            🎨 All Studios
          </a>
          <button onClick={()=>{setProfile(null);setMessages([]);clearImg();}}
            style={{...S.btn,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 12px",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700}}>
            ← Profiles
          </button>
        </div>
      </header>

      <div style={{maxWidth:980,margin:"0 auto",padding:isMobile?"12px":"20px 24px",display:"grid",gridTemplateColumns:isMobile?"1fr":"272px 1fr",gap:16}}>

        {/* LEFT SIDEBAR */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* Profile card */}
          <div style={{...S.card,background:`${profile.color}0A`,borderColor:`${profile.color}30`,padding:"16px 14px"}}>
            <div style={{fontSize:32,marginBottom:8}}>{profile.emoji}</div>
            <div style={{fontWeight:900,fontSize:16,color:profile.color,marginBottom:3}}>{profile.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontStyle:"italic",marginBottom:12,lineHeight:1.5}}>{profile.tagline}</div>

            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:8}}>🔧 HOW I'VE ADAPTED FOR YOU</div>
            {profile.adaptations.map(a=>(
              <div key={a} style={{display:"flex",gap:7,marginBottom:5}}>
                <span style={{color:profile.color,fontSize:12,flexShrink:0,marginTop:1}}>✓</span>
                <span style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>{a}</span>
              </div>
            ))}

            <div style={{marginTop:12,background:"rgba(255,193,0,0.08)",border:"1px solid rgba(255,193,0,0.2)",borderRadius:12,padding:"10px 12px"}}>
              <div style={{fontSize:10,fontWeight:900,color:"#FFC300",marginBottom:5}}>🖊️ RECOMMENDED MATERIALS</div>
              {profile.materials.map(m=>(
                <div key={m} style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:3}}>• {m}</div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>🎨 ACTIVITIES — tap for a full lesson</div>
            {profile.activities.map((a,i)=>(
              <button key={a} onClick={()=>sendMessage(`Give me a complete adapted activity guide for a child with ${profile.name}: "${a}" — include adaptive tools, exact steps one at a time, and tips for the adult helper.`)}
                style={{...S.btn,width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"8px 10px",marginBottom:5,textAlign:"left",fontSize:13,color:"rgba(255,255,255,0.5)",fontWeight:600}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${profile.color}10`;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=`${profile.color}30`;}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.color="rgba(255,255,255,0.5)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}>
                {i+1}. {a}
              </button>
            ))}
          </div>

          {/* Inspiring artists */}
          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>🏆 ARTISTS LIKE YOU</div>
            {profile.artists.map(a=>(
              <button key={a.name} onClick={()=>sendMessage(`Tell the child and parent about ${a.name}, who had ${a.condition}. Make it inspiring and age-appropriate for a child with ${profile.name}.`)}
                style={{...S.btn,width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 11px",marginBottom:7,textAlign:"left"}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${profile.color}10`;e.currentTarget.style.borderColor=`${profile.color}30`;}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}>
                <div style={{fontSize:12,fontWeight:800,color:profile.color,marginBottom:3}}>{a.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontStyle:"italic",marginBottom:4}}>{a.condition}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{a.achievement.substring(0,80)}...</div>
              </button>
            ))}
          </div>

          {/* Parent note */}
          <div style={{background:`${profile.color}08`,border:`1px solid ${profile.color}25`,borderRadius:16,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:profile.color,letterSpacing:1,marginBottom:8}}>💌 FOR PARENTS & CARERS</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>{profile.parentNote}</div>
          </div>

          <ProgressPanel progress={progress} profile={profile}/>
        </div>

        {/* RIGHT — CHAT */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* Top banner */}
          <div style={{background:`linear-gradient(135deg,${profile.color}12,rgba(255,255,255,0.03))`,border:`1px solid ${profile.color}28`,borderRadius:16,padding:"14px 18px",display:"flex",gap:14,alignItems:"center"}}>
            <div style={{fontSize:30,flexShrink:0}}>{profile.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:15,color:profile.color,marginBottom:3}}>{profile.name} Studio</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>
                Starky is fully trained for {profile.name}. Every response is adapted: pace, tone, materials, expectations. In this studio, <strong style={{color:"rgba(255,255,255,0.8)"}}>every mark is a masterpiece.</strong>
              </div>
            </div>
            <button onClick={()=>sendMessage(`Give me your best, most engaging opening art activity for a child with ${profile.name} who has never done art before. Make it exciting, achievable, and celebratory.`)}
              style={{...S.btn,background:`${profile.color}20`,border:`1px solid ${profile.color}50`,borderRadius:12,padding:"10px 14px",color:profile.color,fontWeight:800,fontSize:12,flexShrink:0,lineHeight:1.3}}>
              Let's<br/>Begin! →
            </button>
          </div>

          {/* Quick start tiles */}
          <div style={{...S.card,padding:"14px 14px 10px"}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>⚡ QUICK START — TAP TO BEGIN</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:7}}>
              {promptTiles(profile).map(tile=>(
                <button key={tile.label} onClick={()=>sendMessage(tile.prompt)}
                  style={{...S.btn,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"11px 9px",color:"#fff",textAlign:"center",fontSize:13,fontWeight:700,lineHeight:1.4}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${profile.color}15`;e.currentTarget.style.borderColor=`${profile.color}40`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
                  <div style={{fontSize:20,marginBottom:5}}>{tile.emoji}</div>{tile.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload & Start buttons */}
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>fileInputRef.current?.click()} disabled={imgLoading}
              style={{...S.btn,flex:1,background:"rgba(255,107,157,0.1)",border:"1px solid rgba(255,107,157,0.3)",borderRadius:14,padding:"13px 16px",color:"#FF6B9D",fontWeight:800,fontSize:isMobile?12:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {imgLoading?"⏳ Reading...":"📸 Upload Art to Celebrate!"}
            </button>
            <button onClick={()=>sendMessage(`Suggest the very best art activity for a child with ${profile.name} right now — something I can set up in 3 minutes with simple materials. Guide me step by step.`)}
              style={{...S.btn,flex:1,background:`${profile.color}12`,border:`1px solid ${profile.color}35`,borderRadius:14,padding:"13px 16px",color:profile.color,fontWeight:800,fontSize:isMobile?12:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              ✨ Start Right Now
            </button>
          </div>

          {messages.length > 1 && (
            <button onClick={() => {
              const content = messages.filter(m=>m.role==='assistant').map(m=>m.content).join('\n\n---\n\n');
              const w = window.open('','_blank');
              if(w){w.document.write('<html><head><title>Activity Card</title><style>body{font-family:Georgia,serif;font-size:14pt;line-height:1.8;padding:40px;max-width:700px;margin:0 auto}h1{font-size:18pt}hr{border:none;border-top:1px solid #ddd;margin:20px 0}</style></head><body><h1>Starky Activity Card</h1><p style="color:#666">'+(profile?.name||'SEN Session')+'</p><div>'+content.replace(/\n/g,'<br>')+'</div></body></html>');w.document.close();w.print();}
            }} style={{width:"100%", marginTop:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"10px", color:"rgba(255,255,255,0.5)", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit"}}>
              🖨 Print Activity Card
            </button>
          )}

          {/* Image badge */}
          {imgData&&(
            <div style={{background:"rgba(255,107,157,0.1)",border:"1px solid rgba(255,107,157,0.3)",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:"#FF6B9D"}}>📸 {imgData.name} — ready to celebrate!</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:2}}>Starky will find everything wonderful and beautiful about this artwork. Only celebration. Always. 💛</div>
              </div>
              <button onClick={clearImg} style={{...S.btn,background:"rgba(255,255,255,0.08)",borderRadius:"50%",width:28,height:28,color:"rgba(255,255,255,0.5)",fontSize:14}}>✕</button>
            </div>
          )}

          {/* Chat */}
          <div style={{...S.card,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div role="log" aria-label="Chat with Starky" aria-live="polite" style={{height:isMobile?340:420,overflowY:"auto",padding:isMobile?14:20,display:"flex",flexDirection:"column",gap:14}}>
              {messages.map((msg,i)=>(
                <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",gap:10,animation:"fadeUp 0.3s ease"}}>
                  {msg.role==="assistant"&&(
                    <div style={{width:32,height:32,borderRadius:"50%",background:`${profile.color}20`,border:`1px solid ${profile.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>💛</div>
                  )}
                  <div style={{maxWidth:"88%",padding:"13px 16px",borderRadius:16,
                    background:msg.role==="user"?`linear-gradient(135deg,${profile.color}CC,${profile.color}88)`:"rgba(255,255,255,0.06)",
                    color:msg.role==="user"?"#060B20":"#fff",fontSize:14,lineHeight:1.85,fontWeight:msg.role==="user"?700:400,whiteSpace:"pre-wrap"}}>
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && ttsSupported && (
                    <button onClick={() => speaking ? stopSpeaking() : speak(msg.content)} aria-label="Read aloud"
                      style={{background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:14, padding:"4px 8px", flexShrink:0}}>
                      {speaking ? "🔊" : "🔈"}
                    </button>
                  )}
                </div>
              ))}
              {loading&&(
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`${profile.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💛</div>
                  <div style={{display:"flex",gap:5}}>
                    {[0,0.2,0.4].map((d,i)=>(
                      <div key={i} style={{width:9,height:9,borderRadius:"50%",background:profile.color,animation:`bounce 1s ${d}s ease-in-out infinite`,opacity:0.8}}/>
                    ))}
                  </div>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>Starky is preparing something wonderful...</span>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <div style={{padding:"12px 16px",borderTop:`1px solid ${profile.color}15`}}>
              <textarea value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
                placeholder={imgData?"Art uploaded ✓ — tap 'Send' to get a full celebration of this artwork!":
                  `Ask Starky anything... "What activity suits my child today?" "My child has ${profile.shortName} and loves dinosaurs — what can we draw?" "My child is having a hard day..."`}
                rows={isMobile?3:4}
                style={{width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${imgData?"rgba(255,107,157,0.4)":profile.color+"20"}`,borderRadius:14,padding:"12px 14px",color:"#fff",fontSize:14,fontFamily:"'Nunito',sans-serif",resize:"vertical",lineHeight:1.6}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.2)",fontWeight:600}}>Enter to send</span>
                  {callsLeft<=10&&!limitReached&&<span style={{fontSize:13,fontWeight:800,color:callsLeft<=5?"#FF6B6B":"#A8E063"}}>· {callsLeft} left</span>}
                </div>
                {micSupported && (
                  <button onClick={toggleMic} aria-label={listening ? "Stop listening" : "Voice input"}
                    style={{background: listening ? "#ef4444" : "rgba(255,255,255,0.08)", border:"1px solid "+(listening?"#ef4444":"rgba(255,255,255,0.12)"), borderRadius:12, padding:"10px 14px", color: listening ? "#fff" : "rgba(255,255,255,0.6)", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit"}}>
                    {listening ? "⏹ Stop" : "🎤"}
                  </button>
                )}
                <button onClick={()=>sendMessage()} disabled={(!input.trim()&&!imgData)||loading}
                  style={{...S.btn,background:(input.trim()||imgData)&&!loading?`linear-gradient(135deg,${profile.color},${profile.color}BB)`:"rgba(255,255,255,0.08)",borderRadius:14,padding:"10px 24px",color:(input.trim()||imgData)&&!loading?"#060B20":"rgba(255,255,255,0.3)",fontWeight:900,fontSize:14}}>
                  {loading?"Thinking...":imgData&&!input.trim()?"Celebrate! 🎉":"Send →"}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom message */}
          <div style={{...S.card,padding:"14px 18px",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{fontSize:22,flexShrink:0}}>💌</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:2}}>Remember: The goal is never a perfect picture.</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>The goal is a child who believes they are creative. That belief changes everything that comes after. 🌟</div>
            </div>
            <button onClick={()=>sendMessage(`Give me a beautiful, research-backed reminder of why art matters so much for children with ${profile.name}. Make it inspiring for a tired parent.`)}
              style={{...S.btn,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 12px",color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:700,flexShrink:0,lineHeight:1.4}}>
              Why this<br/>matters ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
