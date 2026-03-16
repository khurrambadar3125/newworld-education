// pages/music-for-all.jsx
// AI Music Studio for Special Needs — 7 profiles, research-backed
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import { addKnowledgeToPrompt } from "../utils/senKnowledge";
import { useVoiceInput, useSpeakText } from '../utils/useVoice';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

const PROG_KEY = "nw_sn_music_progress";
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY)||"{}"); } catch { return {}; } }
function saveProg(p) { try { localStorage.setItem(PROG_KEY,JSON.stringify(p)); } catch {} }
function recordSession(id) {
  const p = loadProg();
  if (!p[id]) p[id] = { sessions:0, last:null };
  p[id].sessions++; p[id].last = new Date().toISOString().split("T")[0];
  saveProg(p); return p;
}

const PROFILES = [
  {
    id:"autism", name:"Autism Spectrum", shortName:"ASD", emoji:"🌟", color:"#63D2FF",
    tagline:"Music is the language that reaches every mind.",
    description:"Children on the spectrum often have an extraordinary relationship with music — heightened pitch sensitivity, perfect recall of melodies, deep emotional response to sound. Music therapy is the most evidenced intervention for ASD that exists.",
    scienceFact:"Cochrane review: Music therapy was superior to standard treatment for ASD in social interaction, communication, and emotional reciprocity across 1,774 participants. (Frontiers in Psychiatry, 2021)",
    musicBenefits:["Reduces cortisol and increases dopamine production","Builds structured, predictable experiences that reduce anxiety","Improves joint attention, turn-taking and social responsiveness","Provides non-verbal emotional expression when words fail","Rhythm entrainment improves motor coordination"],
    adaptations:["Same opening song EVERY session — predictable ritual","Visual schedule of the session before it starts","One instruction at a time — never stack requests","Sensory-check before instruments: Is this sound okay?","Allow headphones if overwhelmed","Celebrate any engagement — humming counts","Warn transitions 2 songs early"],
    instruments:["Drums / hand drum (cause & effect, rhythm)","Xylophone (colour-coded notes, visual pitch)","Piano (structured, play with one finger)","Shakers & bells (easy grip, immediate sound)","Voice — the instrument they already own","Switch-activated adaptive instruments"],
    activities:["Hello song ritual — same song to open every session","Name-rhythm game — clap syllables of names","Emotion sounds — what does happy sound like? Angry? Calm?","Imitation game — I play 3 beats, you copy exactly","Free drumming — no rules, just sound exploration","Favourite song — play along to a loved familiar song","Calm-down music — discover songs that regulate","Musical storytelling — sound effects for a simple story","Beat-matching — tap along to metronome or recorded song","Create a goodbye ritual song — theirs, not imposed"],
    musicians:[
      {name:"Wolfgang Amadeus Mozart", condition:"Suspected ASD traits", achievement:"Hypersensitive hearing, social difficulty, obsessive patterns — now recognised as autistic traits. His extraordinary musical memory and pattern recognition are classic autistic strengths. Began composing at age 5."},
      {name:"Gary Numan", condition:"Asperger syndrome (diagnosed adult)", achievement:"The synth-pop pioneer who wrote 'Cars' said his autism made him 'see music differently.' His hyperfocus and pattern thinking created sounds nobody had heard before."},
      {name:"Hikari Oe", condition:"Autism with intellectual disability", achievement:"Japanese composer who is largely non-verbal but communicates through complex piano compositions. His father — Nobel laureate Kenzaburo Oe — said music gave Hikari his voice."},
    ],
    parentNote:"The ritual IS the therapy. Opening the same song every session creates neurological safety that allows learning. Never skip it. When your child rocks, hums, or covers their ears: they are not misbehaving. They are regulating. Music is working.",
  },
  {
    id:"adhd", name:"ADHD", shortName:"ADHD", emoji:"⚡", color:"#FFC300",
    tagline:"ADHD brains were made for music. Rhythm IS regulation.",
    description:"Music is structurally perfect for ADHD. Rhythm provides external regulation. Short, high-intensity activities match the ADHD attention profile. Drumming specifically reduces hyperactivity and improves focus — and it is the most fun a person can have.",
    scienceFact:"Rhythm-based music therapy significantly reduces hyperactivity symptoms and improves self-regulation in ADHD. Music increases dopamine — the exact neurotransmitter ADHD medication targets. Zero side effects. (IJAR, 2025)",
    musicBenefits:["Rhythm provides external structure that regulates the ADHD nervous system","Music increases dopamine — same target as ADHD medication, no side effects","Drumming specifically reduces hyperactivity and aggression","Short musical games build attention span incrementally","Music gives ADHD children a space where energy is celebrated, not suppressed"],
    adaptations:["Activities in 5–10 minute bursts, then switch","Physical movement incorporated — stand, march, tap, dance","Drums and percussion first — channel energy into rhythm","Gamify: 'Can you keep the beat for 30 seconds?'","Immediate positive feedback after every beat kept","Let them lead — if they want to switch, go with it","Movement break built into every session"],
    instruments:["Drums — the ultimate ADHD instrument","Body percussion — no setup, immediate","Maracas & shakers — physical and immediate","Piano (can play loud fast pieces)","Guitar (strumming is physical)","Djembe or bongo drums"],
    activities:["Drum battle — you play a rhythm, I copy; I play, you copy","Beat-the-clock — keep a steady beat for 1 minute","March and clap — walk to a beat around the room","Fastest drummer — build up speed together","Body percussion groove — claps, stomps, snaps","Song of the day — play along to favourite song","Freestyle rap rhythm — rap about anything to a 4-beat pattern","Musical statues — freeze when music stops","Speed rounds — one chord, 10 times as fast as possible","Emotion drumming — drum out anger, excitement, calm"],
    musicians:[
      {name:"Justin Timberlake", condition:"ADHD and OCD", achievement:"His restlessness and hyperfocus drove him to practise relentlessly and pay extraordinary attention to rhythm. His ADHD energy is visible in every performance."},
      {name:"Solange Knowles", condition:"ADHD", achievement:"Said her diagnosis helped her understand 'why my brain works the way it does — and that it is an advantage.' Channelled ADHD energy into multi-disciplinary music and art."},
      {name:"Will.i.am", condition:"ADHD", achievement:"Said ADHD means he produces 5 songs in a session others produce 1. His rapid idea-generation and inability to stay conventional created his unique sound."},
    ],
    parentNote:"Drums are medicine. 10 minutes of rhythmic drumming before schoolwork measurably improves focus in ADHD children. The energy does not disappear when suppressed — it causes explosions. When it goes into music, it becomes art.",
  },
  {
    id:"dyslexia", name:"Dyslexia & Learning Differences", shortName:"Dyslexia", emoji:"🎵", color:"#FF8C69",
    tagline:"Rhythm training is the most powerful reading intervention that exists.",
    description:"The connection between music and dyslexia is one of the most exciting findings in neuroscience. Children with dyslexia often have extraordinary musical ability — AND music training directly improves reading. Rhythm training repairs the phonological processing deficit at the root of dyslexia.",
    scienceFact:"Habib et al. documented improvement in phonological perception, word reading, and auditory attention in dyslexic children after music therapy. Rhythm entrainment directly repairs the phonological processing deficit of dyslexia. (Frontiers in Psychiatry, 2021)",
    musicBenefits:["Rhythm training directly improves phonological processing — the root of dyslexia","Music notation is visual-spatial — dyslexic strengths shine here","Playing by ear is completely accessible for dyslexic learners","Musical memory is often exceptional in dyslexic students","Music provides academic success where other subjects have failed"],
    adaptations:["Teach by ear FIRST — never force notation on day one","Colour-coded notes instead of standard notation","Rely on patterns and shapes, not reading","Multisensory: sing it, clap it, play it — all three together","Short clear spoken instructions — never written","Use their exceptional auditory memory as primary learning route","Celebrate playing from memory — it IS musical literacy"],
    instruments:["Piano (colour-coded keys)","Guitar (chord shapes not notation)","Drums (pure rhythm — no reading needed)","Ukulele (4 strings, simple shapes)","Voice (the ear-based instrument)","Any instrument where playing by ear is primary"],
    activities:["Clap the syllables of spoken sentences","Rhythm dictation by ear — hear a pattern, copy on drums","Colour-code the piano — learn songs by colour not notation","Chord-shape guitar — 3 chords by shape = a whole song","Sing everything — vocabulary, times tables, facts into song","Pattern spotting — find the repeat in a song","Ear-training echo — hear a melody, sing it back","Beat subdivision — feel the pulse, find the halfbeats","Song deconstruction — how many sections does it have?","Compose by ear — improvise freely then remember and repeat"],
    musicians:[
      {name:"John Lennon", condition:"Dyslexia", achievement:"Struggled academically his entire life. Music was the one space where his brain worked perfectly. The Beatles' harmonic complexity shows what a dyslexic musical mind can do."},
      {name:"Ozzy Osbourne", condition:"Dyslexia and ADHD", achievement:"Could not read music notation. Learned everything by ear and memory. His uncontaminated musical instincts created Heavy Metal."},
      {name:"Cher", condition:"Dyslexia and dyscalculia", achievement:"Described school as 'torture.' Music was the space where she felt competent. Entirely ear-trained. One of the best-selling music artists in history."},
    ],
    parentNote:"Music training is literally improving your child's reading while they think they are having fun. Rhythm work does phonological processing therapy. Pattern recognition builds the same neural pathways reading needs. You are not distracting them from academics — you are doing the most powerful academic intervention available.",
  },
  {
    id:"down-syndrome", name:"Down Syndrome", shortName:"Down Syndrome", emoji:"💛", color:"#A8E063",
    tagline:"Music is where Down syndrome children shine brightest.",
    description:"Children with Down syndrome have a remarkable, documented relationship with music — stronger musical engagement, pitch memory, and rhythmic response than other cognitive delay profiles. Music is genuinely one of this population's superpowers.",
    scienceFact:"Research consistently shows children with Down syndrome demonstrate musical abilities that far exceed expectations from general cognitive assessment. Musical activity builds language, fine motor skills, and social participation. (Children Basel, 2025)",
    musicBenefits:["Significantly improves speech and language development","Builds fine motor skills through instrument playing","Music is one of the highest areas of ability — builds global confidence","Group music builds turn-taking, waiting, social participation","Emotional expression through music reduces frustration behaviours"],
    adaptations:["Music sessions are joyful events — they WANT to be here","Short high-energy activities (10–15 minutes maximum)","High repetition of favourite songs — do not rush new material","Physical movement in every session — music plus dance","Always have a beloved song ready to return to","Simple instruments with immediate gratification","Massive celebration of every contribution, every note, every beat"],
    instruments:["Drums and tambourine (immediate, physical, joyful)","Bells and shakers (easy grip, bright sound)","Piano (one finger plays a melody)","Maracas","Body percussion (always accessible)","Any instrument — joy is primary, technique is secondary"],
    activities:["Favourite song singalong — the one they love most","Drum along to a pop song — pure joy","Musical greeting — sing hello to each person by name","Marching band — walk and drum around the room","Call and response — leader sings a phrase, group echoes","Musical storytelling — add sound effects to a picture book","Dance party — free movement to favourite music","Instrument parade — everyone plays together","Song creation — pick 3 words and make them a song","Musical goodbye ritual — same song to close every session"],
    musicians:[
      {name:"Sujeet Desai", condition:"Down syndrome", achievement:"Professional musician who plays seven instruments and has performed at Carnegie Hall. Called a musical prodigy by teachers who expected nothing. His story is one of the most powerful ever documented."},
      {name:"Valentina Guerrero", condition:"Down syndrome", achievement:"Colombian singer who became an internationally acclaimed performer. Her voice and stage presence have moved audiences worldwide and changed perceptions of what Down syndrome means."},
    ],
    parentNote:"Children with Down syndrome often develop genuine musical ability that exceeds what any cognitive assessment predicted. If your child lights up when music plays — and they will — that is a window. It shows where their brain engages at its highest level. Walk through that window.",
  },
  {
    id:"cerebral-palsy", name:"Cerebral Palsy", shortName:"Cerebral Palsy", emoji:"💪", color:"#C77DFF",
    tagline:"Neurologic music therapy rebuilds what injury disrupted.",
    description:"Music therapy for cerebral palsy has randomised controlled trial evidence — the gold standard of medicine. Rhythm-based movement therapy improves upper limb motor function. And beyond the clinical evidence: music gives children with CP something they can do independently, their way.",
    scienceFact:"Neurologic Music Therapy significantly improved upper-limb rehabilitation in children with severe bilateral cerebral palsy in a randomised controlled trial. (European Journal of Physical & Rehabilitation Medicine, RCT evidence)",
    musicBenefits:["Rhythmic Auditory Stimulation improves gait and motor control","Instrument playing builds fine motor function in affected limbs","Music provides independent creative expression regardless of motor ability","Rhythm entrainment restructures damaged neural motor pathways","Music is achievable in every form regardless of physical limitation"],
    adaptations:["Always offer 3 ways to do every activity: standard, one-handed, switch-activated","Instruments taped to table if grip is difficult","Big body movements over fine motor when needed","Focus completely on expression, never precision","Positioning important: ensure comfortable supported posture","Tempo adapted: slower when motor challenges are significant","Voice is often unaffected — lead with singing"],
    instruments:["Switch-activated electronic instruments","Voice (often unaffected by CP)","Hand drums placed on lap","Maracas with adapted grip","Djembe (played with palms — no grip needed)","Soundbeam (motion sensor — any movement makes music)"],
    activities:["Voice-led music — singing requires no motor ability","One-note symphony — play one note on a drum to a beat","Arm-sweep piano — long sweeping arm movements across keys","Switch music — use any adaptive switch to trigger sounds","Rhythmic clapping however possible — one hand, elbow","Shaker strapped to wrist — rhythm still made","Humming along — any vocalisation is musical participation","Conductor activity — direct others with eyes, head, or voice","Music listening with movement response — move however feels right","Composition through instruction — tell someone else what to play"],
    musicians:[
      {name:"Evelyn Glennie", condition:"Profound deafness", achievement:"World-renowned solo percussionist who hears music through vibration felt through her feet and body. Plays barefoot on stage. Proved music is felt, not just heard."},
      {name:"Frida Kahlo", condition:"Polio and catastrophic accident — used music to cope", achievement:"Surrounded herself with music and song throughout her recovery. Said music gave her a reason to stay alive during her most painful years."},
      {name:"Curtis Mayfield", condition:"Quadriplegia after 1990 accident", achievement:"Recorded his final album lying on his back, singing in short phrases between takes. The album was critically acclaimed. His musical mind was never injured."},
    ],
    parentNote:"The Soundbeam is worth knowing about — a motion sensor that converts any movement into music. For profound physical disability, it offers the first experience of independent musical creation. Ask an occupational therapist. For most children with CP: start with the voice. It is often unaffected. And a voice that sings is already a musician.",
  },
  {
    id:"visual-impairment", name:"Visual Impairment", shortName:"Visual Impairment", emoji:"✨", color:"#FF6B9D",
    tagline:"Music has always been heard, not seen. This is your world.",
    description:"Blind and visually impaired children are disproportionately represented among the world's greatest musicians. Enhanced auditory processing, exceptional musical memory, and heightened pitch sensitivity are documented findings. Music is not adapted for this population — it is their natural domain.",
    scienceFact:"Research documents significantly heightened auditory processing, pitch sensitivity, and musical memory in children with congenital visual impairment — consistent with neuroplastic redistribution of visual cortex to auditory processing. (Music Education Research, 2024)",
    musicBenefits:["Enhanced auditory processing — often exceptional musical ability","Music navigation builds spatial reasoning","Performance and ensemble build confidence and social participation","Braille music notation opens the entire written music world","Music is fully accessible — no visual adaptation needed to play"],
    adaptations:["Teach by ear and touch exclusively","Describe instrument geography: 'Low notes are to your left'","Guide hand placement physically before asking them to play","Textured markers on instrument keys for navigation","Never use visual metaphors — say 'higher pitch' not 'higher up'","Braille music available for older students — introduce it","Trust the ear completely — it is extraordinary"],
    instruments:["Piano (the ear guides the hand)","Voice (requires zero visual orientation)","Drums (touch and feel the instrument)","Guitar (feel the frets by touch)","Any instrument — auditory learners often master faster than sighted peers"],
    activities:["Melodic echo — I play a melody, you echo it back by ear","Instrument geography — find every note by touch","Composition by singing — compose vocally, teach it to me","Harmonic recognition — hear a chord, identify major or minor","Multi-instrument exploration — feel and hear each instrument","Interval training — hear two notes, identify the gap","Song from memory — perform any song purely from memorisation","Improvisation — make something up, no rules, just sound","Call and response singing — musical conversation without sight","Complex body percussion patterns"],
    musicians:[
      {name:"Stevie Wonder", condition:"Blind since birth", achievement:"Perhaps the greatest musician of the 20th century. 25 Grammy Awards. Plays piano, harmonica, drums, bass and more — mastered entirely by ear and touch. His visual cortex became extraordinary auditory processing."},
      {name:"Ray Charles", condition:"Blind since age 7", achievement:"Invented soul music. Played piano, sang, composed, arranged — all entirely by ear. Said blindness 'made him pay more attention to music than sighted people ever could.'"},
      {name:"Andrea Bocelli", condition:"Total blindness since age 12", achievement:"The world's most successful classical crossover artist. Total immersion in sound, without visual distraction, produced a vocal sensitivity that remains unmatched in his genre."},
    ],
    parentNote:"Your child may become a better musician than their sighted peers. This is not comfort — it is neuroscience. The auditory cortex of congenitally blind children is measurably larger and more active. Do not hold back musically. Challenge them. Expect excellence. They are capable of it.",
  },
  {
    id:"nonverbal", name:"Non-Verbal & Communication Needs", shortName:"Non-Verbal", emoji:"🎶", color:"#F4A261",
    tagline:"Before language, there was music. There is always music.",
    description:"Music reaches people that words cannot. For non-verbal children and those with complex communication needs, music is not an alternative therapy — it is the primary communication channel. Rhythm, melody, and sound are the most primitive human languages, older than words by millions of years.",
    scienceFact:"Music therapy was superior to standard treatment in developing communication and social-emotional reciprocity in non-verbal children with ASD. Musical interaction creates the conditions for social connection before and beyond words. (Cochrane Review, 2021)",
    musicBenefits:["Musical interaction precedes and supports verbal communication development","Rhythm provides structure for turn-taking and social back-and-forth","Melodic vocalisation is a stepping stone to speech","Music reduces frustration and aggression from communication barriers","Musical success builds self-belief that transfers to other communication attempts"],
    adaptations:["Music IS the communication — no verbal output ever required","Respond to every musical gesture as meaningful communication","Copy what the child plays or hums — musical conversation","Never demand verbal responses — nod, gesture, play if yes","Simple yes/no choices with instruments: tap once for yes","If child vocalises any pitch, echo it immediately","Sessions are child-led entirely in the musical space"],
    instruments:["Any instrument the child reaches for","Drum (immediate cause-and-effect)","Piano (single key = already music)","Shakers (easiest grip)","Voice — any vocalisation is musical","AAC device with musical sounds if used"],
    activities:["Musical conversation — I play, you play, back and forth","Echo game — I make a sound, you make any sound back","Follow my lead — copy exactly what I do on the drum","Free exploration time — no instructions, just instruments available","Favourite song request — gesture or point to ask","Sound naming — give sounds names that feel right","Rhythm together — tap along to anything we both hear","Vocalise along to music — no words needed, just sound","Instrument voting — which instrument today? Point to choose","Musical emotion expression — show me excited with your drum"],
    musicians:[
      {name:"Hikari Oe", condition:"Autism, largely non-verbal", achievement:"Communicates through complex classical piano compositions. Has released multiple albums. His music speaks what his words cannot — and audiences worldwide understand every phrase."},
      {name:"Stephen Wiltshire", condition:"Non-verbal until age 9, autism", achievement:"His first complete sentence at age 9 was 'pencil.' But he hummed and whistled complex melodies from age 3. Music was his first language."},
    ],
    parentNote:"When your child hums, tap your finger in time. When they tap a surface, echo the rhythm. You have just started a musical conversation. Every hum you mirror is building the neural pathways that social connection and language will later travel along.",
  },
];

const INSPIRING = [
  {name:"Stevie Wonder", emoji:"🎹", note:"Blind since birth. 25 Grammys. His visual cortex became extraordinary auditory processing."},
  {name:"Beethoven", emoji:"🎼", note:"Composed his greatest symphonies after going completely deaf. He felt vibrations through the piano."},
  {name:"Ray Charles", emoji:"🎷", note:"Blind since age 7. Invented soul music entirely by ear. Said blindness made him 'pay more attention.'"},
  {name:"Justin Timberlake", emoji:"🎤", note:"ADHD and OCD. His restless hyperfocused brain produced the most precise rhythmic performances in pop."},
  {name:"Hikari Oe", emoji:"🎵", note:"Non-verbal autistic pianist. His compositions are heard in concert halls worldwide. Music is his language."},
  {name:"Sujeet Desai", emoji:"🎺", note:"Down syndrome. Plays 7 instruments. Performed at Carnegie Hall. Expected nothing — achieved everything."},
];

function buildSystemPrompt(profile) {
  if (!profile) return "";
  const tones = {
    autism:"ONE instruction at a time. Very short sentences. Preview the session. Warn before transitions. Celebrate every sound produced. Suggest the same opening ritual every session.",
    adhd:"HIGH ENERGY. Fast-moving. Use timers: 'Keep the beat for 30 seconds — GO!' Suggest movement. Change activity every 5–10 minutes. Drums first. Celebrate LOUDLY. Never ask them to sit still.",
    dyslexia:"EAR FIRST always. Never mention notation unless asked. Lean into their musical ear: 'Your brain was built for this.' Multisensory — sing it, clap it, play it. Highlight the dyslexia-music connection: rhythm training IS reading therapy.",
    "down-syndrome":"JOY is the session. Short activities, massive celebration, high repetition of favourites. Suggest dancing. Simple instructions. Music and movement are inseparable.",
    "cerebral-palsy":"ALWAYS offer 3 ways to do every activity: two hands, one hand, switch/alternative. Celebrate the sound, not the method. Voice is often unaffected — lead with singing. Mention Soundbeam.",
    "visual-impairment":"EAR AND TOUCH exclusively. Never use visual metaphors. Describe instrument geography. Trust the ear — it is exceptional. Remind families: blind children are disproportionately represented among the world greatest musicians.",
    nonverbal:"MUSIC IS COMMUNICATION. No verbal output ever required. Echo every sound the child makes. Musical conversation is the whole session. Frame everything as musical dialogue, not lesson.",
  };
  return addKnowledgeToPrompt(`You are Starky, a specialist music therapist and teacher with deep expertise in children with ${profile.name}.

MISSION: Use music to unlock communication, regulate emotions, build motor skills, and give every child with ${profile.name} the experience of musical success.

THE RESEARCH: Music therapy for ${profile.name} has strong evidence from peer-reviewed studies including RCTs. It improves communication, social interaction, emotional regulation, motor skills, and self-esteem. This is therapeutic work through music.

STYLE FOR ${profile.name.toUpperCase()}:
${tones[profile.id]||"Warm, patient, celebratory."}

RULES:
1. Music IS the therapy AND the joy — both at once
2. Never require verbal explanations from the child
3. Celebrate EVERY musical contribution, however small
4. Always offer an adaptive version alongside standard
5. Connect to famous musicians with ${profile.name}
6. End responses with: "For the adult: [parent/carer tip]"
7. Session structure: Opening ritual → Core activity → Free exploration → Closing ritual

LESSON FORMAT:
🎵 [Activity Name]
📋 What you need: [instruments]
⏱️ Time: [duration]
Step 1: [micro-step]
...
🎯 What success looks like: [description]
💡 Adaptive version: [how to do it with more support]
For the adult: [parent guidance]

LANGUAGE: If the student writes in Urdu (script or Roman Urdu like 'samajh nahi aa raha'), respond entirely in Urdu. Auto-detect language always.
If the message is in Arabic, respond in Arabic.
Every child is already a musician. Help them discover that.`);
}

function promptTiles(profile) {
  const n = profile.name;
  return [
    {emoji:"🥁", label:"First music lesson", prompt:`Give me a complete first music lesson for a child with ${n}. Assume zero experience. Include every step, adaptive options, and adult guidance.`},
    {emoji:"🎵", label:"Calming activity", prompt:`Give me a calming, regulating music activity for a child with ${n} who is feeling anxious or overwhelmed right now.`},
    {emoji:"⚡", label:"High-energy activity", prompt:`Give me a high-energy, joyful music activity for a child with ${n} with lots of movement and noise. Make it exciting.`},
    {emoji:"🏆", label:"Musicians like me", prompt:`Tell me about famous musicians who had ${n}. Full stories — how their condition shaped their music. Include something genuinely surprising.`},
    {emoji:"📅", label:"Plan a music week", prompt:`Plan a 5-day gentle music schedule for a child with ${n}. Each day 15 minutes. Variety. Simple household materials only.`},
    {emoji:"💌", label:"Guide for parents", prompt:`Give me a parent guide for music sessions at home with a child with ${n}. What to do, what NOT to do, how to set up, what counts as progress.`},
    {emoji:"😰", label:"Not engaging today", prompt:`My child with ${n} is refusing music today. Give me 3 very gentle, zero-pressure micro-activities. They may last 30 seconds each.`},
    {emoji:"🌟", label:"Why music matters", prompt:`Explain the neuroscience and research behind why music is so powerful for children with ${n}. Make it inspiring for a parent.`},
  ];
}

function ProgressPanel({progress, profile}) {
  const total = Object.values(progress).reduce((s,d)=>s+(d.sessions||0),0);
  const pd = profile?(progress[profile.id]||null):null;
  if (total===0) return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:14}}>
      <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:8}}>🎵 OUR JOURNEY</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.7}}>Every music session is a miracle. Your journey starts here. 💛</div>
    </div>
  );
  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:14}}>
      <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:12}}>🎵 OUR JOURNEY</div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <div style={{flex:1,background:(profile?.color||"#FFC300")+"12",border:"1px solid "+(profile?.color||"#FFC300")+"28",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:900,color:profile?.color||"#FFC300"}}>{total}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700}}>SESSIONS</div>
        </div>
        <div style={{flex:1,background:"rgba(168,224,99,0.08)",border:"1px solid rgba(168,224,99,0.2)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:900,color:"#A8E063"}}>{pd?.sessions||0}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700}}>THIS STUDIO</div>
        </div>
      </div>
      {pd?.last&&<div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Last session: {pd.last}</div>}
    </div>
  );
}

export default function MusicForAllPage() {
  const [profile,  setProfile]  = useState(null);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});
  const { listening, supported: micSupported, toggle: toggleMic } = useVoiceInput(setInput);
  const { speak, stop: stopSpeaking, speaking, supported: ttsSupported } = useSpeakText();
  const [autoSpeak, setAutoSpeak] = useState(false);
  const chatEndRef = useRef(null);
  const { callsLeft, limitReached: _limitReached, recordCall } = useSessionLimit();
  const limitReached = false;
  const router = useRouter();

  useEffect(()=>{ const fn=()=>setIsMobile(window.innerWidth<768); fn(); window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn); },[]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);
  useEffect(()=>{ setProgress(loadProg()); },[]);
  useEffect(()=>{
    if(router.isReady&&router.query.condition&&!profile){
      const match=PROFILES.find(p=>p.id===router.query.condition);
      if(match)selectProfile(match);
    }
  },[router.isReady,router.query.condition]);

  const selectProfile = (p) => {
    setProfile(p);
    setMessages([{role:"assistant",content:`Hello! 🎵 I am Starky — your music teacher.\n\nI am here especially for children with **${p.name}**.\n\n${p.description}\n\n🔬 **What research tells us:**\n${p.scienceFact}\n\n**What music gives children with ${p.name}:**\n${p.musicBenefits.map(b=>`• ${b}`).join("\n")}\n\n**How I will help:**\n• Complete adapted music activities, step-by-step\n• Guidance for the adult running the session\n• Instrument suggestions that work for ${p.name}\n• Stories of famous musicians who had ${p.name}\n• Help for difficult days when nothing seems to work\n\nReady to make music? Tap any tile below, choose an activity from the left, or just tell me about your child. I will meet you exactly where you are.\n\n**In this studio: every sound is music. Every child is a musician. No exceptions.** 🎶`}]);
  };

  const sendMessage = async (text) => {
    const txt = (text||input).trim();
    if (!txt||loading||limitReached) return;
    recordCall();
    const prog = recordSession(profile?.id);
    setProgress(prog);
    setInput(""); setLoading(true);
    const prev = [...messages,{role:"user",content:txt}];
    setMessages(prev);
    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1500,system:buildSystemPrompt(profile),messages:prev.map(m=>({role:m.role,content:m.content}))})});
      const data = await res.json();
      const replyText = data.content?.[0]?.text||"Something went wrong — try again!";
      setMessages(p=>[...p,{role:"assistant",content:replyText}]);
      if (autoSpeak) speak(replyText);
    } catch { setMessages(p=>[...p,{role:"assistant",content:"Connection error. Please try again!"}]); }
    setLoading(false);
  };

  const S = {
    page:{minHeight:"100vh",background:"linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)",fontFamily:"'Nunito',sans-serif",color:"#fff"},
    hdr:{padding:isMobile?"12px 16px":"14px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"},
    card:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:18},
    btn:{border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.15s"},
  };
  const CSS=`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *{box-sizing:border-box} button:focus{outline:2px solid #4F8EF7;outline-offset:2px} textarea:focus{outline:none}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes noteFloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-10px) rotate(3deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}`;

  if (!profile) return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Music for All — Adaptive AI Music Studio for Special Needs | NewWorldEdu</title>
        <meta name="description" content="AI-powered music studio adapted for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and non-verbal needs. Research-backed music therapy activities." />
      </Head>
      <header style={S.hdr}>
        <a href="/" style={{textDecoration:"none",fontWeight:900,fontSize:15,color:"#fff"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
        <div style={{display:"flex",gap:12}}>
          <a href="/music" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none",fontWeight:700}}>🎵 Music Studio</a>
          <a href="/arts-for-all" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none",fontWeight:700}}>💛 Arts for All</a>
        </div>
      </header>
      <div style={{maxWidth:820,margin:"0 auto",padding:isMobile?"28px 16px":"52px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:isMobile?52:72,marginBottom:10,animation:"noteFloat 3s ease-in-out infinite"}}>🎶</div>
          <h1 style={{fontSize:isMobile?24:44,fontWeight:900,margin:"0 0 12px",lineHeight:1.2}}>Music for <span style={{color:"#FFC300"}}>Every</span> Child</h1>
          <p style={{fontSize:isMobile?14:17,color:"rgba(255,255,255,0.6)",maxWidth:580,margin:"0 auto 22px",lineHeight:1.9}}>Starky is trained specifically to teach music to children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and complex communication needs. Fully adapted. Deeply researched.</p>
          <div style={{background:"linear-gradient(135deg,rgba(255,193,0,0.1),rgba(168,224,99,0.08))",border:"1px solid rgba(255,193,0,0.3)",borderRadius:18,padding:isMobile?"16px":"20px 28px",maxWidth:640,margin:"0 auto 30px",textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:900,color:"#FFC300",letterSpacing:1,marginBottom:8}}>🔬 WHAT 80+ PEER-REVIEWED STUDIES TELL US</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.9}}>Music therapy improves <strong>communication, social skills, emotional regulation, motor function,</strong> and <strong>self-esteem</strong> across every special needs condition. A Cochrane review found music therapy <strong>superior to standard treatment</strong> for autism in social interaction and emotional reciprocity. A randomised controlled trial showed music therapy rebuilds motor pathways in cerebral palsy. Rhythm training directly repairs the phonological deficit of dyslexia.</div>
            <div style={{fontSize:13,color:"rgba(255,193,0,0.6)",marginTop:8}}>Sources: Frontiers in Psychiatry 2021 · Frontiers in Psychology 2024 · PMC Pediatric Neurorehabilitation 2025 · IJAR 2025</div>
          </div>
        </div>
        <div style={{marginBottom:36}}>
          <div style={{fontSize:12,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:2,textAlign:"center",marginBottom:14}}>🏆 MUSICIANS WHO CHANGED THE WORLD — WITH SPECIAL NEEDS</div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)",gap:8}}>
            {INSPIRING.map(a=>(
              <div key={a.name} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:12}}>
                <div style={{fontSize:22,marginBottom:4}}>{a.emoji}</div>
                <div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.85)",marginBottom:3}}>{a.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{a.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{fontSize:14,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:2,textAlign:"center",marginBottom:10}}>CHOOSE YOUR CHILD'S PROFILE</div>
        <p style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:22}}>Each profile has a fully adapted AI music teacher, activities, instruments, and parent guides.</p>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:12,marginBottom:40}}>
          {PROFILES.map(p=>{
            const prog=progress[p.id];
            return (
              <button key={p.id} onClick={()=>selectProfile(p)}
                style={{...S.btn,background:p.color+"0A",border:"2px solid "+p.color+"30",borderRadius:20,padding:"20px 18px",textAlign:"left",color:"#fff",position:"relative"}}
                onMouseEnter={e=>{e.currentTarget.style.background=p.color+"18";e.currentTarget.style.borderColor=p.color;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=p.color+"0A";e.currentTarget.style.borderColor=p.color+"30";e.currentTarget.style.transform="none";}}>
                {prog&&<div style={{position:"absolute",top:12,right:12,background:p.color+"20",border:"1px solid "+p.color+"40",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:800,color:p.color}}>{prog.sessions} sessions ✓</div>}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <div style={{fontSize:30}}>{p.emoji}</div>
                  <div>
                    <div style={{fontWeight:900,fontSize:15,color:p.color}}>{p.name}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontStyle:"italic",marginTop:1}}>{p.tagline}</div>
                  </div>
                </div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:10}}>{p.description.substring(0,130)}...</div>
                <div style={{background:p.color+"10",border:"1px solid "+p.color+"22",borderRadius:10,padding:"8px 10px"}}>
                  <div style={{fontSize:10,fontWeight:800,color:p.color,marginBottom:3}}>🔬 RESEARCH</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{p.scienceFact.substring(0,120)}...</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{textAlign:"center",padding:"24px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18}}>
          <div style={{fontSize:22,marginBottom:8}}>🎶</div>
          <div style={{fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.8)",marginBottom:6}}>A note to every parent and carer</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.9,maxWidth:560,margin:"0 auto"}}>Before there was language, there was music. Rhythm, melody, and call-and-response are the most ancient forms of human connection — older than words by millions of years. When your child responds to music — and they will — you are witnessing something deeply human. That is not nothing. That is everything. We are honoured to be here with you.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Music for All — Adaptive AI Music Studio for Special Needs | NewWorldEdu</title>
        <meta name="description" content="AI-powered music studio adapted for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and non-verbal needs. Research-backed music therapy activities." />
      </Head>
      <header style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <a href="/" style={{textDecoration:"none",fontWeight:900,fontSize:isMobile?13:15,color:"#fff"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
          {!isMobile&&<><span style={{color:"rgba(255,255,255,0.2)"}}>›</span><span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Music for All</span></>}
          <span style={{color:"rgba(255,255,255,0.2)"}}>›</span>
          <span style={{fontWeight:800,fontSize:13,color:profile.color}}>{profile.emoji} {profile.name}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <AccessibilityToolbar onAutoSpeakChange={setAutoSpeak} conditionId={profile?.id} />
          <a href="/music" style={{...S.btn,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 12px",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center"}}>🎵 Music Studio</a>
          <button onClick={()=>{setProfile(null);setMessages([]);}} style={{...S.btn,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 12px",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700}}>← Profiles</button>
        </div>
      </header>

      <div style={{maxWidth:980,margin:"0 auto",padding:isMobile?"12px":"20px 24px",display:"grid",gridTemplateColumns:isMobile?"1fr":"272px 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{...S.card,background:profile.color+"0A",borderColor:profile.color+"30",padding:14}}>
            <div style={{fontSize:28,marginBottom:6}}>{profile.emoji}</div>
            <div style={{fontWeight:900,fontSize:14,color:profile.color,marginBottom:2}}>{profile.name}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontStyle:"italic",lineHeight:1.5,marginBottom:10}}>{profile.tagline}</div>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:6}}>🎵 HOW MUSIC HELPS</div>
            {profile.musicBenefits.map(b=><div key={b} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:profile.color,fontSize:13,flexShrink:0,marginTop:1}}>✓</span><span style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>{b}</span></div>)}
            <div style={{marginTop:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"10px 11px"}}>
              <div style={{fontSize:10,fontWeight:900,color:"#FFC300",marginBottom:4}}>🎸 BEST INSTRUMENTS</div>
              {profile.instruments.map(i=><div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:3}}>• {i}</div>)}
            </div>
          </div>

          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:8}}>🔧 HOW I'VE ADAPTED FOR YOU</div>
            {profile.adaptations.map(a=><div key={a} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:profile.color,fontSize:10,flexShrink:0,marginTop:2}}>•</span><span style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{a}</span></div>)}
          </div>

          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>🎵 ACTIVITIES — tap for full guide</div>
            {profile.activities.map((a,i)=>(
              <button key={a} onClick={()=>sendMessage(`Give me a complete step-by-step guide to this music activity for a child with ${profile.name}: "${a}". Include what the adult needs to do, adaptive options, and what success looks like.`)}
                style={{...S.btn,width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"8px 10px",marginBottom:5,textAlign:"left",fontSize:13,color:"rgba(255,255,255,0.5)",fontWeight:600}}
                onMouseEnter={e=>{e.currentTarget.style.background=profile.color+"10";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=profile.color+"30";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.color="rgba(255,255,255,0.5)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}>
                {i+1}. {a}
              </button>
            ))}
          </div>

          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>🏆 MUSICIANS LIKE YOU</div>
            {profile.musicians.map(m=>(
              <button key={m.name} onClick={()=>sendMessage(`Tell me the full inspiring story of ${m.name} who had ${m.condition}. How did their condition shape their music? Make it genuinely moving for a parent and child.`)}
                style={{...S.btn,width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 11px",marginBottom:7,textAlign:"left"}}
                onMouseEnter={e=>{e.currentTarget.style.background=profile.color+"10";e.currentTarget.style.borderColor=profile.color+"30";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}>
                <div style={{fontSize:12,fontWeight:800,color:profile.color,marginBottom:2}}>{m.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontStyle:"italic",marginBottom:3}}>{m.condition}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{m.achievement.substring(0,80)}...</div>
              </button>
            ))}
          </div>

          <div style={{background:profile.color+"08",border:"1px solid "+profile.color+"22",borderRadius:16,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:profile.color,letterSpacing:1,marginBottom:8}}>💌 FOR PARENTS & CARERS</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>{profile.parentNote}</div>
          </div>

          <ProgressPanel progress={progress} profile={profile}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"linear-gradient(135deg,"+profile.color+"12,rgba(255,255,255,0.03))",border:"1px solid "+profile.color+"28",borderRadius:16,padding:"14px 18px",display:"flex",gap:14,alignItems:"center"}}>
            <div style={{fontSize:28,flexShrink:0}}>{profile.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:15,color:profile.color,marginBottom:3}}>{profile.name} Music Studio</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>Starky is trained specifically for {profile.name}. Every activity, every instrument suggestion, every word is adapted. In this studio: <strong style={{color:"rgba(255,255,255,0.8)"}}>every sound is music. Every child is a musician.</strong></div>
            </div>
            <button onClick={()=>sendMessage(`Give me your very best opening music activity for a child with ${profile.name} who has never had a music session before. Achievable, joyful, immediate success.`)}
              style={{...S.btn,background:profile.color+"20",border:"1px solid "+profile.color+"50",borderRadius:12,padding:"10px 14px",color:profile.color,fontWeight:800,fontSize:12,flexShrink:0,lineHeight:1.3,textAlign:"center"}}>
              Begin!<br/>→
            </button>
          </div>

          <div style={{...S.card,padding:"14px 14px 10px"}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>⚡ QUICK START — TAP TO BEGIN</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:7}}>
              {promptTiles(profile).map(tile=>(
                <button key={tile.label} onClick={()=>sendMessage(tile.prompt)}
                  style={{...S.btn,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"11px 9px",color:"#fff",textAlign:"center",fontSize:13,fontWeight:700,lineHeight:1.4}}
                  onMouseEnter={e=>{e.currentTarget.style.background=profile.color+"15";e.currentTarget.style.borderColor=profile.color+"40";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
                  <div style={{fontSize:20,marginBottom:5}}>{tile.emoji}</div>{tile.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>sendMessage(`Give me a 5-day home music plan for a child with ${profile.name}. Each session 15 minutes. Household objects only. Day-by-day, step-by-step.`)}
              style={{...S.btn,background:"rgba(168,224,99,0.08)",border:"1px solid rgba(168,224,99,0.25)",borderRadius:14,padding:"13px 14px",color:"#A8E063",fontWeight:800,fontSize:isMobile?11:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              📅 5-Day Home Plan
            </button>
            <button onClick={()=>sendMessage(`What is the neuroscience behind why music is so powerful for children with ${profile.name}? Give me specific research findings. Make it inspiring and convincing for a parent.`)}
              style={{...S.btn,background:profile.color+"10",border:"1px solid "+profile.color+"30",borderRadius:14,padding:"13px 14px",color:profile.color,fontWeight:800,fontSize:isMobile?11:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              🔬 The Science
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

          <div style={{...S.card,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div role="log" aria-label="Chat with Starky" aria-live="polite" style={{height:isMobile?340:430,overflowY:"auto",padding:isMobile?14:20,display:"flex",flexDirection:"column",gap:14}}>
              {messages.map((msg,i)=>(
                <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",gap:10,animation:"fadeUp 0.3s ease"}}>
                  {msg.role==="assistant"&&<div style={{width:32,height:32,borderRadius:"50%",background:profile.color+"20",border:"1px solid "+profile.color+"40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>🎵</div>}
                  <div style={{maxWidth:"88%",padding:"13px 16px",borderRadius:16,background:msg.role==="user"?"linear-gradient(135deg,"+profile.color+"CC,"+profile.color+"88)":"rgba(255,255,255,0.06)",color:msg.role==="user"?"#060B20":"#fff",fontSize:14,lineHeight:1.85,fontWeight:msg.role==="user"?700:400,whiteSpace:"pre-wrap"}}>{msg.content}</div>
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
                  <div style={{width:32,height:32,borderRadius:"50%",background:profile.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🎵</div>
                  <div style={{display:"flex",gap:5}}>{[0,0.2,0.4].map((d,j)=><div key={j} style={{width:9,height:9,borderRadius:"50%",background:profile.color,animation:"bounce 1s "+d+"s ease-in-out infinite",opacity:0.8}}/>)}</div>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>Starky is composing a response...</span>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <div style={{padding:"12px 16px",borderTop:"1px solid "+profile.color+"15"}}>
              <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input);}}}
                placeholder={"Ask Starky anything... \"What instrument should my child with "+profile.shortName+" start with?\" · \"My child refused music today — help\" · \"Which musicians had "+profile.shortName+"?\""}
                rows={isMobile?3:4}
                style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid "+profile.color+"22",borderRadius:14,padding:"12px 14px",color:"#fff",fontSize:14,fontFamily:"'Nunito',sans-serif",resize:"vertical",lineHeight:1.6}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                <div style={{display:"flex",gap:6}}>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.2)",fontWeight:600}}>Enter to send</span>
                  {callsLeft<=10&&!limitReached&&<span style={{fontSize:13,fontWeight:800,color:callsLeft<=5?"#FF6B6B":"#A8E063"}}>· {callsLeft} left</span>}
                </div>
                {micSupported && (
                  <button onClick={toggleMic} aria-label={listening ? "Stop listening" : "Voice input"}
                    style={{background: listening ? "#ef4444" : "rgba(255,255,255,0.08)", border:"1px solid "+(listening?"#ef4444":"rgba(255,255,255,0.12)"), borderRadius:12, padding:"10px 14px", color: listening ? "#fff" : "rgba(255,255,255,0.6)", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit"}}>
                    {listening ? "⏹ Stop" : "🎤"}
                  </button>
                )}
                <button onClick={()=>sendMessage(input)} disabled={!input.trim()||loading}
                  style={{...S.btn,background:input.trim()&&!loading?"linear-gradient(135deg,"+profile.color+","+profile.color+"BB)":"rgba(255,255,255,0.08)",borderRadius:14,padding:"10px 24px",color:input.trim()&&!loading?"#060B20":"rgba(255,255,255,0.3)",fontWeight:900,fontSize:14}}>
                  {loading?"Listening...":"Send →"}
                </button>
              </div>
            </div>
          </div>

          <div style={{...S.card,padding:"14px 18px",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{fontSize:20}}>🎶</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.7)"}}>Before there was language, there was music.</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",lineHeight:1.6}}>Rhythm and melody are 40,000 years old. Language is 10,000. Every child responds to music — it is wired into our species. 🌍</div>
            </div>
            <button onClick={()=>sendMessage(`Tell me something genuinely amazing about how music affects the human brain — specifically for children with ${profile.name}. Make it awe-inspiring.`)}
              style={{...S.btn,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 12px",color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:700,flexShrink:0,lineHeight:1.4,textAlign:"center"}}>
              Amaze<br/>me ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
