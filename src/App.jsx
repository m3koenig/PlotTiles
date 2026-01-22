import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import {
  RotateCw, Lock, Info, Check, Download, Upload, Maximize2, X, Lightbulb, Volume2, Menu,
  Sword, Shield, Ghost, Castle, Mountain,
  Trees, Flame, Skull, FlaskConical, Key,
  Map as MapIcon, Compass, Sun, Moon, Zap,
  Bird, Fish, Footprints,
  Cloud, Snowflake, Heart, Brain, Anchor,
  Hammer, Book, Eye, Gem, Gift,
  Bomb, Bug, CloudLightning, Crown,
  Dog, Droplets, Fan, Feather,
  Hand, Leaf, Magnet, Palette,
  Rocket, Shell, Star, Umbrella,
  Watch, Wind, Axe, Ambulance, Baby, Banana, Beer,
  Bell, Biohazard, Bone, Briefcase, Camera, Car, Cat, Cherry, Clapperboard,
  Clock, Coffee, Coins, Construction, Cookie, Cpu, Crosshair, Dna, DoorOpen, Drum,
  Dumbbell, Egg, Factory, FerrisWheel, FileText, Flag, Flashlight, Flower, ForkKnife, Frown,
  Fuel, Gamepad2, Gavel, Glasses, Globe, Grape, Guitar, Handshake, Headphones, History,
  Home, Hospital, Hotel, IceCream, Image, Infinity, Joystick, Keyboard, Lamp, Landmark,
  Laptop, Lasso, Library as LibraryIcon, LifeBuoy, Lightbulb as LightbulbIcon, Luggage, Mail, MapPin, Medal, Megaphone,
  Mic, Microscope, Monitor, Mouse, Music, Navigation, Network, Newspaper, Nut, Orbit,
  Package, Paintbrush, Palmtree, Paperclip, PartyPopper, PawPrint, PenTool, Pencil as PencilIcon,
  Phone, PiggyBank, Pill, Plane, Plug, Pocket, Power, Printer, Puzzle, Radiation, Radio,
  Rat, Recycle, Route, Ruler, Save, Search, Send, Settings, Share,
  Ship, Shirt, ShoppingBag, ShoppingCart, Shovel, Siren, Smartphone, Smile, Speaker,
  Sprout, Stethoscope, StickyNote, Table, Tablet, Tag, Target, Tent, Terminal, Thermometer,
  ThumbsDown, ThumbsUp, Ticket, Timer, Tornado, Train, Trash, Trophy, Truck, Tv, Users,
  Video, Wallet, Waves, Webcam, Wifi, Wine,
  Bold, Italic, Heading1, Heading2, Layout, Sparkles, Copy, Link as LinkIcon, Share2
} from 'lucide-react';

// ==========================================
// 1. HILFSFUNKTIONEN & UTILS
// ==========================================

/**
 * Wandelt einfache Markdown-Syntax in HTML-Strings um
 */
const renderMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-xs font-bold mt-1 text-indigo-600">$3</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-sm font-bold mt-2 text-indigo-700">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-base font-bold mt-2 text-indigo-800">$1</h1>')
    .replace(/^\* (.*$)/gim, '<li class="ml-2 list-disc">$1</li>')
    .replace(/^\- (.*$)/gim, '<li class="ml-2 list-dash">$1</li>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br />');
};

/**
 * Seed Encoding / Decoding
 */
const encodeState = (state) => {
  try {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) { return ""; }
};

const decodeState = (encoded) => {
  try {
    if (!encoded) return null;
    const json = decodeURIComponent(escape(atob(encoded.trim())));
    return JSON.parse(json);
  } catch (e) { return null; }
};

// ==========================================
// 2. STATISCHE DATEN (Kategorien, Icons, Tags)
// ==========================================

const CATEGORIES = [
  { label: 'Konflikt', bg: 'bg-red-500', shadow: 'shadow-red-500/40' },
  { label: 'Stimmung', bg: 'bg-blue-600', shadow: 'shadow-blue-600/40' },
  { label: 'Ort', bg: 'bg-green-600', shadow: 'shadow-green-600/40' },
  { label: 'Objekt', bg: 'bg-yellow-500', shadow: 'shadow-yellow-500/40' },
  { label: 'Magie', bg: 'bg-purple-600', shadow: 'shadow-purple-600/40' },
  { label: 'Charakter', bg: 'bg-orange-500', shadow: 'shadow-orange-500/40' },
  { label: 'Twist', bg: 'bg-teal-500', shadow: 'shadow-teal-500/40' },
  { label: 'Soziales', bg: 'bg-pink-500', shadow: 'shadow-pink-500/40' },
  { label: 'Wissen', bg: 'bg-indigo-600', shadow: 'shadow-indigo-600/40' },
];

const SETTINGS_TAGS = [
  { id: 'fantasy', label: 'High Fantasy', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'scifi', label: 'Cyberpunk', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { id: 'horror', label: 'Gothic Horror', color: 'text-purple-900', bg: 'bg-purple-50' },
  { id: 'noir', label: 'Film Noir', color: 'text-slate-700', bg: 'bg-slate-100' },
  { id: 'west', label: 'Wild West', color: 'text-orange-800', bg: 'bg-orange-50' },
  { id: 'space', label: 'Space Opera', color: 'text-indigo-600', bg: 'bg-indigo-50' }
];

const STORY_ICONS = [
  { name: 'Schwert', icon: Sword, genres: ['fantasy', 'west'] },
  { name: 'Schild', icon: Shield, genres: ['fantasy', 'space'] },
  { name: 'Geist', icon: Ghost, genres: ['horror', 'fantasy'] },
  { name: 'Burg', icon: Castle, genres: ['fantasy', 'horror'] },
  { name: 'Berg', icon: Mountain, genres: ['fantasy', 'west'] },
  { name: 'Wald', icon: Trees, genres: ['fantasy', 'horror'] },
  { name: 'Feuer', icon: Flame, genres: ['horror', 'scifi'] },
  { name: 'Totenkopf', icon: Skull, genres: ['horror', 'noir'] },
  { name: 'Trank', icon: FlaskConical, genres: ['fantasy', 'scifi'] },
  { name: 'Schlüssel', icon: Key, genres: ['noir', 'fantasy'] },
  { name: 'Karte', icon: MapIcon, genres: ['fantasy', 'west'] },
  { name: 'Kompass', icon: Compass, genres: ['west', 'space'] },
  { name: 'Sonne', icon: Sun, genres: ['fantasy', 'west'] },
  { name: 'Mond', icon: Moon, genres: ['horror', 'noir'] },
  { name: 'Blitz', icon: Zap, genres: ['scifi', 'space'] },
  { name: 'Vogel', icon: Bird, genres: ['fantasy', 'west'] },
  { name: 'Fisch', icon: Fish, genres: ['fantasy', 'noir'] },
  { name: 'Spur', icon: Footprints, genres: ['noir', 'west'] },
  { name: 'Wolke', icon: Cloud, genres: ['scifi', 'space'] },
  { name: 'Schnee', icon: Snowflake, genres: ['fantasy', 'horror'] },
  { name: 'Herz', icon: Heart, genres: ['noir', 'fantasy'] },
  { name: 'Gehirn', icon: Brain, genres: ['scifi', 'horror'] },
  { name: 'Anker', icon: Anchor, genres: ['noir', 'fantasy'] },
  { name: 'Hammer', icon: Hammer, genres: ['fantasy', 'west'] },
  { name: 'Buch', icon: Book, genres: ['fantasy', 'noir'] },
  { name: 'Auge', icon: Eye, genres: ['horror', 'noir'] },
  { name: 'Edelstein', icon: Gem, genres: ['fantasy', 'noir'] },
  { name: 'Geschenk', icon: Gift, genres: ['noir', 'fantasy'] },
  { name: 'Bombe', icon: Bomb, genres: ['noir', 'scifi'] },
  { name: 'Käfer', icon: Bug, genres: ['horror', 'scifi'] },
  { name: 'Gewitter', icon: CloudLightning, genres: ['horror', 'space'] },
  { name: 'Krone', icon: Crown, genres: ['fantasy', 'noir'] },
  { name: 'Hund', icon: Dog, genres: ['west', 'noir'] },
  { name: 'Tropfen', icon: Droplets, genres: ['fantasy', 'noir'] },
  { name: 'Feder', icon: Feather, genres: ['fantasy', 'noir'] },
  { name: 'Hand', icon: Hand, genres: ['noir', 'horror'] },
  { name: 'Blatt', icon: Leaf, genres: ['fantasy', 'west'] },
  { name: 'Magnet', icon: Magnet, genres: ['scifi', 'space'] },
  { name: 'Rakete', icon: Rocket, genres: ['space', 'scifi'] },
  { name: 'Muschel', icon: Shell, genres: ['fantasy', 'noir'] },
  { name: 'Stern', icon: Star, genres: ['space', 'fantasy'] },
  { name: 'Schirm', icon: Umbrella, genres: ['noir', 'horror'] },
  { name: 'Uhr', icon: Watch, genres: ['noir', 'scifi'] },
  { name: 'Wind', icon: Wind, genres: ['fantasy', 'west'] },
  { name: 'Axt', icon: Axe, genres: ['fantasy', 'horror'] },
  { name: 'Ambulanz', icon: Ambulance, genres: ['horror', 'noir'] },
  { name: 'Baby', icon: Baby, genres: ['horror', 'fantasy'] },
  { name: 'Banane', icon: Banana, genres: ['noir', 'scifi'] },
  { name: 'Bier', icon: Beer, genres: ['west', 'noir'] },
  { name: 'Glocke', icon: Bell, genres: ['fantasy', 'horror'] },
  { name: 'Gefahr', icon: Biohazard, genres: ['scifi', 'horror'] },
  { name: 'Knochen', icon: Bone, genres: ['horror', 'fantasy'] },
  { name: 'Koffer', icon: Briefcase, genres: ['noir', 'scifi'] },
  { name: 'Foto', icon: Camera, genres: ['noir', 'horror'] },
  { name: 'Auto', icon: Car, genres: ['noir', 'scifi'] },
  { name: 'Katze', icon: Cat, genres: ['horror', 'noir'] },
  { name: 'Kirsche', icon: Cherry, genres: ['noir', 'fantasy'] },
  { name: 'Film', icon: Clapperboard, genres: ['noir', 'scifi'] },
  { name: 'Zeit', icon: Clock, genres: ['scifi', 'noir'] },
  { name: 'Kaffee', icon: Coffee, genres: ['noir', 'scifi'] },
  { name: 'Münzen', icon: Coins, genres: ['noir', 'west'] },
  { name: 'Baustelle', icon: Construction, genres: ['scifi', 'noir'] },
  { name: 'Keks', icon: Cookie, genres: ['fantasy', 'horror'] },
  { name: 'Technik', icon: Cpu, genres: ['scifi', 'space'] },
  { name: 'Ziel', icon: Crosshair, genres: ['noir', 'scifi'] },
  { name: 'DNA', icon: Dna, genres: ['scifi', 'horror'] },
  { name: 'Tür', icon: DoorOpen, genres: ['horror', 'fantasy'] },
  { name: 'Trommel', icon: Drum, genres: ['fantasy', 'west'] },
  { name: 'Sport', icon: Dumbbell, genres: ['scifi', 'noir'] },
  { name: 'Ei', icon: Egg, genres: ['fantasy', 'scifi'] },
  { name: 'Fabrik', icon: Factory, genres: ['scifi', 'noir'] },
  { name: 'Rummel', icon: FerrisWheel, genres: ['horror', 'noir'] },
  { name: 'Dokument', icon: FileText, genres: ['noir', 'scifi'] },
  { name: 'Flagge', icon: Flag, genres: ['west', 'space'] },
  { name: 'Taschenlampe', icon: Flashlight, genres: ['horror', 'noir'] },
  { name: 'Blume', icon: Flower, genres: ['fantasy', 'noir'] },
  { name: 'Essen', icon: ForkKnife, genres: ['noir', 'west'] },
  { name: 'Trauer', icon: Frown, genres: ['horror', 'noir'] },
  { name: 'Tanken', icon: Fuel, genres: ['scifi', 'west'] },
  { name: 'Gaming', icon: Gamepad2, genres: ['scifi', 'space'] },
  { name: 'Urteil', icon: Gavel, genres: ['noir', 'west'] },
  { name: 'Brille', icon: Glasses, genres: ['noir', 'scifi'] },
  { name: 'Welt', icon: Globe, genres: ['space', 'scifi'] },
  { name: 'Traube', icon: Grape, genres: ['fantasy', 'noir'] },
  { name: 'Gitarre', icon: Guitar, genres: ['noir', 'west'] },
  { name: 'Pakt', icon: Handshake, genres: ['noir', 'fantasy'] },
  { name: 'Musik', icon: Headphones, genres: ['scifi', 'noir'] },
  { name: 'Vergangenheit', icon: History, genres: ['fantasy', 'noir'] },
  { name: 'Zuhause', icon: Home, genres: ['horror', 'noir'] },
  { name: 'Krankenhaus', icon: Hospital, genres: ['horror', 'noir'] },
  { name: 'Hotel', icon: Hotel, genres: ['noir', 'horror'] },
  { name: 'Eis', icon: IceCream, genres: ['fantasy', 'horror'] },
  { name: 'Bild', icon: Image, genres: ['noir', 'fantasy'] },
  { name: 'Unendlich', icon: Infinity, genres: ['scifi', 'space'] },
  { name: 'Spielen', icon: Joystick, genres: ['scifi', 'space'] },
  { name: 'Tippen', icon: Keyboard, genres: ['scifi', 'noir'] },
  { name: 'Licht', icon: Lamp, genres: ['noir', 'horror'] },
  { name: 'Denkmal', icon: Landmark, genres: ['fantasy', 'noir'] },
  { name: 'Laptop', icon: Laptop, genres: ['scifi', 'space'] },
  { name: 'Einfangen', icon: Lasso, genres: ['west', 'fantasy'] },
  { name: 'Wissen', icon: LibraryIcon, genres: ['fantasy', 'noir'] },
  { name: 'Rettung', icon: LifeBuoy, genres: ['noir', 'space'] },
  { name: 'Idee', icon: LightbulbIcon, genres: ['scifi', 'fantasy'] },
  { name: 'Reise', icon: Luggage, genres: ['noir', 'space'] },
  { name: 'Brief', icon: Mail, genres: ['noir', 'fantasy'] },
  { name: 'Standort', icon: MapPin, genres: ['noir', 'scifi'] },
  { name: 'Medaille', icon: Medal, genres: ['fantasy', 'west'] },
  { name: 'Durchsage', icon: Megaphone, genres: ['noir', 'scifi'] },
  { name: 'Gespräch', icon: Mic, genres: ['noir', 'scifi'] },
  { name: 'Mikroskop', icon: Microscope, genres: ['scifi', 'horror'] },
  { name: 'Bildschirm', icon: Monitor, genres: ['scifi', 'space'] },
  { name: 'Maus', icon: Mouse, genres: ['scifi', 'noir'] },
  { name: 'Melodie', icon: Music, genres: ['noir', 'fantasy'] },
  { name: 'Navigation', icon: Navigation, genres: ['space', 'scifi'] },
  { name: 'Netzwerk', icon: Network, genres: ['scifi', 'space'] },
  { name: 'Zeitung', icon: Newspaper, genres: ['noir', 'scifi'] },
  { name: 'Nuss', icon: Nut, genres: ['fantasy', 'west'] },
  { name: 'Weltraum', icon: Orbit, genres: ['space', 'scifi'] },
  { name: 'Paket', icon: Package, genres: ['noir', 'scifi'] },
  { name: 'Kunst', icon: Paintbrush, genres: ['noir', 'fantasy'] },
  { name: 'Urlaub', icon: Palmtree, genres: ['noir', 'fantasy'] },
  { name: 'Büro', icon: Paperclip, genres: ['noir', 'scifi'] },
  { name: 'Feier', icon: PartyPopper, genres: ['noir', 'horror'] },
  { name: 'Pfote', icon: PawPrint, genres: ['fantasy', 'west'] },
  { name: 'Design', icon: PenTool, genres: ['scifi', 'noir'] },
  { name: 'Stift', icon: PencilIcon, genres: ['noir', 'fantasy'] },
  { name: 'Anruf', icon: Phone, genres: ['noir', 'scifi'] },
  { name: 'Sparen', icon: PiggyBank, genres: ['noir', 'west'] },
  { name: 'Medizin', icon: Pill, genres: ['scifi', 'horror'] },
  { name: 'Flugzeug', icon: Plane, genres: ['space', 'noir'] },
  { name: 'Strom', icon: Plug, genres: ['scifi', 'space'] },
  { name: 'Tasche', icon: Pocket, genres: ['noir', 'west'] },
  { name: 'Podcast', icon: Power, genres: ['scifi', 'space'] },
  { name: 'Druck', icon: Printer, genres: ['noir', 'scifi'] },
  { name: 'Rätsel', icon: Puzzle, genres: ['noir', 'horror'] },
  { name: 'Strahlung', icon: Radiation, genres: ['scifi', 'horror'] },
  { name: 'Radio', icon: Radio, genres: ['noir', 'scifi'] },
  { name: 'Ratte', icon: Rat, genres: ['horror', 'noir'] },
  { name: 'Recycling', icon: Recycle, genres: ['scifi', 'noir'] },
  { name: 'Weg', icon: Route, genres: ['west', 'space'] },
  { name: 'Maßstab', icon: Ruler, genres: ['scifi', 'noir'] },
  { name: 'Speichern', icon: Save, genres: ['scifi', 'space'] },
  { name: 'Suchen', icon: Search, genres: ['noir', 'scifi'] },
  { name: 'Schicken', icon: Send, genres: ['space', 'scifi'] },
  { name: 'Einstellung', icon: Settings, genres: ['scifi', 'space'] },
  { name: 'Teilen', icon: Share, genres: ['noir', 'scifi'] },
  { name: 'Schiff', icon: Ship, genres: ['noir', 'fantasy'] },
  { name: 'Kleidung', icon: Shirt, genres: ['noir', 'fantasy'] },
  { name: 'Einkauf', icon: ShoppingBag, genres: ['noir', 'scifi'] },
  { name: 'Warenkorb', icon: ShoppingCart, genres: ['scifi', 'noir'] },
  { name: 'Schaufel', icon: Shovel, genres: ['horror', 'west'] },
  { name: 'Alarm', icon: Siren, genres: ['noir', 'horror'] },
  { name: 'Handy', icon: Smartphone, genres: ['scifi', 'noir'] },
  { name: 'Freude', icon: Smile, genres: ['fantasy', 'noir'] },
  { name: 'Lautsprecher', icon: Speaker, genres: ['scifi', 'noir'] },
  { name: 'Pflanze', icon: Sprout, genres: ['fantasy', 'scifi'] },
  { name: 'Arzt', icon: Stethoscope, genres: ['horror', 'noir'] },
  { name: 'Notiz', icon: StickyNote, genres: ['noir', 'scifi'] },
  { name: 'Tisch', icon: Table, genres: ['noir', 'fantasy'] },
  { name: 'Tablet', icon: Tablet, genres: ['scifi', 'space'] },
  { name: 'Preis', icon: Tag, genres: ['noir', 'fantasy'] },
  { name: 'Zielscheibe', icon: Target, genres: ['noir', 'scifi'] },
  { name: 'Zelt', icon: Tent, genres: ['fantasy', 'west'] },
  { name: 'Code', icon: Terminal, genres: ['scifi', 'space'] },
  { name: 'Temperatur', icon: Thermometer, genres: ['scifi', 'horror'] },
  { name: 'Ablehnung', icon: ThumbsDown, genres: ['noir', 'horror'] },
  { name: 'Zustimmung', icon: ThumbsUp, genres: ['noir', 'fantasy'] },
  { name: 'Eintritt', icon: Ticket, genres: ['noir', 'horror'] },
  { name: 'Dauer', icon: Timer, genres: ['scifi', 'noir'] },
  { name: 'Wirbelsturm', icon: Tornado, genres: ['horror', 'west'] },
  { name: 'Zug', icon: Train, genres: ['noir', 'west'] },
  { name: 'Müll', icon: Trash, genres: ['noir', 'scifi'] },
  { name: 'Sieg', icon: Trophy, genres: ['fantasy', 'space'] },
  { name: 'LKW', icon: Truck, genres: ['noir', 'west'] },
  { name: 'Fernseher', icon: Tv, genres: ['noir', 'scifi'] },
  { name: 'Leute', icon: Users, genres: ['noir', 'horror'] },
  { name: 'Video', icon: Video, genres: ['noir', 'scifi'] },
  { name: 'Geldbeutel', icon: Wallet, genres: ['noir', 'west'] },
  { name: 'Wellen', icon: Waves, genres: ['fantasy', 'horror'] },
  { name: 'Kamera', icon: Webcam, genres: ['scifi', 'horror'] },
  { name: 'Internet', icon: Wifi, genres: ['scifi', 'space'] },
  { name: 'Wein', icon: Wine, genres: ['noir', 'fantasy'] }
];

// ==========================================
// 3. LOGIK-HELFER (Ideen-Generator & Icon Wrapper)
// ==========================================

const generateIdeas = (iconName, categoryLabel) => {
  const genericIdeas = {
    'Konflikt': [`Ein Streit um ${iconName}`, `Gefahr durch ${iconName}`, `Verlust von ${iconName}`],
    'Ort': [`In der Nähe von ${iconName}`, `Versteckt unter ${iconName}`, `Eine Stadt namens ${iconName}`],
    'Stimmung': [`Düster wie ${iconName}`, `Hoffnungsvoll durch ${iconName}`, `Kalt wie ${iconName}`],
    'Objekt': [`Ein magisches ${iconName}`, `Das letzte ${iconName} der Welt`, `Ein kaputtes ${iconName}`],
    'Magie': [`Die Kraft von ${iconName}`, `Ein Fluch namens ${iconName}`, `Segen durch ${iconName}`],
    'Charakter': [`Ein Meister des ${iconName}`, `Der Hüter von ${iconName}`, `Jemand, der ${iconName} hasst`],
    'Twist': [`${iconName} war eine Lüge`, `Plötzlich erscheint ${iconName}`, `Alles hängt an ${iconName}`],
    'Soziales': [`Ein Bund für ${iconName}`, `Verrat wegen ${iconName}`, `Geschenk von ${iconName}`],
    'Wissen': [`Das Rätsel um ${iconName}`, `Eine Legende über ${iconName}`, `Die Wahrheit hinter ${iconName}`],
  };
  return genericIdeas[categoryLabel] || [`Nutze ${iconName} als Element`];
};

const SafeIcon = ({ icon, size, className, strokeWidth }) => {
  if (!icon) return null;
  return React.createElement(icon, { size, className, strokeWidth });
};

// ==========================================
// 4. HAUPTKOMPONENTE (APP)
// ==========================================

const App = () => {
  // --- STATE MANAGEMENT ---
  const [dice, setDice] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zoomId, setZoomId] = useState(null);
  const [hoveredDieId, setHoveredDieId] = useState(null);
  const [tooltipDieId, setTooltipDieId] = useState(null);
  const [showIdeas, setShowIdeas] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [isMdPreview, setIsMdPreview] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState(null);
  const [seedInput, setSeedInput] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);

  // --- REFS ---
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const textareaRef = useRef(null);
  const longPressTimer = useRef(null);
  const isLongPressing = useRef(false);

  // --- HILFSMETHODEN (INTERN) ---
  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  /**
   * Initialisiert das Spielbrett
   */
  const initDice = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSeed = params.get('seed');

    // Check if seed exists in URL and load it
    if (urlSeed) {
      setSeedInput(urlSeed); // Set text field directly
      const decoded = decodeState(urlSeed);
      if (decoded && Array.isArray(decoded)) {
        setDice(decoded);
        return;
      }
    }

    const allIndices = Array.from({ length: STORY_ICONS.length }, (_, i) => i);
    const shuffledIndices = shuffleArray(allIndices);
    const shuffledCategories = shuffleArray(CATEGORIES);

    const newDice = shuffledCategories.map((cat, i) => {
      const iconIdx = shuffledIndices[i];
      const iconData = STORY_ICONS[iconIdx];
      return {
        id: i,
        category: cat,
        iconIndex: iconIdx,
        locked: false,
        flipped: false,
        note: '',
        genres: [...(iconData.genres || [])]
      };
    });
    setDice(newDice);
  }, []);

  // --- LIFECYCLE EFFECTS ---
  useEffect(() => {
    initDice();
  }, [initDice]);

  const currentNoteIsPlaceholder = useCallback((note) => {
    return !note || note.trim() === "" || note.trim() === "#";
  }, []);

  const updateNote = useCallback((id, text) => {
    setDice(prev => prev.map(d => d.id === id ? { ...d, note: text } : d));
  }, []);

  // Automatischer Header im Editor
  useEffect(() => {
    if (zoomId !== null) {
      const currentDie = dice.find(d => d.id === zoomId);
      if (currentDie && (!currentDie.note || currentNoteIsPlaceholder(currentDie.note))) {
        if (currentDie.note !== "# ") {
          updateNote(zoomId, "# ");
        }
      }
    }
  }, [zoomId]);

  // Focus-Verwaltung für den Editor
  useLayoutEffect(() => {
    if (zoomId !== null && !isMdPreview) {
      const timer = setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          const length = textarea.value.length;
          textarea.focus();
          textarea.setSelectionRange(length, length);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [zoomId, isMdPreview]);

  // ==========================================
  // 5. INTERAKTIONS-HANDLER (TOUCH & MOUSE)
  // ==========================================

  const handlePointerDown = (id) => {
    isLongPressing.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPressing.current = true;
      setTooltipDieId(id);
    }, 600);
  };

  const handlePointerUp = () => {
    clearTimeout(longPressTimer.current);
    setTooltipDieId(null);
  };

  // --- AUDIO LOGIK ---
  const playRealisticDiceSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playClack = (time, volume, pitch) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, time);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, time + 0.1);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(pitch * 2, time);
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.15);
      };
      const now = audioCtx.currentTime;
      for (let i = 0; i < 6; i++) {
        const startTime = now + (i * 0.08) + (Math.random() * 0.05);
        const volume = 0.2 - (i * 0.02);
        const pitch = 150 + Math.random() * 100;
        playClack(startTime, Math.max(0.01, volume), pitch);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const playDiceSound = useCallback(() => {
    if (customAudioUrl) {
      try {
        const audio = new Audio(customAudioUrl);
        audio.play().catch(() => playRealisticDiceSound());
      } catch (e) {
        console.error("Error: ", e);
        playRealisticDiceSound();
      }
    } else {
      playRealisticDiceSound();
    }
  }, [customAudioUrl]);

  // --- SEED & SHARING HANDLING ---

  const copyShareLink = () => {
    const seed = encodeState(dice);
    const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${seed}`;

    const textArea = document.createElement("textarea");
    textArea.value = shareUrl;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
    document.body.removeChild(textArea);
  };

  const copyCurrentSeed = () => {
    const seed = encodeState(dice);
    const textArea = document.createElement("textarea");
    textArea.value = seed;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      if (document.execCommand('copy')) {
        setSeedInput("SEED KOPIERT!");
        setTimeout(() => setSeedInput(seed), 2000);
      }
    } catch (err) {
      console.error("Error copying seed: ", err);
    }
    document.body.removeChild(textArea);
  };

  const handleLoadFromSeed = () => {
    if (!seedInput) return;
    const decoded = decodeState(seedInput);
    if (decoded && Array.isArray(decoded)) {
      setDice(decoded);
      setIsMenuOpen(false);
    } else {
      setSeedInput("UNGÜLTIGER CODE!");
      setTimeout(() => setSeedInput(""), 1500);
    }
  };

  // --- CORE GAME ACTIONS ---

  /**
   * Würfelt alle nicht gesperrten Kacheln neu
   */
  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();

    setTimeout(() => {
      setDice(prevDice => {
        // Nur verfügbare Kategorien (nicht gesperrte) neu mischen
        const lockedCategoriesLabels = prevDice.filter(d => d.locked).map(d => d.category.label);
        const availableCategories = CATEGORIES.filter(c => !lockedCategoriesLabels.includes(c.label));
        const shuffledAvailableCategories = shuffleArray(availableCategories);

        const lockedIcons = prevDice.filter(d => d.locked).map(d => d.iconIndex);
        const availableIcons = Array.from({ length: STORY_ICONS.length }, (_, i) => i)
          .filter(index => !lockedIcons.includes(index));
        const shuffledAvailableIcons = shuffleArray(availableIcons);

        let iconPointer = 0;
        let catPointer = 0;

        return prevDice.map((die) => {
          if (die.locked) {
            return die; // Kategorie und Icon bleiben erhalten
          }
          const nextCategory = shuffledAvailableCategories[catPointer++];
          const nextIconIdx = shuffledAvailableIcons[iconPointer++];
          const nextIconData = STORY_ICONS[nextIconIdx];
          return {
            ...die,
            iconIndex: nextIconIdx,
            flipped: false,
            note: '',
            category: nextCategory,
            genres: [...(nextIconData.genres || [])]
          };
        });
      });
      setIsRolling(false);
    }, 600);
  };

  const toggleLock = (id) => setDice(prev => prev.map(d => d.id === id ? { ...d, locked: !d.locked, flipped: false } : d));
  const toggleFlip = (id) => setDice(prev => prev.map(d => d.id === id ? { ...d, flipped: !d.flipped } : d));

  const flipAll = () => {
    setDice(prev => {
      const isAnyFrontShowing = prev.some(d => !d.flipped);
      return prev.map(d => ({ ...d, flipped: isAnyFrontShowing }));
    });
  };

  const toggleGenre = (id, genreId) => setDice(prev => prev.map(d => {
    if (d.id !== id) return d;
    const exists = d.genres?.includes(genreId);
    return { ...d, genres: exists ? d.genres.filter(g => g !== genreId) : [...(d.genres || []), genreId] };
  }));

  // --- FORMATIERUNG & DATEI OPS ---

  const applyFormat = (prefix, suffix = prefix) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    const newText = `${before}${prefix}${selection}${suffix}${after}`;
    updateNote(zoomId, newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const saveState = () => {
    const blob = new Blob([JSON.stringify(dice, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `plot-tiles-v4-84-1.json`;
    link.click();
    setIsMenuOpen(false);
  };

  const loadState = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedDice = JSON.parse(e.target.result);
        if (Array.isArray(loadedDice)) setDice(loadedDice);
      } catch (err) {
        console.error("Error: ", err);
      }
    };
    reader.readAsText(file);
    event.target.value = null;
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      setZoomId(null);
    }
  };

  // --- DERIVED STATE ---
  const activeZoomedDie = dice.find(d => d.id === zoomId);
  const activeTooltipDie = dice.find(d => d.id === (hoveredDieId ?? tooltipDieId));

  // ==========================================
  // 6. RENDER LOGIC
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 flex flex-col items-center select-none overflow-x-hidden text-left">

      {/* HEADER SECTION */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-8 mt-6 px-4 text-left">
        <div className="text-left">
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500 uppercase leading-none">Plot Tiles</h1>
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mt-2">v4.84.1 • Pfad der Genres</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyShareLink}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all shadow-lg text-slate-300 active:scale-95"
            title="Link teilen"
          >
            {copyFeedback ? <Check size={24} className="text-green-500 animate-in zoom-in" /> : <Share2 size={24} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Menu size={24} className="text-slate-300" />
          </button>
        </div>
      </header>

      {/* OVERLAY: MAIN MENU (DRAWER) */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[700]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 z-[701] shadow-2xl p-6 flex flex-col gap-8 text-left overflow-y-auto">
            <div className="flex justify-between items-center text-left">
              <h2 className="text-xl font-black uppercase tracking-widest text-indigo-400">Menü</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg"><X size={20} /></button>
            </div>

            {/* SEED AREA */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Seed System</p>
              <button onClick={copyCurrentSeed} className="w-full py-4 bg-slate-800 rounded-2xl text-xs font-black uppercase hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <Copy size={16} /> Seed kopieren
              </button>
              <div className="relative mt-2 flex flex-col gap-2">
                <textarea
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[9px] font-mono focus:outline-none focus:border-indigo-500 min-h-[80px] resize-none"
                  placeholder="Code hier einfügen zum Laden..."
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                />
                <button onClick={handleLoadFromSeed} className="w-full py-3 bg-indigo-600 rounded-xl text-xs font-black uppercase hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
                  <Check size={16} /> Seed Laden
                </button>
              </div>
              <p className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">Du kannst den Seed auch per URL laden: ?seed=CODE</p>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-left">Dateien & Sound</p>
              <button onClick={() => audioInputRef.current.click()} className="flex items-center gap-3 w-full p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all text-left group">
                <Volume2 size={20} className={customAudioUrl ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'} />
                <span className="text-sm font-bold">{customAudioUrl ? 'Eigener Sound aktiv' : 'Audio hochladen'}</span>
              </button>
              <input type="file" ref={audioInputRef} onChange={(e) => { setCustomAudioUrl(URL.createObjectURL(e.target.files[0])); setIsMenuOpen(false); }} accept="audio/*" className="hidden" />

              <button onClick={saveState} className="flex items-center gap-3 w-full p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all text-left group">
                <Download size={20} className="text-slate-400 group-hover:text-white" />
                <span className="text-sm font-bold">Exportieren (.json)</span>
              </button>

              <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-3 w-full p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all text-left group">
                <Upload size={20} className="text-slate-400 group-hover:text-white" />
                <span className="text-sm font-bold">Importieren (.json)</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={loadState} accept=".json" className="hidden" />
            </div>

            <div className="flex flex-col gap-3 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-left">Information</p>
              <button onClick={() => { setShowIntro(true); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all text-left group">
                <Info size={20} className="text-slate-400 group-hover:text-white" />
                <span className="text-sm font-bold">Was ist Plot Tiles?</span>
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800 text-center">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose text-left">v4.84.1 • Plot Tiles Engine</p>
            </div>
          </div>
        </>
      )}

      {/* OVERLAY: INTRO MODAL */}
      {showIntro && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-6 text-left">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowIntro(false)} />
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 slide-in-from-bottom-10 text-left">
            <div className="flex justify-between items-center mb-6 text-left">
              <h3 className="text-2xl font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 text-left">
                <Sparkles className="text-indigo-400" size={24} /> Plot Tiles
              </h3>
              <button onClick={() => setShowIntro(false)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6 text-slate-300 font-medium leading-relaxed text-sm md:text-base text-left">
              <p>
                <strong className="text-white">Plot Tiles</strong> ist deine digitale Schreibwerkstatt.
              </p>
              <p>
                Nutze den <strong className="text-indigo-400">Langen Klick</strong> auf eine Kachel, um Details einzusehen. Auf dem Desktop öffnet ein <strong className="text-indigo-400">Doppelklick</strong> den großen Editor.
              </p>
            </div>

            <button
              onClick={() => setShowIntro(false)}
              className="w-full mt-10 py-5 bg-indigo-600 text-white text-sm font-black rounded-[2rem] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95"
            >
              VERSTANDEN
            </button>
          </div>
        </div>
      )}

      {/* TOOLTIP OVERLAY (LONG PRESS / HOVER) */}
      {activeTooltipDie && !activeTooltipDie.flipped && activeTooltipDie.note && !zoomId && (
        <div className="fixed inset-0 pointer-events-none z-[400] flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-[2.5rem] shadow-2xl transform -translate-y-32 text-left">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5 text-left">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${activeTooltipDie.category.bg}`}>
                <SafeIcon icon={STORY_ICONS[activeTooltipDie.iconIndex].icon} size={20} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">{activeTooltipDie.category.label}</div>
                <div className="text-xs font-bold text-white uppercase">{STORY_ICONS[activeTooltipDie.iconIndex].name}</div>
              </div>
            </div>
            <div className="prose-tooltip text-sm text-white leading-relaxed font-semibold text-left" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeTooltipDie.note) }} />
          </div>
        </div>
      )}

      {/* GAME GRID (MAIN UI) */}
      <div className={`grid grid-cols-3 gap-4 md:gap-6 w-full max-w-md relative text-left ${zoomId !== null ? 'pointer-events-none' : ''}`}>
        {dice.map((die) => (
          <div
            key={die.id}
            className={`perspective-1000 w-full aspect-square group relative transition-all duration-300 
              ${hoveredDieId === die.id ? 'z-[60] scale-150' : 'z-0 scale-100'}`}
            onMouseEnter={() => setHoveredDieId(die.id)}
            onMouseLeave={() => { setHoveredDieId(null); setTooltipDieId(null); isLongPressing.current = false; }}
            onPointerDown={() => handlePointerDown(die.id)}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer shadow-2xl 
                ${die.flipped ? 'rotate-y-180' : ''} 
                ${isRolling && !die.locked ? 'animate-roll' : ''}`}
              onClick={(e) => {
                if (isLongPressing.current) {
                  isLongPressing.current = false;
                  return;
                }
                if (e.target.tagName === 'TEXTAREA' || e.target.closest('.control-btn')) return;
                die.locked ? toggleFlip(die.id) : toggleLock(die.id);
              }}
              onDoubleClick={(e) => {
                if (e.nativeEvent.pointerType === 'touch') return;
                e.stopPropagation();
                if (!die.locked) toggleLock(die.id);
                setZoomId(die.id);
              }}
            >
              {/* FRONT SIDE (ICON & CATEGORY) */}
              <div className={`absolute inset-0 backface-hidden rounded-[2rem] p-4 shadow-xl border-b-8 border-black/20 flex flex-col items-center justify-center ${die.category.bg} ${die.category.shadow} ${die.locked ? 'ring-2 ring-white ring-offset-2' : ''}`}>
                <div className="flex-1 flex items-center justify-center w-full">
                  <SafeIcon icon={STORY_ICONS[die.iconIndex].icon} size="70%" strokeWidth={1.8} className={`text-white drop-shadow-xl ${isRolling && !die.locked ? 'opacity-0' : 'opacity-100'}`} />
                </div>
                <div className="w-full text-center text-[15px] font-black uppercase tracking text-white/90 px-2 truncate mt-1" >{die.category.label}</div>
                {die.locked && (
                  <div
                    onClick={(e) => { e.stopPropagation(); toggleLock(die.id); }}
                    className="absolute -top-1 -right-1 p-2 rounded-full bg-white shadow-xl flex items-center gap-1 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <Lock size={10} className="text-black" />
                    {die.note && die.note !== "# " && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                  </div>
                )}
              </div>

              {/* BACK SIDE (PREVIEW OF NOTES) */}
              <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] p-4 shadow-xl border-b-8 border-black/20 flex flex-col bg-slate-100 text-slate-900 overflow-hidden text-left`}>
                <div className="flex justify-between items-center mb-1 text-left">
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 truncate pr-2 text-left">{die.category.label}</span>
                  <div className="flex gap-1 text-left">
                    <button onClick={(e) => { e.stopPropagation(); setZoomId(die.id); }} className="control-btn p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><Maximize2 size={10} /></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFlip(die.id); }} className="control-btn p-1.5 hover:bg-slate-200 rounded-lg text-green-600 transition-colors"><Check size={10} /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 text-[7px] font-bold leading-tight text-slate-700 scrollbar-hide text-left" dangerouslySetInnerHTML={{ __html: renderMarkdown(die.note) }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ZOOMED EDITOR VIEW (FULLSCREEN MODAL) */}
      {zoomId !== null && activeZoomedDie && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 sm:p-4 md:p-12 overflow-hidden text-left">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl cursor-pointer" onMouseDown={() => setZoomId(null)}></div>

          <div
            className={`relative w-full max-w-5xl h-full max-h-[95vh] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col bg-white text-slate-900 border-b-[10px] border-black/10 overflow-hidden text-left`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex-1 flex flex-col p-6 md:p-10 bg-white min-w-0 relative text-left">

              {/* SUB-OVERLAYS: GENRES & IDEAS SELECTORS */}
              {(showGenres || showIdeas) && (
                <>
                  <div className="absolute inset-0 z-[580]" onClick={() => { setShowGenres(false); setShowIdeas(false); }} />
                  <div className="absolute left-1/2 -translate-x-1/2 top-[180px] w-[90%] md:w-[600px] z-[590] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 text-left">
                    <div className="flex justify-between items-center mb-6 text-left">
                      <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2 text-left">
                        {showGenres ? <><Layout className="text-indigo-600" /> Genres</> : <><Lightbulb className="text-orange-500" /> Ideen</>}
                      </h3>
                      <button onClick={() => { setShowGenres(false); setShowIdeas(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-hide text-left">
                      {showGenres ? (
                        <div className="grid grid-cols-2 gap-3 text-left">
                          {SETTINGS_TAGS.map(tag => (
                            <button
                              key={tag.id}
                              onClick={() => toggleGenre(activeZoomedDie.id, tag.id)}
                              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${activeZoomedDie.genres?.includes(tag.id) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                            >
                              <span className={`text-[10px] font-black uppercase ${tag.color}`}>{tag.label}</span>
                              {activeZoomedDie.genres?.includes(tag.id) && <Check size={14} className="text-indigo-600" />}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3 text-left">
                          {generateIdeas(STORY_ICONS[activeZoomedDie.iconIndex].name, activeZoomedDie.category.label).map((idea, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const currentNote = activeZoomedDie.note || '';
                                const ideaHeading = `# ${idea}`;
                                if (currentNote.trim() === "#" || currentNote.trim() === "# " || currentNote === "" || currentNoteIsPlaceholder(currentNote)) {
                                  updateNote(activeZoomedDie.id, ideaHeading);
                                } else {
                                  updateNote(activeZoomedDie.id, currentNote.trim() + `\n${ideaHeading}`);
                                }
                                setShowIdeas(false);
                              }}
                              className="w-full text-left p-5 rounded-2xl bg-orange-50 border-2 border-orange-100 hover:border-orange-200 flex items-center justify-between group transition-all"
                            >
                              <span className="text-sm font-bold text-orange-900 text-left">{idea}</span>
                              <Sparkles size={16} className="text-orange-300 group-hover:text-orange-500" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* EDITOR HEADER */}
              <div className="flex justify-between items-center mb-6 text-left">
                <div className="flex items-center gap-5 text-left">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl ${activeZoomedDie.category.bg}`}>
                    <SafeIcon icon={STORY_ICONS[activeZoomedDie.iconIndex].icon} size={32} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-left">{activeZoomedDie.category.label}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-left">Plot Tile: {STORY_ICONS[activeZoomedDie.iconIndex].name}</p>
                  </div>
                </div>
                <button onClick={() => setZoomId(null)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all hover:rotate-90"><X size={24} className="text-slate-500" /></button>
              </div>

              {/* EDITOR TABS (GENRES / IDEAS / PREVIEW) */}
              <div className="flex items-center gap-3 mb-6 bg-slate-100/50 p-2 rounded-[2rem] text-left">
                <button onClick={() => { setShowGenres(!showGenres); setShowIdeas(false); }} className={`flex-1 py-3 rounded-[1.4rem] text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${showGenres ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Layout size={14} /> Genres</button>
                <button onClick={() => { setShowIdeas(!showIdeas); setShowGenres(false); }} className={`flex-1 py-3 rounded-[1.4rem] text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${showIdeas ? 'bg-orange-500 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Lightbulb size={14} /> Ideen</button>
                <button onClick={() => setIsMdPreview(!isMdPreview)} className={`flex-1 py-3 rounded-[1.4rem] text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${isMdPreview ? 'bg-slate-800 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Check size={14} /> {isMdPreview ? 'Edit' : 'Vorschau'}</button>
              </div>

              {/* MAIN CONTENT (TEXTAREA OR PREVIEW) */}
              <div className="flex-1 flex flex-col gap-4 overflow-hidden text-left">
                {!isMdPreview && (
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm shrink-0 text-left">
                    <button onClick={() => applyFormat('# ', '')} title="H1" className="p-2.5 text-slate-500 hover:text-indigo-600 bg-white rounded-xl shadow-sm"><Heading1 size={18} /></button>
                    <button onClick={() => applyFormat('## ', '')} title="H2" className="p-2.5 text-slate-500 hover:text-indigo-600 bg-white rounded-xl shadow-sm"><Heading2 size={18} /></button>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <button onClick={() => applyFormat('**', '**')} title="Fett" className="p-2.5 text-slate-500 hover:text-indigo-600 bg-white rounded-xl shadow-sm"><Bold size={18} /></button>
                    <button onClick={() => applyFormat('*', '*')} title="Kursiv" className="p-2.5 text-slate-500 hover:text-indigo-600 bg-white rounded-xl shadow-sm"><Italic size={18} /></button>
                  </div>
                )}
                {isMdPreview ? (
                  <div className="w-full flex-1 bg-slate-50 rounded-[2.5rem] p-8 text-xl overflow-y-auto border-2 border-slate-100 shadow-inner prose-base text-left" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeZoomedDie.note) }} />
                ) : (
                  <textarea
                    ref={textareaRef}
                    className="w-full flex-1 bg-slate-50 rounded-[2.5rem] p-8 text-xl md:text-3xl font-medium focus:outline-none focus:ring-[12px] ring-indigo-50 border-none shadow-inner leading-relaxed overflow-y-auto resize-none scrollbar-hide text-left"
                    placeholder="# Skizziere deinen Plot..."
                    value={activeZoomedDie.note || ''}
                    onChange={(e) => updateNote(activeZoomedDie.id, e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                )}
              </div>
              <div className="mt-6 flex justify-end items-center text-left">
                <button onClick={() => setZoomId(null)} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black uppercase tracking-[0.2em] text-sm shadow-2xl active:scale-95 transition-all">Schließen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CONTROLS (ROLL / UNLOCK / FLIP ALL) */}
      <div className="mt-14 flex flex-col gap-4 w-full max-w-xs px-2 text-left">
        <button onClick={rollDice} disabled={isRolling} className={`w-full py-6 rounded-[1.8rem] font-black text-2xl flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em] shadow-2xl active:scale-95 ${isRolling ? 'bg-slate-800 text-slate-600' : 'bg-white text-black hover:bg-slate-100'}`}>
          <RotateCw size={28} className={isRolling ? 'animate-spin' : ''} />
          {isRolling ? '...' : 'Würfeln'}
        </button>
        <div className="flex justify-center gap-6 text-left">
          <button onClick={() => setDice(d => d.map(x => ({ ...x, locked: false, flipped: false })))} className="text-slate-400 text-xs font-black uppercase hover:text-white transition-colors py-3 tracking-widest text-left">Alle entsperren</button>
          <button onClick={flipAll} className="text-slate-400 text-xs font-black uppercase hover:text-white transition-colors py-3 tracking-widest text-left">Alle drehen</button>
        </div>
      </div>

      {/* GLOBAL FOOTER */}
      <footer className="mt-auto py-12 text-slate-600 text-[10px] font-bold tracking-[0.2em] uppercase text-center opacity-50 text-left">v4.84.1 • Plot Tiles • Pfad der Genres</footer>

      {/* CSS STYLES & ANIMATIONS */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes roll {
          0% { transform: translateY(0) rotateX(0) rotateY(0); }
          25% { transform: translateY(-15px) rotateX(10deg) rotateY(-10deg); }
          75% { transform: translateY(5px) rotateX(-10deg) rotateY(10deg); }
          100% { transform: translateY(0) rotateX(0) rotateY(0); }
        }
        .animate-roll { animation: roll 0.25s infinite ease-in-out; }

        /* Tooltip Contrast Overrides */
        .prose-tooltip h1, .prose-tooltip h2, .prose-tooltip h3 { color: #e0e7ff !important; margin-top: 0.5rem; margin-bottom: 0.25rem; }
        .prose-tooltip strong { color: #ffffff; }
      `}</style>
    </div>
  );
};

export default App;