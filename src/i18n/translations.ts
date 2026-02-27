export type Locale = "en" | "si" | "ta";

export const localeNames: Record<Locale, string> = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
};

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.articles": "Articles",
    "nav.categories": "Categories",
    "nav.search": "Search",
    "nav.about": "About",

    // Hero
    "hero.tagline": "AI Powered Learning from KG to A Levels",
    "hero.title": "Explore Our Living Planet",
    "hero.subtitle":
      "Discover the wonders of Planet Earth through expertly crafted articles on climate, oceans, wildlife, and sustainability — with AI-powered guidance for every learner.",
    "hero.cta": "Start Exploring",
    "hero.cta2": "Ask Earth Tutor",

    // Sections
    "featured.title": "Featured Articles",
    "featured.subtitle": "Deep dives into the topics that matter most",
    "categories.title": "Explore by Topic",
    "categories.subtitle": "Dive into every corner of our planet",
    "latest.title": "Latest Articles",
    "latest.subtitle": "Fresh insights published weekly",
    "cta.title": "Ready to Discover Our Planet?",
    "cta.subtitle":
      "Join thousands of students exploring climate, oceans, wildlife, and sustainability with AI-powered guidance.",
    "cta.button": "Start Learning",

    // Articles
    "articles.readMore": "Read More",
    "articles.minRead": "min read",
    "articles.by": "By",
    "articles.published": "Published",
    "articles.related": "Related Articles",
    "articles.all": "All Articles",

    // Search
    "search.title": "Search Articles",
    "search.placeholder": "Search for climate, oceans, wildlife, sustainability...",
    "search.results": "results found",
    "search.noResults": "No articles found. Try a different search term.",
    "search.filter": "Filter by category",
    "search.all": "All Categories",

    // AI Assistant
    "ai.title": "AI Earth Tutor",
    "ai.subtitle": "Powered by Claude",
    "ai.placeholder": "Ask about climate, oceans, wildlife...",
    "ai.welcome":
      "Hello! I'm your AI Earth tutor. Ask me about climate change, oceans, wildlife, forests, sustainability — anything about our amazing planet. What would you like to explore today?",
    "ai.thinking": "Thinking...",

    // Footer
    "footer.description":
      "Empowering the next generation of learners with world-class educational content and AI-powered guidance.",
    "footer.quickLinks": "Quick Links",
    "footer.subjects": "Subjects",
    "footer.connect": "Connect",
    "footer.rights": "All rights reserved.",
    "footer.contact": "Contact Us",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.back": "Back",
    "common.viewAll": "View All",
  },
  si: {
    // Navigation
    "nav.home": "මුල් පිටුව",
    "nav.articles": "ලිපි",
    "nav.categories": "ප්‍රවර්ග",
    "nav.search": "සෙවීම",
    "nav.about": "අප ගැන",

    // Hero
    "hero.tagline": "KG සිට A Levels දක්වා AI බලයෙන් ඉගෙනීම",
    "hero.title": "අපේ ජීවමාන ග්‍රහලෝකය ගවේෂණය කරන්න",
    "hero.subtitle":
      "දේශගුණය, සාගර, වනජීවී හා තිරසාරභාවය පිළිබඳ විශේෂඥ ලිපි හරහා පෘථිවි ග්‍රහලෝකයේ අරුම පුදුම දේ සොයා ගන්න — AI මඟපෙන්වීම සමඟ.",
    "hero.cta": "ගවේෂණය ආරම්භ කරන්න",
    "hero.cta2": "පෘථිවි ගුරුවරයාගෙන් අසන්න",

    // Sections
    "featured.title": "විශේෂාංග ලිපි",
    "featured.subtitle": "වැදගත්ම මාතෘකා ගැන ගැඹුරු විමර්ශන",
    "categories.title": "මාතෘකාව අනුව ගවේෂණය කරන්න",
    "categories.subtitle": "අපේ ග්‍රහලෝකයේ සෑම කෙළවරකටම කිමිදෙන්න",
    "latest.title": "නවතම ලිපි",
    "latest.subtitle": "සතිපතා ප්‍රකාශිත නව අදහස්",
    "cta.title": "ඔබේ ඉගෙනීම පරිවර්තනය කිරීමට සූදානම්ද?",
    "cta.subtitle":
      "AI බලයෙන් ක්‍රියාත්මක මඟපෙන්වීම සමඟ නව දැනුම් ලෝකයක් දැනටමත් සොයා ගන්නා දහස් ගණන් සිසුන්ට එක්වන්න.",
    "cta.button": "නොමිලේ ආරම්භ කරන්න",

    // Articles
    "articles.readMore": "තවත් කියවන්න",
    "articles.minRead": "මිනි කියවීම",
    "articles.by": "විසින්",
    "articles.published": "ප්‍රකාශිතයි",
    "articles.related": "අදාළ ලිපි",
    "articles.all": "සියලු ලිපි",

    // Search
    "search.title": "ලිපි සොයන්න",
    "search.placeholder": "මාතෘකා, විෂයයන් හෝ ප්‍රශ්න සොයන්න...",
    "search.results": "ප්‍රතිඵල සොයා ගන්නා ලදී",
    "search.noResults": "ලිපි හමු නොවීය. වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න.",
    "search.filter": "ප්‍රවර්ගය අනුව පෙරන්න",
    "search.all": "සියලු ප්‍රවර්ග",

    // AI Assistant
    "ai.title": "AI පෘථිවි ගුරුවරයා",
    "ai.subtitle": "Claude බලයෙන්",
    "ai.placeholder": "දේශගුණය, සාගර, වනජීවී ගැන අසන්න...",
    "ai.welcome":
      "ආයුබෝවන්! මම ඔබේ AI පෘථිවි ගුරුවරයා. දේශගුණ විපර්යාස, සාගර, වනජීවී, වනාන්තර, තිරසාරභාවය — අපේ අරුම පුදුම ග්‍රහලෝකය ගැන ඕනෑම දෙයක් මගෙන් අසන්න. අද ඔබ කුමක් ගවේෂණය කිරීමට කැමතිද?",
    "ai.thinking": "සිතමින්...",

    // Footer
    "footer.description":
      "ලෝක මට්ටමේ අධ්‍යාපන අන්තර්ගතය සහ AI බලයෙන් ක්‍රියාත්මක මඟපෙන්වීම සමඟ ඊළඟ පරම්පරාවේ ඉගෙන ගන්නන් සවිබල ගැන්වීම.",
    "footer.quickLinks": "ඉක්මන් සබැඳි",
    "footer.subjects": "විෂයයන්",
    "footer.connect": "සම්බන්ධ වන්න",
    "footer.rights": "සියලු හිමිකම් ඇවිරිණි.",
    "footer.contact": "අප අමතන්න",
    "footer.privacy": "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
    "footer.terms": "සේවා නියමයන්",

    // Common
    "common.loading": "පූරණය වෙමින්...",
    "common.error": "යමක් වැරදුණා",
    "common.back": "ආපසු",
    "common.viewAll": "සියල්ල බලන්න",
  },
  ta: {
    // Navigation
    "nav.home": "முகப்பு",
    "nav.articles": "கட்டுரைகள்",
    "nav.categories": "வகைகள்",
    "nav.search": "தேடல்",
    "nav.about": "எங்களைப் பற்றி",

    // Hero
    "hero.tagline": "KG முதல் A Levels வரை AI இயக்கும் கற்றல்",
    "hero.title": "நமது உயிர்ப்புள்ள கிரகத்தை ஆராயுங்கள்",
    "hero.subtitle":
      "காலநிலை, கடல்கள், வனவிலங்குகள் மற்றும் நிலைத்தன்மை பற்றிய நிபுணர் கட்டுரைகள் மூலம் பூமியின் அதிசயங்களைக் கண்டறியுங்கள் — AI வழிகாட்டுதலுடன்.",
    "hero.cta": "ஆராய்ச்சியைத் தொடங்குங்கள்",
    "hero.cta2": "பூமி ஆசிரியரிடம் கேளுங்கள்",

    // Sections
    "featured.title": "சிறப்புக் கட்டுரைகள்",
    "featured.subtitle": "மிக முக்கியமான தலைப்புகளில் ஆழமான ஆராய்ச்சி",
    "categories.title": "தலைப்பு வாரியாக ஆராயுங்கள்",
    "categories.subtitle": "நமது கிரகத்தின் ஒவ்வொரு மூலையிலும் மூழ்குங்கள்",
    "latest.title": "சமீபத்திய கட்டுரைகள்",
    "latest.subtitle": "வாராந்திர புதிய நுண்ணறிவுகள்",
    "cta.title": "உங்கள் கற்றலை மாற்ற தயாரா?",
    "cta.subtitle":
      "AI இயக்கும் வழிகாட்டுதலுடன் புதிய அறிவு உலகத்தை ஏற்கனவே கண்டுபிடிக்கும் ஆயிரக்கணக்கான மாணவர்களுடன் சேருங்கள்.",
    "cta.button": "இலவசமாகத் தொடங்குங்கள்",

    // Articles
    "articles.readMore": "மேலும் படிக்க",
    "articles.minRead": "நிமிட வாசிப்பு",
    "articles.by": "எழுதியவர்",
    "articles.published": "வெளியிடப்பட்டது",
    "articles.related": "தொடர்புடைய கட்டுரைகள்",
    "articles.all": "அனைத்து கட்டுரைகள்",

    // Search
    "search.title": "கட்டுரைகளைத் தேடுங்கள்",
    "search.placeholder": "தலைப்புகள், பாடங்கள் அல்லது கேள்விகளைத் தேடுங்கள்...",
    "search.results": "முடிவுகள் கிடைத்தன",
    "search.noResults":
      "கட்டுரைகள் கிடைக்கவில்லை. வேறு தேடல் சொல்லை முயற்சிக்கவும்.",
    "search.filter": "வகை வாரியாக வடிகட்டுங்கள்",
    "search.all": "அனைத்து வகைகள்",

    // AI Assistant
    "ai.title": "AI பூமி ஆசிரியர்",
    "ai.subtitle": "Claude இயக்குகிறது",
    "ai.placeholder": "காலநிலை, கடல்கள், வனவிலங்குகள் பற்றி கேளுங்கள்...",
    "ai.welcome":
      "வணக்கம்! நான் உங்கள் AI பூமி ஆசிரியர். காலநிலை மாற்றம், கடல்கள், வனவிலங்குகள், காடுகள், நிலைத்தன்மை — நமது அற்புதமான கிரகத்தைப் பற்றி எதையும் என்னிடம் கேளுங்கள். இன்று நீங்கள் எதை ஆராய விரும்புகிறீர்கள்?",
    "ai.thinking": "சிந்திக்கிறேன்...",

    // Footer
    "footer.description":
      "உலகத்தரம் வாய்ந்த கல்வி உள்ளடக்கம் மற்றும் AI இயக்கும் வழிகாட்டுதலுடன் அடுத்த தலைமுறை கற்பவர்களை மேம்படுத்துதல்.",
    "footer.quickLinks": "விரைவு இணைப்புகள்",
    "footer.subjects": "பாடங்கள்",
    "footer.connect": "இணையுங்கள்",
    "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    "footer.contact": "எங்களைத் தொடர்புகொள்ளுங்கள்",
    "footer.privacy": "தனியுரிமைக் கொள்கை",
    "footer.terms": "சேவை விதிமுறைகள்",

    // Common
    "common.loading": "ஏற்றுகிறது...",
    "common.error": "ஏதோ தவறு நடந்தது",
    "common.back": "பின்செல்",
    "common.viewAll": "அனைத்தையும் காண்க",
  },
};
