// pages/reading-for-all.jsx
// ════════════════════════════════════════════════════════════════════════════
// STARKY READS — For Every Child
//
// An AI reading tutor trained specifically for children with:
//   🌟 Autism Spectrum
//   ⚡ ADHD
//   🎵 Dyslexia & Learning Differences
//   💛 Down Syndrome
//   💪 Cerebral Palsy & Physical Needs
//   ✨ Visual Impairment
//   🎶 Non-Verbal & AAC Users
//
// RESEARCH BASE:
//   - PMC 2024: Visualizing & Verbalizing dramatically improves reading
//     comprehension in autistic children (Beckerson et al.)
//   - Frontiers in Education 2025: Nonspeaking autistic learners CAN acquire
//     meaningful reading skills with individualized AAC-compatible instruction
//   - Down Syndrome Resource Foundation: Visual learning strengths; whole-word
//     reading can TEACH oral language, not just reflect it
//   - NRP meta-analysis: Evidence-based phonics works for ALL children including ASD
//   - PMC 2021: DS individuals show strong word reading relative to comprehension
//     — visual imagery strategies significantly improve recall
//   - International Dyslexia Association: Orton-Gillingham multi-sensory
//     structured literacy is gold standard
// ════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSessionLimit } from "../utils/useSessionLimit";
import { addKnowledgeToPrompt } from "../utils/senKnowledge";
import { useVoiceInput, useSpeakText } from '../utils/useVoice';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

const PROG_KEY = "nw_reading_for_all_progress";
function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY)||"{}"); } catch { return {}; } }
function saveProg(p) { try { localStorage.setItem(PROG_KEY,JSON.stringify(p)); } catch {} }
function recordSession(profileId, bookTitle) {
  const p = loadProg();
  if (!p[profileId]) p[profileId] = { sessions:0, books:[], last:null };
  p[profileId].sessions++;
  if (bookTitle && !p[profileId].books.includes(bookTitle)) p[profileId].books.push(bookTitle);
  p[profileId].last = new Date().toISOString().split("T")[0];
  saveProg(p); return p;
}

// ── PROFILES ─────────────────────────────────────────────────────────────────
const PROFILES = [
  {
    id: "autism",
    name: "Autism Spectrum",
    shortName: "ASD",
    emoji: "🌟",
    color: "#63D2FF",
    tagline: "A visual thinker's superpower: pattern, detail, and memory no neurotypical brain can match.",
    description: "Many autistic children are exceptional word decoders who read fluently — but the magic of stories, inference, and emotional subtext needs a different kind of teaching. Starky uses visual strategies, literal-to-inferential scaffolding, and special interests to unlock the full joy of reading.",
    scienceFact: "PMC 2024 RCT: Visualizing & Verbalizing intervention dramatically improved reading comprehension in autistic children who were good decoders but poor comprehenders. Visual thinking IS the path in.",
    readingStrengths: [
      "Exceptional visual memory and pattern recognition",
      "Hyperlexia common — often read above grade level early",
      "Strong factual recall and encyclopedic knowledge",
      "Deep focus on topics of special interest",
      "Excellent at literal reading — what the text actually says",
    ],
    readingChallenges: [
      "Inference and 'reading between the lines'",
      "Figurative language — metaphor, sarcasm, idiom",
      "Emotional subtext in characters",
      "Predicting what will happen next",
      "Understanding unstated social rules in stories",
    ],
    adaptations: [
      "ALWAYS explain figurative language explicitly — never assume it's understood",
      "Use visual imagery: 'Picture this scene in your mind — describe what you see'",
      "Connect books to special interests whenever possible",
      "Comprehension questions: literal first, THEN inferential",
      "Characters are hard — ask: 'What does this character WANT? What do they FEAR?'",
      "Predict using logic and evidence — not social intuition",
      "Celebrate hyperlexia: 'Your decoding is extraordinary — now let's discover the hidden story'",
    ],
    books: [
      {title:"The Curious Incident of the Dog in the Night-Time",author:"Mark Haddon",emoji:"🐕",note:"Autistic narrator — see the world through Christopher's beautiful mind"},
      {title:"Matilda",author:"Roald Dahl",emoji:"📖",note:"Extraordinary mind in an ordinary world — the outsider who triumphs through intelligence"},
      {title:"Charlotte's Web",author:"E.B. White",emoji:"🕸️",note:"Perfect literal + inferential: What do Charlotte's words ACTUALLY mean? What is she really doing?"},
      {title:"Harry Potter and the Philosopher's Stone",author:"J.K. Rowling",emoji:"⚡",note:"Rule-based magical world — logic, patterns, fairness, a place where being different is power"},
      {title:"Diary of a Wimpy Kid",author:"Jeff Kinney",emoji:"📓",note:"Excellent for understanding social rules and WHY they exist — and why Greg keeps getting them wrong"},
      {title:"The Hitchhiker's Guide to the Galaxy",author:"Douglas Adams",emoji:"🌌",note:"Logical absurdism — celebrates the literal mind's confusion at a baffling universe"},
      {title:"James and the Giant Peach",author:"Roald Dahl",emoji:"🍑",note:"Escaping a terrible world through imagination — perfect for visual imagery practice"},
      {title:"A Wrinkle in Time",author:"Madeleine L'Engle",emoji:"⭐",note:"Pattern-thinking and scientific logic save the universe. Intelligence IS the superpower."},
      {title:"Encyclopedia Brown",author:"Donald J. Sobol",emoji:"🔍",note:"Solve the mystery using only CLUES and LOGIC — autistic cognitive style as hero"},
      {title:"Sherlock Holmes",author:"Arthur Conan Doyle",emoji:"🔎",note:"The patron saint of autistic reading: obsessive detail, pure logic, social confusion, genius"},
    ],
    activities: [
      "Visualise and describe — draw what you picture",
      "Spot the rule — what social rules are the characters following?",
      "Literal vs hidden meaning — what they say vs what they mean",
      "Emotion detective — what is the character feeling? How do you know?",
      "Predict with evidence — what PROOF tells you what happens next?",
      "Special interest link — how does this book connect to your favourite topic?",
      "Fact check the author — is the science/history accurate?",
      "Character logic — does this character's behaviour make sense?",
      "Vocabulary power — collect unusual words like a dictionary",
      "Rewrite from different character's point of view",
    ],
    inspirers: [
      {name:"Temple Grandin", condition:"Autism", achievement:"Revolutionised animal science — her visual thinking saw what neurotypical scientists missed. Wrote multiple bestselling books about her autistic mind."},
      {name:"Alan Turing", condition:"Suspected autism", achievement:"Invented computer science and cracked Nazi codes. Thought in patterns others couldn't see. Changed the world."},
      {name:"Mark Haddon", condition:"Neurotypical — researched autism deeply", achievement:"Wrote The Curious Incident from an autistic perspective so authentically that autistic readers said 'he understands'"},
    ],
    parentNote: "Many autistic children are hyperlexic — reading at 3, 4, 5 years old. This is NOT evidence they understand what they read. Word recognition and comprehension are separate neural processes. Your child's extraordinary decoding is a gift. Starky's job is to open the door from words into meaning. It takes visual strategies, patience, and explicit teaching of what neurotypical readers absorb unconsciously. It is absolutely learnable.",
  },

  {
    id: "adhd",
    name: "ADHD",
    shortName: "ADHD",
    emoji: "⚡",
    color: "#FFC300",
    tagline: "ADHD readers read EVERYTHING — they just can't stop to read one thing at a time.",
    description: "ADHD brains are not broken reading brains — they are over-fuelled engines that need the right track. High-interest books, short bursts, movement, voice, drama, and competition are the tools. Starky is the fastest, most exciting reading teacher in existence.",
    scienceFact: "Research consistently shows ADHD children read at age-appropriate levels when material matches their interest. The deficit is in SUSTAINED attention — not reading ability. High-interest reading eliminates the gap.",
    readingStrengths: [
      "Hyperfocus on genuinely interesting material",
      "Creative and divergent thinking about stories",
      "Often exceptional at reading CHARACTER — they feel emotion intensely",
      "Strong verbal intelligence — oral comprehension usually excellent",
      "High creativity in writing and story creation",
    ],
    readingChallenges: [
      "Sustained attention on 'boring' material",
      "Losing the thread mid-page — re-reading paragraphs",
      "Working memory: forgetting what happened in earlier chapters",
      "Sitting still long enough to finish a page",
      "Starting assignments — the blank page is terrifying",
    ],
    adaptations: [
      "Start with the HOOK — most exciting part of the book first",
      "Short, rapid-fire questions — keep the brain engaged",
      "High-interest ONLY — never apologise for this choice",
      "Movement built in: stand up, act out scenes, use body percussion",
      "Gamify: 'Beat my question in under 10 seconds'",
      "Working memory support: 'Quick recap — what do we know so far?'",
      "Celebrate leaping ahead: 'You're already thinking about the ending — fantastic!'",
      "5-7 minute activity maximum, then switch mode",
    ],
    books: [
      {title:"Diary of a Wimpy Kid",author:"Jeff Kinney",emoji:"📓",note:"Perfect ADHD book: short chapters, illustrations, funny, relatable to social humiliations every kid knows"},
      {title:"Dog Man",author:"Dav Pilkey",emoji:"🐕",note:"Dav Pilkey has ADHD and dyslexia. Made for ADHD brains: visual, fast, funny, short, brilliant"},
      {title:"Percy Jackson and the Lightning Thief",author:"Rick Riordan",emoji:"⚡",note:"Rick Riordan wrote Percy Jackson FOR his son who has ADHD and dyslexia. Percy's ADHD is a superpower."},
      {title:"The Hunger Games",author:"Suzanne Collins",emoji:"🏹",note:"Impossible to put down. Action on every page. Perfect sustained attention machine for ADHD readers."},
      {title:"Matilda",author:"Roald Dahl",emoji:"📖",note:"Short chapters, constant action, immediate gratification — Roald Dahl wrote for impatient brains"},
      {title:"Horrible Histories",author:"Terry Deary",emoji:"💀",note:"History as comedy, gore, and shock. ADHD readers read the whole series without noticing they're learning"},
      {title:"Captain Underpants",author:"Dav Pilkey",emoji:"🩲",note:"Also by Pilkey. He was told he would never amount to anything. He wrote the bestselling children's book series in history."},
      {title:"Wimpy Kid: Do-It-Yourself Book",author:"Jeff Kinney",emoji:"✏️",note:"Reading + writing + drawing = ADHD heaven. The blank pages are not threatening — they're invitations."},
      {title:"The BFG",author:"Roald Dahl",emoji:"👂",note:"Invented words, sound effects, made-up language — ADHD brains love linguistic chaos"},
      {title:"Hitchhiker's Guide to the Galaxy",author:"Douglas Adams",emoji:"🌌",note:"Absurdist comedy that goes wherever it wants — a book with ADHD itself"},
    ],
    activities: [
      "Speed round: 10 comprehension questions as fast as possible",
      "Act out the scene — stand up and perform it",
      "What happens NEXT? Race to predict it",
      "Find the funniest moment in the chapter",
      "Character vs character: who would win in a fight?",
      "Rewrite the ending — 60 seconds, go!",
      "Draw the scene you most clearly pictured",
      "Best line in the whole book — find it",
      "Rate the chapter 1-10 and justify in 3 words",
      "Create a movie trailer for this book",
    ],
    inspirers: [
      {name:"Dav Pilkey", condition:"ADHD and Dyslexia", achievement:"Creator of Dog Man and Captain Underpants — two of the best-selling children's series ever. Was told in school he would amount to nothing. He writes for kids exactly like him."},
      {name:"Rick Riordan", condition:"His son has ADHD and dyslexia", achievement:"Wrote Percy Jackson specifically so his ADHD son could see himself as the hero — not broken, but a demigod with battle-ready senses"},
      {name:"Richard Branson", condition:"ADHD and Dyslexia", achievement:"Founder of Virgin. School told him he would either end up in prison or become a millionaire. Failed every exam. Built one of the world's biggest brands."},
    ],
    parentNote: "Books that look 'too easy' are not beneath your child. Dog Man looks like a baby book. It is also read by brilliant 12-year-olds and has created more readers than almost anything published this century. Percy Jackson is designed for ADHD brains and has reading levels comparable to Harry Potter. The child who reads Dog Man every night is practising reading EVERY NIGHT. That child will outread the child who struggles through a 'proper' book once a week. Meet them where they are. Hyperfocus on the right book is the most powerful reading intervention that exists.",
  },

  {
    id: "dyslexia",
    name: "Dyslexia & Learning Differences",
    shortName: "Dyslexia",
    emoji: "🎵",
    color: "#FF8C69",
    tagline: "Dyslexic minds see the big picture before anyone else has found the page.",
    description: "Dyslexia is not a reading disorder — it is a different kind of mind that struggles with one specific skill: decoding written symbols. Everything else — intelligence, creativity, verbal reasoning, spatial thinking, storytelling — is not just intact but often extraordinary. Starky teaches the bridge between that brilliant mind and the printed word.",
    scienceFact: "International Dyslexia Association: Orton-Gillingham structured literacy is the gold-standard intervention — multi-sensory, explicit, sequential phonics. The dyslexic brain can learn to read with the right pathway. Crucially: listening comprehension often far exceeds reading level — audiobooks are NOT cheating.",
    readingStrengths: [
      "Verbal intelligence and oral language often exceptional",
      "Big-picture thinking and narrative comprehension — they 'get' stories",
      "Spatial reasoning — often extraordinary visual-spatial thinkers",
      "Creative and divergent — connect ideas across domains",
      "Highly empathetic readers — feel characters deeply",
      "Listening comprehension often years ahead of reading level",
    ],
    readingChallenges: [
      "Word decoding — sounding out unfamiliar words",
      "Letter reversals (b/d, p/q) and word reversals",
      "Reading fluency — slow, effortful word-by-word reading",
      "Spelling — the most persistent challenge",
      "Visual tracking across lines of text",
      "Working memory while decoding",
    ],
    adaptations: [
      "AUDIOBOOKS ARE READING — never suggest otherwise. Listening + text = gold standard.",
      "Short sessions with breaks — decoding is exhausting",
      "Cover up surrounding text to reduce visual overwhelm",
      "Colour overlays mentioned — ask if they help",
      "Multi-sensory: say it, clap it, write it in air, then read it",
      "Comprehension questions should be VERBAL not written",
      "Build on extraordinary listening comprehension strength",
      "Font matters: dyslexia-friendly fonts (Lexie Readable, OpenDyslexic) — mention this",
      "Never time them. Reading speed is not reading intelligence.",
    ],
    books: [
      {title:"Percy Jackson and the Lightning Thief",author:"Rick Riordan",emoji:"⚡",note:"Written FOR dyslexic readers. Percy's dyslexia is because his brain is hardwired for Ancient Greek. Dyslexia = divine brain wiring."},
      {title:"Dog Man",author:"Dav Pilkey",emoji:"🐕",note:"Created by a dyslexic author for dyslexic readers. Visual storytelling, short bursts, huge payoff."},
      {title:"Charlie and the Chocolate Factory",author:"Roald Dahl",emoji:"🍫",note:"Roald Dahl had dyslexia. Short chapters. Outrageous imagination. Audiobook by Stephen Fry is perfection."},
      {title:"The Secret Garden",author:"Frances Hodgson Burnett",emoji:"🌿",note:"Rich sensory language — ideal for building vocabulary through listening. Audiobook recommended."},
      {title:"Wonder",author:"R.J. Palacio",emoji:"🌟",note:"Multiple short narrators — less overwhelming than long single-perspective chapters"},
      {title:"Harry Potter and the Philosopher's Stone",author:"J.K. Rowling",emoji:"⚡",note:"Stephen Fry's audiobook is one of the most loved recordings in the English language. Listening IS experiencing this book."},
      {title:"Holes",author:"Louis Sachar",emoji:"🕳️",note:"Short chapters, clever plot, audiobook excellent — perfect for building reading stamina gradually"},
      {title:"Diary of a Wimpy Kid",author:"Jeff Kinney",emoji:"📓",note:"Large font, many illustrations, short chapters — physical design is dyslexia-friendly"},
      {title:"Roald Dahl Complete Works",author:"Roald Dahl",emoji:"🦊",note:"Dahl himself had dyslexia. His writing style reflects it: short punchy sentences, outrageous vocabulary, auditory rhythm"},
      {title:"The Giver",author:"Lois Lowry",emoji:"📦",note:"Clean prose, clear sentences, deep ideas. Achievable text with extraordinary concepts."},
    ],
    activities: [
      "Listen first, then discuss — audiobook comprehension session",
      "Phoneme sorting — group words by sound families",
      "Multisensory spelling: say it, tap it, trace it, write it",
      "Syllable clapping: break every new word into beats",
      "Reading detectives: spot the phonics pattern on this page",
      "Vocabulary cartoons: draw the meaning of a new word",
      "Story mountain: map the plot with pictures not words",
      "Character voice: read in different voices to make it physical",
      "Oral retell: tell me the story without looking at the book",
      "Create an audiobook: record yourself reading a passage",
    ],
    inspirers: [
      {name:"Dav Pilkey", condition:"ADHD and Dyslexia", achievement:"Dog Man and Captain Underpants — teacher told him his comics were worthless. He dedicated his first book 'for anyone who has ever been told they were doing it wrong.'"},
      {name:"Agatha Christie", condition:"Dyslexia", achievement:"World's best-selling fiction writer of all time (after Shakespeare). Over 2 billion books sold. Described her own writing as laborious — she dictated most of her work."},
      {name:"Richard Branson", condition:"Dyslexia and ADHD", achievement:"Failed every exam at school. Built the Virgin empire. 'School taught me I was stupid. Business taught me I was not.'"},
    ],
    parentNote: "The worst thing you can say to a dyslexic child is 'read it again, more carefully.' They ARE being careful. Every word costs them ten times the effort it costs a typical reader. They are not lazy. They are exhausted. The best thing you can do: audiobooks, discussion, storytelling, oral comprehension — BUILD the love of stories through the ear, the gate that is wide open. When the love of stories is deep and powerful, learning to decode the written version becomes worth the effort.",
  },

  {
    id: "down-syndrome",
    name: "Down Syndrome",
    shortName: "DS",
    emoji: "💛",
    color: "#A8E063",
    tagline: "Reading can teach language — not just reflect it. This changes everything.",
    description: "Children with Down syndrome often surprise their families and teachers by reading before speaking fluently. This is because visual memory is one of their strongest cognitive channels, and reading can literally GROW their oral language, not just reflect it. Starky approaches DS reading with joy, repetition, visual strategies, and high expectations.",
    scienceFact: "Down Syndrome Education International (2024): Systematic evidence shows children with DS have specific visual memory strengths that support whole-word reading. Critically: teaching reading can IMPROVE oral language in DS — the direction of causation runs BOTH ways. Start early. Expect success.",
    readingStrengths: [
      "Strong visual memory — can learn whole words by sight rapidly",
      "Excellent long-term memory for materials they love",
      "Music and rhythm — support phonological awareness powerfully",
      "Emotional intelligence — highly attuned to character feelings",
      "Visual learning: pictures, photographs, concrete objects alongside text",
      "High motivation when the topic is loved",
    ],
    readingChallenges: [
      "Phonological processing — sound-to-letter correspondence harder",
      "Short-term verbal memory — instructions need to be short",
      "Speech and language: comprehension often exceeds expressive language",
      "Reading comprehension vs word recognition: may read words but miss meaning",
      "Sustained attention on challenging material",
    ],
    adaptations: [
      "Whole-word recognition first — 'flash card' reading is perfect start",
      "Pictures alongside every word — visual context is essential",
      "Short, simple instructions: ONE task at a time",
      "High repetition — same books many times is not boring, it is learning",
      "Celebrate EVERY word read — massive enthusiasm",
      "Short sessions: 10-15 minutes maximum before break",
      "Music to support memory: sing the word, rhythm the sentence",
      "Never compare to typical reading development timelines",
      "Reading TEACHES language — don't wait for language before reading",
    ],
    books: [
      {title:"The Very Hungry Caterpillar",author:"Eric Carle",emoji:"🐛",note:"Predictable text, numbered repetition, visual sequence — perfect whole-word flash card material"},
      {title:"Each Peach Pear Plum",author:"Janet and Allan Ahlberg",emoji:"🍐",note:"Simple rhyme, repeated structure, classic fairytale characters — extraordinary for word learning"},
      {title:"Guess How Much I Love You",author:"Sam McBratney",emoji:"🐰",note:"Emotional connection + repetitive text + bedtime ritual = perfect reading foundation"},
      {title:"The Gruffalo",author:"Julia Donaldson",emoji:"🦌",note:"Rhyme and rhythm support phonological memory. Predictable pattern means child can 'read' with you quickly"},
      {title:"We're Going on a Bear Hunt",author:"Michael Rosen",emoji:"🐻",note:"Strong rhythm, repetition, physical activity alongside reading — multi-sensory perfect"},
      {title:"Brown Bear Brown Bear",author:"Bill Martin Jr",emoji:"🐻",note:"Purest whole-word teaching text. 11 words learned from one beautiful book."},
      {title:"Dear Zoo",author:"Rod Campbell",emoji:"🦁",note:"Interactive, surprise element, simple vocabulary, perfect for supported reading"},
      {title:"Fantastic Mr. Fox",author:"Roald Dahl",emoji:"🦊",note:"Short chapters, clear good vs bad, animal characters — wonderful read-aloud for older DS readers"},
      {title:"Matilda",author:"Roald Dahl",emoji:"📖",note:"A child whose extraordinary abilities are dismissed by adults — profound resonance. Wonderful read-aloud."},
      {title:"Charlie and the Chocolate Factory",author:"Roald Dahl",emoji:"🍫",note:"Pure joy and imagination — perfect read-aloud. Short chapters, wonderful audiobook."},
    ],
    activities: [
      "Flash card word wall — grow the collection",
      "Spot the word: find this word on the page",
      "Sentence building with known words",
      "Match word to picture",
      "Read and clap: clap the rhythm of the sentence",
      "Word family sorting: all the 'cat' words together",
      "Sequence the story: put picture cards in order",
      "Favourite sentence: which one do you love most?",
      "Find the funny: what made you laugh?",
      "Retell with puppets or toys",
    ],
    inspirers: [
      {name:"Karen Gaffney", condition:"Down syndrome", achievement:"World's first person with Down syndrome to swim the English Channel (relay). Holds an honorary doctorate. International public speaker for inclusion."},
      {name:"Chris Burke", condition:"Down syndrome", achievement:"Professional actor — starred in the ABC series Life Goes On. First person with Down syndrome to star in their own TV show. Also a musician."},
      {name:"Mia Peterson", condition:"Down syndrome", achievement:"Self-advocate, author, and motivational speaker. Gave a speech at the White House. Co-wrote a book. 'I have more abilities than disabilities.'"},
    ],
    parentNote: "Start reading before your child can speak in full sentences. This sounds backwards. It is the most important thing you can learn. Research with Down syndrome children consistently shows that learning to read BUILDS oral language — the written word gives the child a visual anchor for words they can't yet hold in their auditory memory. The child who has a word on a flash card can LOOK at it while trying to say it. Literacy and language grow each other. Start the moment they show any interest. Expect reading. Celebrate every word. The research is clear: your child can do this.",
  },

  {
    id: "cerebral-palsy",
    name: "Cerebral Palsy & Physical Needs",
    shortName: "CP",
    emoji: "💪",
    color: "#C77DFF",
    tagline: "The mind that reads is the same mind whether the body turns pages or a switch does.",
    description: "Cerebral palsy affects movement, not intelligence. Many children with CP have fully typical cognition and a passionate love of books — they simply need adapted access. Eye-gaze technology, switches, AAC devices, voice activation, read-aloud software, and adapted page-turning all open the world of books. Starky never notices HOW you turn the page — only what's on it.",
    scienceFact: "Research confirms that literacy development in children with CP follows similar pathways to typical development when physical access barriers are removed. AAC technology enables children with complex communication needs to demonstrate comprehension far beyond what unaided expression shows.",
    readingStrengths: [
      "Cognitive ability often fully typical — intellectual capability intact",
      "Reading comprehension frequently age-appropriate or above",
      "Often voracious readers when access is provided",
      "Strong listening comprehension — audiobooks fully accessible",
      "Time for reading — hospitalisations and recovery periods create reading opportunities",
      "Rich inner world — imagination is unaffected by motor difficulties",
    ],
    readingChallenges: [
      "Physical page turning — technology required",
      "Writing to demonstrate comprehension — needs alternative output",
      "Oral reading — speech affected by motor control",
      "Fatigue — physical effort of reading position is real",
      "Speech-to-text and AAC response for questions",
    ],
    adaptations: [
      "ALWAYS offer alternatives: speak, type, point, tap switch, eye-gaze — all equally valid",
      "Audiobooks + e-books + adapted readers are the primary access method",
      "Never ask for oral reading unless the child wants to try",
      "Comprehension can be demonstrated through pointing, yes/no, AAC, eye-gaze",
      "Fatigue management: shorter sessions, comfortable positioning first",
      "Switch-accessible e-readers like VitalSource, Bookshare",
      "Read-aloud software: NaturalReader, Voice Dream, Learning Ally",
      "AAC device with literary vocabulary — prepare the device with book vocab",
      "Celebrate EVERY comprehension response however it's communicated",
    ],
    books: [
      {title:"Harry Potter series",author:"J.K. Rowling",emoji:"⚡",note:"All available as audiobooks (Stephen Fry), e-books, switch-accessible. 7 books of pure magic."},
      {title:"The Curious Incident of the Dog in the Night-Time",author:"Mark Haddon",emoji:"🐕",note:"First-person narrative of a neurodivergent mind — profound and beautiful. Excellent audiobook."},
      {title:"The Hitchhiker's Guide to the Galaxy",author:"Douglas Adams",emoji:"🌌",note:"Complete audiobook. Exceptional for a brilliant mind that needs to be entertained."},
      {title:"Lord of the Rings",author:"J.R.R. Tolkien",emoji:"💍",note:"Audiobook by Rob Inglis is legendary. For older readers: 60 hours of extraordinary storytelling."},
      {title:"To Kill a Mockingbird",author:"Harper Lee",emoji:"🐦",note:"Sissy Spacek audiobook. One of the most important books ever written. Fully accessible."},
      {title:"Roald Dahl Complete Works",author:"Roald Dahl",emoji:"🦊",note:"All available as audiobooks. Short, immediate, brilliant. Perfect for fatigue management."},
      {title:"Charlotte's Web",author:"E.B. White",emoji:"🕸️",note:"Simple, beautiful, profound. Perfect for all ages. Short chapters, full audiobook."},
      {title:"Wonder",author:"R.J. Palacio",emoji:"🌟",note:"About living in a body that draws stares. Multiple narrators. Many children with CP say this is the most important book they've ever read."},
      {title:"Out of My Mind",author:"Sharon Draper",emoji:"🧠",note:"Narrator has cerebral palsy, is non-verbal, and is the most intelligent child in her school. No-one around her knows. This book changes lives."},
      {title:"My Left Foot",author:"Christy Brown",emoji:"✍️",note:"Memoir of Irish writer with cerebral palsy who learned to type with his left foot. Raw, honest, extraordinary."},
    ],
    activities: [
      "Audiobook discussion — what happened? what do you think?",
      "Character ranking: who do you like most? (point or tap)",
      "Predict what happens next — yes/no prediction game",
      "Best moment vote: which was the best bit of this chapter?",
      "Emotion check: how did that scene make you feel?",
      "Comparison: this character is like ___. Why?",
      "Would you rather: based on two choices in the book",
      "Theme discussion: what is this book REALLY about?",
      "Recommendation: would you recommend this? To whom?",
      "Create the next chapter — dictate or type your ideas",
    ],
    inspirers: [
      {name:"Christy Brown", condition:"Cerebral palsy (severely limited motor control)", achievement:"Wrote a celebrated autobiography using only his left foot. Later a published poet and novelist. My Left Foot made into an Oscar-winning film."},
      {name:"Jean-Dominique Bauby", condition:"Locked-in syndrome", achievement:"Dictated an entire memoir by blinking his left eyelid. The Diving Bell and the Butterfly is one of the most beautiful books ever written."},
      {name:"Stephen Hawking", condition:"ALS (motor neurone disease)", achievement:"Communicated through a single cheek muscle. Wrote the best-selling physics book of all time. 'My body may be restricted, but my mind is free to roam the universe.'"},
    ],
    parentNote: "Out of My Mind by Sharon Draper is the most important recommendation on this list. Its narrator, Melody, has cerebral palsy, is completely non-verbal, and is the most intelligent child in her entire school. Nobody around her knows. When she finally gets a communication device and can express what she has understood all along, the response of the adults around her is devastating and triumphant in equal measure. If your child with CP has not read this book — read it together. Tonight.",
  },

  {
    id: "visual-impairment",
    name: "Visual Impairment",
    shortName: "VI",
    emoji: "✨",
    color: "#FF6B9D",
    tagline: "Every great story is already a world made of sound and touch. You were born ready.",
    description: "Literature requires no eyes. The greatest stories ever written reach through the ear with the same power as through the eye — and for children with visual impairment, the auditory pathway is often extraordinary. Braille, audiobooks, tactile books, and text-to-speech open every word ever written. Starky is entirely ear-based.",
    scienceFact: "Oxford Handbook of Developmental Cognitive Neuroscience: Congenitally blind children show neuroplastic redistribution of visual cortex to auditory processing. Their auditory memory and language comprehension frequently exceed sighted peers. Literature was always meant for the ear first — ancient storytelling is thousands of years older than reading.",
    readingStrengths: [
      "Exceptional auditory memory — hear and retain far more than sighted peers",
      "Rich language development — narrated world builds extensive vocabulary",
      "Listening comprehension often exceeds age-level significantly",
      "Strong narrative imagination — vivid mental imagery from description",
      "Braille gives full access to every published work",
      "Text-to-speech enables independent reading at high speed",
    ],
    readingChallenges: [
      "Physical access to text without adaptations",
      "Books with heavy visual components (maps, diagrams, picture books)",
      "Classroom reading at same pace as sighted peers",
      "Access to Braille materials (production is slow)",
      "Independence with new devices",
    ],
    adaptations: [
      "Audiobooks are the primary and equal reading format — never 'secondary'",
      "Braille materials: contact RNIB or equivalent national organisation",
      "Text-to-speech software: Voice Dream, Learning Ally, JAWS, NVDA",
      "Describe images and illustrations explicitly — they are part of the text",
      "Tactile books for young children: RNIB produces many",
      "Trust the ear completely — comprehension questions oral only",
      "Vocabulary from audio is often richer than from print",
      "Never assume less comprehension because of visual impairment",
      "Braille music is also available — the listening mind is equally musical",
    ],
    books: [
      {title:"Harry Potter series (Stephen Fry audiobooks)",author:"J.K. Rowling",emoji:"⚡",note:"Stephen Fry's 117-hour recording is considered one of the finest audiobooks ever made. This is the recommended format for VI readers."},
      {title:"The Hitchhiker's Guide to the Galaxy",author:"Douglas Adams",emoji:"🌌",note:"Complete audiobook. Language and comedy are everything — not one visual joke."},
      {title:"Roald Dahl Complete Works",author:"Roald Dahl",emoji:"🦊",note:"All available as audiobooks read by Roald Dahl himself or excellent voice actors. Sound is inseparable from Dahl's writing."},
      {title:"Lord of the Rings",author:"J.R.R. Tolkien",emoji:"💍",note:"Rob Inglis's audiobook is legendary — different voices for every character. 60 hours."},
      {title:"To Kill a Mockingbird",author:"Harper Lee",emoji:"🐦",note:"Audiobook by Sissy Spacek. One of the richest narrative voices in American literature."},
      {title:"Treasure Island",author:"Robert Louis Stevenson",emoji:"💀",note:"Pure storytelling — language is everything. Excellent audiobook tradition."},
      {title:"Sherlock Holmes Complete Works",author:"Arthur Conan Doyle",emoji:"🔎",note:"Sound and logic are everything. Sherlock Holmes famously 'reads' the world without visual aids."},
      {title:"A Wrinkle in Time",author:"Madeleine L'Engle",emoji:"⭐",note:"Extraordinary language and imagination. Full audiobook."},
      {title:"The Alchemist",author:"Paulo Coelho",emoji:"☀️",note:"Read by Jeremy Irons audiobook. Language carries every image. Perfect."},
      {title:"Pride and Prejudice",author:"Jane Austen",emoji:"💃",note:"Rosamund Pike audiobook — brilliant. Austen's wit is entirely language-based. Nothing visual is lost."},
    ],
    activities: [
      "Predict from audio clues — what does the scene sound like?",
      "Vocabulary from context — what does this word mean from how it's used?",
      "Character voice identification — whose speech is whose?",
      "Mental map: describe the setting in your mind after listening",
      "Comparative listening: same scene, two audiobooks, spot differences",
      "Write/dictate from the author's voice: imitate their style",
      "Sound design: what sounds would accompany this scene?",
      "Theme through language: find 3 phrases that carry the main theme",
      "Oral comprehension questions — rapid fire",
      "Create the sequel: dictate what happens next",
    ],
    inspirers: [
      {name:"John Milton", condition:"Blind from age 43", achievement:"Dictated Paradise Lost to his daughters after losing his sight entirely. It is arguably the greatest epic poem in the English language. Never saw a word of it."},
      {name:"Jorge Luis Borges", condition:"Blind in later life", achievement:"One of the 20th century's greatest writers. Continued to create — dictating and collaborating — long after blindness. His stories are about ideas, not images."},
      {name:"Homer", condition:"Ancient Greek poet, traditionally described as blind", achievement:"The Iliad and The Odyssey — two of the oldest and greatest stories ever told. Composed orally. The literary tradition began with a blind man."},
    ],
    parentNote: "The entire literary tradition began with a blind man. Homer composed the Iliad and the Odyssey orally — they existed as sound before anyone wrote them down. Every story was originally told, not read. Your child is not arriving at literature through the back door. They are arriving through the original door — the oldest one. Their relationship with the story, heard rather than seen, is as ancient and as valid as any reader's. Expect greatness from their literary mind. The neuroscience says it is almost certainly already there.",
  },

  {
    id: "nonverbal",
    name: "Non-Verbal & AAC Users",
    shortName: "AAC",
    emoji: "🎶",
    color: "#F4A261",
    tagline: "Understanding a story is not the same as speaking about it. Never confuse the two.",
    description: "Non-verbal children and AAC users often demonstrate reading comprehension through pointing, eye-gaze, switch activation, or device communication that far exceeds what their unaided expression suggests. Starky uses yes/no formats, multiple-choice, pointing, and AAC-compatible question structures to unlock what's already understood. The goal: never let a communication barrier become a comprehension barrier.",
    scienceFact: "Frontiers in Education 2025: Nonspeaking autistic teenagers and adults can learn to spell and demonstrate reading comprehension when given individualized AAC-compatible instruction. Jaswal et al. 2024 found that nonspeaking autistic individuals consistently understood far more than their environment assumed. Presuming competence is not optimism — it is evidence-based practice.",
    readingStrengths: [
      "Understanding often intact or above average — communication is the challenge",
      "Visual learning frequently very strong",
      "Pattern recognition and sequence understanding",
      "Emotional response to stories often profound",
      "Listening comprehension through shared reading can be exceptional",
      "May demonstrate understanding through body language, eye-gaze, affect",
    ],
    readingChallenges: [
      "Demonstrating comprehension without reliable speech",
      "AAC vocabulary may not include literary terms yet",
      "Shared reading requires skilled communication partner",
      "Fatigue from AAC use during complex comprehension tasks",
      "Assessment tools often don't capture true understanding",
    ],
    adaptations: [
      "PRESUME COMPETENCE — always assume understanding until proven otherwise",
      "Yes/No questions for every comprehension check",
      "Multiple choice by pointing or eye-gaze",
      "Story sequence ordering: 'Which picture comes first?'",
      "Emotional response: 'Did you like this part? Show me'",
      "AAC device preparation: add literary vocabulary before session",
      "Shared reading aloud — child listens, adult reads, comprehension is discussed",
      "Low-tech options: symbol cards, pointing boards, picture sequences",
      "Never skip to 'easier' books — adapt the QUESTION not the BOOK",
      "Partner-assisted scanning for switch users",
    ],
    books: [
      {title:"The Very Hungry Caterpillar",author:"Eric Carle",emoji:"🐛",note:"Predictable, sequenced, visual — perfect for pointing and sequencing activities"},
      {title:"We're Going on a Bear Hunt",author:"Michael Rosen",emoji:"🐻",note:"Repetitive, rhythmic, physical — can respond with movement, not just words"},
      {title:"The Gruffalo",author:"Julia Donaldson",emoji:"🦌",note:"Predictable structure allows anticipation — child can signal 'I know what comes next'"},
      {title:"Owl Babies",author:"Martin Waddell",emoji:"🦉",note:"Short, emotional, simple — powerful comprehension check on feelings. 'How do the babies feel?'"},
      {title:"Harry Potter and the Philosopher's Stone",author:"J.K. Rowling",emoji:"⚡",note:"Audiobook — many non-verbal children with complex needs listen to full Harry Potter and demonstrate comprehension through AAC"},
      {title:"Charlotte's Web",author:"E.B. White",emoji:"🕸️",note:"Read aloud. Emotional content is accessible and profound. Simple yes/no comprehension framework works perfectly."},
      {title:"Wonder",author:"R.J. Palacio",emoji:"🌟",note:"Many non-verbal children with complex needs have a profound response to this book. Auggie's experience of being misread resonates deeply."},
      {title:"Out of My Mind",author:"Sharon Draper",emoji:"🧠",note:"ESSENTIAL — narrator is non-verbal with cerebral palsy and is misunderstood. This book can be transformative for the child AND their family."},
      {title:"The One and Only Ivan",author:"Katherine Applegate",emoji:"🦍",note:"First-person narration by a gorilla who communicates through art. Extraordinary book about having things to say and finding the way to say them."},
      {title:"Watership Down",author:"Richard Adams",emoji:"🐰",note:"Audiobook. Rich narrative. For older readers — demonstrates that high literary experience is possible regardless of communication method."},
    ],
    activities: [
      "Yes/No comprehension: I'll say it, you show me — yes or no",
      "Point to the emotion: which face shows how the character feels?",
      "Story sequence: put these events in order (point or tap)",
      "Would you rather: choice between two things from the story",
      "Best bit: tap when we reach your favourite part (re-read together)",
      "Character choice: point to the character you like most",
      "Prediction with symbols: choose what you think happens next",
      "Shared vocabulary building: today's word is ___, find it on your device",
      "Rate the book: thumbs/happy face — good book or not?",
      "Re-enact: use toys or objects to show what happened in the scene",
    ],
    inspirers: [
      {name:"Carly Fleischmann", condition:"Non-verbal autism", achievement:"At age 11 began typing independently for first time. Described her inner world with extraordinary intelligence and eloquence. Now an author, journalist, and TV host. Her book Carly's Voice changed how the world understands non-verbal autism."},
      {name:"Tito Rajarshi Mukhopadhyay", condition:"Non-verbal autism", achievement:"Published his first poetry collection at age 8. Has published multiple books of poetry and prose. Communication: typing. Understanding: extraordinary."},
      {name:"Ivan the gorilla (The One and Only Ivan)", condition:"Fictional — but based on a real gorilla", achievement:"Communicated 15 years of solitude through finger-painted art. The real Ivan's art hangs in galleries. The story of having things to say and finding the way to say them."},
    ],
    parentNote: "Presume competence. These two words are the most important words in special needs education. Research has documented, repeatedly, that non-verbal children understand far more than the adults around them assume. The child who cannot tell you they understood Charlotte's Web may have wept inside at Charlotte's death. The child who cannot say who their favourite Harry Potter character is may have a fully formed opinion. Your job, and Starky's job, is to BUILD the bridge between what your child knows and what they can express — not to assume the understanding isn't there because the expression isn't easy. It is there. Presume it. Act on it.",
  },
];

// ── QUICK TILES ─────────────────────────────────────────────────────────────
function promptTiles(profile) {
  const n = profile.name;
  return [
    {e:"📚",t:"First reading session",p:`Design a first reading session for a child with ${n}. Give me a complete step-by-step guide including: how to set up the space, what book to start with, how to introduce it, what questions to ask, what success looks like, and what to do if they disengage. Make it practical and immediately usable.`},
    {e:"🧠",t:"Comprehension strategies",p:`Explain the best evidence-based reading comprehension strategies for children with ${n}. Give me specific techniques with examples of how to use each one during shared reading.`},
    {e:"📖",t:"Best books for this child",p:`Give me your top 10 book recommendations for a child with ${n}, from picture books through chapter books. For each one: WHY it works for this child, what the reading experience looks like, and the best format (print/audio/adapted).`},
    {e:"😔",t:"Child refusing to read",p:`A child with ${n} is completely refusing to engage with reading. They push books away, become distressed, or simply shut down. What do I do? Give me a compassionate, practical, research-based guide to rebuilding reading engagement.`},
    {e:"📝",t:"Comprehension questions",p:`Give me 20 excellent reading comprehension questions adapted for children with ${n}. Include literal, inferential, and creative questions. Show how to adapt each question for different communication abilities.`},
    {e:"🏠",t:"Home reading plan",p:`Design a 5-day home reading plan for a child with ${n}. Each day should be 15-20 minutes maximum. Use household objects and free resources. Make it genuinely fun and achievable.`},
    {e:"💌",t:"Guide for parents",p:`Write a comprehensive guide for parents of a child with ${n} who wants to support reading at home. Include what to do, what NOT to do, the most common mistakes parents make, and the most important things to know.`},
    {e:"🔬",t:"The reading science",p:`Explain the neuroscience and research findings on reading and ${n}. What do peer-reviewed studies say about how reading works differently in this profile? What does this mean for how we teach? Make it accessible for a parent.`},
  ];
}

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
function buildSystemPrompt(profile) {
  if (!profile) return "";
  const styles = {
    "autism":"VISUAL THINKER approach: use Visualizing and Verbalizing techniques. Ask: 'Picture this scene — describe what you see.' Explain all figurative language explicitly. Comprehension questions: literal first, THEN inferential. Connect to special interests always. Never assume inference is happening — scaffold it step by step. SHORT sentences. Logical structure. Predictable format.",
    "adhd":"HIGH ENERGY. Fast-moving. Activities in 5-7 minute bursts maximum. Gamify: timers, competitions, speed rounds. Physical: 'Stand up and act that scene out.' Celebrate loudly. Never require sitting still. Change mode frequently. Hook them immediately with the most exciting part first. Build in working memory support: 'Quick recap — what do we know so far?'",
    "dyslexia":"LISTENING FIRST always. Audiobooks are equal to print — never suggest otherwise. Build on extraordinary listening comprehension strength. Multisensory: say it, clap it, trace it. Never time reading aloud. Verbal comprehension only — no written responses. Celebrate the brilliant mind, not the decoding speed. Mention dyslexia is not a broken brain: it's a brain wired differently.",
    "down-syndrome":"JOY is the session. Short (10-15 min max). Massive celebration of every word. High repetition is not boring — it is learning. Visual + auditory together. ONE instruction at a time. Music and rhythm to support memory. Sing vocabulary. Whole-word flash card approach mentioned. Reading can TEACH language — both directions work.",
    "cerebral-palsy":"ALWAYS offer 3 ways to demonstrate understanding: say, point, or yes/no. Audiobooks are primary format — never secondary. Fatigue management: shorter sessions. Never ask for oral reading unless child wants to try. Comprehension through body language, AAC, eye-gaze — all equally valid. 'Out of My Mind' by Sharon Draper mentioned as life-changing.",
    "visual-impairment":"EAR is everything. Audiobooks are the format. Describe any visual content I reference. Trust the ear completely — auditory comprehension is frequently extraordinary. Braille and text-to-speech mentioned as access routes. Homer was blind — the literary tradition began with a blind poet. This child belongs at the centre of the literary world, not the edge.",
    "nonverbal":"PRESUME COMPETENCE — always, without exception. Yes/No question formats. Multiple choice by pointing. Never downgrade the book because of communication difficulty — adapt the QUESTION not the BOOK. AAC vocabulary preparation mentioned. Shared reading: adult reads aloud, comprehension discussion uses low-tech and high-tech options. Carly Fleischmann and Tito Mukhopadhyay as inspiration.",
  };
  return addKnowledgeToPrompt(`You are Starky — the world's most knowledgeable and compassionate reading tutor for children with special educational needs.

CURRENT PROFILE: ${profile.name} (${profile.shortName})
READING STRENGTHS: ${profile.readingStrengths.join("; ")}
READING CHALLENGES: ${profile.readingChallenges.join("; ")}

COMMUNICATION AND TEACHING STYLE:
${styles[profile.id]||"Warm, patient, expert."}

CRITICAL ADAPTATIONS FOR THIS PROFILE:
${profile.adaptations.map((a,i)=>`${i+1}. ${a}`).join("\n")}

YOUR APPROACH:
1. Every response ends with: "For the adult: [specific, practical guidance]"
2. Always offer adaptive alternatives — never only one way to do something
3. Connect books to the child's known interests and experiences
4. Celebrate every engagement, however small
5. Reference the inspiring figures with this profile to build identity and expectation
6. For comprehension: ALWAYS give literal questions before inferential ones
7. Vocabulary: context → definition → child's own example → celebrate
8. Never give a comprehension test. Give a comprehension CONVERSATION.

SESSION STRUCTURE TEMPLATE:
🌟 Opening ritual (same every session — predictability is safety)
📖 Core reading/discussion activity
✨ Child-led exploration
🎯 Closing celebration and preview of next session

LESSON FORMAT:
📚 [Activity Name]
📋 What you need: [minimal list]
⏱️ Time: [duration]
Step 1: [micro-step]
Step 2: [micro-step]
✅ What success looks like: [specific description]
💡 Adaptive version: [for more support]
For the adult: [essential guidance]

INSPIRING FIGURES WITH ${profile.shortName}:
${profile.inspirers.map(i=>`${i.name}: ${i.achievement}`).join("\n")}

LANGUAGE: If the student writes in Urdu (script or Roman Urdu like 'samajh nahi aa raha'), respond entirely in Urdu. Auto-detect language always.

Remember: You are not teaching a condition. You are teaching a reader. The most important thing you will ever do in a reading session is make a child feel that books are for them.`);
}

// ── PROGRESS PANEL ────────────────────────────────────────────────────────────
function ProgressPanel({progress, profile}) {
  const total = Object.values(progress).reduce((s,d)=>s+(d.sessions||0),0);
  const pd = profile?(progress[profile.id]||null):null;
  const books = Object.values(progress).reduce((s,d)=>s+(d.books?.length||0),0);
  if (total===0) return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:14}}>
      <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:8}}>📚 READING JOURNEY</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.7}}>"Every child deserves a reading tutor who believes in them completely." — Begin your first session to start your journey.</div>
    </div>
  );
  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:14}}>
      <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:12}}>📚 READING JOURNEY</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:8}}>
        {[{v:total,l:"SESSIONS",c:profile?.color||"#FFC300"},{v:books,l:"BOOKS",c:"#A8E063"},{v:pd?.sessions||0,l:"THIS PROFILE",c:profile?.color||"#63D2FF"}].map(x=>(
          <div key={x.l} style={{background:x.c+"12",border:"1px solid "+x.c+"28",borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:900,color:x.c}}>{x.v}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:700}}>{x.l}</div>
          </div>
        ))}
      </div>
      {pd?.books?.length>0&&<div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Books: {pd.books.slice(-3).join(", ")}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function ReadingForAllPage() {
  const [profile, setProfile] = useState(null);
  const [activeBook, setActiveBook] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState({});
  const { listening, supported: micSupported, toggle: toggleMic } = useVoiceInput(setInput);
  const { speak, stop: stopSpeaking, speaking, supported: ttsSupported } = useSpeakText();
  const [autoSpeak, setAutoSpeak] = useState(false);
  const chatEndRef = useRef(null);
  const { callsLeft, limitReached: _limitReached, recordCall } = useSessionLimit();
  const limitReached = false;
  const router = useRouter();

  useEffect(()=>{const fn=()=>setIsMobile(window.innerWidth<768);fn();window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);
  useEffect(()=>{setProgress(loadProg());},[]);
  useEffect(()=>{
    if(router.isReady&&router.query.condition&&!profile){
      const match=PROFILES.find(p=>p.id===router.query.condition);
      if(match)selectProfile(match);
    }
  },[router.isReady,router.query.condition]);

  const S = {
    page:{minHeight:"100vh",background:"linear-gradient(135deg,#060B20 0%,#0D1635 60%,#060B20 100%)",fontFamily:"'Nunito',sans-serif",color:"#fff"},
    hdr:{padding:isMobile?"12px 16px":"14px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"},
    card:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:18},
    btn:{border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.15s"},
  };
  const CSS="@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');\n*{box-sizing:border-box}button:focus{outline:2px solid #4F8EF7;outline-offset:2px}textarea:focus,input:focus{outline:none}\n::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}\n@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}\n@keyframes bookFloat{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}\n@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}\n@media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}";

  const selectProfile = (p) => {
    setProfile(p); setActiveBook(null);
    setMessages([{role:"assistant",content:"Hello! 📚\n\nWelcome to reading support for "+p.name+".\n\n"+p.description+"\n\n📊 WHAT THE RESEARCH TELLS US:\n"+p.scienceFact+"\n\n✅ READING STRENGTHS I'm working with:\n"+p.readingStrengths.map(s=>"• "+s).join("\n")+"\n\n🚀 HOW I TEACH:\n"+p.adaptations.slice(0,4).map(a=>"• "+a).join("\n")+"\n\nWe have "+p.books.length+" specially chosen books for this profile. Click any book on the left, or use the quick-start tiles, or simply ask me anything.\n\n📚 \""+p.inspirers[0].name+" — "+p.inspirers[0].achievement+"\"\n\nLet's read."}]);
  };

  const sendMessageDirect = async (text, book=activeBook) => {
    if (!text||loading) return;
    recordCall();
    const prog = recordSession(profile?.id, book?.title);
    setProgress(prog);
    const prev = [...messages,{role:"user",content:text}];
    setMessages(prev); setLoading(true);
    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1500,system:buildSystemPrompt(profile),messages:prev.map(m=>({role:m.role,content:m.content}))})});
      const data = await res.json();
      const replyText = data.content?.[0]?.text||"Something went wrong — please try again.";
      setMessages(p=>[...p,{role:"assistant",content:replyText}]);
      if (autoSpeak) speak(replyText);
    } catch { setMessages(p=>[...p,{role:"assistant",content:"Connection error. Please try again."}]); }
    setLoading(false);
  };

  const sendMessage = async (text) => {
    const txt=(text||input).trim();
    if (!txt||loading||limitReached) return;
    setInput("");
    await sendMessageDirect(txt);
  };

  const selectBook = (book) => {
    setActiveBook(book);
    sendMessageDirect("Tell me about \""+book.title+"\" by "+book.author+" for a child with "+profile.name+". Include: why this book was chosen for this profile, what the reading experience looks like with these adaptations, the best format for this child (print/audio/adapted), and 3 opening questions I can use in the first session. Note: "+book.note, book);
  };

  // ── PROFILE SELECTOR ──────────────────────────────────────────────────────
  if (!profile) return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Reading for All — Adaptive Reading Tutor for Special Needs | NewWorldEdu</title>
        <meta name="description" content="Adaptive reading tutor for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and non-verbal needs. Evidence-based literacy instruction and book recommendations." />
      </Head>
      <header style={S.hdr}>
        <a href="/" style={{textDecoration:"none",fontWeight:900,fontSize:15,color:"#fff"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <a href="/reading" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none",fontWeight:700}}>📚 Reading</a>
          <a href="/music-for-all" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none",fontWeight:700}}>🎶 Music for All</a>
          <a href="/arts-for-all" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none",fontWeight:700}}>🎨 Arts for All</a>
        </div>
      </header>

      <div style={{maxWidth:860,margin:"0 auto",padding:isMobile?"28px 16px":"52px 24px"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <div style={{fontSize:isMobile?52:72,marginBottom:10,animation:"bookFloat 3s ease-in-out infinite"}}>📖</div>
          <h1 style={{fontSize:isMobile?24:46,fontWeight:900,margin:"0 0 12px",lineHeight:1.2}}>Starky Reads <span style={{color:"#FF8C69"}}>For Every Child</span></h1>
          <p style={{fontSize:isMobile?14:17,color:"rgba(255,255,255,0.6)",maxWidth:600,margin:"0 auto 16px",lineHeight:1.9}}>
            A reading tutor trained specifically for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and complex communication needs. Every approach. Every book. Every child.
          </p>

          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:18,padding:isMobile?"16px":"20px 28px",maxWidth:640,margin:"0 auto 32px",textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1.5,marginBottom:12}}>📊 WHAT RESEARCH ACROSS 50+ STUDIES TELLS US</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8}}>
              {[
                "Autistic hyperlexic children can unlock comprehension through Visualizing & Verbalizing (PMC 2024 RCT)",
                "Audiobooks are NOT cheating for dyslexic readers — they are evidence-based access (IDA 2024)",
                "Reading can teach oral language in Down syndrome — causation runs both ways (DSEI 2024)",
                "Non-verbal children understand far more than unaided expression suggests (Frontiers 2025)",
                "Percy Jackson was written specifically for ADHD and dyslexic children — high interest eliminates the attentional gap",
                "Blind children's auditory cortex expands neuroplastically — their literary comprehension frequently exceeds sighted peers",
              ].map(f=>(
                <div key={f} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px",fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>
                  ✓ {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{fontSize:13,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:2,textAlign:"center",marginBottom:18}}>CHOOSE A READING PROFILE</div>

        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:14,marginBottom:40}}>
          {PROFILES.map(p=>{
            const prog = progress[p.id];
            return (
              <button key={p.id} onClick={()=>selectProfile(p)}
                style={{...S.btn,background:p.color+"0A",border:"2px solid "+p.color+"30",borderRadius:22,padding:"20px 18px",textAlign:"left",color:"#fff",position:"relative"}}
                onMouseEnter={e=>{e.currentTarget.style.background=p.color+"18";e.currentTarget.style.borderColor=p.color;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=p.color+"0A";e.currentTarget.style.borderColor=p.color+"30";e.currentTarget.style.transform="none";}}>
                {prog&&<div style={{position:"absolute",top:12,right:12,background:p.color+"20",border:"1px solid "+p.color+"40",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:800,color:p.color}}>{prog.sessions} sessions</div>}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <div style={{fontSize:32}}>{p.emoji}</div>
                  <div>
                    <div style={{fontWeight:900,fontSize:16,color:p.color}}>{p.name}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>{p.books.length} books · {p.activities.length} activities</div>
                  </div>
                </div>
                <div style={{fontSize:13,fontStyle:"italic",color:p.color+"CC",marginBottom:7,lineHeight:1.5}}>{p.tagline}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:10}}>{p.description.substring(0,130)}...</div>
                <div style={{background:p.color+"10",border:"1px solid "+p.color+"25",borderRadius:10,padding:"8px 10px",fontSize:10,color:p.color+"CC",lineHeight:1.6}}>
                  🔬 {p.scienceFact.substring(0,100)}...
                </div>
              </button>
            );
          })}
        </div>

        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:isMobile?"20px":"28px",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:10}}>📚</div>
          <div style={{fontWeight:900,fontSize:isMobile?15:18,color:"rgba(255,255,255,0.85)",marginBottom:8}}>Every child deserves a reading life.</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.9,maxWidth:560,margin:"0 auto"}}>
            The child who reads Charlotte's Web and weeps at Charlotte's death — whether they turned the pages with their hands, their eyes, a switch, or their ears — has had the same experience as every reader who ever loved that book. Reading is not how you access words. Reading is what happens when words reach your mind. Starky's job is to build that bridge — for every child, every mind, every way of being in the world.
          </div>
        </div>
      </div>
    </div>
  );

  // ── STUDIO INTERFACE ──────────────────────────────────────────────────────
  const tiles = promptTiles(profile);
  return (
    <div style={S.page}><style>{CSS}</style>
      <Head>
        <title>Reading for All — Adaptive Reading Tutor for Special Needs | NewWorldEdu</title>
        <meta name="description" content="Adaptive reading tutor for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and non-verbal needs. Evidence-based literacy instruction and book recommendations." />
      </Head>
      <header style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <a href="/" style={{textDecoration:"none",fontWeight:900,fontSize:isMobile?13:15,color:"#fff"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
          {!isMobile&&<><span style={{color:"rgba(255,255,255,0.2)"}}>›</span><span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Reading for All</span></>}
          <span style={{color:"rgba(255,255,255,0.2)"}}>›</span>
          <span style={{fontWeight:800,fontSize:13,color:profile.color}}>{profile.emoji} {profile.name}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <AccessibilityToolbar onAutoSpeakChange={setAutoSpeak} conditionId={profile?.id} />
          <button onClick={()=>{setProfile(null);setActiveBook(null);setMessages([]);}}
            style={{...S.btn,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 12px",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700}}>
            ← Profiles
          </button>
        </div>
      </header>

      <div style={{maxWidth:1020,margin:"0 auto",padding:isMobile?"12px":"20px 24px",display:"grid",gridTemplateColumns:isMobile?"1fr":"300px 1fr",gap:16}}>

        {/* SIDEBAR */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* Profile card */}
          <div style={{background:profile.color+"0A",border:"2px solid "+profile.color+"30",borderRadius:18,padding:14}}>
            <div style={{fontSize:28,marginBottom:4}}>{profile.emoji}</div>
            <div style={{fontWeight:900,fontSize:15,color:profile.color,marginBottom:2}}>{profile.name}</div>
            <div style={{fontSize:13,fontStyle:"italic",color:profile.color+"BB",marginBottom:10,lineHeight:1.5}}>{profile.tagline}</div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:10,marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.3)",letterSpacing:1,marginBottom:6}}>✅ READING STRENGTHS</div>
              {profile.readingStrengths.map(s=><div key={s} style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:3,lineHeight:1.4}}>• {s}</div>)}
            </div>
            <div style={{background:profile.color+"0C",border:"1px solid "+profile.color+"20",borderRadius:12,padding:10}}>
              <div style={{fontSize:10,fontWeight:900,color:profile.color+"90",letterSpacing:1,marginBottom:6}}>🔬 THE SCIENCE</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{profile.scienceFact}</div>
            </div>
          </div>

          {/* Book library */}
          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>
              📚 BOOKS FOR {profile.shortName} — {profile.books.length} TITLES
            </div>
            <div style={{maxHeight:330,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
              {profile.books.map(b=>(
                <button key={b.title} onClick={()=>selectBook(b)}
                  style={{...S.btn,background:activeBook?.title===b.title?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)",border:"1px solid "+(activeBook?.title===b.title?profile.color+"50":"rgba(255,255,255,0.06)"),borderRadius:10,padding:"9px 10px",textAlign:"left",display:"flex",gap:8,alignItems:"flex-start"}}
                  onMouseEnter={e=>{if(activeBook?.title!==b.title){e.currentTarget.style.background=profile.color+"10";e.currentTarget.style.borderColor=profile.color+"30";}}}
                  onMouseLeave={e=>{if(activeBook?.title!==b.title){e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}}
                >
                  <span style={{fontSize:16,flexShrink:0}}>{b.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:800,color:activeBook?.title===b.title?profile.color:"rgba(255,255,255,0.75)",lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.title}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{b.author}</div>
                    <div style={{fontSize:9,color:profile.color+"88",marginTop:2,lineHeight:1.4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.note}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Adaptations */}
          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>🔧 HOW STARKY ADAPTS</div>
            {profile.adaptations.map((a,i)=>(
              <div key={i} style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:6,lineHeight:1.5,paddingLeft:4,borderLeft:"2px solid "+profile.color+"30"}}>
                <span style={{color:profile.color+"80",fontWeight:700,marginRight:6}}>•</span>{a}
              </div>
            ))}
          </div>

          {/* Activities */}
          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>⚡ READING ACTIVITIES</div>
            {profile.activities.map((a,i)=>(
              <button key={i} onClick={()=>sendMessageDirect("Give me a complete step-by-step guide for this reading activity adapted for "+profile.name+": '"+a+"'. Include what the adult does, what the child does, adaptive options, what success looks like, and how to make it joyful.")}
                style={{...S.btn,width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:9,padding:"7px 10px",marginBottom:4,textAlign:"left",display:"flex",gap:8,alignItems:"center",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:600}}
                onMouseEnter={e=>{e.currentTarget.style.background=profile.color+"10";e.currentTarget.style.color=profile.color;}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
                <span style={{fontWeight:900,color:profile.color+"60",flexShrink:0,fontSize:10}}>{i+1}.</span>
                {a}
              </button>
            ))}
          </div>

          {/* Inspirers */}
          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>🏆 INSPIRING READERS & THINKERS</div>
            {profile.inspirers.map(ins=>(
              <button key={ins.name} onClick={()=>sendMessageDirect("Tell me the full inspiring story of "+ins.name+" and their relationship with "+profile.name+". Make it genuinely moving and motivating for a child. Include details of how they overcame challenges and what they achieved.")}
                style={{...S.btn,width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 11px",marginBottom:7,textAlign:"left",color:"#fff"}}
                onMouseEnter={e=>{e.currentTarget.style.background=profile.color+"10";e.currentTarget.style.borderColor=profile.color+"30";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}>
                <div style={{fontWeight:800,fontSize:12,color:profile.color,marginBottom:2}}>{ins.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontStyle:"italic",marginBottom:3}}>{ins.condition}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{ins.achievement.substring(0,80)}...</div>
              </button>
            ))}
          </div>

          {/* Parent note */}
          <div style={{background:profile.color+"0A",border:"1px solid "+profile.color+"25",borderRadius:16,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:profile.color,letterSpacing:1,marginBottom:8}}>💌 FOR PARENTS & CARERS</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.8}}>{profile.parentNote}</div>
          </div>

          <ProgressPanel progress={progress} profile={profile}/>
        </div>

        {/* MAIN AREA */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* Top banner */}
          <div style={{background:"linear-gradient(135deg,"+profile.color+"12,rgba(255,255,255,0.03))",border:"1px solid "+profile.color+"28",borderRadius:16,padding:"14px 18px",display:"flex",gap:14,alignItems:"center"}}>
            <div style={{fontSize:28,flexShrink:0}}>{profile.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:15,color:profile.color,marginBottom:2}}>{profile.name} Reading Studio</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{profile.tagline}</div>
            </div>
            <button onClick={()=>sendMessageDirect("Begin! Give me the single most powerful first activity for reading with a child with "+profile.name+" who has never had specialist reading support before. Complete, practical, joyful.")}
              style={{...S.btn,background:profile.color+"25",border:"1px solid "+profile.color+"50",borderRadius:12,padding:"10px 16px",color:profile.color,fontWeight:900,fontSize:13,flexShrink:0}}>
              Begin! →
            </button>
          </div>

          {/* Quick tiles */}
          <div style={{...S.card,padding:14}}>
            <div style={{fontSize:10,fontWeight:900,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:10}}>⚡ QUICK START</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:7}}>
              {tiles.map(t=>(
                <button key={t.t} onClick={()=>sendMessage(t.p)}
                  style={{...S.btn,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"12px 10px",textAlign:"center",color:"#fff"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=profile.color+"15";e.currentTarget.style.borderColor=profile.color+"40";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.transform="none";}}>
                  <div style={{fontSize:22,marginBottom:6}}>{t.e}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.75)",lineHeight:1.4}}>{t.t}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Special actions */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button onClick={()=>sendMessageDirect("Give me a complete 5-day home reading plan for a child with "+profile.name+". Each day: 15-20 minutes, achievable with household objects or free resources, specific activities with step-by-step instructions, and what success looks like each day.")}
              style={{...S.btn,background:profile.color+"10",border:"1px solid "+profile.color+"30",borderRadius:14,padding:"12px 14px",color:profile.color,fontWeight:800,fontSize:12,display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
              📅 5-Day Reading Plan
            </button>
            <button onClick={()=>sendMessageDirect("Give me the most important, most surprising, and most hopeful research findings about reading and "+profile.name+". Include: what the science says about their reading brain, what interventions work best (with evidence), and what parents absolutely need to know.")}
              style={{...S.btn,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"12px 14px",color:"rgba(255,255,255,0.6)",fontWeight:800,fontSize:12,display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
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

          {/* Chat */}
          <div style={{...S.card,overflow:"hidden",display:"flex",flexDirection:"column",flex:1}}>
            <div role="log" aria-label="Chat with Starky" aria-live="polite" style={{height:isMobile?360:500,overflowY:"auto",padding:isMobile?14:20,display:"flex",flexDirection:"column",gap:14}}>
              {messages.map((msg,i)=>(
                <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",gap:10,animation:"fadeUp 0.3s ease"}}>
                  {msg.role==="assistant"&&<div style={{width:32,height:32,borderRadius:"50%",background:profile.color+"20",border:"1px solid "+profile.color+"40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>📚</div>}
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
                  <div style={{width:32,height:32,borderRadius:"50%",background:profile.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📚</div>
                  <div style={{display:"flex",gap:5}}>{[0,0.2,0.4].map((d,j)=><div key={j} style={{width:9,height:9,borderRadius:"50%",background:profile.color,animation:"bounce 1s "+d+"s ease-in-out infinite",opacity:0.8}}/>)}</div>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>Starky is reading...</span>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <div style={{padding:"12px 16px",borderTop:"1px solid "+profile.color+"15"}}>
              <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input);}}}
                placeholder={"Ask anything about reading with "+profile.name+"... 'My child won't engage' · 'What book should I start with?' · 'How do I do comprehension questions?' · 'The science of reading and "+profile.shortName+"'"}
                rows={isMobile?3:4}
                style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid "+profile.color+"22",borderRadius:14,padding:"12px 14px",color:"#fff",fontSize:14,fontFamily:"'Nunito',sans-serif",resize:"vertical",lineHeight:1.6}}/>
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
                <button onClick={()=>sendMessage(input)} disabled={!input.trim()||loading}
                  style={{...S.btn,background:input.trim()&&!loading?"linear-gradient(135deg,"+profile.color+","+profile.color+"BB)":"rgba(255,255,255,0.08)",borderRadius:14,padding:"10px 24px",color:input.trim()&&!loading?"#060B20":"rgba(255,255,255,0.3)",fontWeight:900,fontSize:14}}>
                  {loading?"Reading...":"Send →"}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom card */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"18px 20px",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:8}}>📚</div>
            <div style={{fontWeight:900,fontSize:isMobile?14:16,color:"rgba(255,255,255,0.8)",marginBottom:6}}>"Every child deserves a reading life."</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.9,maxWidth:480,margin:"0 auto 12px"}}>{profile.parentNote.substring(0,200)}...</div>
            <button onClick={()=>sendMessageDirect("Tell me the most surprising and hopeful research finding about reading and "+profile.name+" — something that would genuinely astonish and move a parent. Make it unforgettable.")}
              style={{...S.btn,background:profile.color+"15",border:"1px solid "+profile.color+"35",borderRadius:12,padding:"10px 20px",color:profile.color,fontWeight:800,fontSize:12}}>
              Amaze me ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
