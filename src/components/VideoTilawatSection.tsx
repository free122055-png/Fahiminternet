import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Search, SlidersHorizontal, Play, Pause, RotateCcw, RotateCw, 
  SkipBack, SkipForward, Heart, Bookmark, Share2, Download, MoreVertical, 
  Maximize2, Minimize2, CheckCircle2, Volume2, VolumeX, Tv, Settings, 
  X, Check, Sparkles, Filter, Eye, Clock, UserCheck, ChevronDown, ChevronUp
} from 'lucide-react';
import { VideoTilawat } from '../types';
import { getMediaUrl } from '../utils/mediaStorage';

// Default initial high-quality direct MP4 Quran video tilawats
export const DEFAULT_VIDEO_TILAWATS: VideoTilawat[] = [
  {
    id: 'vid-1',
    title: 'এত লাখ মানুষের তিলাওয়াত শুনে উজাল লাখো জনতা',
    surahName: 'সূরা আল-মুজাম্মিল ও সূরা ফাতেহা',
    qariName: 'ক্বারী ঈদী শাবান আফিফ',
    qariImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
    duration: '28:15',
    views: '1.4M ভিউ',
    uploadedTime: '২ মাস আগে',
    uploadedAt: '2026-06-15',
    category: 'popular',
    isPopular: true,
    isRecent: false,
    likesCount: 14200,
    description: 'এত লাখ টানের তিলাওয়াত শুনে উজাল লাখো জনতা। আল্লাহর কালাম পবিত্র কুরআনুল কারীমের সুরেলা তিলাওয়াত। ক্বারী ঈদী শাবান আফিফের কণ্ঠে এক অনন্য হৃদয়ছোঁয়া তিলাওয়াত যা যেকারো মনকে শান্ত করবে।'
  },
  {
    id: 'vid-2',
    title: 'সুরা রহমান মন জুড়ানো তিলাওয়াত',
    surahName: 'সূরা আর-রহমান',
    qariName: 'ক্বারী সাইদুল ইসলাম আসাদ',
    qariImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&auto=format&fit=crop&q=80',
    duration: '32:10',
    views: '650K ভিউ',
    uploadedTime: '২ মাস আগে',
    uploadedAt: '2026-06-20',
    category: 'popular',
    isPopular: true,
    isRecent: false,
    likesCount: 8900,
    description: 'সূরা আর-রহমানের অত্যন্ত আবেগঘন ও সুমধুর তিলাওয়াত। ক্বারী সাইদুল ইসলাম আসাদের সুললিত কণ্ঠে আল্লাহর অগণিত নিয়ামতের স্মৃতিচারণ।'
  },
  {
    id: 'vid-3',
    title: 'সুরা ইয়াসিন তিলাওয়াত',
    surahName: 'সূরা ইয়াসিন',
    qariName: 'ক্বারী আবু রায়হান',
    qariImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80',
    duration: '26:45',
    views: '540K ভিউ',
    uploadedTime: '১ মাস আগে',
    uploadedAt: '2026-07-10',
    category: 'recent',
    isPopular: true,
    isRecent: true,
    likesCount: 7300,
    description: 'কুরআনের হৃৎপিণ্ড সূরা ইয়াসিনের পূর্ণাঙ্গ তিলাওয়াত। প্রতিদিন সকালে শুনলে দিনের সকল কাজে বরকত নেমে আসে।'
  },
  {
    id: 'vid-4',
    title: 'অসাধারণ কুরআন তিলাওয়াত',
    surahName: 'সূরা আল-ওয়াকিয়াহ',
    qariName: 'ক্বারী মিজানুর রহমান আজহারী',
    qariImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=80',
    duration: '24:30',
    views: '1.1M ভিউ',
    uploadedTime: '৩ মাস আগে',
    uploadedAt: '2026-05-15',
    category: 'popular',
    isPopular: true,
    isRecent: false,
    likesCount: 15400,
    description: 'মাগফিরাত ও অন্তরের শান্তির জন্য অসাধারণ কুরআন তিলাওয়াত।'
  },
  {
    id: 'vid-5',
    title: 'সুরা আল মুলক',
    surahName: 'সূরা আল-মুলক',
    qariName: 'ক্বারী সাইদুল ইসলাম আসাদ',
    qariImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
    duration: '29:05',
    views: '420K ভিউ',
    uploadedTime: '১ মাস আগে',
    uploadedAt: '2026-07-05',
    category: 'recent',
    isPopular: false,
    isRecent: true,
    likesCount: 5200,
    description: 'কবরের আজাব থেকে মুক্তির উপায় সূরা আল-মুলকের তিলাওয়াত।'
  },
  {
    id: 'vid-6',
    title: 'সুরা আর রহমান',
    surahName: 'সূরা আর-রহমান',
    qariName: 'ক্বারী আবু রায়হান',
    qariImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80',
    duration: '27:18',
    views: '380K ভিউ',
    uploadedTime: '২ সপ্তাহ আগে',
    uploadedAt: '2026-08-01',
    category: 'recent',
    isPopular: false,
    isRecent: true,
    likesCount: 4600,
    description: 'মধুর সুরে সূরা আর রহমানের অনন্য তিলাওয়াত।'
  },
  {
    id: 'vid-7',
    title: 'কষ্টের রাজা শুনতেই কোটি মানুষের পাগল',
    surahName: 'সূরা ইউসুফ',
    qariName: 'ক্বারী ঈদী শাবান আফিফ',
    qariImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&auto=format&fit=crop&q=80',
    duration: '30:47',
    views: '1.2M ভিউ',
    uploadedTime: '২ মাস আগে',
    uploadedAt: '2026-06-18',
    category: 'popular',
    isPopular: true,
    isRecent: false,
    likesCount: 16500,
    description: 'হযরত ইউসুফ (আঃ) এর জীবনী ও সূরা ইউসুফের অপূর্ব আবেগঘন তিলাওয়াত।'
  },
  {
    id: 'vid-8',
    title: 'মন জুড়ানো তিলাওয়াত',
    surahName: 'সূরা কাহফ',
    qariName: 'ক্বারী আবু রায়হান',
    qariImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=80',
    duration: '25:33',
    views: '980K ভিউ',
    uploadedTime: '১ মাস আগে',
    uploadedAt: '2026-07-15',
    category: 'recent',
    isPopular: true,
    isRecent: true,
    likesCount: 11200,
    description: 'জুমার দিনের শ্রেষ্ঠ আমল সূরা কাহফের হৃদয়স্পর্শী তিলাওয়াত।'
  },
  {
    id: 'vid-9',
    title: 'আল্লাহর বাণী শুনুন মন শান্ত হবে',
    surahName: 'সূরা আল-ইনশিরাহ ও আদ-দুহা',
    qariName: 'শায়খ আহমাদুল্লাহ',
    qariImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&auto=format&fit=crop&q=80',
    duration: '31:02',
    views: '750K ভিউ',
    uploadedTime: '৩ মাস আগে',
    uploadedAt: '2026-05-22',
    category: 'popular',
    isPopular: true,
    isRecent: false,
    likesCount: 13800,
    description: 'সকল দুশ্চিন্তা দূর করে মনে গভীর প্রশান্তি এনে দেবে এই পবিত্র তিলাওয়াত।'
  },
  {
    id: 'vid-10',
    title: 'সূরা বাকারা পূর্ণাঙ্গ হৃদয়স্পর্শী তিলাওয়াত (১ ঘণ্টা ২৫ মিনিট)',
    surahName: 'সূরা আল-বাকারা',
    qariName: 'শায়খ মিশারী বিন রশিদ আল-আফাসী',
    qariImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80',
    duration: '1:25:40',
    views: '2.8M ভিউ',
    uploadedTime: '৫ মাস আগে',
    uploadedAt: '2026-03-12',
    category: 'popular',
    isPopular: true,
    isRecent: false,
    likesCount: 28900,
    description: 'ঘরের বরকত ও শয়তানের কুপ্রভাব দূর করতে দীর্ঘ দেড় ঘণ্টার সূরা বাকারার পূর্ণাঙ্গ তিলাওয়াত।'
  }
];

interface VideoTilawatSectionProps {
  onBack: () => void;
  customVideos?: VideoTilawat[];
}

export const VideoTilawatSection: React.FC<VideoTilawatSectionProps> = ({
  onBack,
  customVideos
}) => {
  // Respect admin customVideos array when defined (even if empty or filtered after deletion)
  const allVideos = useMemo(() => {
    if (customVideos !== undefined) {
      return customVideos;
    }
    return DEFAULT_VIDEO_TILAWATS;
  }, [customVideos]);

  const [activeVideo, setActiveVideo] = useState<VideoTilawat>(allVideos[0] || DEFAULT_VIDEO_TILAWATS[0]);

  // Ensure active video updates if current video is deleted by admin
  useEffect(() => {
    if (allVideos.length > 0 && !allVideos.some(v => v.id === activeVideo?.id)) {
      setActiveVideo(allVideos[0]);
    }
  }, [allVideos]);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'popular' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(765); // 12:45 mock default or live seconds
  const [durationSeconds, setDurationSeconds] = useState(1695); // 28:15 mock
  const [isMuted, setIsMuted] = useState(false);
  const [isFollowed, setIsFollowed] = useState<Record<string, boolean>>({});
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({ 'vid-1': true });
  const [savedVideos, setSavedVideos] = useState<Record<string, boolean>>({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastVideoTimeRef = useRef<number>(0);

  // Auto-hide controls after 2.5 seconds when playing
  const resetControlsTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  
  // When the video source changes, load it explicitly
  useEffect(() => {
    if (videoRef.current) {
      
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked after load:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentVideoSrc, activeVideo?.videoUrl]);

  // When play/pause state toggles
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked:', err);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Parse duration string to seconds helper
  const parseDurationToSeconds = (durStr: string): number => {
    if (!durStr) return 1800;
    const parts = durStr.split(':').map(Number);
    if (parts.length === 2) {
      return (parts[0] * 60) + parts[1];
    } else if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }
    return 1800;
  };

  // Get YouTube Embed URL if applicable
  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
    }
    return null;
  };

  const youtubeEmbedUrl = useMemo(() => {
    return getYouTubeEmbedUrl(currentVideoSrc || activeVideo?.videoUrl || '');
  }, [currentVideoSrc, activeVideo]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // When active video changes
  useEffect(() => {
    let isMounted = true;
    if (activeVideo) {
      const durSecs = parseDurationToSeconds(activeVideo.duration);
      setDurationSeconds(durSecs);
      setCurrentTime(0);

      // Reset current video src if blob URL, or keep if http/https
      if (activeVideo.videoUrl && (activeVideo.videoUrl.startsWith('http://') || activeVideo.videoUrl.startsWith('https://'))) {
        setCurrentVideoSrc(activeVideo.videoUrl);
      } else {
        setCurrentVideoSrc('');
      }

      const sampleFallback = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

      getMediaUrl(activeVideo.id, activeVideo.videoUrl, sampleFallback).then((src) => {
        if (isMounted && src) {
          setCurrentVideoSrc(src);
        }
      }).catch(() => {
        if (isMounted) {
          setCurrentVideoSrc(sampleFallback);
        }
      });

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked:', err);
          setIsPlaying(false);
        });
      }
    }
    return () => { isMounted = false; };
  }, [activeVideo]);

  // Video Timeupdate listener for native HTML5 video (Throttled per second to avoid UI lag)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = Math.floor(videoRef.current.currentTime);
      if (cur !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = cur;
        setCurrentTime(cur);
      }
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDurationSeconds(videoRef.current.duration);
      }
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch((err) => {
          console.warn('Auto-play blocked:', err);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  // Skip -10s or +10s
  const handleSeekOffset = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(durationSeconds, videoRef.current.currentTime + seconds));
    } else {
      setCurrentTime(prev => Math.max(0, Math.min(durationSeconds, prev + seconds)));
    }
  };

  // Progress Bar Seek
  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Next / Previous Video
  const handleNextVideo = () => {
    const currentIndex = allVideos.findIndex(v => v.id === activeVideo.id);
    if (currentIndex !== -1 && currentIndex < allVideos.length - 1) {
      setActiveVideo(allVideos[currentIndex + 1]);
    } else if (allVideos.length > 0) {
      setActiveVideo(allVideos[0]);
    }
  };

  const handlePrevVideo = () => {
    const currentIndex = allVideos.findIndex(v => v.id === activeVideo.id);
    if (currentIndex > 0) {
      setActiveVideo(allVideos[currentIndex - 1]);
    }
  };

  // Filtered Video List
  const filteredVideos = useMemo(() => {
    return allVideos.filter(v => {
      // Category filter
      if (selectedFilter === 'recent' && !v.isRecent) return false;
      if (selectedFilter === 'popular' && !v.isPopular) return false;
      if (selectedFilter === 'favorites' && !savedVideos[v.id] && !likedVideos[v.id]) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = v.title.toLowerCase().includes(q);
        const matchQari = v.qariName.toLowerCase().includes(q);
        const matchSurah = v.surahName?.toLowerCase().includes(q);
        return matchTitle || matchQari || matchSurah;
      }
      return true;
    });
  }, [allVideos, selectedFilter, searchQuery, savedVideos, likedVideos]);

  // Recommended list (excluding current active video)
  const recommendedVideos = useMemo(() => {
    return filteredVideos.filter(v => v.id !== activeVideo.id);
  }, [filteredVideos, activeVideo]);

  // Toggle Like
  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Toggle Save
  const toggleSave = (videoId: string) => {
    setSavedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Toggle Follow
  const toggleFollow = (qariName: string) => {
    setIsFollowed(prev => ({
      ...prev,
      [qariName]: !prev[qariName]
    }));
  };

  // Share
  const handleShare = (video: VideoTilawat) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `${video.title} - ${video.qariName} এর সুমধুর ভিডিও তিলাওয়াত শুনুন ফাহিম ইন্টারনেটে।`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${video.title}\n${video.videoUrl}`);
      alert('📋 ভিডিও তিলাওয়াত লিংক কপি করা হয়েছে!');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white pb-10">
      
      {/* -------------------- 1. TOP APP HEADER (MATCHING SCREENSHOT) -------------------- */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3.5 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-slate-700/50"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>ভিডিও তিলাওয়াত</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                Live HD
              </span>
            </h1>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700 animate-in fade-in">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ক্বারী বা সূরার নাম খুঁজুন..."
                className="bg-transparent text-xs text-white placeholder-slate-400 outline-none w-36 sm:w-48"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
                className="text-slate-400 hover:text-white ml-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer border border-slate-700/50"
              title="ভিডিও খুঁজুন"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          )}

          <button
            onClick={() => {
              if (selectedFilter === 'all') setSelectedFilter('popular');
              else if (selectedFilter === 'popular') setSelectedFilter('recent');
              else setSelectedFilter('all');
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              selectedFilter !== 'all' 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/50'
            }`}
            title="ফিল্টার"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* -------------------- 2. CATEGORY PILLS (MATCHING SCREENSHOT) -------------------- */}
      <div className="px-4 py-3 bg-[#0b1120] border-b border-slate-800/60 overflow-x-auto hide-scrollbar flex items-center gap-2">
        {[
          { id: 'all', label: 'সকল' },
          { id: 'recent', label: 'সাম্প্রতিক' },
          { id: 'popular', label: 'জনপ্রিয়' },
          { id: 'favorites', label: 'আমার পছন্দ' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
              selectedFilter === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-600/30 scale-105'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90 hover:text-white border border-slate-700/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full px-0 sm:px-4 py-0 sm:py-4 space-y-4">

        {/* -------------------- 3. ACTIVE / FEATURED VIDEO PLAYER HERO CARD -------------------- */}
        <div className="bg-[#111827] sm:rounded-3xl border-y sm:border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Video Player Container */}
          <div 
            onClick={(e) => {
              resetControlsTimer();
              if (showControls) togglePlay(); // If already showing, toggle play. If hidden, just show controls first.
            }}
            onTouchStart={resetControlsTimer}
            className="relative aspect-video w-full bg-black group overflow-hidden cursor-pointer"
          >
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                src={currentVideoSrc || (activeVideo.videoUrl && !activeVideo.videoUrl.startsWith('blob:') ? activeVideo.videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                poster={activeVideo.thumbnailUrl}
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleNextVideo}
                onError={(e) => {
                  const mediaErr = e.currentTarget.error;
                  console.warn('Video element playback note:', mediaErr?.code, mediaErr?.message);
                  const sampleVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                  if (currentVideoSrc !== sampleVideo) {
                    setCurrentVideoSrc(sampleVideo);
                  } else {
                    setIsPlaying(false);
                  }
                }}
                playsInline
                className="w-full h-full object-contain"
              />
            )}

            {!youtubeEmbedUrl && (
            <>
            {/* Custom Overlay Controls for Direct MP4 / Video files (Auto-hide after 2.5s) */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                resetControlsTimer();
                togglePlay();
              }}
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 flex flex-col justify-between p-3 sm:p-4 transition-opacity duration-300 ${
                showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              
              {/* Top Bar inside Video Player */}
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/80 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                    HD 1080p
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(prev => !prev);
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                      }
                      resetControlsTimer();
                    }}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer active:scale-95 transition-all"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlayerFullscreen(prev => !prev);
                      if (!isPlayerFullscreen) {
                        if (videoRef.current?.requestFullscreen) {
                          videoRef.current.requestFullscreen();
                        }
                      } else {
                        if (document.exitFullscreen) {
                          document.exitFullscreen();
                        }
                      }
                      resetControlsTimer();
                    }}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer active:scale-95 transition-all"
                  >
                    {isPlayerFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Center Playback Controller (Purple glowing circular button matching screenshot) */}
              <div className="flex items-center justify-center gap-5 sm:gap-8 pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeekOffset(-10);
                    resetControlsTimer();
                  }}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                  title="১০ সেকেন্ড পিছিয়ে যান"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevVideo();
                    resetControlsTimer();
                  }}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                  title="পূর্ববর্তী ভিডিও"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                    resetControlsTimer();
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextVideo();
                    resetControlsTimer();
                  }}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                  title="পরবর্তী ভিডিও"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeekOffset(10);
                    resetControlsTimer();
                  }}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                  title="১০ সেকেন্ড এগিয়ে যান"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Scrubber & Time */}
              <div className="space-y-1 pointer-events-auto">
                <input
                  type="range"
                  min={0}
                  max={durationSeconds || 100}
                  value={currentTime}
                  onChange={handleProgressBarChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
                />
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{activeVideo.duration || formatTime(durationSeconds)}</span>
                </div>
              </div>
            </div>

              </>
            )}
            {/* Duration pill in corner (matching screenshot) */}
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold backdrop-blur-xs pointer-events-none border border-white/10">
              {activeVideo.duration}
            </div>
          </div>

          {/* Video Metadata & Actions Details */}
          <div className="p-4 sm:p-5 space-y-4">
            
            {/* Status indicator + Title + Like Button */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>এখন চলছে</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base sm:text-xl font-black text-white leading-snug">
                  {activeVideo.title}
                </h2>
                <button
                  onClick={() => toggleLike(activeVideo.id)}
                  className={`p-2 rounded-full transition-all cursor-pointer flex-shrink-0 ${
                    likedVideos[activeVideo.id]
                      ? 'text-rose-500 bg-rose-500/10'
                      : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                  }`}
                  title="পছন্দ করুন"
                >
                  <Heart className={`w-6 h-6 ${likedVideos[activeVideo.id] ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Qari Channel Profile Row with Follow Button (Matching screenshot) */}
            <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {activeVideo.qariImage ? (
                    <img
                      src={activeVideo.qariImage}
                      alt={activeVideo.qariName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/60 shadow-md"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-sm">
                      {activeVideo.qariName.slice(0, 2)}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {activeVideo.qariName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400">
                    {activeVideo.views || '1.2M ভিউ'} • {activeVideo.uploadedTime || '২ মাস আগে'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(activeVideo.qariName)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  isFollowed[activeVideo.qariName]
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 active:scale-95'
                }`}
              >
                {isFollowed[activeVideo.qariName] ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>অনুসরণ করা হয়েছে</span>
                  </>
                ) : (
                  <span>ফলো করুন</span>
                )}
              </button>
            </div>

            {/* Action Buttons Bar: পছন্দ, সেভ, শেয়ার, ডাউনলোড (Matching screenshot) */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => toggleLike(activeVideo.id)}
                className={`py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer border ${
                  likedVideos[activeVideo.id]
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/50'
                }`}
              >
                <Heart className={`w-5 h-5 ${likedVideos[activeVideo.id] ? 'fill-current' : ''}`} />
                <span className="text-[11px]">পছন্দ</span>
              </button>

              <button
                onClick={() => toggleSave(activeVideo.id)}
                className={`py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer border ${
                  savedVideos[activeVideo.id]
                    ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/50'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${savedVideos[activeVideo.id] ? 'fill-current' : ''}`} />
                <span className="text-[11px]">সেভ</span>
              </button>

              <button
                onClick={() => handleShare(activeVideo)}
                className="py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-all cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-[11px]">শেয়ার</span>
              </button>

              <a
                href={activeVideo.videoUrl}
                target="_blank"
                rel="noreferrer"
                download={activeVideo.videoFileName || `${activeVideo.title}.mp4`}
                className="py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span className="text-[11px]">ডাউনলোড</span>
              </a>
            </div>

            {/* Description Card ("বিবরণ") */}
            <div className="bg-[#1e293b]/70 rounded-2xl p-3.5 sm:p-4 border border-slate-700/60 space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-100 text-xs">বিবরণ</span>
                <button
                  onClick={() => setShowFullDescription(prev => !prev)}
                  className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{showFullDescription ? 'সংক্ষেপ করুন' : 'আরও দেখুন'}</span>
                  {showFullDescription ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className={showFullDescription ? '' : 'line-clamp-2'}>
                {activeVideo.description || 'পবিত্র কুরআনুল কারীমের মন জুড়ানো তিলাওয়াত। যেকারো হৃদয়কে প্রশান্ত করতে অনন্য তিলাওয়াত।' }
              </p>

              {activeVideo.surahName && (
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-black text-[11px]">
                    📖 {activeVideo.surahName}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold text-[11px]">
                    ⏱️ সময়সীমা: {activeVideo.duration}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* -------------------- 4. "পরবর্তী ভিডিও" / RECOMMENDED LIST (MATCHING SCREENSHOT) -------------------- */}
        <div className="px-4 sm:px-0 space-y-3 pt-2">
          
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="w-2 h-4 bg-indigo-500 rounded-full inline-block" />
              <span>পরবর্তী ভিডিও ({recommendedVideos.length})</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {selectedFilter === 'all' ? 'সকল তিলাওয়াত' : selectedFilter === 'popular' ? 'জনপ্রিয়' : 'সাম্প্রতিক'}
            </span>
          </div>

          {/* Videos List */}
          <div className="space-y-2.5">
            {recommendedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setActiveVideo(video);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2.5 sm:p-3 rounded-2xl bg-[#111827] hover:bg-[#1e293b] border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 flex items-start gap-3 cursor-pointer group shadow-sm active:scale-[0.99]"
              >
                {/* Video Thumbnail with duration badge */}
                <div className="relative w-32 sm:w-40 aspect-video rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/50">
                  <img
                    src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&auto=format&fit=crop&q=80'}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[10px] font-black border border-white/10">
                    {video.duration}
                  </div>
                </div>

                {/* Video Information */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-400 truncate">
                      {video.qariName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1.5">
                    <span>
                      {video.views || '500K ভিউ'} • {video.uploadedTime || '১ মাস আগে'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(video);
                      }}
                      className="p-1 text-slate-500 hover:text-slate-300 rounded-lg cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {recommendedVideos.length === 0 && (
              <div className="p-8 text-center bg-[#111827] rounded-3xl border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">কোনো ভিডিও তিলাওয়াত পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  অন্য কোনো কীওয়ার্ড বা ক্যাটাগরি ফিল্টার সিলেক্ট করে পুনরায় চেষ্টা করুন।
                </p>
                <button
                  onClick={() => {
                    setSelectedFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                >
                  সকল ভিডিও দেখুন
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
