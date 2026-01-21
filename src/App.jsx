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
  Bold, Italic, Heading1, Heading2, Layout, Sparkles
} from 'lucide-react';

// Hilfsfunktion für einfaches Markdown-Rendering
const renderMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-xs font-bold mt-1 text-indigo-600">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-sm font-bold mt-2 text-indigo-700">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-base font-bold mt-2 text-indigo-800">$1</h1>')
    .replace(/^\* (.*$)/gim, '<li class="ml-2 list-disc">$1</li>')
    .replace(/^\- (.*$)/gim, '<li class="ml-2 list-dash">$1</li>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br />');
};

const CATEGORIES = [
  { label: 'Konflikt', bg: 'bg-red-500', shadow: 'shadow-red-500/40', defaultGenres: ['horror', 'noir'] },
  { label: 'Stimmung', bg: 'bg-blue-600', shadow: 'shadow-blue-600/40', defaultGenres: ['scifi', 'noir'] },
  { label: 'Ort', bg: 'bg-green-600', shadow: 'shadow-green-600/40', defaultGenres: ['fantasy', 'west'] },
  { label: 'Objekt', bg: 'bg-yellow-500', shadow: 'shadow-yellow-500/40', defaultGenres: ['fantasy', 'noir'] },
  { label: 'Magie', bg: 'bg-purple-600', shadow: 'shadow-purple-600/40', defaultGenres: ['fantasy', 'space'] },
  { label: 'Charakter', bg: 'bg-orange-500', shadow: 'shadow-orange-500/40', defaultGenres: ['noir', 'west'] },
  { label: 'Twist', bg: 'bg-teal-500', shadow: 'shadow-teal-500/40', defaultGenres: ['scifi', 'space'] },
  { label: 'Soziales', bg: 'bg-pink-500', shadow: 'shadow-pink-500/40', defaultGenres: ['noir', 'fantasy'] },
  { label: 'Wissen', bg: 'bg-indigo-600', shadow: 'shadow-indigo-600/40', defaultGenres: ['scifi', 'horror'] },
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
  { name: 'Schwert', icon: Sword }, { name: 'Schild', icon: Shield },
  { name: 'Geist', icon: Ghost }, { name: 'Burg', icon: Castle },
  { name: 'Berg', icon: Mountain }, { name: 'Wald', icon: Trees },
  { name: 'Feuer', icon: Flame }, { name: 'Totenkopf', icon: Skull },
  { name: 'Trank', icon: FlaskConical }, { name: 'Schlüssel', icon: Key },
  { name: 'Karte', icon: MapIcon }, { name: 'Kompass', icon: Compass },
  { name: 'Sonne', icon: Sun }, { name: 'Mond', icon: Moon },
  { name: 'Blitz', icon: Zap }, { name: 'Vogel', icon: Bird },
  { name: 'Fisch', icon: Fish }, { name: 'Spur', icon: Footprints },
  { name: 'Wolke', icon: Cloud }, { name: 'Schnee', icon: Snowflake },
  { name: 'Herz', icon: Heart }, { name: 'Gehirn', icon: Brain },
  { name: 'Anker', icon: Anchor }, { name: 'Hammer', icon: Hammer },
  { name: 'Buch', icon: Book }, { name: 'Auge', icon: Eye },
  { name: 'Edelstein', icon: Gem }, { name: 'Geschenk', icon: Gift },
  { name: 'Bombe', icon: Bomb }, { name: 'Käfer', icon: Bug },
  { name: 'Gewitter', icon: CloudLightning }, { name: 'Krone', icon: Crown },
  { name: 'Hund', icon: Dog }, { name: 'Tropfen', icon: Droplets },
  { name: 'Feder', icon: Feather }, { name: 'Hand', icon: Hand },
  { name: 'Blatt', icon: Leaf }, { name: 'Magnet', icon: Magnet },
  { name: 'Rakete', icon: Rocket }, { name: 'Muschel', icon: Shell },
  { name: 'Stern', icon: Star }, { name: 'Schirm', icon: Umbrella },
  { name: 'Uhr', icon: Watch }, { name: 'Wind', icon: Wind },
  { name: 'Axt', icon: Axe }, { name: 'Ambulanz', icon: Ambulance },
  { name: 'Baby', icon: Baby }, { name: 'Banane', icon: Banana },
  { name: 'Bier', icon: Beer }, { name: 'Glocke', icon: Bell },
  { name: 'Gefahr', icon: Biohazard }, { name: 'Knochen', icon: Bone },
  { name: 'Koffer', icon: Briefcase }, { name: 'Foto', icon: Camera },
  { name: 'Auto', icon: Car }, { name: 'Katze', icon: Cat },
  { name: 'Kirsche', icon: Cherry }, { name: 'Film', icon: Clapperboard },
  { name: 'Zeit', icon: Clock }, { name: 'Kaffee', icon: Coffee },
  { name: 'Münzen', icon: Coins }, { name: 'Baustelle', icon: Construction },
  { name: 'Keks', icon: Cookie }, { name: 'Technik', icon: Cpu },
  { name: 'Ziel', icon: Crosshair }, { name: 'DNA', icon: Dna },
  { name: 'Tür', icon: DoorOpen }, { name: 'Trommel', icon: Drum },
  { name: 'Sport', icon: Dumbbell }, { name: 'Ei', icon: Egg },
  { name: 'Fabrik', icon: Factory }, { name: 'Rummel', icon: FerrisWheel },
  { name: 'Dokument', icon: FileText }, { name: 'Flagge', icon: Flag },
  { name: 'Taschenlampe', icon: Flashlight }, { name: 'Blume', icon: Flower },
  { name: 'Essen', icon: ForkKnife }, { name: 'Trauer', icon: Frown },
  { name: 'Tanken', icon: Fuel }, { name: 'Gaming', icon: Gamepad2 },
  { name: 'Urteil', icon: Gavel }, { name: 'Brille', icon: Glasses },
  { name: 'Welt', icon: Globe }, { name: 'Traube', icon: Grape },
  { name: 'Gitarre', icon: Guitar }, { name: 'Pakt', icon: Handshake },
  { name: 'Musik', icon: Headphones }, { name: 'Vergangenheit', icon: History },
  { name: 'Zuhause', icon: Home }, { name: 'Krankenhaus', icon: Hospital },
  { name: 'Hotel', icon: Hotel }, { name: 'Eis', icon: IceCream },
  { name: 'Bild', icon: Image }, { name: 'Unendlich', icon: Infinity },
  { name: 'Spielen', icon: Joystick }, { name: 'Tippen', icon: Keyboard },
  { name: 'Licht', icon: Lamp }, { name: 'Denkmal', icon: Landmark },
  { name: 'Laptop', icon: Laptop }, { name: 'Einfangen', icon: Lasso },
  { name: 'Wissen', icon: LibraryIcon }, { name: 'Rettung', icon: LifeBuoy },
  { name: 'Idee', icon: LightbulbIcon }, { name: 'Reise', icon: Luggage },
  { name: 'Brief', icon: Mail }, { name: 'Standort', icon: MapPin },
  { name: 'Medaille', icon: Medal }, { name: 'Durchsage', icon: Megaphone },
  { name: 'Gespräch', icon: Mic }, { name: 'Mikroskop', icon: Microscope },
  { name: 'Bildschirm', icon: Monitor }, { name: 'Maus', icon: Mouse },
  { name: 'Melodie', icon: Music }, { name: 'Navigation', icon: Navigation },
  { name: 'Netzwerk', icon: Network }, { name: 'Zeitung', icon: Newspaper },
  { name: 'Nuss', icon: Nut }, { name: 'Weltraum', icon: Orbit },
  { name: 'Paket', icon: Package }, { name: 'Kunst', icon: Paintbrush },
  { name: 'Urlaub', icon: Palmtree }, { name: 'Büro', icon: Paperclip },
  { name: 'Feier', icon: PartyPopper }, { name: 'Pfote', icon: PawPrint },
  { name: 'Design', icon: PenTool }, { name: 'Stift', icon: PencilIcon },
  { name: 'Anruf', icon: Phone }, { name: 'Sparen', icon: PiggyBank },
  { name: 'Medizin', icon: Pill }, { name: 'Flugzeug', icon: Plane },
  { name: 'Strom', icon: Plug }, { name: 'Tasche', icon: Pocket },
  { name: 'Podcast', icon: Power }, { name: 'Druck', icon: Printer },
  { name: 'Rätsel', icon: Puzzle }, { name: 'Strahlung', icon: Radiation },
  { name: 'Radio', icon: Radio }, { name: 'Ratte', icon: Rat },
  { name: 'Recycling', icon: Recycle }, { name: 'Weg', icon: Route },
  { name: 'Maßstab', icon: Ruler }, { name: 'Speichern', icon: Save },
  { name: 'Suchen', icon: Search }, { name: 'Schicken', icon: Send },
  { name: 'Einstellung', icon: Settings }, { name: 'Teilen', icon: Share },
  { name: 'Schiff', icon: Ship }, { name: 'Kleidung', icon: Shirt },
  { name: 'Einkauf', icon: ShoppingBag }, { name: 'Warenkorb', icon: ShoppingCart },
  { name: 'Schaufel', icon: Shovel }, { name: 'Alarm', icon: Siren },
  { name: 'Handy', icon: Smartphone }, { name: 'Freude', icon: Smile },
  { name: 'Lautsprecher', icon: Speaker }, { name: 'Pflanze', icon: Sprout },
  { name: 'Arzt', icon: Stethoscope }, { name: 'Notiz', icon: StickyNote },
  { name: 'Tisch', icon: Table }, { name: 'Tablet', icon: Tablet },
  { name: 'Preis', icon: Tag }, { name: 'Zielscheibe', icon: Target },
  { name: 'Zelt', icon: Tent }, { name: 'Code', icon: Terminal },
  { name: 'Temperatur', icon: Thermometer }, { name: 'Ablehnung', icon: ThumbsDown },
  { name: 'Zustimmung', icon: ThumbsUp }, { name: 'Eintritt', icon: Ticket },
  { name: 'Dauer', icon: Timer }, { name: 'Wirbelsturm', icon: Tornado },
  { name: 'Zug', icon: Train }, { name: 'Müll', icon: Trash },
  { name: 'Sieg', icon: Trophy }, { name: 'LKW', icon: Truck },
  { name: 'Fernseher', icon: Tv }, { name: 'Leute', icon: Users },
  { name: 'Video', icon: Video }, { name: 'Geldbeutel', icon: Wallet },
  { name: 'Wellen', icon: Waves }, { name: 'Kamera', icon: Webcam },
  { name: 'Internet', icon: Wifi }, { name: 'Wein', icon: Wine }
];

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

const App = () => {
  const [dice, setDice] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zoomId, setZoomId] = useState(null);
  const [hoveredDieId, setHoveredDieId] = useState(null);
  const [showIdeas, setShowIdeas] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [isMdPreview, setIsMdPreview] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState(null);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const textareaRef = useRef(null);

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const initDice = useCallback(() => {
    const allIndices = Array.from({ length: STORY_ICONS.length }, (_, i) => i);
    const shuffledIndices = shuffleArray(allIndices);
    const shuffledCategories = shuffleArray(CATEGORIES);
    
    const newDice = shuffledCategories.map((cat, i) => ({
      id: i,
      category: cat,
      iconIndex: shuffledIndices[i],
      locked: false,
      flipped: false,
      note: '',
      genres: cat.defaultGenres || []
    }));
    setDice(newDice);
  }, []);

  useEffect(() => {
    initDice();
  }, [initDice]);

  const currentNoteIsPlaceholder = useCallback((note) => {
    return !note || note.trim() === "" || note.trim() === "#";
  }, []);

  const updateNote = useCallback((id, text) => {
    setDice(prev => prev.map(d => d.id === id ? { ...d, note: text } : d));
  }, []);

  // FIX: Separate initialization of placeholder to prevent infinite update depth loop
  useEffect(() => {
    if (zoomId !== null) {
      const currentDie = dice.find(d => d.id === zoomId);
      if (currentDie && (!currentDie.note || currentNoteIsPlaceholder(currentDie.note))) {
        // Only update if it's not already exactly "# "
        if (currentDie.note !== "# ") {
          updateNote(zoomId, "# ");
        }
      }
    }
  }, [zoomId]); // Only fire when zoomId changes, NOT when dice changes

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
    } catch (e) { }
  };

  const playDiceSound = useCallback(() => {
    if (customAudioUrl) {
      try {
        const audio = new Audio(customAudioUrl);
        audio.play().catch(() => playRealisticDiceSound());
      } catch (e) { playRealisticDiceSound(); }
    } else {
      playRealisticDiceSound();
    }
  }, [customAudioUrl]);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();
    
    setTimeout(() => {
      setDice(prevDice => {
        const lockedIndices = prevDice.filter(d => d.locked).map(d => d.iconIndex);
        const availableIndices = Array.from({ length: STORY_ICONS.length }, (_, i) => i)
          .filter(index => !lockedIndices.includes(index));
        const shuffledIcons = shuffleArray(availableIndices);
        const shuffledCategories = shuffleArray(CATEGORIES);
        
        let iconPointer = 0;
        return prevDice.map((die, idx) => {
          const newCategory = shuffledCategories[idx];
          if (die.locked) {
            return { 
              ...die, 
              category: newCategory 
            };
          }
          const nextIcon = shuffledIcons[iconPointer++];
          return { 
            ...die, 
            iconIndex: nextIcon, 
            flipped: false, 
            note: '', 
            category: newCategory,
            genres: newCategory.defaultGenres || []
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
    link.download = `plot-tiles-v4-62-0.json`;
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
      } catch (err) { }
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

  const activeZoomedDie = dice.find(d => d.id === zoomId);
  const activeHoveredDie = dice.find(d => d.id === hoveredDieId);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 flex flex-col items-center select-none overflow-x-hidden">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8 mt-6 px-4">
        <div className="text-left">
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500 uppercase leading-none">Plot Tiles</h1>
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mt-2">v4.62.0 • Sternenwächter</p>
        </div>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Menu size={24} className="text-slate-300" />
        </button>
      </header>

      {/* MODAL: Main Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[700]" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-800 z-[701] shadow-2xl p-6 flex flex-col gap-8 text-left">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest text-indigo-400">Menü</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg"><X size={20}/></button>
            </div>
            
            <div className="flex flex-col gap-3">
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

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-left">Information</p>
              <button onClick={() => { setShowIntro(true); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all text-left group">
                <Info size={20} className="text-slate-400 group-hover:text-white" />
                <span className="text-sm font-bold">Was ist Plot Tiles?</span>
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800 text-center">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose">v4.62.0 • Plot Tiles Engine</p>
            </div>
          </div>
        </>
      )}

      {/* MODAL: Info */}
      {showIntro && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowIntro(false)} />
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 slide-in-from-bottom-10 text-left">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                 <Sparkles className="text-indigo-400" size={24} /> Plot Tiles
               </h3>
               <button onClick={() => setShowIntro(false)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
                 <X size={20} className="text-slate-400" />
               </button>
            </div>
            
            <div className="space-y-6 text-slate-300 font-medium leading-relaxed text-left text-sm md:text-base">
              <p>
                <strong className="text-white">Plot Tiles</strong> ist deine digitale Schreibwerkstatt und eine unerschöpfliche Inspirationsquelle für Autoren, Spielleiter und kreative Köpfe.
              </p>
              
              <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300">Wie es funktioniert</h4>
                <p>
                  Das System kombiniert <span className="text-white underline decoration-indigo-500/50 underline-offset-4">zufällige visuelle Icons</span> mit festen <span className="text-white underline decoration-red-500/50 underline-offset-4">erzählerischen Kategorien</span>.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Check size={16} className="text-indigo-400 shrink-0 mt-1" />
                    <span>Löse Schreibblockaden durch Assoziation.</span>
                  </li>
                  <li className="flex gap-3">
                    <Check size={16} className="text-indigo-400 shrink-0 mt-1" />
                    <span>Entwirf NSC-Hintergründe für RPG-Runden.</span>
                  </li>
                  <li className="flex gap-3">
                    <Check size={16} className="text-indigo-400 shrink-0 mt-1" />
                    <span>Speichere deine Ideen direkt in den Kacheln.</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <button 
              onClick={() => setShowIntro(false)} 
              className="w-full mt-10 py-5 bg-indigo-600 text-white text-sm font-black rounded-[2rem] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-500/40 transition-all active:scale-95"
            >
              VERSTANDEN
            </button>
          </div>
        </div>
      )}

      {/* TOOLTIP */}
      {activeHoveredDie && !activeHoveredDie.flipped && activeHoveredDie.note && !zoomId && (
        <div className="fixed inset-0 pointer-events-none z-[400] flex items-center justify-center p-4">
           <div className="w-full max-w-sm p-6 bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-[2.5rem] shadow-2xl transform -translate-y-32 text-left">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${activeHoveredDie.category.bg}`}>
                  <SafeIcon icon={STORY_ICONS[activeHoveredDie.iconIndex].icon} size={20} />
                </div>
                <div className="text-left">
                   <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{activeHoveredDie.category.label}</div>
                   <div className="text-xs font-bold text-white uppercase">{STORY_ICONS[activeHoveredDie.iconIndex].name}</div>
                </div>
              </div>
              <div className="prose-tooltip text-sm text-slate-200 leading-relaxed font-medium text-left" dangerouslySetInnerHTML={{ __html: renderMarkdown(activeHoveredDie.note) }} />
           </div>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-md relative">
        {dice.map((die) => (
          <div 
            key={die.id} 
            className={`perspective-1000 w-full aspect-square group relative transition-all duration-300 
              ${hoveredDieId === die.id ? 'z-[60] scale-150' : 'z-0 scale-100'}`} 
            onMouseEnter={() => setHoveredDieId(die.id)} 
            onMouseLeave={() => setHoveredDieId(null)}
          >
            <div 
              className={`relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer shadow-2xl 
                ${die.flipped ? 'rotate-y-180' : ''} 
                ${isRolling && !die.locked ? 'animate-roll' : ''}`}
              onClick={(e) => {
                if (e.target.tagName === 'TEXTAREA' || e.target.closest('.control-btn')) return;
                die.locked ? toggleFlip(die.id) : toggleLock(die.id);
              }}
              onDoubleClick={(e) => { 
                e.stopPropagation(); 
                if (!die.locked) toggleLock(die.id); 
                setZoomId(die.id); 
              }}
            >
              <div className={`absolute inset-0 backface-hidden rounded-[2rem] p-4 shadow-xl border-b-8 border-black/20 flex flex-col items-center justify-center ${die.category.bg} ${die.category.shadow} ${die.locked ? 'ring-2 ring-white ring-offset-2' : ''}`}>
                <div className="flex-1 flex items-center justify-center w-full">
                   <SafeIcon icon={STORY_ICONS[die.iconIndex].icon} size="70%" strokeWidth={1.8} className={`text-white drop-shadow-xl ${isRolling && !die.locked ? 'opacity-0' : 'opacity-100'}`} />
                </div>
                <div className="w-full text-center text-[8px] font-black uppercase tracking-[0.15em] text-white/90 px-2 truncate mt-1 text-left">{die.category.label}</div>
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

      {/* ZOOM MODAL */}
      {zoomId !== null && activeZoomedDie && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-2 sm:p-4 md:p-12 overflow-hidden text-left">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setZoomId(null)}></div>
          
          <div className={`relative w-full max-w-5xl h-full max-h-[95vh] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col bg-white text-slate-900 border-b-[10px] border-black/10 overflow-hidden text-left`}>
            
            <div className="flex-1 flex flex-col p-6 md:p-10 bg-white min-w-0 relative text-left">
              
              {(showGenres || showIdeas) && (
                <>
                  <div className="absolute inset-0 z-[580]" onClick={() => { setShowGenres(false); setShowIdeas(false); }} />
                  <div className="absolute left-1/2 -translate-x-1/2 top-[180px] w-[90%] md:w-[600px] z-[590] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 text-left">
                    <div className="flex justify-between items-center mb-6 text-left">
                        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2 text-left">
                          {showGenres ? <><Layout className="text-indigo-600" /> Genres</> : <><Lightbulb className="text-orange-500" /> Ideen</>}
                        </h3>
                        <button onClick={() => { setShowGenres(false); setShowIdeas(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
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
                                  {activeZoomedDie.genres?.includes(tag.id) && <Check size={14} className="text-indigo-600"/>}
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

              <div className="flex items-center gap-3 mb-6 bg-slate-100/50 p-2 rounded-[2rem] text-left">
                <button onClick={() => { setShowGenres(!showGenres); setShowIdeas(false); }} className={`flex-1 py-3 rounded-[1.4rem] text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${showGenres ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Layout size={14}/> Genres</button>
                <button onClick={() => { setShowIdeas(!showIdeas); setShowGenres(false); }} className={`flex-1 py-3 rounded-[1.4rem] text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${showIdeas ? 'bg-orange-500 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Lightbulb size={14}/> Ideen</button>
                <button onClick={() => setIsMdPreview(!isMdPreview)} className={`flex-1 py-3 rounded-[1.4rem] text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${isMdPreview ? 'bg-slate-800 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Check size={14}/> {isMdPreview ? 'Edit' : 'Vorschau'}</button>
              </div>

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

      {/* CONTROLS */}
      <div className="mt-14 flex flex-col gap-4 w-full max-w-xs px-2 text-left">
        <button onClick={rollDice} disabled={isRolling} className={`w-full py-6 rounded-[1.8rem] font-black text-2xl flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em] shadow-2xl active:scale-95 ${isRolling ? 'bg-slate-800 text-slate-600' : 'bg-white text-black hover:bg-slate-100'}`}>
          <RotateCw size={28} className={isRolling ? 'animate-spin' : ''} />
          {isRolling ? '...' : 'Würfeln'}
        </button>
        <div className="flex justify-center gap-6 text-left">
          <button onClick={() => setDice(d => d.map(x => ({...x, locked: false, flipped: false})))} className="text-slate-400 text-xs font-black uppercase hover:text-white transition-colors py-3 tracking-widest text-left">Alle entsperren</button>
          <button onClick={flipAll} className="text-slate-400 text-xs font-black uppercase hover:text-white transition-colors py-3 tracking-widest text-left">Alle drehen</button>
        </div>
      </div>
      
      <footer className="mt-auto py-12 text-slate-600 text-[10px] font-bold tracking-[0.2em] uppercase text-center opacity-50 text-left">v4.62.0 • Plot Tiles • Sternenwächter</footer>
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
      `}</style>
    </div>
  );
};

export default App;