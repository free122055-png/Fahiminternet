import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Search, 
  Menu, 
  Star, 
  BookOpen, 
  Bookmark, 
  Music, 
  Calendar, 
  ListMusic, 
  Home, 
  Radio, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Heart, 
  Share2, 
  Download, 
  Check, 
  X, 
  ArrowLeft,
  Headphones,
  Sparkles,
  Info,
  Layers,
  Clock,
  Shuffle,
  MoreVertical,
  Edit3,
  Plus,
  GripVertical,
  SkipBack,
  SkipForward,
  FolderPlus,
  CheckCircle2,
  Trash2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { 
  ALL_SURAHS, 
  ALL_QARIS, 
  getSurahAudioUrl, 
  getFallbackAudioUrl, 
  type Surah, 
  type Qari 
} from '../data/surahData';

export type { Surah, Qari };

interface PlaylistItem {
  id: string;
  surahNumber: number;
  surahName: string;
  qariName: string;
  duration: string;
  durationSec: number;
  serverUrl?: string;
}

interface Playlist {
  id: string;
  title: string;
  itemCount: number;
  totalTime: string;
  createdDate: string;
  description: string;
  coverImage: string;
  tracks: PlaylistItem[];
}

// 114 Complete Surahs and Verified Qaris
const SURAH_LIST: Surah[] = ALL_SURAHS;
const QARI_LIST: Qari[] = ALL_QARIS;

// Initial Playlists matching exact screenshot
const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'fav_tilawat',
    title: 'প্রিয় তিলাওয়াত',
    itemCount: 10,
    totalTime: '২ ঘণ্টা ১৫ মিনিট',
    createdDate: '১২ মে, ২০২৪',
    description: 'আমার সবচেয়ে প্রিয় কিছু তিলাওয়াত এক জায়গায় সংগৃহীত।',
    coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400&auto=format&fit=crop&q=80',
    tracks: [
      { id: 't1', surahNumber: 1, surahName: 'আল-ফাতিহা', qariName: 'শায়খ সাউদ আল-জুমাহ', duration: '05:27', durationSec: 327 },
      { id: 't2', surahNumber: 2, surahName: 'আল-বাকারা', qariName: 'শায়খ আব্দুর রহমান আস-সুদাইস', duration: '1:02:15', durationSec: 3735 },
      { id: 't3', surahNumber: 3, surahName: 'আলে ইমরান', qariName: 'শায়খ মিশার রশিদ', duration: '33:12', durationSec: 1992 },
      { id: 't4', surahNumber: 36, surahName: 'সূরা ইয়াসিন', qariName: 'শায়খ সাউদ আল-জুমাহ', duration: '22:18', durationSec: 1338 },
      { id: 't5', surahNumber: 55, surahName: 'সূরা আর-রহমান', qariName: 'শায়খ আব্দুল বাসিত', duration: '15:39', durationSec: 939 },
      { id: 't6', surahNumber: 67, surahName: 'সূরা আল-মুলক', qariName: 'শায়খ মাহের আল-মুয়াইকলি', duration: '16:42', durationSec: 1002 },
      { id: 't7', surahNumber: 18, surahName: 'সূরা আল-কাহফ', qariName: 'শায়খ সাউদ আল-জুমাহ', duration: '34:01', durationSec: 2041 }
    ]
  },
  {
    id: 'night_tilawat',
    title: 'রাতের তিলাওয়াত',
    itemCount: 14,
    totalTime: '৩ ঘণ্টা ২০ মিনিট',
    createdDate: '১৮ জুন, ২০২৪',
    description: 'ঘুমানোর পূর্বে প্রশান্তিময় ও ভাবগাম্ভীর্যপূর্ণ সূরাসমূহের তিলাওয়াত।',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
    tracks: [
      { id: 'nt1', surahNumber: 67, surahName: 'সূরা আল-মুলক', qariName: 'শায়খ মিশার রশিদ', duration: '12:45', durationSec: 765 },
      { id: 'nt2', surahNumber: 32, surahName: 'সূরা আস-সাজদাহ', qariName: 'শায়খ সাউদ আল-জুমাহ', duration: '18:10', durationSec: 1090 },
      { id: 'nt3', surahNumber: 56, surahName: 'আল-ওয়াক্বিয়া', qariName: 'শায়খ মাহের আল-মুয়াইকলি', duration: '20:30', durationSec: 1230 },
      { id: 'nt4', surahNumber: 112, surahName: 'আল-ইখলাস', qariName: 'শায়খ আব্দুল বাসিত', duration: '03:15', durationSec: 195 }
    ]
  },
  {
    id: 'morning_tilawat',
    title: 'সকালের তিলাওয়াত',
    itemCount: 12,
    totalTime: '১ ঘণ্টা ৪০ মিনিট',
    createdDate: '০৫ জুলাই, ২০২৪',
    description: 'ভোরের পবিত্র শুরুতে বরকতময় আয়াত ও সূরাসমূহের তিলাওয়াত।',
    coverImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&auto=format&fit=crop&q=80',
    tracks: [
      { id: 'mt1', surahNumber: 36, surahName: 'সূরা ইয়াসিন', qariName: 'শায়খ আব্দুর রহমান আস-সুদাইস', duration: '21:10', durationSec: 1270 },
      { id: 'mt2', surahNumber: 55, surahName: 'সূরা আর-রহমান', qariName: 'শায়খ মিশার রশিদ', duration: '14:20', durationSec: 860 },
      { id: 'mt3', surahNumber: 1, surahName: 'আল-ফাতিহা', qariName: 'শায়খ সাউদ আল-জুমাহ', duration: '04:50', durationSec: 290 }
    ]
  },
  {
    id: 'ramadan_special',
    title: 'রমজান স্পেশাল',
    itemCount: 25,
    totalTime: '৫ ঘণ্টা ৩০ মিনিট',
    createdDate: '১০ মার্চ, ২০২৪',
    description: 'মাহে রমজানের খতমে কুরআন ও তারাবীহর নির্বাচিত তিলাওয়াত সমূহ।',
    coverImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&auto=format&fit=crop&q=80',
    tracks: [
      { id: 'rt1', surahNumber: 2, surahName: 'আল-বাকারা (শেষ অংশ)', qariName: 'শায়খ আব্দুর রহমান আস-সুদাইস', duration: '45:10', durationSec: 2710 },
      { id: 'rt2', surahNumber: 18, surahName: 'সূরা আল-কাহফ', qariName: 'শায়খ মাহের আল-মুয়াইকলি', duration: '32:15', durationSec: 1935 }
    ]
  }
];

interface TilawatLibraryProps {
  onBack?: () => void;
}

export const TilawatLibrary: React.FC<TilawatLibraryProps> = ({ onBack }) => {
  // Navigation tabs: 'home' | 'tilawat' | 'playlist' | 'bookmark' | 'settings'
  const [activeTab, setActiveTab] = useState<'home' | 'tilawat' | 'playlist' | 'bookmark' | 'settings'>('home');
  
  // Playlists State
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  
  // Audio Engine State
  const [selectedQari, setSelectedQari] = useState<Qari>(QARI_LIST[0]);
  const [selectedSurah, setSelectedSurah] = useState<Surah>(SURAH_LIST[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(35);
  const [duration, setDuration] = useState<number>(327);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // UI States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showFullPlayer, setShowFullPlayer] = useState<boolean>(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState<boolean>(false);
  const [showAddTrackModal, setShowAddTrackModal] = useState<boolean>(false);
  const [showQariModal, setShowQariModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<'full' | 'juz' | 'surah' | 'recent' | null>(null);
  const [viewCategoryMode, setViewCategoryMode] = useState<'all' | 'juz' | 'surah' | 'recent'>('all');
  const [selectedJuz, setSelectedJuz] = useState<number>(1);
  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 36, 55, 67]);
  const [bookmarks, setBookmarks] = useState<number[]>([1, 18, 36]);
  const [heroSlide, setHeroSlide] = useState<number>(0);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);

  // New Playlist Form State
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Audio HTML5 ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackAttemptRef = useRef<number>(0);

  // Sync Volume and Playback Speed to HTML5 Audio Element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Format Surah Audio URL
  const getAudioUrl = (qari: Qari, surahNumber: number) => {
    return getSurahAudioUrl(qari, surahNumber);
  };

  // Direct and robust playback trigger
  const startAudioPlayback = (audioSrc?: string) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    if (audioSrc) {
      fallbackAttemptRef.current = 0;
      setIsAudioLoading(true);
      audio.pause();
      audio.src = audioSrc;
      audio.playbackRate = playbackSpeed;
      audio.volume = isMuted ? 0 : volume;
      audio.currentTime = 0;
      audio.load();
    }

    setIsAudioLoading(true);
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsAudioLoading(false);
          setIsPlaying(true);
        })
        .catch((err) => {
          setIsAudioLoading(false);
          if (err.name !== 'AbortError') {
            console.warn('Audio playback notice:', err);
          }
        });
    }
  };

  // Automatic Audio Error Recovery with Multi-CDN Fallback
  const handleAudioError = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    if (fallbackAttemptRef.current === 0) {
      fallbackAttemptRef.current = 1;
      const fallbackUrl = getFallbackAudioUrl(selectedQari, selectedSurah.number);
      console.log('Audio primary failed, switching to backup server:', fallbackUrl);
      audio.src = fallbackUrl;
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(e => console.warn('Fallback play notice:', e));
    } else if (fallbackAttemptRef.current === 1) {
      fallbackAttemptRef.current = 2;
      const padNum = String(selectedSurah.number).padStart(3, '0');
      const backupUrl = `https://server8.mp3quran.net/afs/${padNum}.mp3`;
      console.log('Audio fallback 1 failed, switching to universal server:', backupUrl);
      audio.src = backupUrl;
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(e => console.warn('Universal play notice:', e));
    }
  };

  // Play a specific Surah
  const playSurah = (surah: Surah, qari?: Qari) => {
    const targetQari = qari || selectedQari;
    fallbackAttemptRef.current = 0;
    setSelectedSurah(surah);
    if (qari) setSelectedQari(qari);
    
    const targetSrc = getAudioUrl(targetQari, surah.number);
    startAudioPlayback(targetSrc);
  };

  // Play a track from a playlist
  const playPlaylistTrack = (playlist: Playlist, trackIndex: number) => {
    setSelectedPlaylist(playlist);
    setCurrentTrackIndex(trackIndex);
    const track = playlist.tracks[trackIndex];
    if (!track) return;

    // Find or fallback surah from ALL_SURAHS
    const foundSurah = ALL_SURAHS.find(s => s.number === track.surahNumber) || ALL_SURAHS[0];

    // Find or fallback qari
    const foundQari = ALL_QARIS.find(q => q.name.includes(track.qariName) || track.qariName.includes(q.name)) || selectedQari;

    fallbackAttemptRef.current = 0;
    setSelectedSurah(foundSurah);
    setSelectedQari(foundQari);

    const targetSrc = getAudioUrl(foundQari, track.surahNumber);
    startAudioPlayback(targetSrc);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const currentSrc = getAudioUrl(selectedQari, selectedSurah.number);
      if (!audio.src || audio.src === '' || audio.src === window.location.href) {
        startAudioPlayback(currentSrc);
      } else {
        startAudioPlayback();
      }
    }
  };

  const handleNext = () => {
    if (selectedPlaylist && selectedPlaylist.tracks.length > 0) {
      let nextIndex = currentTrackIndex + 1;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * selectedPlaylist.tracks.length);
      } else if (nextIndex >= selectedPlaylist.tracks.length) {
        nextIndex = 0;
      }
      playPlaylistTrack(selectedPlaylist, nextIndex);
    } else {
      const currentIndex = SURAH_LIST.findIndex(s => s.number === selectedSurah.number);
      const nextIndex = (currentIndex + 1) % SURAH_LIST.length;
      playSurah(SURAH_LIST[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (selectedPlaylist && selectedPlaylist.tracks.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + selectedPlaylist.tracks.length) % selectedPlaylist.tracks.length;
      playPlaylistTrack(selectedPlaylist, prevIndex);
    } else {
      const currentIndex = SURAH_LIST.findIndex(s => s.number === selectedSurah.number);
      const prevIndex = (currentIndex - 1 + SURAH_LIST.length) % SURAH_LIST.length;
      playSurah(SURAH_LIST[prevIndex]);
    }
  };

  const handleShufflePlay = (playlist: Playlist) => {
    setIsShuffle(true);
    const randomIndex = Math.floor(Math.random() * playlist.tracks.length);
    playPlaylistTrack(playlist, randomIndex);
  };

  const toggleFavorite = (surahNumber: number) => {
    if (favorites.includes(surahNumber)) {
      setFavorites(favorites.filter(id => id !== surahNumber));
    } else {
      setFavorites([...favorites, surahNumber]);
    }
  };

  const toggleBookmark = (surahNumber: number) => {
    if (bookmarks.includes(surahNumber)) {
      setBookmarks(bookmarks.filter(id => id !== surahNumber));
    } else {
      setBookmarks([...bookmarks, surahNumber]);
    }
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    const newPl: Playlist = {
      id: 'pl_' + Date.now(),
      title: newPlaylistTitle.trim(),
      itemCount: 1,
      totalTime: '০৫ মিনিট',
      createdDate: 'আজ, ২০২৪',
      description: newPlaylistDesc.trim() || 'আমার কাস্টম প্লেলিস্ট।',
      coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400&auto=format&fit=crop&q=80',
      tracks: [
        { id: 't_' + Date.now(), surahNumber: 1, surahName: 'আল-ফাতিহা', qariName: selectedQari.name, duration: '05:27', durationSec: 327 }
      ]
    };

    setPlaylists([newPl, ...playlists]);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
    setShowCreatePlaylistModal(false);
    setSelectedPlaylist(newPl);
  };

  const handleAddTrackToPlaylist = (surah: Surah) => {
    if (!selectedPlaylist) return;
    const newTrack: PlaylistItem = {
      id: 'trk_' + Date.now(),
      surahNumber: surah.number,
      surahName: surah.name,
      qariName: selectedQari.name,
      duration: '08:15',
      durationSec: 495
    };

    const updatedPl: Playlist = {
      ...selectedPlaylist,
      itemCount: selectedPlaylist.itemCount + 1,
      tracks: [...selectedPlaylist.tracks, newTrack]
    };

    setSelectedPlaylist(updatedPl);
    setPlaylists(playlists.map(p => p.id === updatedPl.id ? updatedPl : p));
    setShowAddTrackModal(false);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filtered lists
  const filteredSurahs = SURAH_LIST.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.bengaliMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.number).includes(searchQuery)
  );

  return (
    <div id="tilawat-library-root" className="relative w-full min-h-screen bg-[#070b14] text-slate-100 font-sans select-none overflow-x-hidden pb-32">
      {/* Hidden Audio Engine */}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setIsAudioLoading(false);
        }}
        onPlaying={() => {
          setIsPlaying(true);
          setIsAudioLoading(false);
        }}
        onWaiting={() => setIsAudioLoading(true)}
        onCanPlay={() => setIsAudioLoading(false)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => {
          if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        onEnded={handleNext}
        onError={handleAudioError}
        loop={isLooping}
      />

      {/* =========================================================================
          VIEW MODE 1: PLAYLIST DETAIL VIEW (WHEN A PLAYLIST IS SELECTED)
          (EXACT MATCH TO RIGHT SCREEN OF USER SCREENSHOT)
         ========================================================================= */}
      {selectedPlaylist ? (
        <div className="w-full">
          {/* Top Bar for Playlist Details */}
          <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-900/60">
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors border border-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>

            <h1 className="text-lg font-black text-white tracking-wide text-center truncate max-w-[200px]">
              {selectedPlaylist.title}
            </h1>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowCreatePlaylistModal(true)}
                className="w-9 h-9 rounded-full bg-slate-900/80 text-slate-300 flex items-center justify-center border border-slate-800 hover:text-white"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-slate-900/80 text-slate-300 flex items-center justify-center border border-slate-800 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Playlist Detail Header Card */}
          <div className="p-4 space-y-6">
            <div className="flex items-start gap-4">
              {/* Cover Image */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 relative">
                <img
                  src={selectedPlaylist.coverImage}
                  alt={selectedPlaylist.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Playlist Info */}
              <div className="flex-1 space-y-1.5">
                <h2 className="text-lg font-black text-white leading-tight">
                  {selectedPlaylist.title}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedPlaylist.tracks.length} টি তিলাওয়াত
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  মোট সময়: {selectedPlaylist.totalTime}
                </p>
                <p className="text-[11px] text-slate-500">
                  তৈরি: {selectedPlaylist.createdDate}
                </p>
                <p className="text-xs text-slate-300 pt-1 line-clamp-2 leading-relaxed">
                  {selectedPlaylist.description}
                </p>

                {/* Action Buttons: Shuffle Play, Heart, Share */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleShufflePlay(selectedPlaylist)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-lg shadow-emerald-950/60 active:scale-95 transition-all cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>সাফল প্লে</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(999)}
                    className="w-8 h-8 rounded-full bg-[#0e1626] border border-slate-800 text-slate-300 hover:text-rose-400 flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  <button className="w-8 h-8 rounded-full bg-[#0e1626] border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Track List Items (Exact match to right screen) */}
            <div className="space-y-1 divide-y divide-slate-900/60">
              {selectedPlaylist.tracks.map((track, idx) => {
                const isCurrentPlaying = selectedSurah.number === track.surahNumber && isPlaying;
                return (
                  <motion.div
                    key={track.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => playPlaylistTrack(selectedPlaylist, idx)}
                    className={`py-3 px-2 flex items-center justify-between gap-3 cursor-pointer rounded-xl transition-colors ${
                      isCurrentPlaying ? 'bg-emerald-950/20 text-emerald-400' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* Reorder Grip Handle */}
                      <button className="text-slate-600 hover:text-slate-400 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </button>

                      {/* Number or Equalizer Waves */}
                      <div className="w-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        {isCurrentPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-0.5 bg-emerald-400 animate-pulse h-full rounded-full" />
                            <span className="w-0.5 bg-emerald-400 animate-pulse h-2 rounded-full" />
                            <span className="w-0.5 bg-emerald-400 animate-pulse h-3.5 rounded-full" />
                          </div>
                        ) : (
                          <span className={`${idx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                            {idx + 1}.
                          </span>
                        )}
                      </div>

                      {/* Surah Title & Qari Name */}
                      <div className="overflow-hidden">
                        <h4 className={`text-sm font-bold truncate ${isCurrentPlaying ? 'text-emerald-400' : 'text-white'}`}>
                          {track.surahName}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {track.qariName}
                        </p>
                      </div>
                    </div>

                    {/* Duration & More Action */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-xs text-slate-400 font-medium">
                        {track.duration}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-slate-500 hover:text-white p-1"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom "+ আরও তিলাওয়াত যোগ করুন" Button */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setShowAddTrackModal(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 py-2 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>আরও তিলাওয়াত যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW MODE 2: MAIN PLAYLIST TAB OR TILAWAT HOME VIEW
            (EXACT MATCH TO LEFT SCREEN OF USER SCREENSHOT)
           ========================================================================= */
        <div>
          {/* Top App Bar */}
          <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-900/60">
            <div className="flex items-center gap-3">
              {onBack ? (
                <button
                  onClick={onBack}
                  className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors border border-slate-800 cursor-pointer"
                  title="ড্যাশবোর্ডে ফিরে যান"
                >
                  <ArrowLeft className="w-5 h-5 text-emerald-400" />
                </button>
              ) : (
                <button
                  onClick={() => setShowQariModal(true)}
                  className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors border border-slate-800 cursor-pointer"
                >
                  <Menu className="w-5 h-5 text-slate-300" />
                </button>
              )}
            </div>

            <h1 className="text-xl font-black text-white tracking-wide text-center">
              {activeTab === 'playlist' ? 'প্লেলিস্ট' : activeTab === 'tilawat' ? 'তিলাওয়াত' : activeTab === 'bookmark' ? 'বুকমার্ক' : 'তিলাওয়াত'}
            </h1>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border cursor-pointer ${
                  isSearchOpen 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Search Dropdown Input */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-2 bg-[#0c1222] border-b border-slate-800/80"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="প্লেলিস্ট, ক্বারী বা সূরা খুঁজুন..."
                    className="w-full bg-[#131c31] border border-slate-700/80 rounded-2xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: TILAWAT LIBRARY HOME DASHBOARD (EXACT SCREENSHOT MATCH) */}
          {activeTab === 'home' && (
            <main className="px-4 pt-2 space-y-5 pb-20">
              {/* 1. HERO SLIDE BANNER (EXACT AS SCREENSHOT) */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061e18] via-[#09261f] to-[#0a1b18] border border-emerald-500/30 p-5 shadow-2xl shadow-emerald-950/40">
                {/* Islamic Geometric Pattern Backdrop */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-950/40 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-2">
                  {/* Left Hero Texts & Action */}
                  <div className="space-y-2.5 max-w-[62%]">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                      <span>আজকের তিলাওয়াত</span>
                    </div>

                    <h2 className="text-lg font-black text-white leading-tight tracking-tight">
                      শায়খ সাউদ আল-জুমাহ
                    </h2>

                    <p className="text-xs text-emerald-200/80 font-medium leading-relaxed">
                      মধুর ও গভীর কণ্ঠে তিলাওয়াত
                    </p>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          const targetQari = QARI_LIST.find(q => q.id === 'saud_al_jumah') || QARI_LIST[0];
                          setSelectedQari(targetQari);
                          playSurah(SURAH_LIST[0], targetQari);
                        }}
                        className="inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-[#0d1f1b] hover:bg-[#0f2823] border border-emerald-500/40 text-white text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                      >
                        <span className="text-white font-bold">এখন শুনুন</span>
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                          <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 ml-0.5" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Right Reciter Portrait with Islamic Arch Frame */}
                  <div className="relative w-28 h-32 flex-shrink-0 flex items-end justify-center">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-t-full border-t border-x border-emerald-500/20 blur-[1px]" />
                    <img
                      src={QARI_LIST[0].image}
                      alt="শায়খ সাউদ আল-জুমাহ"
                      className="relative z-10 w-28 h-32 object-cover rounded-2xl shadow-xl border border-emerald-500/30"
                    />
                  </div>
                </div>
              </section>

              {/* Indicator Carousel Dots Under Hero */}
              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                <span className="w-4 h-1 bg-emerald-400 rounded-full transition-all" />
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
              </div>

              {/* 2. POPULAR QARIS SECTION: জনপ্রিয় ক্বারী */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white tracking-wide">
                    জনপ্রিয় ক্বারী
                  </h3>
                  <button
                    onClick={() => setShowQariModal(true)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    সব দেখুন
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Qari Card 1 (Saud Al-Jumah - Selected State) */}
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const qari = QARI_LIST[0];
                      setSelectedQari(qari);
                      playSurah(selectedSurah, qari);
                    }}
                    className={`relative p-3 rounded-2xl text-center flex flex-col items-center justify-between cursor-pointer transition-all ${
                      selectedQari.id === 'saud_al_jumah'
                        ? 'bg-gradient-to-b from-[#0a231b] to-[#0c1f1d] border-2 border-emerald-500/90 shadow-lg shadow-emerald-950/70'
                        : 'bg-[#0e1626] border border-slate-800'
                    }`}
                  >
                    {/* Green Star Badge on top right */}
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center shadow">
                      <Star className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
                    </div>

                    {/* Avatar with Circular Ring & Glowing Dot */}
                    <div className="relative mt-1 mb-2">
                      <img
                        src={QARI_LIST[0].image}
                        alt={QARI_LIST[0].name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md p-0.5"
                      />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a231b] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white truncate w-full text-center">
                      সাউদ আল-জুমাহ
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-center">
                      সৌদি আরব
                    </p>
                  </motion.div>

                  {/* Qari Card 2 (Mishary Rashid) */}
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const qari = QARI_LIST.find(q => q.id === 'mishary_rashid') || QARI_LIST[2];
                      setSelectedQari(qari);
                      playSurah(selectedSurah, qari);
                    }}
                    className={`p-3 rounded-2xl text-center flex flex-col items-center justify-between cursor-pointer transition-all ${
                      selectedQari.id === 'mishary_rashid'
                        ? 'bg-gradient-to-b from-[#0a231b] to-[#0c1f1d] border-2 border-emerald-500/90 shadow-lg shadow-emerald-950/70'
                        : 'bg-[#0e1626] border border-slate-800 hover:bg-[#131e33]'
                    }`}
                  >
                    <div className="relative mt-1 mb-2">
                      <img
                        src={QARI_LIST[2].image}
                        alt="মিশারী রাশিদ"
                        className="w-14 h-14 rounded-full object-cover border border-slate-700 shadow"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white truncate w-full text-center">
                      মিশারী রাশিদ
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-center">
                      কুয়েত
                    </p>
                  </motion.div>

                  {/* Qari Card 3 (Abdul Rahman) */}
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const qari = QARI_LIST.find(q => q.id === 'abdul_rahman_sudais') || QARI_LIST[1];
                      setSelectedQari(qari);
                      playSurah(selectedSurah, qari);
                    }}
                    className={`p-3 rounded-2xl text-center flex flex-col items-center justify-between cursor-pointer transition-all ${
                      selectedQari.id === 'abdul_rahman_sudais'
                        ? 'bg-gradient-to-b from-[#0a231b] to-[#0c1f1d] border-2 border-emerald-500/90 shadow-lg shadow-emerald-950/70'
                        : 'bg-[#0e1626] border border-slate-800 hover:bg-[#131e33]'
                    }`}
                  >
                    <div className="relative mt-1 mb-2">
                      <img
                        src={QARI_LIST[1].image}
                        alt="আব্দুল রহমান"
                        className="w-14 h-14 rounded-full object-cover border border-slate-700 shadow"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white truncate w-full text-center">
                      আব্দুল রহমান
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-center">
                      মিশর
                    </p>
                  </motion.div>
                </div>
              </section>

              {/* 3. NEWLY ADDED SECTION: নতুন যোগ হয়েছে */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white tracking-wide">
                    নতুন যোগ হয়েছে
                  </h3>
                  <button
                    onClick={() => setShowQariModal(true)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    সব দেখুন
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Card 1: ইউনুস সুলহিয়াস */}
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const qari = QARI_LIST.find(q => q.id === 'younus_sulhayas') || QARI_LIST[5];
                      setSelectedQari(qari);
                      playSurah(selectedSurah, qari);
                    }}
                    className="relative p-3 rounded-2xl bg-[#0e1626] border border-slate-800 hover:bg-[#131e33] text-center flex flex-col items-center justify-between cursor-pointer transition-all"
                  >
                    {/* Top Left 'নতুন' Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                      নতুন
                    </div>

                    <div className="relative mt-3 mb-2">
                      <img
                        src={QARI_LIST[5]?.image || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'}
                        alt="ইউনুস সুলহিয়াস"
                        className="w-14 h-14 rounded-full object-cover border border-slate-700 shadow"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white truncate w-full text-center">
                      ইউনুস সুলহিয়াস
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-center">
                      মরক্কো
                    </p>
                  </motion.div>

                  {/* Card 2: আব্দুল রশীদ আলী সুফি */}
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const qari = QARI_LIST.find(q => q.id === 'abdul_rashid_sufi') || QARI_LIST[6];
                      setSelectedQari(qari);
                      playSurah(selectedSurah, qari);
                    }}
                    className="relative p-3 rounded-2xl bg-[#0e1626] border border-slate-800 hover:bg-[#131e33] text-center flex flex-col items-center justify-between cursor-pointer transition-all"
                  >
                    {/* Top Left 'নতুন' Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                      নতুন
                    </div>

                    {/* Top Right Decorative Emblem */}
                    <div className="absolute top-2 right-2 text-emerald-400 opacity-60">
                      <Sparkles className="w-3 h-3" />
                    </div>

                    <div className="relative mt-3 mb-2">
                      <img
                        src={QARI_LIST[6]?.image || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'}
                        alt="আব্দুল রশীদ আলী সুফি"
                        className="w-14 h-14 rounded-full object-cover border border-slate-700 shadow"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white truncate w-full text-center">
                      আব্দুল রশীদ আলী সুফি
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-center">
                      সুদান
                    </p>
                  </motion.div>

                  {/* Card 3: ফারেস আব্বাদ */}
                  <motion.div
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const qari = QARI_LIST.find(q => q.id === 'fares_abbad') || QARI_LIST[7];
                      setSelectedQari(qari);
                      playSurah(selectedSurah, qari);
                    }}
                    className="relative p-3 rounded-2xl bg-[#0e1626] border border-slate-800 hover:bg-[#131e33] text-center flex flex-col items-center justify-between cursor-pointer transition-all"
                  >
                    {/* Top Right Decorative Emblem */}
                    <div className="absolute top-2 right-2 text-emerald-400 opacity-60">
                      <Sparkles className="w-3 h-3" />
                    </div>

                    <div className="relative mt-3 mb-2">
                      <img
                        src={QARI_LIST[7]?.image || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80'}
                        alt="ফারেস আব্বাদ"
                        className="w-14 h-14 rounded-full object-cover border border-slate-700 shadow"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-white truncate w-full text-center">
                      ফারেস আব্বাদ
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 text-center">
                      কুয়েত
                    </p>
                  </motion.div>
                </div>
              </section>

              {/* 4. LISTEN BY CATEGORY: বিভাগ অনুযায়ী শুনুন */}
              <section className="space-y-3">
                <h3 className="text-base font-black text-white tracking-wide">
                  বিভাগ অনুযায়ী শুনুন
                </h3>

                <div className="grid grid-cols-4 gap-2.5">
                  {/* Category 1: পূর্ণ কুরআন */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCategoryModal('full')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      পূর্ণ কুরআন
                    </span>
                  </motion.div>

                  {/* Category 2: জুজ অনুযায়ী */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCategoryModal('juz')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2 border border-teal-500/20 group-hover:scale-105 transition-transform">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      জুজ অনুযায়ী
                    </span>
                  </motion.div>

                  {/* Category 3: সূরা অনুযায়ী */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCategoryModal('surah')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 border border-purple-500/20 group-hover:scale-105 transition-transform">
                      <Music className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      সূরা অনুযায়ী
                    </span>
                  </motion.div>

                  {/* Category 4: শেষ ৭ দিন */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCategoryModal('recent')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 border border-sky-500/20 group-hover:scale-105 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      শেষ ৭ দিন
                    </span>
                  </motion.div>
                </div>
              </section>

              {/* 5. SURAH LIST SECTION */}
              <section className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white tracking-wide">
                    সূরা তালিকা
                  </h3>
                  <button
                    onClick={() => {
                      setActiveTab('tilawat');
                    }}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    সকল ১১৪ সূরা <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {filteredSurahs.slice(0, 6).map((surah) => {
                    const isCurrent = selectedSurah.number === surah.number && isPlaying;
                    return (
                      <div
                        key={surah.number}
                        onClick={() => playSurah(surah)}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md'
                            : 'bg-[#0e1626] border-slate-800/80 hover:bg-[#131e33]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isCurrent ? 'bg-emerald-500 text-black font-black' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {surah.number}
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                              {surah.name}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {surah.bengaliMeaning} • {surah.totalAyat} আয়াত • {surah.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-emerald-400 text-sm">
                            {surah.arabicName}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSurah(surah);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isCurrent ? 'bg-emerald-500 text-black' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                            }`}
                          >
                            {isCurrent ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </main>
          )}

          {/* TAB 3: PLAYLIST VIEW (EXACT MATCH TO LEFT SCREEN) */}
          {activeTab === 'playlist' && (
            <main className="px-4 pt-3 space-y-6">

              {/* ----------------- 1. PLAYLIST HERO CARD (EXACT MATCH) ----------------- */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c241e] via-[#091a18] to-[#040e0c] border border-emerald-500/30 p-5 shadow-2xl shadow-emerald-950/40">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-3 max-w-[62%]">
                    {/* Music note icon with equalizing bars */}
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <ListMusic className="w-5 h-5" />
                    </div>

                    <h2 className="text-base font-black text-white leading-snug">
                      আপনার প্রিয় তিলাওয়াতগুলো এক জায়গায় গুছিয়ে শুনুন
                    </h2>

                    <button
                      onClick={() => setShowCreatePlaylistModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-lg shadow-emerald-950/60 active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>নতুন প্লেলিস্ট তৈরি করুন</span>
                    </button>
                  </div>

                  {/* Glowing Quran on Rehal Artwork */}
                  <div className="relative w-28 h-32 flex-shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
                    <img
                      src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&auto=format&fit=crop&q=80"
                      alt="পবিত্র কুরআন"
                      className="relative z-10 w-full h-full object-cover rounded-2xl border border-emerald-500/30 shadow-xl"
                    />
                  </div>
                </div>
              </section>

              {/* ----------------- 2. QUICK ACCESS GRID: দ্রুত অ্যাক্সেস ----------------- */}
              <section className="space-y-3">
                <h3 className="text-base font-black text-white tracking-wide">
                  দ্রুত অ্যাক্সেস
                </h3>

                <div className="grid grid-cols-4 gap-2.5">
                  {/* Item 1: প্রিয় তিলাওয়াত */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      const favPl = playlists.find(p => p.id === 'fav_tilawat') || playlists[0];
                      setSelectedPlaylist(favPl);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      প্রিয় তিলাওয়াত
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      ২৪ টি
                    </span>
                  </motion.div>

                  {/* Item 2: ডাউনলোড করা */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      const dlPl = playlists[1] || playlists[0];
                      setSelectedPlaylist(dlPl);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      ডাউনলোড করা
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      ৩৪ টি
                    </span>
                  </motion.div>

                  {/* Item 3: সম্প্রতি শোনা */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      const recPl = playlists[2] || playlists[0];
                      setSelectedPlaylist(recPl);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      সম্প্রতি শোনা
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      ৪৬ টি
                    </span>
                  </motion.div>

                  {/* Item 4: নিজের তৈরি */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCreatePlaylistModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight">
                      নিজের তৈরি
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      ১২ টি
                    </span>
                  </motion.div>
                </div>
              </section>

              {/* ----------------- 3. MY PLAYLISTS SECTION: আমার প্লেলিস্ট ----------------- */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white tracking-wide">
                    আমার প্লেলিস্ট
                  </h3>
                  <button
                    onClick={() => setShowCreatePlaylistModal(true)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    সব দেখুন
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* List of Playlists (Exact Match Cards) */}
                <div className="space-y-3">
                  {playlists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlaylist(playlist)}
                      className="p-3.5 rounded-2xl bg-[#0e1626] hover:bg-[#131e33] border border-slate-800/80 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-md"
                    >
                      {/* Left Thumbnail & Texts */}
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-emerald-500/30">
                          <img
                            src={playlist.coverImage}
                            alt={playlist.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="overflow-hidden">
                          <h4 className="text-sm font-black text-white truncate">
                            {playlist.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            {playlist.itemCount} টি তিলাওয়াত
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            মোট সময়: {playlist.totalTime}
                          </p>
                        </div>
                      </div>

                      {/* Right Play Button & Three Dots */}
                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleShufflePlay(playlist)}
                          className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all shadow-md cursor-pointer border-none"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>

                        <button className="text-slate-500 hover:text-white p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

            </main>
          )}

          {/* TAB 2: TILAWAT FULL SURAH EXPLORER & RECITATIONS (১১৪ সূরা ও ক্বারী তালিকা) */}
          {activeTab === 'tilawat' && (
            <main className="px-4 pt-3 space-y-4 pb-20">
              {/* Selected Qari Active Bar */}
              <div 
                onClick={() => setShowQariModal(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0a231b] to-[#0d1e2e] border border-emerald-500/40 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={selectedQari.image}
                    alt={selectedQari.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400"
                  />
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">বর্তমান ক্বারী</div>
                    <div className="text-sm font-black text-white">{selectedQari.name}</div>
                    <div className="text-xs text-slate-400">{selectedQari.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>ক্বারী পরিবর্তন</span>
                </div>
              </div>

              {/* Filter Tabs for Surahs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setViewCategoryMode('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    viewCategoryMode === 'all'
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'bg-[#0e1626] text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  সকল ১১৪ সূরা
                </button>
                <button
                  onClick={() => setViewCategoryMode('surah')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    viewCategoryMode === 'surah'
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'bg-[#0e1626] text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  মাক্কী সূরা
                </button>
                <button
                  onClick={() => setViewCategoryMode('recent')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    viewCategoryMode === 'recent'
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'bg-[#0e1626] text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  মাদানী সূরা
                </button>
                <button
                  onClick={() => setViewCategoryMode('juz')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    viewCategoryMode === 'juz'
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'bg-[#0e1626] text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  জুজ / পারা (১-৩০)
                </button>
              </div>

              {/* Juz Explorer View or Surah List */}
              {viewCategoryMode === 'juz' ? (
                <div className="space-y-2">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                    <div
                      key={juzNum}
                      onClick={() => {
                        const targetSurah = ALL_SURAHS.find(s => s.juzNumber === juzNum) || ALL_SURAHS[0];
                        playSurah(targetSurah);
                      }}
                      className="p-3.5 rounded-2xl bg-[#0e1626] hover:bg-[#142036] border border-slate-800/80 flex items-center justify-between cursor-pointer transition-all shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/20">
                          {juzNum}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">পারা / জুজ {juzNum}</h4>
                          <p className="text-xs text-slate-400">পবিত্র কুরআনের {juzNum}ম অংশ</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-colors">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(viewCategoryMode === 'surah' 
                    ? filteredSurahs.filter(s => s.type === 'মাক্কী')
                    : viewCategoryMode === 'recent'
                    ? filteredSurahs.filter(s => s.type === 'মাদানী')
                    : filteredSurahs
                  ).map((surah) => {
                    const isCurrent = selectedSurah.number === surah.number && isPlaying;
                    return (
                      <div
                        key={surah.number}
                        onClick={() => playSurah(surah)}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md'
                            : 'bg-[#0e1626] border-slate-800/80 hover:bg-[#131e33]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isCurrent ? 'bg-emerald-500 text-black font-black' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {surah.number}
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                              {surah.name}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {surah.bengaliMeaning} • {surah.totalAyat} আয়াত • {surah.type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="font-serif font-bold text-emerald-400 text-base">
                            {surah.arabicName}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSurah(surah);
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                              isCurrent ? 'bg-emerald-500 text-black' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                            }`}
                          >
                            {isCurrent ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          )}

          {/* TAB 4: BOOKMARKS */}
          {activeTab === 'bookmark' && (
            <main className="px-4 pt-3 space-y-4">
              <h3 className="text-base font-black text-white tracking-wide">
                সংরক্ষিত বুকমার্ক সমূহ
              </h3>
              <div className="space-y-2">
                {SURAH_LIST.filter(s => bookmarks.includes(s.number)).map(surah => (
                  <div
                    key={surah.number}
                    onClick={() => playSurah(surah)}
                    className="p-3.5 rounded-2xl bg-[#0e1626] border border-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <Bookmark className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{surah.name}</h4>
                        <p className="text-xs text-slate-400">{surah.bengaliMeaning}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(surah.number);
                      }}
                      className="text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <main className="px-4 pt-3 space-y-4">
              <h3 className="text-base font-black text-white tracking-wide">
                তিলাওয়াত সেটিংস
              </h3>
              <div className="bg-[#0e1626] rounded-2xl p-4 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">অডিও অটো-প্লে</h4>
                    <p className="text-xs text-slate-400">পরবর্তী সূরা স্বয়ংক্রিয়ভাবে চালু হবে</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">উচ্চ মানের অডিও (HD)</h4>
                    <p className="text-xs text-slate-400">MP3 192kbps ক্রিস্টাল ক্লিয়ার সাউন্ড</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
                </div>
              </div>
            </main>
          )}
        </div>
      )}

      {/* =========================================================================
          STICKY BOTTOM AUDIO PLAYER BAR (EXACT AS SCREENSHOT)
         ========================================================================= */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 px-3 pb-1">
        <motion.div
          layoutId="tilawat-sticky-player"
          onClick={() => setShowFullPlayer(true)}
          className="w-full max-w-md mx-auto bg-[#101827]/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-2.5 shadow-2xl shadow-black flex items-center justify-between cursor-pointer"
        >
          {/* Reciter Avatar & Surah Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-200">
              <img
                src={selectedQari.image}
                alt={selectedQari.name}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate leading-tight">
                {selectedSurah.name}
              </h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {selectedQari.name}
              </p>
            </div>
          </div>

          {/* Controls: Prev, Play/Pause (Green circle), Next, Queue */}
          <div className="flex items-center gap-2 pl-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handlePrev}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={isAudioLoading}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95 flex items-center justify-center transition-all shadow-md cursor-pointer border-none"
            >
              {isAudioLoading ? (
                <Loader2 className="w-5 h-5 text-black animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current text-black" />
              ) : (
                <Play className="w-5 h-5 fill-current text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => {
                if (selectedPlaylist) {
                  setShowFullPlayer(true);
                } else {
                  setActiveTab('playlist');
                }
              }}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          BOTTOM 5-TAB APP NAVIGATION BAR (EXACT ICONS & LABELS)
         ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-slate-900/80 px-4 py-2 flex items-center justify-around">
        {/* Tab 1: হোম */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">হোম</span>
        </button>

        {/* Tab 2: তিলাওয়াত (Headphone icon) */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('tilawat');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'tilawat' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px] font-medium">তিলাওয়াত</span>
        </button>

        {/* Tab 3: প্লেলিস্ট (ListMusic Active Tab) */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('playlist');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'playlist' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <ListMusic className="w-5 h-5" />
          <span className="text-[10px] font-bold">প্লেলিস্ট</span>
        </button>

        {/* Tab 4: বুকমার্ক */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('bookmark');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'bookmark' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">বুকমার্ক</span>
        </button>

        {/* Tab 5: সেটিংস */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('settings');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'settings' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">সেটিংস</span>
        </button>
      </nav>

      {/* =========================================================================
          MODAL: CREATE NEW PLAYLIST
         ========================================================================= */}
      <AnimatePresence>
        {showCreatePlaylistModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e1626] rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-emerald-400" />
                  নতুন প্লেলিস্ট তৈরি করুন
                </h3>
                <button
                  onClick={() => setShowCreatePlaylistModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePlaylist} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    প্লেলিস্টের নাম
                  </label>
                  <input
                    type="text"
                    value={newPlaylistTitle}
                    onChange={(e) => setNewPlaylistTitle(e.target.value)}
                    placeholder="যেমন: তাহাজ্জুদের তিলাওয়াত..."
                    required
                    className="w-full bg-[#152037] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    সংক্ষিপ্ত বিবরণ (অপশনাল)
                  </label>
                  <textarea
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    placeholder="প্লেলিস্ট সম্পর্কে কিছু লিখুন..."
                    rows={2}
                    className="w-full bg-[#152037] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreatePlaylistModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950"
                  >
                    তৈরি করুন
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: ADD TRACK TO PLAYLIST
         ========================================================================= */}
      <AnimatePresence>
        {showAddTrackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md max-h-[80vh] bg-[#0e1626] rounded-3xl p-5 border border-emerald-500/30 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  প্লেলিস্টে সূরা যুক্ত করুন
                </h3>
                <button
                  onClick={() => setShowAddTrackModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-3 space-y-2 flex-1">
                {SURAH_LIST.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => handleAddTrackToPlaylist(surah)}
                    className="p-3 rounded-xl bg-[#152037] hover:bg-[#1a2948] border border-slate-700/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{surah.number}. {surah.name}</h4>
                      <p className="text-xs text-slate-400">{surah.bengaliMeaning} • {surah.totalAyat} আয়াত</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      + যোগ করুন
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          FULL-SCREEN AUDIO PLAYER MODAL
         ========================================================================= */}
      <AnimatePresence>
        {showFullPlayer && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#070b14] flex flex-col p-6 overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFullPlayer(false)}
                className="w-10 h-10 rounded-full bg-slate-900 text-slate-300 flex items-center justify-center border border-slate-800 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  এখন চলছে
                </span>
                <h3 className="text-sm font-black text-white">
                  {selectedSurah.name}
                </h3>
              </div>

              <button
                onClick={() => toggleFavorite(selectedSurah.number)}
                className="w-10 h-10 rounded-full bg-slate-900 text-slate-300 flex items-center justify-center border border-slate-800 cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${favorites.includes(selectedSurah.number) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Big Disc / Artwork */}
            <div className="flex-1 flex flex-col items-center justify-center my-4">
              <div className="relative w-64 h-64 rounded-full p-2 bg-gradient-to-tr from-emerald-500/40 via-slate-800 to-emerald-500/20 shadow-2xl shadow-emerald-950/80">
                <div className={`w-full h-full rounded-full overflow-hidden border-4 border-slate-900 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                  <img
                    src={selectedQari.image}
                    alt={selectedQari.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center mt-6 space-y-1">
                <h2 className="text-xl font-black text-white">
                  {selectedSurah.number}. {selectedSurah.name}
                </h2>
                <p className="text-sm text-emerald-400 font-bold">
                  {selectedQari.name}
                </p>
                <p className="text-xs text-slate-400 font-serif">
                  {selectedSurah.arabicName} • {selectedSurah.bengaliMeaning}
                </p>
              </div>
            </div>

            {/* Slider / Time bar */}
            <div className="space-y-2 mb-6">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const newTime = Number(e.target.value);
                  setCurrentTime(newTime);
                  if (audioRef.current) audioRef.current.currentTime = newTime;
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between px-6 mb-8">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 transition-colors ${isShuffle ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 border border-slate-800"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={isAudioLoading}
                className="w-16 h-16 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isAudioLoading ? (
                  <Loader2 className="w-8 h-8 text-black animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 border border-slate-800"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 transition-colors ${isLooping ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: ALL QARIS LIST (জনপ্রিয় ও সকল ক্বারী)
         ========================================================================= */}
      <AnimatePresence>
        {showQariModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md max-h-[85vh] bg-[#0e1626] rounded-3xl p-5 border border-emerald-500/30 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-emerald-400" />
                  সকল ক্বারী নির্বাচন করুন
                </h3>
                <button
                  onClick={() => setShowQariModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
                {QARI_LIST.map((qari) => {
                  const isSelected = selectedQari.id === qari.id;
                  return (
                    <div
                      key={qari.id}
                      onClick={() => {
                        setSelectedQari(qari);
                        setShowQariModal(false);
                        playSurah(selectedSurah, qari);
                      }}
                      className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0a231b] border-2 border-emerald-500/90 shadow-md'
                          : 'bg-[#141e33] hover:bg-[#1a2845] border border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={qari.image}
                          alt={qari.name}
                          className={`w-12 h-12 rounded-full object-cover border-2 ${
                            isSelected ? 'border-emerald-400' : 'border-slate-700'
                          }`}
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {qari.name}
                            {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                          </h4>
                          <p className="text-xs text-slate-400">{qari.country} • {qari.arabicName || 'ক্বারী'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        {isSelected ? 'চলছে' : 'নির্বাচন'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: CATEGORY VIEWER (বিভাগ অনুযায়ী শুনুন)
         ========================================================================= */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md max-h-[85vh] bg-[#0e1626] rounded-3xl p-5 border border-emerald-500/30 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  {showCategoryModal === 'full' && 'পূর্ণ কুরআন (১১৪ সূরা)'}
                  {showCategoryModal === 'juz' && 'জুজ অনুযায়ী তিলাওয়াত (১-৩০)'}
                  {showCategoryModal === 'surah' && 'সূরা অনুযায়ী বিভাগ'}
                  {showCategoryModal === 'recent' && 'শেষ ৭ দিনের তিলাওয়াত'}
                </h3>
                <button
                  onClick={() => setShowCategoryModal(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-3 space-y-2 flex-1 pr-1">
                {showCategoryModal === 'juz' ? (
                  Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                    <div
                      key={juzNum}
                      onClick={() => {
                        const targetSurah = ALL_SURAHS.find(s => s.juzNumber === juzNum) || ALL_SURAHS[0];
                        playSurah(targetSurah);
                        setShowCategoryModal(null);
                      }}
                      className="p-3.5 rounded-2xl bg-[#141e33] hover:bg-[#1a2845] border border-slate-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold text-xs">
                          {juzNum}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">পারা / জুজ {juzNum}</h4>
                          <p className="text-xs text-slate-400">পবিত্র কুরআনের {juzNum}ম অংশ</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  ))
                ) : showCategoryModal === 'recent' ? (
                  SURAH_LIST.slice(0, 7).map((surah, idx) => (
                    <div
                      key={surah.number}
                      onClick={() => {
                        playSurah(surah);
                        setShowCategoryModal(null);
                      }}
                      className="p-3.5 rounded-2xl bg-[#141e33] hover:bg-[#1a2845] border border-slate-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{surah.name}</h4>
                          <p className="text-xs text-slate-400">গত {idx + 1} দিন আগে শোনা হয়েছে</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  ))
                ) : (
                  SURAH_LIST.map((surah) => (
                    <div
                      key={surah.number}
                      onClick={() => {
                        playSurah(surah);
                        setShowCategoryModal(null);
                      }}
                      className="p-3 rounded-2xl bg-[#141e33] hover:bg-[#1a2845] border border-slate-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                          {surah.number}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{surah.name}</h4>
                          <p className="text-xs text-slate-400">{surah.bengaliMeaning} • {surah.totalAyat} আয়াত • {surah.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-emerald-400 text-sm">
                          {surah.arabicName}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
