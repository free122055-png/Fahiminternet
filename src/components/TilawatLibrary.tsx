import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Loader2,
  Video,
  CloudRain,
  Square,
  Repeat,
  Mic,
  Sliders,
  Wand2
} from 'lucide-react';

export interface BackgroundSoundItem {
  id: string;
  name: string;
  bengaliName: string;
  icon: string;
  audioUrl: string;
  defaultVolume?: number;
  isMusic?: boolean;
}

export const BACKGROUND_SOUNDS_LIST: BackgroundSoundItem[] = [
  { id: 'light_rain', name: 'Light Rain', bengaliName: 'হালকা বৃষ্টি', icon: '🌧️', audioUrl: 'https://actions.google.com/sounds/v1/weather/rain_drizzle.ogg', defaultVolume: 0.20 },
  { id: 'heavy_rain', name: 'Heavy Rain', bengaliName: 'ভারী বৃষ্টি', icon: '🌧️', audioUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg', defaultVolume: 0.25 },
  { id: 'rain_thunder', name: 'Rain + Thunder', bengaliName: 'বৃষ্টি ও মেঘের গর্জন', icon: '⛈️', audioUrl: 'https://actions.google.com/sounds/v1/weather/thunderstorm.ogg', defaultVolume: 0.25 },
  { id: 'rain_window', name: 'Rain on Window', bengaliName: 'জানালায় বৃষ্টির শব্দ', icon: '🌧️', audioUrl: 'https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg', defaultVolume: 0.20 },
  { id: 'ocean_waves', name: 'Ocean Waves', bengaliName: 'সমুদ্রের ঢেউ', icon: '🌊', audioUrl: 'https://actions.google.com/sounds/v1/water/ocean_waves.ogg', defaultVolume: 0.25 },
  { id: 'river_flow', name: 'River Flow', bengaliName: 'নদীর পানির শব্দ', icon: '🏞️', audioUrl: 'https://actions.google.com/sounds/v1/water/river_stream.ogg', defaultVolume: 0.20 },
  { id: 'waterfall', name: 'Waterfall', bengaliName: 'ঝরনার শব্দ', icon: '💦', audioUrl: 'https://actions.google.com/sounds/v1/water/waterfall.ogg', defaultVolume: 0.20 },
  { id: 'small_stream', name: 'Small Stream', bengaliName: 'ছোট ঝরনা/নদী', icon: '💧', audioUrl: 'https://actions.google.com/sounds/v1/water/stream_flowing.ogg', defaultVolume: 0.20 },
  { id: 'soft_wind', name: 'Soft Wind', bengaliName: 'হালকা বাতাস', icon: '💨', audioUrl: 'https://actions.google.com/sounds/v1/weather/wind_light.ogg', defaultVolume: 0.20 },
  { id: 'leaves_rustling', name: 'Leaves Rustling', bengaliName: 'পাতার মৃদু শব্দ', icon: '🍃', audioUrl: 'https://actions.google.com/sounds/v1/weather/wind_in_trees.ogg', defaultVolume: 0.18 },
  { id: 'forest_ambience', name: 'Forest Ambience', bengaliName: 'জঙ্গলের পরিবেশ', icon: '🌲', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/forest.ogg', defaultVolume: 0.22 },
  { id: 'birds', name: 'Birds', bengaliName: 'পাখির ডাক', icon: '🐦', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', defaultVolume: 0.20 },
  { id: 'birds_wind', name: 'Birds + Soft Wind', bengaliName: 'পাখির ডাক ও হালকা বাতাস', icon: '🐦', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg', defaultVolume: 0.20 },
  { id: 'night_crickets', name: 'Night Crickets', bengaliName: 'ঝিঁঝিঁ পোকার শব্দ', icon: '🦗', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/night_crickets.ogg', defaultVolume: 0.20 },
  { id: 'night_ambience', name: 'Night Ambience', bengaliName: 'রাতের শান্ত পরিবেশ', icon: '🌙', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/night_village.ogg', defaultVolume: 0.20 },
  { id: 'morning_nature', name: 'Morning Nature', bengaliName: 'সকালের পরিবেশ', icon: '🌅', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/farm_morning.ogg', defaultVolume: 0.20 },
  { id: 'garden_ambience', name: 'Garden Ambience', bengaliName: 'বাগানের শান্ত পরিবেশ', icon: '🌿', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/garden.ogg', defaultVolume: 0.20 },
  { id: 'open_field', name: 'Open Field', bengaliName: 'খোলা মাঠের পরিবেশ', icon: '🌾', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/meadow.ogg', defaultVolume: 0.20 },
  { id: 'soft_birds', name: 'Soft Birds', bengaliName: 'মৃদু পাখির ডাক', icon: '🕊️', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg', defaultVolume: 0.18 },
  { id: 'rain_wind', name: 'Rain + Soft Wind', bengaliName: 'বৃষ্টি ও হালকা বাতাস', icon: '🌧️', audioUrl: 'https://actions.google.com/sounds/v1/weather/rain_drizzle.ogg', defaultVolume: 0.20 },
  { id: 'forest_birds', name: 'Forest + Birds', bengaliName: 'জঙ্গল ও পাখির ডাক', icon: '🌲', audioUrl: 'https://actions.google.com/sounds/v1/ambiences/forest.ogg', defaultVolume: 0.20 },
  { id: 'calm_sea', name: 'Calm Sea', bengaliName: 'শান্ত সমুদ্র', icon: '🌊', audioUrl: 'https://actions.google.com/sounds/v1/water/sea_gentle.ogg', defaultVolume: 0.20 },
  { id: 'fireplace', name: 'Fireplace', bengaliName: 'আগুনের মৃদু শব্দ', icon: '🔥', audioUrl: 'https://actions.google.com/sounds/v1/household/fireplace.ogg', defaultVolume: 0.20 },
  { id: 'soft_ambient_music', name: 'Soft Ambient Music', bengaliName: 'নরম ও শান্ত অ্যানবিয়েন্ট মিউজিক', icon: '🎵', audioUrl: 'https://actions.google.com/sounds/v1/science_fiction/meditation_bell.ogg', defaultVolume: 0.15, isMusic: true }
];

// Procedural Web Audio Ambient Sound Synthesizer (Instant offline / zero latency backup)
class AmbientAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  public activeSoundId: string | null = null;

  public start(soundId: string, volume: number = 0.25) {
    this.stop();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.08;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();

      if (soundId === 'ocean' || soundId === 'river' || soundId === 'waterfall') {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(350, this.ctx.currentTime);
        this.lfoNode = this.ctx.createOscillator();
        this.lfoNode.frequency.setValueAtTime(0.12, this.ctx.currentTime);
        this.lfoGain = this.ctx.createGain();
        this.lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
        this.lfoNode.connect(this.lfoGain);
        this.lfoGain.connect(this.filterNode.frequency);
        this.lfoNode.start();
      } else if (soundId === 'wind' || soundId === 'leaves') {
        this.filterNode.type = 'bandpass';
        this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);
        this.lfoNode = this.ctx.createOscillator();
        this.lfoNode.frequency.setValueAtTime(0.2, this.ctx.currentTime);
        this.lfoGain = this.ctx.createGain();
        this.lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
        this.lfoNode.connect(this.lfoGain);
        this.lfoGain.connect(this.filterNode.frequency);
        this.lfoNode.start();
      } else {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(700, this.ctx.currentTime);
      }

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);
      this.noiseNode.start();
      this.activeSoundId = soundId;
    } catch (e) {
      console.warn('Synth startup error:', e);
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  public stop() {
    try {
      if (this.lfoNode) { this.lfoNode.stop(); this.lfoNode.disconnect(); this.lfoNode = null; }
      if (this.noiseNode) { this.noiseNode.stop(); this.noiseNode.disconnect(); this.noiseNode = null; }
      if (this.ctx) { this.ctx.close(); this.ctx = null; }
    } catch (e) {
      // ignore
    }
    this.activeSoundId = null;
  }
}
import { motion, AnimatePresence } from 'motion/react';
import { VideoTilawatSection } from './VideoTilawatSection';
import type { CustomTilawatAudio, VideoTilawat, VoiceStyleItem, TilawatBanner } from '../types';

export const VOICE_STYLES_LIST: VoiceStyleItem[] = [
  {
    id: 'natural',
    name: 'Natural Voice',
    bengaliName: 'আসল কণ্ঠ',
    description: 'ক্বারী সাহেবের আসল স্বাভাবিক কণ্ঠ (কোনো ইফেক্ট ছাড়া)',
    icon: '🎙️',
    badge: 'Default',
  },
  {
    id: 'soft',
    name: 'Soft Voice',
    bengaliName: 'নরম ও কোমল কণ্ঠ',
    description: 'মৃদু ও নরম অনুভূতি, কানে আরামদায়ী কোমল সাউন্ড',
    icon: '🌸',
    highpassFreq: 40,
    lowpassFreq: 4800,
    lowShelfFreq: 220,
    lowShelfGain: 4.5,
    midPeakingFreq: 400,
    midPeakingGain: 2.0,
    highShelfFreq: 4000,
    highShelfGain: -7.0,
  },
  {
    id: 'thin',
    name: 'Thin Voice',
    bengaliName: 'হালকা/চিকন কণ্ঠ',
    description: 'হালকা ও পরিষ্কার হাই-ফ্রিকোয়েন্সি ব্যালেন্স, ভারী বেস মুক্ত',
    icon: '✨',
    highpassFreq: 280,
    lowpassFreq: 18000,
    lowShelfFreq: 200,
    lowShelfGain: -9.0,
    midPeakingFreq: 500,
    midPeakingGain: -4.0,
    presenceFreq: 3200,
    presenceGain: 6.5,
    highShelfFreq: 6000,
    highShelfGain: 5.0,
  },
  {
    id: 'deep',
    name: 'Deep Voice',
    bengaliName: 'গভীর কণ্ঠ',
    description: 'গভীর ও গম্ভীর পরিবেশ, স্বাভাবিক নমনীয়তা সহ',
    icon: '🌊',
    highpassFreq: 30,
    lowpassFreq: 7500,
    lowShelfFreq: 130,
    lowShelfGain: 8.5,
    midPeakingFreq: 350,
    midPeakingGain: 4.5,
    presenceFreq: 2200,
    presenceGain: -2.0,
    highShelfFreq: 4000,
    highShelfGain: -6.5,
  },
  {
    id: 'heavy',
    name: 'Heavy Voice',
    bengaliName: 'মোটা ও ভারী কণ্ঠ',
    description: 'ভরাট ও ভারী স্বর, কোনো আর্টিফিশিয়াল ডিস্টোরশন ছাড়াই',
    icon: '📢',
    highpassFreq: 35,
    lowpassFreq: 9000,
    lowShelfFreq: 180,
    lowShelfGain: 9.5,
    midPeakingFreq: 450,
    midPeakingGain: 5.5,
    presenceFreq: 2000,
    presenceGain: 1.5,
    highShelfFreq: 5000,
    highShelfGain: -3.5,
  },
  {
    id: 'warm',
    name: 'Warm Voice',
    bengaliName: 'উষ্ণ ও মিষ্টি কণ্ঠ',
    description: 'উষ্ণ, মিষ্টি ও মাধুর্যপূর্ণ তিলাওয়াত',
    icon: '☀️',
    highpassFreq: 60,
    lowpassFreq: 14000,
    lowShelfFreq: 250,
    lowShelfGain: 4.5,
    midPeakingFreq: 600,
    midPeakingGain: 4.0,
    presenceFreq: 2400,
    presenceGain: 3.0,
    highShelfFreq: 6500,
    highShelfGain: -2.5,
  },
  {
    id: 'powerful',
    name: 'Powerful Voice',
    bengaliName: 'শক্তিশালী কণ্ঠ',
    description: 'দৃঢ় ও সুদৃঢ় প্রভাব, হালকা ডায়নামিক কম্প্রেশন সহ',
    icon: '⚡',
    highpassFreq: 70,
    lowpassFreq: 18000,
    lowShelfFreq: 160,
    lowShelfGain: 4.5,
    midPeakingFreq: 800,
    midPeakingGain: 2.5,
    presenceFreq: 2600,
    presenceGain: 7.5,
    highShelfFreq: 5500,
    highShelfGain: 3.5,
    compressorThreshold: -24,
    compressorRatio: 4.5,
    compressorKnee: 8,
  },
  {
    id: 'clear',
    name: 'Clear Voice',
    bengaliName: 'পরিষ্কার ও স্বচ্ছ কণ্ঠ',
    description: 'অতি স্বচ্ছ ও স্ফটিকের মতো পরিষ্কার প্রতিটি হরফ',
    icon: '💎',
    highpassFreq: 120,
    lowpassFreq: 19000,
    lowShelfFreq: 180,
    lowShelfGain: -1.5,
    midPeakingFreq: 400,
    midPeakingGain: -5.5,
    presenceFreq: 3500,
    presenceGain: 8.5,
    highShelfFreq: 7500,
    highShelfGain: 6.0,
  },
  {
    id: 'rich',
    name: 'Rich Voice',
    bengaliName: 'সমৃদ্ধ ও পূর্ণ কণ্ঠ',
    description: 'পূর্ণাঙ্গ, সুসংগত ও সমৃদ্ধ অডিও ব্যালেন্স',
    icon: '🌟',
    highpassFreq: 50,
    lowpassFreq: 18000,
    lowShelfFreq: 160,
    lowShelfGain: 5.5,
    midPeakingFreq: 500,
    midPeakingGain: 3.5,
    presenceFreq: 2800,
    presenceGain: 5.0,
    highShelfFreq: 6500,
    highShelfGain: 3.5,
    compressorThreshold: -20,
    compressorRatio: 3.0,
  },
  {
    id: 'bass',
    name: 'Bass Voice',
    bengaliName: 'সামান্য ভারী Bass অনুভূতি',
    description: 'হালকা বেস ও ভরাট সাউন্ডের অনুভূতি',
    icon: '🎸',
    highpassFreq: 30,
    lowpassFreq: 12000,
    lowShelfFreq: 100,
    lowShelfGain: 11.5,
    midPeakingFreq: 250,
    midPeakingGain: 5.0,
    presenceFreq: 2500,
    presenceGain: 1.5,
    highShelfFreq: 5000,
    highShelfGain: -3.0,
  },
  {
    id: 'low',
    name: 'Low Voice',
    bengaliName: 'একটু নিচু/গভীর টোন',
    description: 'একটু নিচু ও শান্ত স্বরের ভারসাম্য',
    icon: '🔉',
    highpassFreq: 45,
    lowpassFreq: 5500,
    lowShelfFreq: 150,
    lowShelfGain: 6.5,
    midPeakingFreq: 350,
    midPeakingGain: 3.5,
    presenceFreq: 1800,
    presenceGain: -3.0,
    highShelfFreq: 3200,
    highShelfGain: -8.5,
  },
  {
    id: 'high',
    name: 'High Voice',
    bengaliName: 'একটু উঁচু টোন',
    description: 'একটু উঁচু ও উজ্জ্বল সাউন্ডে স্পষ্ট তিলাওয়াত',
    icon: '🔊',
    highpassFreq: 220,
    lowpassFreq: 20000,
    lowShelfFreq: 200,
    lowShelfGain: -6.0,
    midPeakingFreq: 1200,
    midPeakingGain: 3.5,
    presenceFreq: 3800,
    presenceGain: 7.0,
    highShelfFreq: 6000,
    highShelfGain: 8.0,
  },
  {
    id: 'spacious',
    name: 'Spacious Voice',
    bengaliName: 'হালকা প্রশস্ত/মসজিদের মতো অনুভূতি',
    description: 'খোলামেলা বিশাল স্থানের মতো মনোরম প্রশান্তি',
    icon: '🏛️',
    highpassFreq: 60,
    lowpassFreq: 15000,
    lowShelfFreq: 180,
    lowShelfGain: 3.5,
    midPeakingFreq: 500,
    midPeakingGain: 2.0,
    presenceFreq: 2500,
    presenceGain: 3.0,
    highShelfFreq: 6000,
    highShelfGain: 1.5,
    reverbMix: 0.32,
    reverbDelay: 0.09,
    reverbDecay: 0.32,
  },
  {
    id: 'studio',
    name: 'Studio Voice',
    bengaliName: 'পরিষ্কার Professional Studio Sound',
    description: 'প্রফেশনাল রেকর্ডিং স্টুডিওর মতো পারফেক্ট ফিল্টার্ড সাউন্ড',
    icon: '🎧',
    highpassFreq: 85,
    lowpassFreq: 19000,
    lowShelfFreq: 150,
    lowShelfGain: 2.5,
    midPeakingFreq: 380,
    midPeakingGain: -4.5,
    presenceFreq: 3000,
    presenceGain: 6.5,
    highShelfFreq: 8000,
    highShelfGain: 4.5,
    compressorThreshold: -22,
    compressorRatio: 3.5,
    compressorKnee: 6,
    reverbMix: 0.14,
    reverbDelay: 0.03,
    reverbDecay: 0.15,
  },
  {
    id: 'mosque',
    name: 'Mosque Voice',
    bengaliName: 'Natural হালকা Mosque/Reverb Effect',
    description: 'মনোরম পবিত্র মসজিদের গম্বুজের প্রাকৃতিক সুন্দর রিভার্ব',
    icon: '🕌',
    highpassFreq: 50,
    lowpassFreq: 14000,
    lowShelfFreq: 180,
    lowShelfGain: 4.5,
    midPeakingFreq: 450,
    midPeakingGain: 3.0,
    presenceFreq: 2400,
    presenceGain: 4.0,
    highShelfFreq: 5500,
    highShelfGain: 1.0,
    reverbMix: 0.48,
    reverbDelay: 0.14,
    reverbDecay: 0.45,
  },
];

// Web Audio DSP Engine for Voice Effect Processing (Natural male vocal preservation)
class VoiceEffectDSP {
  private ctx: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private inputGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private highpassNode: BiquadFilterNode | null = null;
  private lowpassNode: BiquadFilterNode | null = null;
  private lowShelfNode: BiquadFilterNode | null = null;
  private midPeakingNode: BiquadFilterNode | null = null;
  private presenceNode: BiquadFilterNode | null = null;
  private highShelfNode: BiquadFilterNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private delayNode: DelayNode | null = null;
  private feedbackGain: GainNode | null = null;
  private delayFilter: BiquadFilterNode | null = null;
  private reverbWetGain: GainNode | null = null;

  private isSourceConnected = false;

  public init(audioElement: HTMLAudioElement) {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      if (!this.isSourceConnected && audioElement) {
        try {
          this.source = this.ctx.createMediaElementSource(audioElement);

          this.inputGain = this.ctx.createGain();
          this.dryGain = this.ctx.createGain();
          this.wetGain = this.ctx.createGain();
          this.reverbWetGain = this.ctx.createGain();

          this.highpassNode = this.ctx.createBiquadFilter();
          this.highpassNode.type = 'highpass';
          this.highpassNode.frequency.value = 20;

          this.lowpassNode = this.ctx.createBiquadFilter();
          this.lowpassNode.type = 'lowpass';
          this.lowpassNode.frequency.value = 20000;

          this.lowShelfNode = this.ctx.createBiquadFilter();
          this.lowShelfNode.type = 'lowshelf';
          this.lowShelfNode.frequency.value = 200;
          this.lowShelfNode.gain.value = 0;

          this.midPeakingNode = this.ctx.createBiquadFilter();
          this.midPeakingNode.type = 'peaking';
          this.midPeakingNode.frequency.value = 400;
          this.midPeakingNode.Q.value = 1.0;
          this.midPeakingNode.gain.value = 0;

          this.presenceNode = this.ctx.createBiquadFilter();
          this.presenceNode.type = 'peaking';
          this.presenceNode.frequency.value = 2800;
          this.presenceNode.Q.value = 1.0;
          this.presenceNode.gain.value = 0;

          this.highShelfNode = this.ctx.createBiquadFilter();
          this.highShelfNode.type = 'highshelf';
          this.highShelfNode.frequency.value = 6000;
          this.highShelfNode.gain.value = 0;

          this.compressorNode = this.ctx.createDynamicsCompressor();
          this.compressorNode.threshold.value = 0;
          this.compressorNode.ratio.value = 1;

          this.delayNode = this.ctx.createDelay(1.0);
          this.delayNode.delayTime.value = 0.1;

          this.feedbackGain = this.ctx.createGain();
          this.feedbackGain.gain.value = 0;

          this.delayFilter = this.ctx.createBiquadFilter();
          this.delayFilter.type = 'lowpass';
          this.delayFilter.frequency.value = 3200;

          // Wire Source -> InputGain
          this.source.connect(this.inputGain);

          // Wire Dry Path
          this.inputGain.connect(this.dryGain);
          this.dryGain.connect(this.ctx.destination);

          // Wire Wet Path (Multi-band EQ Chain)
          this.inputGain.connect(this.highpassNode);
          this.highpassNode.connect(this.lowShelfNode);
          this.lowShelfNode.connect(this.midPeakingNode);
          this.midPeakingNode.connect(this.presenceNode);
          this.presenceNode.connect(this.highShelfNode);
          this.highShelfNode.connect(this.lowpassNode);
          this.lowpassNode.connect(this.compressorNode);
          this.compressorNode.connect(this.wetGain);
          this.wetGain.connect(this.ctx.destination);

          // Wire Reverb / Delay Loop
          this.compressorNode.connect(this.delayNode);
          this.delayNode.connect(this.delayFilter);
          this.delayFilter.connect(this.feedbackGain);
          this.feedbackGain.connect(this.delayNode);
          this.delayFilter.connect(this.reverbWetGain);
          this.reverbWetGain.connect(this.ctx.destination);

          this.isSourceConnected = true;
        } catch (sourceErr) {
          console.warn('VoiceEffectDSP media element source connect note:', sourceErr);
        }
      }
    } catch (err) {
      console.warn('VoiceEffectDSP init catch:', err);
    }
  }

  public applyStyle(style: VoiceStyleItem, strength: number) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const normStrength = Math.max(0, Math.min(1, strength));
    const now = this.ctx.currentTime;
    const rampTime = 0.04; // Smooth 40ms interpolation to prevent audio pop/disruption

    if (style.id === 'natural' || normStrength === 0) {
      this.dryGain?.gain.setTargetAtTime(1.0, now, rampTime);
      this.wetGain?.gain.setTargetAtTime(0.0, now, rampTime);
      this.reverbWetGain?.gain.setTargetAtTime(0.0, now, rampTime);
      this.feedbackGain?.gain.setTargetAtTime(0.0, now, rampTime);
      return;
    }

    // Pure 100% wet DSP processing when style is active
    this.dryGain?.gain.setTargetAtTime(0.0, now, rampTime);
    this.wetGain?.gain.setTargetAtTime(1.0, now, rampTime);

    // Highpass Filter
    const targetHp = style.highpassFreq ? 20 + (style.highpassFreq - 20) * normStrength : 20;
    this.highpassNode?.frequency.setTargetAtTime(targetHp, now, rampTime);

    // Lowpass Filter
    const targetLp = style.lowpassFreq ? 20000 - (20000 - style.lowpassFreq) * normStrength : 20000;
    this.lowpassNode?.frequency.setTargetAtTime(targetLp, now, rampTime);

    // Low Shelf Filter (Bass)
    const targetLsFreq = style.lowShelfFreq || 200;
    const targetLsGain = (style.lowShelfGain || 0) * normStrength;
    this.lowShelfNode?.frequency.setTargetAtTime(targetLsFreq, now, rampTime);
    this.lowShelfNode?.gain.setTargetAtTime(targetLsGain, now, rampTime);

    // Mid Peaking Filter (Low-Mid Body)
    const targetMidFreq = style.midPeakingFreq || 400;
    const targetMidGain = (style.midPeakingGain || 0) * normStrength;
    const targetMidQ = style.midPeakingQ || 1.0;
    this.midPeakingNode?.frequency.setTargetAtTime(targetMidFreq, now, rampTime);
    this.midPeakingNode?.gain.setTargetAtTime(targetMidGain, now, rampTime);
    this.midPeakingNode?.Q.setTargetAtTime(targetMidQ, now, rampTime);

    // Presence Peaking Filter (High-Mid Clarity)
    const targetPresFreq = style.presenceFreq || 2800;
    const targetPresGain = (style.presenceGain || 0) * normStrength;
    const targetPresQ = style.presenceQ || 1.0;
    this.presenceNode?.frequency.setTargetAtTime(targetPresFreq, now, rampTime);
    this.presenceNode?.gain.setTargetAtTime(targetPresGain, now, rampTime);
    this.presenceNode?.Q.setTargetAtTime(targetPresQ, now, rampTime);

    // High Shelf Filter (Treble / Air)
    const targetHsFreq = style.highShelfFreq || 6000;
    const targetHsGain = (style.highShelfGain || 0) * normStrength;
    this.highShelfNode?.frequency.setTargetAtTime(targetHsFreq, now, rampTime);
    this.highShelfNode?.gain.setTargetAtTime(targetHsGain, now, rampTime);

    // Dynamic Compression
    if (style.compressorRatio && style.compressorRatio > 1) {
      const targetThresh = style.compressorThreshold || -20;
      const targetRatio = 1 + ((style.compressorRatio || 1) - 1) * normStrength;
      const targetKnee = style.compressorKnee || 6;
      this.compressorNode?.threshold.setTargetAtTime(targetThresh, now, rampTime);
      this.compressorNode?.ratio.setTargetAtTime(targetRatio, now, rampTime);
      this.compressorNode?.knee.setTargetAtTime(targetKnee, now, rampTime);
    } else {
      this.compressorNode?.threshold.setTargetAtTime(0, now, rampTime);
      this.compressorNode?.ratio.setTargetAtTime(1, now, rampTime);
    }

    // Reverb / Spatial Ambience Loop
    if (style.reverbMix && style.reverbMix > 0) {
      const delaySec = style.reverbDelay || 0.1;
      const feedback = (style.reverbDecay || 0.3) * normStrength;
      const mixVal = (style.reverbMix || 0.3) * normStrength;

      this.delayNode?.delayTime.setTargetAtTime(delaySec, now, rampTime);
      this.feedbackGain?.gain.setTargetAtTime(feedback, now, rampTime);
      this.reverbWetGain?.gain.setTargetAtTime(mixVal, now, rampTime);
    } else {
      this.feedbackGain?.gain.setTargetAtTime(0, now, rampTime);
      this.reverbWetGain?.gain.setTargetAtTime(0, now, rampTime);
    }
  }
}
import { getMediaUrl } from '../utils/mediaStorage';
import { DEFAULT_TILAWAT_AUDIOS } from './AdminPanel';

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

// Helper to safely render Qari avatar or fallback monogram badge
const renderQariAvatar = (
  qari: { image?: string; initials?: string; name: string },
  imgClassName: string,
  badgeClassName?: string
) => {
  if (qari.image && qari.image.trim() !== '') {
    return <img src={qari.image} alt={qari.name} className={imgClassName} />;
  }
  const initials = qari.initials || qari.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`${badgeClassName || imgClassName} flex items-center justify-center font-black text-white bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-950 border-2 border-emerald-400/80 shadow-lg`}>
      {initials}
    </div>
  );
};

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

const DEFAULT_TILAWAT_BANNERS: TilawatBanner[] = [
  {
    id: 'banner_dosari',
    title: 'শায়খ ইয়াসির আদ-দোসারি',
    subtitle: 'সুললিত ও তেজোদৃপ্ত কণ্ঠে তিলাওয়াত',
    qariId: 'yasser_dosari',
  },
  {
    id: 'banner_bader',
    title: 'শায়খ বদর আল-তুর্কী',
    subtitle: 'হৃদয়স্পর্শী সুর ও ধীর তিলাওয়াত',
    qariId: 'bader_turki',
  },
  {
    id: 'banner_mahdi',
    title: 'শায়খ মাহদি আশ-শিসানি',
    subtitle: 'চেচনিয়ার সুমধুর ও হৃদয়কাড়া তিলাওয়াত',
    qariId: 'mahdi_shishani',
  }
];

interface TilawatLibraryProps {
  onBack?: () => void;
  customQaris?: Qari[];
  customTilawatAudios?: CustomTilawatAudio[];
  customVideoTilawats?: VideoTilawat[];
  customBackgroundSounds?: BackgroundSoundItem[];
  tilawatBanners?: TilawatBanner[];
}

export const TilawatLibrary: React.FC<TilawatLibraryProps> = ({ 
  onBack, 
  customQaris, 
  customTilawatAudios, 
  customVideoTilawats,
  customBackgroundSounds,
  tilawatBanners
}) => {
  const QARI_LIST: Qari[] = (customQaris && customQaris.length > 0) ? customQaris : ALL_QARIS;
  const displayTilawatAudios: CustomTilawatAudio[] = customTilawatAudios !== undefined ? customTilawatAudios : DEFAULT_TILAWAT_AUDIOS;
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
  const [viewCategoryMode, setViewCategoryMode] = useState<'all' | 'juz' | 'surah' | 'recent' | 'custom'>('all');
  const [selectedJuz, setSelectedJuz] = useState<number>(1);
  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 36, 55, 67]);
  const [bookmarks, setBookmarks] = useState<number[]>([1, 18, 36]);
  const [heroSlide, setHeroSlide] = useState<number>(0);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);

  const bannerList = (tilawatBanners && tilawatBanners.length > 0) ? tilawatBanners : DEFAULT_TILAWAT_BANNERS;

  // Banner Automatic sliding every 3 seconds
  useEffect(() => {
    if (bannerList.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % bannerList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [bannerList.length]);

  const handleBannerClick = (banner: TilawatBanner) => {
    if (banner.customAudioId) {
      const audio = displayTilawatAudios.find(a => a.id === banner.customAudioId);
      if (audio) {
        playCustomAudio(audio);
        return;
      }
    }

    const targetQari = QARI_LIST.find(q => q.id === banner.qariId) || QARI_LIST[0];
    const targetSurahNumber = banner.surahNumber || 1;
    const targetSurah = SURAH_LIST.find(s => s.number === targetSurahNumber) || SURAH_LIST[0];

    setSelectedQari(targetQari);
    playSurah(targetSurah, targetQari);
  };

  // New Playlist Form State
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Multi-Track Secondary Background Audio Engine States
  // activeBgSounds: { [soundId: string]: volumeFloat (0.0 to 1.0) }
  const [activeBgSounds, setActiveBgSounds] = useState<Record<string, number>>({});
  const [isBgMasterPaused, setIsBgMasterPaused] = useState<boolean>(false);
  const [masterBgVolume, setMasterBgVolume] = useState<number>(1.0); // Master multiplier
  const [showBgSoundSheet, setShowBgSoundSheet] = useState<boolean>(false);
  const [bgTab, setBgTab] = useState<'all' | 'mix'>('all');

  // Voice Style / Voice Effect Engine States
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState<VoiceStyleItem>(VOICE_STYLES_LIST[0]);
  const [voiceEffectStrength, setVoiceEffectStrength] = useState<number>(1.0); // 1.0 = 100%
  const [showVoiceStyleSheet, setShowVoiceStyleSheet] = useState<boolean>(false);
  const voiceEffectProcessorRef = useRef<VoiceEffectDSP | null>(null);

  // Synchronize Voice Effect DSP with HTML5 Audio Element
  useEffect(() => {
    if (!audioRef.current) return;
    if (selectedVoiceStyle.id === 'natural') {
      if (voiceEffectProcessorRef.current) {
        voiceEffectProcessorRef.current.applyStyle(selectedVoiceStyle, voiceEffectStrength);
      }
      return;
    }
    try {
      if (!voiceEffectProcessorRef.current) {
        voiceEffectProcessorRef.current = new VoiceEffectDSP();
      }
      voiceEffectProcessorRef.current.init(audioRef.current);
      voiceEffectProcessorRef.current.applyStyle(selectedVoiceStyle, voiceEffectStrength);
    } catch (err) {
      console.warn('DSP sync notice:', err);
    }
  }, [selectedVoiceStyle, voiceEffectStrength, isPlaying]);

  // Sleep Timer States
  const [showSleepTimerModal, setShowSleepTimerModal] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [timerRemainingSec, setTimerRemainingSec] = useState<number | null>(null);

  // Audio HTML5 refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const synthsRef = useRef<Record<string, AmbientAudioSynth>>({});
  const sleepTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fallbackAttemptRef = useRef<number>(0);
  const lastAudioTimeRef = useRef<number>(0);
  const lastAudioDurationRef = useRef<number>(0);

  // Combined available background sounds
  const availableBgSounds = React.useMemo(() => {
    if (customBackgroundSounds && customBackgroundSounds.length > 0) {
      return customBackgroundSounds;
    }
    return BACKGROUND_SOUNDS_LIST;
  }, [customBackgroundSounds]);

  // Active background sounds item list
  const activeBgSoundsList = React.useMemo(() => {
    return availableBgSounds.filter(s => activeBgSounds[s.id] !== undefined);
  }, [availableBgSounds, activeBgSounds]);

  // Multi-Track Background Audio Synchronization Engine
  useEffect(() => {
    const currentAudioMap = bgAudioElementsRef.current;
    const activeIds = Object.keys(activeBgSounds);

    activeIds.forEach((id) => {
      const soundVol = activeBgSounds[id]; // Range 0.0 to 1.0
      const soundObj = availableBgSounds.find((s) => s.id === id);
      if (!soundObj) return;

      let audioEl = currentAudioMap[id];
      if (!audioEl) {
        audioEl = new Audio(soundObj.audioUrl);
        audioEl.loop = true;
        audioEl.preload = 'auto';
        currentAudioMap[id] = audioEl;
      }

      const effectiveVol = Math.max(0, Math.min(1, soundVol * masterBgVolume));
      audioEl.volume = effectiveVol;

      if (isPlaying && !isBgMasterPaused && effectiveVol > 0) {
        if (audioEl.paused) {
          audioEl.play().catch((err) => {
            console.warn(`Bg sound ${id} HTML5 audio play catch, trying synth:`, err);
            if (!synthsRef.current[id]) {
              synthsRef.current[id] = new AmbientAudioSynth();
            }
            synthsRef.current[id].start(id, effectiveVol);
          });
        }
      } else {
        if (!audioEl.paused) {
          audioEl.pause();
        }
        if (synthsRef.current[id]) {
          synthsRef.current[id].stop();
        }
      }
    });

    // Cleanup audio elements for sounds that were toggled off
    Object.keys(currentAudioMap).forEach((id) => {
      if (!activeIds.includes(id)) {
        currentAudioMap[id].pause();
        currentAudioMap[id].src = '';
        delete currentAudioMap[id];
        if (synthsRef.current[id]) {
          synthsRef.current[id].stop();
          delete synthsRef.current[id];
        }
      }
    });
  }, [activeBgSounds, isPlaying, isBgMasterPaused, masterBgVolume, availableBgSounds]);

  // Background Sound Handlers (Single Sound Selection Mode: Max 1 Background Sound Active)
  const handleToggleBgSound = (sound: BackgroundSoundItem) => {
    setActiveBgSounds((prev) => {
      // If clicking the currently active background sound, toggle it off
      if (prev[sound.id] !== undefined) {
        return {};
      }
      // Otherwise, activate ONLY this single background sound (replaces previous selection)
      return {
        [sound.id]: sound.defaultVolume ?? 0.25
      };
    });
    setIsBgMasterPaused(false);
  };

  const handleSoundVolumeChange = (soundId: string, volume: number) => {
    setActiveBgSounds((prev) => ({
      ...prev,
      [soundId]: volume
    }));
  };

  const handleTurnOffAllBgSounds = () => {
    setActiveBgSounds({});
    setIsBgMasterPaused(false);
  };

  // Sleep Timer Countdown Sync Effect
  useEffect(() => {
    if (sleepTimerMinutes !== null && sleepTimerMinutes > 0 && isPlaying) {
      const totalSec = sleepTimerMinutes * 60;
      setTimerRemainingSec(totalSec);

      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);

      sleepTimerIntervalRef.current = setInterval(() => {
        setTimerRemainingSec((prev) => {
          if (prev === null || prev <= 1) {
            if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
            if (audioRef.current) audioRef.current.pause();
            Object.values(bgAudioElementsRef.current).forEach((el) => el.pause());
            Object.values(synthsRef.current).forEach((synth) => synth.stop());
            setIsPlaying(false);
            setSleepTimerMinutes(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    }

    return () => {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    };
  }, [sleepTimerMinutes, isPlaying]);

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

  // Setup Media Session API for Background Playback & Lock Screen / Notification Controls
  useEffect(() => {
    if ('mediaSession' in navigator && selectedSurah && selectedQari) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${selectedSurah.name} (${selectedSurah.arabicName})`,
        artist: selectedQari.name,
        album: 'আল-কুরআনুল কারীম (Tilawat)',
        artwork: [
          { src: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=512&h=512&fit=crop&q=80', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        if (audioRef.current) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.warn(e));
        }
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        handlePrev();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        handleNext();
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(audioRef.current.currentTime - (details.seekOffset || 10), 0);
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        if (audioRef.current && audioRef.current.duration) {
          audioRef.current.currentTime = Math.min(audioRef.current.currentTime + (details.seekOffset || 10), audioRef.current.duration);
        }
      });
    }
  }, [selectedSurah, selectedQari]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

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

  // Play a custom uploaded Tilawat Audio
  const playCustomAudio = (customAudio: CustomTilawatAudio) => {
    fallbackAttemptRef.current = 0;
    const foundSurah = ALL_SURAHS.find(s => s.number === customAudio.surahNumber) || {
      number: customAudio.surahNumber,
      name: customAudio.surahName,
      englishName: customAudio.title,
      arabicName: customAudio.title,
      versesCount: 0,
      revelationType: 'Meccan' as const
    };
    const foundQari: Qari = {
      id: customAudio.qariId || 'custom_qari_' + customAudio.id,
      name: customAudio.qariName,
      arabicName: customAudio.qariName,
      country: 'বাংলাদেশ',
      serverUrl: '',
      listens: 'Custom',
      initials: customAudio.qariName.slice(0, 2),
      image: customAudio.qariImage || '',
      bio: customAudio.description || 'কাস্টম আপলোডকৃত তিলাওয়াত'
    };
    setSelectedSurah(foundSurah as Surah);
    setSelectedQari(foundQari);
    getMediaUrl(customAudio.id, customAudio.audioUrl).then((src) => {
      startAudioPlayback(src || customAudio.audioUrl);
    }).catch(() => {
      startAudioPlayback(customAudio.audioUrl);
    });
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

  // Filtered lists (Memoized for high performance)
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return SURAH_LIST;
    const q = searchQuery.toLowerCase().trim();
    return SURAH_LIST.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.bengaliMeaning.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    );
  }, [searchQuery]);

  return (
    <div id="tilawat-library-root" className="relative w-full min-h-screen bg-[#0b1320] text-white font-sans select-none overflow-x-hidden pb-32">
      {/* Hidden Audio Engine */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="auto"
        playsInline
        onPlay={() => {
          setIsPlaying(true);
          setIsAudioLoading(false);
          if (audioRef.current && selectedVoiceStyle.id !== 'natural') {
            try {
              if (!voiceEffectProcessorRef.current) {
                voiceEffectProcessorRef.current = new VoiceEffectDSP();
              }
              voiceEffectProcessorRef.current.init(audioRef.current);
              voiceEffectProcessorRef.current.applyStyle(selectedVoiceStyle, voiceEffectStrength);
            } catch (err) {
              console.warn('Voice effect init notice:', err);
            }
          }
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
            const dur = Math.floor(audioRef.current.duration);
            lastAudioDurationRef.current = dur;
            setDuration(dur);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const cur = Math.floor(audioRef.current.currentTime);
            if (cur !== lastAudioTimeRef.current) {
              lastAudioTimeRef.current = cur;
              setCurrentTime(cur);
            }
            if (audioRef.current.duration && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
              const dur = Math.floor(audioRef.current.duration);
              if (dur !== lastAudioDurationRef.current) {
                lastAudioDurationRef.current = dur;
                setDuration(dur);
              }
            }
          }
        }}
        onEnded={handleNext}
        onError={handleAudioError}
        loop={isLooping}
      />

      {/* =========================================================================
          VIEW MODE 1: PLAYLIST DETAIL VIEW (WHEN A PLAYLIST IS SELECTED)
         ========================================================================= */}
      {selectedPlaylist ? (
        <div className="w-full">
          {/* Top Bar for Playlist Details */}
          <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm">
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <h1 className="text-lg font-black text-white tracking-wide text-center truncate max-w-[200px]">
              {selectedPlaylist.title}
            </h1>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowCreatePlaylistModal(true)}
                className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center border border-slate-800 hover:bg-slate-700 hover:text-white"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center border border-slate-800 hover:bg-slate-700 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Playlist Detail Header Card */}
          <div className="p-4 space-y-6">
            <div className="flex items-start gap-4">
              {/* Cover Image */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-emerald-500/50/30 shadow-xl relative">
                <img
                  src={selectedPlaylist.coverImage}
                  alt={selectedPlaylist.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
                <p className="text-[11px] text-slate-400">
                  তৈরি: {selectedPlaylist.createdDate}
                </p>
                <p className="text-xs text-slate-400 pt-1 line-clamp-2 leading-relaxed">
                  {selectedPlaylist.description}
                </p>

                {/* Action Buttons: Shuffle Play, Heart, Share */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleShufflePlay(selectedPlaylist)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>সাফল প্লে</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(999)}
                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  <button className="w-8 h-8 rounded-full bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Track List Items */}
            <div className="space-y-2">
              {selectedPlaylist.tracks.map((track, idx) => {
                const isCurrentPlaying = selectedSurah.number === track.surahNumber && isPlaying;
                return (
                  <motion.div
                    key={track.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => playPlaylistTrack(selectedPlaylist, idx)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isCurrentPlaying 
                        ? 'bg-emerald-600/10 border-emerald-400 shadow-sm' 
                        : 'bg-slate-900 border-slate-800/80 hover:bg-slate-900 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* Reorder Grip Handle */}
                      <button className="text-slate-400 hover:text-slate-400 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </button>

                      {/* Number or Equalizer Waves */}
                      <div className="w-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        {isCurrentPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-0.5 bg-emerald-600 animate-pulse h-full rounded-full" />
                            <span className="w-0.5 bg-emerald-600 animate-pulse h-2 rounded-full" />
                            <span className="w-0.5 bg-emerald-600 animate-pulse h-3.5 rounded-full" />
                          </div>
                        ) : (
                          <span className={`${idx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                            {idx + 1}.
                          </span>
                        )}
                      </div>

                      {/* Surah Title & Qari Name */}
                      <div className="overflow-hidden">
                        <h4 className={`text-sm font-bold truncate ${isCurrentPlaying ? 'text-emerald-400 font-black' : 'text-white'}`}>
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
                        className="text-slate-400 hover:text-white p-1"
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
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-400 py-2.5 px-5 rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/50/30 active:scale-95 transition-all cursor-pointer shadow-sm"
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
           ========================================================================= */
        <div>
          {/* Top App Bar */}
          <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-800/90 shadow-sm">
            <div className="flex items-center gap-3">
              {onBack ? (
                <button
                  onClick={onBack}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-800 cursor-pointer"
                  title="ড্যাশবোর্ডে ফিরে যান"
                >
                  <ArrowLeft className="w-5 h-5 text-emerald-400" />
                </button>
              ) : (
                <button
                  onClick={() => setShowQariModal(true)}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-800 cursor-pointer"
                >
                  <Menu className="w-5 h-5 text-white" />
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
                    ? 'bg-emerald-600/20 text-emerald-400 border-slate-800' 
                    : 'bg-slate-800 text-white border-slate-800 hover:bg-slate-700'
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
                className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 shadow-sm"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="প্লেলিস্ট, ক্বারী বা সূরা খুঁজুন..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-slate-900 transition-all shadow-inner"
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

          {/* TAB 1: TILAWAT LIBRARY HOME DASHBOARD */}
          {activeTab === 'home' && (
            <main className="px-4 pt-3 space-y-5 pb-20">
              {/* 1. HERO SLIDE BANNER */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {bannerList.length > 0 && (() => {
                    const currentBanner = bannerList[heroSlide % bannerList.length] || bannerList[0];
                    if (!currentBanner) return null;
                    return (
                      <motion.div
                        key={currentBanner.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => handleBannerClick(currentBanner)}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-950 border border-slate-800/40 p-5 shadow-xl text-white cursor-pointer group hover:border-emerald-500/50 transition-all duration-300"
                      >
                        {/* Islamic Geometric Pattern Backdrop */}
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-700/50 to-transparent pointer-events-none" />
                        {currentBanner.imageUrl && (
                          <div 
                            className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none" 
                            style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
                          />
                        )}

                        <div className="relative z-10 flex items-center justify-between gap-2">
                          {/* Left Hero Texts & Action */}
                          <div className="space-y-2.5 max-w-[62%]">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/30 backdrop-blur-md border border-slate-800/30 text-white text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                              <span>আজকের তিলাওয়াত</span>
                            </div>

                            <h2 className="text-lg font-black text-white leading-tight tracking-tight">
                              {currentBanner.title}
                            </h2>

                            <p className="text-xs text-emerald-400 font-medium leading-relaxed">
                              {currentBanner.subtitle || 'মধুর ও গভীর কণ্ঠে তিলাওয়াত'}
                            </p>

                            <div className="pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBannerClick(currentBanner);
                                }}
                                className="inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-slate-900 hover:bg-emerald-600/10 text-white text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                              >
                                <span className="text-white font-bold">এখন শুনুন</span>
                                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Right Reciter Portrait with Islamic Arch Frame */}
                          <div className="relative w-28 h-32 flex-shrink-0 flex items-end justify-center">
                            <div className="absolute inset-0 bg-slate-900/10 rounded-t-full border-t border-x border-slate-800/20 blur-[1px]" />
                            {currentBanner.imageUrl ? (
                              <img 
                                src={currentBanner.imageUrl} 
                                alt={currentBanner.title} 
                                className="relative z-10 w-28 h-32 object-cover rounded-2xl shadow-xl border border-slate-800/30"
                              />
                            ) : (
                              renderQariAvatar(
                                QARI_LIST.find(q => q.id === currentBanner.qariId) || { name: currentBanner.title, initials: 'QT' },
                                "relative z-10 w-28 h-32 object-cover rounded-2xl shadow-xl border border-slate-800/30",
                                "relative z-10 w-28 h-32 object-cover rounded-2xl shadow-xl border border-slate-800/30 text-3xl"
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Indicator Carousel Dots Under Hero */}
                <div className="flex items-center justify-center gap-1.5 pt-3">
                  {bannerList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === (heroSlide % bannerList.length) ? 'w-4 bg-emerald-600' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 2. POPULAR QARIS SECTION: জনপ্রিয় ক্বারী */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white tracking-wide">
                    জনপ্রিয় ক্বারী
                  </h3>
                  <button
                    onClick={() => setShowQariModal(true)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-400 transition-colors flex items-center gap-0.5 cursor-pointer"
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
                        ? 'bg-emerald-600/10 border-2 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900 border border-slate-800/80 hover:bg-slate-900 shadow-sm'
                    }`}
                  >
                    {/* Green Star Badge on top right */}
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600/20 border border-slate-800 flex items-center justify-center shadow">
                      <Star className="w-2.5 h-2.5 text-emerald-400 fill-emerald-500" />
                    </div>

                    {/* Avatar with Circular Ring & Glowing Dot */}
                    <div className="relative mt-1 mb-2">
                      {renderQariAvatar(
                        QARI_LIST[0],
                        "w-14 h-14 rounded-full object-cover border-2 border-emerald-500/50 shadow-md p-0.5",
                        "w-14 h-14 rounded-full text-sm p-0.5"
                      )}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-slate-800 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse" />
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
                        ? 'bg-emerald-600/10 border-2 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900 border border-slate-800/80 hover:bg-slate-900 shadow-sm'
                    }`}
                  >
                    <div className="relative mt-1 mb-2">
                      {renderQariAvatar(
                        QARI_LIST[2],
                        "w-14 h-14 rounded-full object-cover border border-slate-800 shadow",
                        "w-14 h-14 rounded-full text-sm"
                      )}
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
                        ? 'bg-emerald-600/10 border-2 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900 border border-slate-800/80 hover:bg-slate-900 shadow-sm'
                    }`}
                  >
                    <div className="relative mt-1 mb-2">
                      {renderQariAvatar(
                        QARI_LIST[1],
                        "w-14 h-14 rounded-full object-cover border border-slate-800 shadow",
                        "w-14 h-14 rounded-full text-sm"
                      )}
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
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-400 transition-colors flex items-center gap-0.5 cursor-pointer"
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
                    className="relative p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:bg-slate-900 shadow-sm text-center flex flex-col items-center justify-between cursor-pointer transition-all"
                  >
                    {/* Top Left 'নতুন' Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-emerald-600/20 border border-slate-800 text-emerald-400 text-[9px] font-bold">
                      নতুন
                    </div>

                    <div className="relative mt-3 mb-2">
                      {renderQariAvatar(
                        QARI_LIST[5] || { name: 'ইউনুস সুলহিয়াস', initials: 'YS' },
                        "w-14 h-14 rounded-full object-cover border border-slate-800 shadow",
                        "w-14 h-14 rounded-full text-sm"
                      )}
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
                    className="relative p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:bg-slate-900 shadow-sm text-center flex flex-col items-center justify-between cursor-pointer transition-all"
                  >
                    {/* Top Left 'নতুন' Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-emerald-600/20 border border-slate-800 text-emerald-400 text-[9px] font-bold">
                      নতুন
                    </div>

                    {/* Top Right Decorative Emblem */}
                    <div className="absolute top-2 right-2 text-emerald-400 opacity-80">
                      <Sparkles className="w-3 h-3" />
                    </div>

                    <div className="relative mt-3 mb-2">
                      {renderQariAvatar(
                        QARI_LIST[6] || { name: 'আব্দুল রশীদ আলী সুফি', initials: 'AS' },
                        "w-14 h-14 rounded-full object-cover border border-slate-800 shadow",
                        "w-14 h-14 rounded-full text-sm"
                      )}
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
                    className="relative p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:bg-slate-900 shadow-sm text-center flex flex-col items-center justify-between cursor-pointer transition-all"
                  >
                    {/* Top Right Decorative Emblem */}
                    <div className="absolute top-2 right-2 text-emerald-400 opacity-80">
                      <Sparkles className="w-3 h-3" />
                    </div>

                    <div className="relative mt-3 mb-2">
                      {renderQariAvatar(
                        QARI_LIST[7] || { name: 'ফারেস আব্বাদ', initials: 'FA' },
                        "w-14 h-14 rounded-full object-cover border border-slate-800 shadow",
                        "w-14 h-14 rounded-full text-sm"
                      )}
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
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/50/30 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
                      পূর্ণ কুরআন
                    </span>
                  </motion.div>

                  {/* Category 2: জুজ অনুযায়ী */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCategoryModal('juz')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2 border border-teal-500/20 group-hover:scale-105 transition-transform">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
                      জুজ অনুযায়ী
                    </span>
                  </motion.div>

                  {/* Category 3: সূরা অনুযায়ী */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCategoryModal('surah')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 border border-purple-500/20 group-hover:scale-105 transition-transform">
                      <Music className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
                      সূরা অনুযায়ী
                    </span>
                  </motion.div>

                  {/* Category 4: শেষ ৭ দিন */}
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowCategoryModal('recent')}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 border border-sky-500/20 group-hover:scale-105 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
                      শেষ ৭ দিন
                    </span>
                  </motion.div>
                </div>
              </section>

              {/* SPECIAL ADMIN UPLOADED AUDIOS SECTION */}
              {customTilawatAudios && customTilawatAudios.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                      <h3 className="text-base font-black text-white tracking-wide">
                        সরাসরি আপলোডকৃত বিশেষ তিলাওয়াত
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/50/30">
                      {customTilawatAudios.length} টি অডিও
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {customTilawatAudios.map((cAudio) => {
                      const isCurrent = audioRef.current?.src === cAudio.audioUrl && isPlaying;
                      return (
                        <motion.div
                          key={cAudio.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => playCustomAudio(cAudio)}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-600/10/90 border-emerald-500/50 shadow-md'
                              : 'bg-slate-900 border-slate-800/90 hover:border-slate-800 hover:bg-slate-900/80 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {cAudio.qariImage ? (
                              <img
                                src={cAudio.qariImage}
                                alt={cAudio.qariName}
                                className={`w-11 h-11 rounded-2xl object-cover border flex-shrink-0 transition-transform shadow-sm ${
                                  isCurrent ? 'border-emerald-500/50 ring-2 ring-[#12A878] scale-105' : 'border-slate-800'
                                }`}
                              />
                            ) : (
                              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-transform ${
                                isCurrent ? 'bg-emerald-600 text-white shadow-md scale-105' : 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/50/30'
                              }`}>
                                <Volume2 className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="px-2 py-0.2 rounded-md bg-emerald-600/20 text-emerald-400 text-[10px] font-bold">
                                  সূরা {cAudio.surahNumber}: {cAudio.surahName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {cAudio.duration || '03:30'}
                                </span>
                              </div>
                              <h4 className={`text-sm font-black truncate ${isCurrent ? 'text-emerald-400 font-black' : 'text-white'}`}>
                                {cAudio.title}
                              </h4>
                              <p className="text-xs text-slate-400 truncate">
                                ক্বারী: <span className="text-white font-semibold">{cAudio.qariName}</span>
                                {cAudio.description && ` • ${cAudio.description}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playCustomAudio(cAudio);
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                                isCurrent 
                                  ? 'bg-emerald-600 text-white animate-pulse' 
                                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
                              }`}
                            >
                              {isCurrent ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

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
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-400 transition-colors flex items-center gap-0.5 cursor-pointer"
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
                            ? 'bg-emerald-600/10 border-emerald-500/50 shadow-sm'
                            : 'bg-slate-900 border-slate-800/80 hover:border-slate-800 hover:bg-slate-900/80 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isCurrent ? 'bg-emerald-600 text-white font-black' : 'bg-slate-800 text-white border border-slate-800'
                          }`}>
                            {surah.number}
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${isCurrent ? 'text-emerald-400 font-black' : 'text-white'}`}>
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
                              isCurrent ? 'bg-emerald-600 text-white' : 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white'
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

              {/* ----------------- 1. PLAYLIST HERO CARD ----------------- */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-950 border border-slate-800/40 p-5 shadow-xl text-white">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-3 max-w-[62%]">
                    {/* Music note icon with equalizing bars */}
                    <div className="w-10 h-10 rounded-2xl bg-slate-900/10 text-white flex items-center justify-center border border-slate-800/20">
                      <ListMusic className="w-5 h-5" />
                    </div>

                    <h2 className="text-base font-black text-white leading-snug">
                      আপনার প্রিয় তিলাওয়াতগুলো এক জায়গায় গুছিয়ে শুনুন
                    </h2>

                    <button
                      onClick={() => setShowCreatePlaylistModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-emerald-600/10 text-white text-xs font-black shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3] text-emerald-400" />
                      <span className="text-white">নতুন প্লেলিস্ট তৈরি করুন</span>
                    </button>
                  </div>

                  {/* Glowing Quran on Rehal Artwork */}
                  <div className="relative w-28 h-32 flex-shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/20 rounded-full blur-xl" />
                    <img
                      src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&auto=format&fit=crop&q=80"
                      alt="পবিত্র কুরআন"
                      className="relative z-10 w-full h-full object-cover rounded-2xl border border-slate-800/30 shadow-xl"
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
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-2 border border-emerald-500/50/30 group-hover:scale-105 transition-transform">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
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
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2 border border-teal-500/20 group-hover:scale-105 transition-transform">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
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
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 border border-sky-500/20 group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
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
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 shadow-sm text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 border border-purple-500/20 group-hover:scale-105 transition-transform">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
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
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-400 transition-colors flex items-center gap-0.5 cursor-pointer"
                  >
                    সব দেখুন
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* List of Playlists */}
                <div className="space-y-3">
                  {playlists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlaylist(playlist)}
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm"
                    >
                      {/* Left Thumbnail & Texts */}
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-emerald-500/50/30">
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
                          <p className="text-[11px] text-slate-400 font-medium">
                            মোট সময়: {playlist.totalTime}
                          </p>
                        </div>
                      </div>

                      {/* Right Play Button & Three Dots */}
                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleShufflePlay(playlist)}
                          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-md cursor-pointer border-none"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>

                        <button className="text-slate-400 hover:text-white p-1">
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
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-400 hover:bg-emerald-600/10/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  {renderQariAvatar(
                    selectedQari,
                    "w-11 h-11 rounded-full object-cover border-2 border-emerald-500/50 shadow-sm",
                    "w-11 h-11 rounded-full text-xs"
                  )}
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">বর্তমান ক্বারী</div>
                    <div className="text-sm font-black text-white">{selectedQari.name}</div>
                    <div className="text-xs text-slate-400">{selectedQari.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-600/20 px-3 py-1.5 rounded-full border border-slate-800">
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
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-900 shadow-sm'
                  }`}
                >
                  সকল ১১৪ সূরা
                </button>
                {displayTilawatAudios.length > 0 && (
                  <button
                    onClick={() => setViewCategoryMode('custom')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewCategoryMode === 'custom'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 text-emerald-400 border border-slate-800 hover:bg-emerald-600/10 shadow-sm'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>আপলোডকৃত অডিও ({displayTilawatAudios.length})</span>
                  </button>
                )}
                <button
                  onClick={() => setViewCategoryMode('surah')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    viewCategoryMode === 'surah'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-900 shadow-sm'
                  }`}
                >
                  মাক্কী সূরা
                </button>
                <button
                  onClick={() => setViewCategoryMode('recent')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    viewCategoryMode === 'recent'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-900 shadow-sm'
                  }`}
                >
                  মাদানী সূরা
                </button>
                <button
                  onClick={() => setViewCategoryMode('juz')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    viewCategoryMode === 'juz'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-900 shadow-sm'
                  }`}
                >
                  জুজ / পারা (১-৩০)
                </button>
              </div>

              {/* Custom Audio Explorer View */}
              {viewCategoryMode === 'custom' ? (
                <div className="space-y-2.5">
                  {displayTilawatAudios.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 shadow-sm">
                      কোনো আপলোডকৃত অডিও পাওয়া যায়নি
                    </div>
                  ) : (
                    displayTilawatAudios.map((cAudio) => {
                      const isCurrent = audioRef.current?.src === cAudio.audioUrl && isPlaying;
                      return (
                        <div
                          key={cAudio.id}
                          onClick={() => playCustomAudio(cAudio)}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-600/10 border-emerald-500/50 shadow-sm'
                              : 'bg-slate-900 border-slate-800/80 hover:bg-slate-900 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {cAudio.qariImage ? (
                              <img
                                src={cAudio.qariImage}
                                alt={cAudio.qariName}
                                className={`w-11 h-11 rounded-xl object-cover border flex-shrink-0 shadow-sm ${
                                  isCurrent ? 'border-emerald-500/50 ring-2 ring-[#12A878]' : 'border-slate-800'
                                }`}
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                isCurrent ? 'bg-emerald-600 text-white' : 'bg-emerald-600/20 text-emerald-400'
                              }`}>
                                <Volume2 className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 font-bold">
                                  সূরা {cAudio.surahNumber}: {cAudio.surahName}
                                </span>
                                <span className="text-[10px] text-slate-400">{cAudio.duration}</span>
                              </div>
                              <h4 className={`text-sm font-black truncate mt-0.5 ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                                {cAudio.title}
                              </h4>
                              <p className="text-xs text-slate-400 truncate">ক্বারী: {cAudio.qariName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playCustomAudio(cAudio);
                              }}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                                isCurrent ? 'bg-emerald-600 text-white' : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              {isCurrent ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : viewCategoryMode === 'juz' ? (
                <div className="space-y-2">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                    <div
                      key={juzNum}
                      onClick={() => {
                        const targetSurah = ALL_SURAHS.find(s => s.juzNumber === juzNum) || ALL_SURAHS[0];
                        playSurah(targetSurah);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-between cursor-pointer transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/20">
                          {juzNum}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">পারা / জুজ {juzNum}</h4>
                          <p className="text-xs text-slate-400">পবিত্র কুরআনের {juzNum}ম অংশ</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
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
                            ? 'bg-emerald-600/10 border-emerald-500/50 shadow-sm'
                            : 'bg-slate-900 border-slate-800/80 hover:bg-slate-900 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isCurrent ? 'bg-emerald-600 text-white font-black' : 'bg-slate-800 text-white border border-slate-800'
                          }`}>
                            {surah.number}
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${isCurrent ? 'text-emerald-400 font-black' : 'text-white'}`}>
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
                              isCurrent ? 'bg-emerald-600 text-white' : 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white'
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
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
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
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <main className="px-4 pt-3 space-y-4">
              <h3 className="text-base font-black text-white tracking-wide">
                তিলাওয়াত সেটিংস
              </h3>
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800/80 shadow-sm space-y-4">
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
          STICKY BOTTOM AUDIO PLAYER BAR
         ========================================================================= */}
      {true && (
        <div className="fixed bottom-[68px] left-0 right-0 z-40 px-3 pb-1">
          <motion.div
            layoutId="tilawat-sticky-player"
            onClick={() => setShowFullPlayer(true)}
            className="w-full max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-2.5 shadow-xl flex items-center justify-between cursor-pointer"
          >
          {/* Reciter Avatar & Surah Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-400 shadow-sm">
              {renderQariAvatar(
                selectedQari,
                "w-full h-full object-cover",
                "w-full h-full text-xs"
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
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

          {/* Controls: Prev, Play/Pause, Next, Queue */}
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
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 flex items-center justify-center transition-all shadow-md cursor-pointer border-none"
            >
              {isAudioLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current text-white" />
              ) : (
                <Play className="w-5 h-5 fill-current text-white ml-0.5" />
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
      )}

      {/* =========================================================================
          BOTTOM 5-TAB APP NAVIGATION BAR
         ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 px-4 py-2 flex items-center justify-around shadow-lg">
        {/* Tab 1: হোম */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">হোম</span>
        </button>

        {/* Tab 2: তিলাওয়াত */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('tilawat');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'tilawat' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px] font-medium">তিলাওয়াত</span>
        </button>

        {/* Tab 3: প্লেলিস্ট */}
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveTab('playlist');
          }}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer border-none bg-transparent ${
            activeTab === 'playlist' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
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
            activeTab === 'bookmark' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">বুকমার্ক</span>
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4"
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
                  <label className="text-xs font-bold text-white block mb-1">
                    প্লেলিস্টের নাম
                  </label>
                  <input
                    type="text"
                    value={newPlaylistTitle}
                    onChange={(e) => setNewPlaylistTitle(e.target.value)}
                    placeholder="যেমন: তাহাজ্জুদের তিলাওয়াত..."
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white block mb-1">
                    সংক্ষিপ্ত বিবরণ (অপশনাল)
                  </label>
                  <textarea
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    placeholder="প্লেলিস্ট সম্পর্কে কিছু লিখুন..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreatePlaylistModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-md"
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md max-h-[80vh] bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl flex flex-col"
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
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{surah.number}. {surah.name}</h4>
                      <p className="text-xs text-slate-400">{surah.bengaliMeaning} • {surah.totalAyat} আয়াত</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-600/10 px-2 py-1 rounded-lg border border-emerald-500/50/30">
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
            className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col p-6 overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFullPlayer(false)}
                className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-800 shadow-sm cursor-pointer hover:bg-slate-900 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-center">
                <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
                  প্রধান ক্বারী
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {selectedSurah.name}
                </h3>
              </div>

              <button
                onClick={() => toggleFavorite(selectedSurah.number)}
                className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-400 flex items-center justify-center border border-slate-800 shadow-sm cursor-pointer hover:bg-slate-900 transition-colors"
              >
                <Heart className={`w-6 h-6 ${favorites.includes(selectedSurah.number) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Big Disc / Artwork */}
            <div className="flex-1 flex flex-col items-center justify-center my-2 relative">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center">
                {/* Decorative rings similar to screenshot */}
                <div className="absolute inset-0 rounded-full border border-emerald-500/50/20 border-dashed" />
                <div className="absolute inset-2 rounded-full border border-emerald-500/50/10 border-dotted" />
                
                {/* Visualizer bars logic could be complex to perfectly replicate the image, but we can do a static decorative ring or animated bars. I'll stick to a simple clean ring for now as the screenshot has vertical bars on the side and a dotted circle. */}
                <div className="absolute -left-16 sm:-left-20 right-auto h-32 w-10 flex items-center justify-center gap-1.5 opacity-60">
                  {/* Decorative Left Visualizer */}
                  {[2, 4, 3, 6, 9, 7, 4, 2].map((h, i) => (
                    <div key={`l-${i}`} className="w-1.5 bg-emerald-500 rounded-full" style={{ height: `${h * 12}px` }} />
                  ))}
                </div>
                <div className="absolute left-auto -right-16 sm:-right-20 h-32 w-10 flex items-center justify-center gap-1.5 opacity-60">
                  {/* Decorative Right Visualizer */}
                  {[3, 5, 8, 10, 6, 4, 3, 2].map((h, i) => (
                    <div key={`r-${i}`} className="w-1.5 bg-emerald-500 rounded-full" style={{ height: `${h * 12}px` }} />
                  ))}
                </div>

                {/* Progress arc approximation using border */}
                <div className="absolute inset-4 rounded-full border-[6px] border-emerald-500/50/10" />
                <div className="absolute inset-4 rounded-full border-[6px] border-emerald-500/50 border-t-transparent border-r-transparent border-b-transparent transform rotate-45" />

                <div className={`w-56 h-56 rounded-full overflow-hidden border-8 border-slate-800 shadow-lg z-10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                  {renderQariAvatar(
                    selectedQari,
                    "w-full h-full object-cover",
                    "w-full h-full text-4xl"
                  )}
                </div>
              </div>

              {/* Active Background Sound Floating Chip (Matching screenshot) */}
              {activeBgSoundsList.length > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setShowBgSoundSheet(true)}
                  className="mt-8 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-white text-sm font-medium flex items-center gap-3 cursor-pointer shadow-md hover:bg-slate-900 transition-all"
                >
                  <div className="flex items-center gap-1 text-emerald-400">
                    {activeBgSoundsList.slice(0, 3).map(s => (
                      <CloudRain key={s.id} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span>
                    {activeBgSoundsList.length === 1 
                      ? `${activeBgSoundsList[0].name} (${activeBgSoundsList[0].bengaliName}) • ${Math.round((activeBgSounds[activeBgSoundsList[0].id] || 0) * 100)}%`
                      : `${activeBgSoundsList.length}টি ব্যাকগ্রাউন্ড সাউন্ড সক্রিয়`
                    }
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBgMasterPaused(!isBgMasterPaused);
                    }}
                    className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 transition-transform active:scale-90 shadow-sm ml-1"
                  >
                    {isBgMasterPaused ? <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                  </button>
                </motion.div>
              )}

              {/* Active Voice Style Floating Chip */}
              {selectedVoiceStyle.id !== 'natural' && activeBgSoundsList.length === 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setShowVoiceStyleSheet(true)}
                  className="mt-8 px-5 py-2.5 rounded-full bg-emerald-600/10/80 border border-emerald-500/50/20 text-white text-sm font-semibold flex items-center gap-3 cursor-pointer shadow-sm hover:bg-emerald-600/10 transition-all"
                >
                  <span className="text-xl">{selectedVoiceStyle.icon}</span>
                  <span>
                    ভয়েস: {selectedVoiceStyle.bengaliName} ({Math.round(voiceEffectStrength * 100)}%)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVoiceStyle(VOICE_STYLES_LIST[0]);
                    }}
                    className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500/20 ml-1 transition-transform active:scale-90"
                    title="আসল কণ্ঠে রিসেট"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}

              <div className="text-center mt-8 space-y-2">
                <h2 className="text-3xl font-black text-white tracking-wide">
                  {selectedSurah.number}. {selectedSurah.name}
                </h2>
                <p className="text-lg text-emerald-400 font-bold">
                  {selectedQari.name}
                </p>
                <p className="text-sm text-slate-400 font-medium">
                  {selectedSurah.arabicName} • {selectedSurah.bengaliMeaning}
                </p>
              </div>
            </div>

            {/* Slider / Time bar */}
            <div className="space-y-2 mb-8 px-2 mt-4">
              <div className="flex justify-between text-sm text-slate-400 font-medium mb-3">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="relative w-full h-1.5 bg-slate-800 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-emerald-600 rounded-full" 
                  style={{ width: `${(currentTime / Math.max(duration, 1)) * 100}%` }}
                />
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 -mt-2 w-4 h-4 bg-emerald-600 rounded-full shadow-md pointer-events-none"
                  style={{ left: `calc(${(currentTime / Math.max(duration, 1)) * 100}% - 8px)` }}
                />
              </div>
            </div>

            {/* Main Playback Controls */}
            <div className="flex items-center justify-between px-2 mb-10">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm border border-slate-800 ${isShuffle ? 'bg-emerald-600/10 text-emerald-400' : 'bg-slate-900 text-emerald-400 hover:bg-slate-900'}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrev}
                className="w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-sm flex items-center justify-center hover:bg-slate-900 border border-slate-800"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-[-12px] bg-emerald-600/10 rounded-full" />
                <button
                  onClick={togglePlayPause}
                  disabled={isAudioLoading}
                  className="relative z-10 w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(8,127,91,0.3)] hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isAudioLoading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>
              </div>

              <button
                onClick={handleNext}
                className="w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-sm flex items-center justify-center hover:bg-slate-900 border border-slate-800"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm border border-slate-800 ${isLooping ? 'bg-emerald-600/10 text-emerald-400' : 'bg-slate-900 text-emerald-400 hover:bg-slate-900'}`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom 5 Action Buttons */}
            <div className="bg-slate-900 rounded-3xl p-2 border border-slate-800 flex items-center justify-between mb-2 shadow-[0_-4px_20px_rgb(0,0,0,0.03)]">
              {/* Loop */}
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${
                  isLooping ? 'bg-emerald-600/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Repeat className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-bold">লুপ</span>
                {isLooping && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />}
              </button>

              {/* Voice Style */}
              <button
                onClick={() => setShowVoiceStyleSheet(true)}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${
                  selectedVoiceStyle.id !== 'natural' ? 'bg-emerald-600/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Mic className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-bold">ভয়েস</span>
                {selectedVoiceStyle.id !== 'natural' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />}
              </button>

              {/* Timer */}
              <button
                onClick={() => setShowSleepTimerModal(true)}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${
                  sleepTimerMinutes !== null ? 'bg-emerald-600/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Clock className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-bold">টাইমার</span>
                {sleepTimerMinutes !== null && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />}
              </button>

              {/* Playlist */}
              <button
                onClick={() => setShowAddTrackModal(true)}
                className="flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all text-slate-400 hover:text-white hover:bg-slate-900"
              >
                <ListMusic className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-bold">প্লেলিস্ট</span>
              </button>

              {/* Background Sound */}
              <button
                onClick={() => setShowBgSoundSheet(true)}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl transition-all ${
                  activeBgSoundsList.length > 0 ? 'bg-emerald-600/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Volume2 className="w-6 h-6 mb-1.5" />
                <span className="text-xs font-bold">সাউন্ড</span>
                {activeBgSoundsList.length > 0 && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          BACKGROUND SOUND BOTTOM SHEET MODAL (GRANULAR VOLUME & MULTI-TRACK MIXER)
         ========================================================================= */}
      <AnimatePresence>
        {showBgSoundSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center sm:items-center p-0 sm:p-4"
            onClick={() => setShowBgSoundSheet(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-lg bg-slate-900 text-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 border-t sm:border border-slate-800 shadow-2xl flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                      <CloudRain className="w-6 h-6 text-emerald-400" />
                      <span>Background Sound System</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      পছন্দের ১টি ব্যাকগ্রাউন্ড সাউন্ড নির্বাচন করুন (১টি ভয়েস ইফেক্ট + ১টি ব্যাকগ্রাউন্ড সাউন্ড)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBgSoundSheet(false)}
                    className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Master Controls Header if active sounds exist */}
                {activeBgSoundsList.length > 0 && (
                  <div className="mt-4 p-4 bg-emerald-600/10/50 rounded-2xl border border-emerald-500/50/20 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" />
                        <span>মাস্টার ভলিউম (সব সাউন্ড)</span>
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {Math.round(masterBgVolume * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={masterBgVolume}
                        onChange={(e) => setMasterBgVolume(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <button
                        onClick={handleTurnOffAllBgSounds}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-[11px] rounded-xl whitespace-nowrap cursor-pointer transition-all shadow-sm"
                      >
                        সব বন্ধ করুন
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs: All Sounds | My Mix */}
              <div className="flex items-center gap-2 mt-4 mb-3 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setBgTab('all')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    bgTab === 'all'
                      ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-800'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Sounds ({availableBgSounds.length})
                </button>
                <button
                  onClick={() => setBgTab('mix')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                    bgTab === 'mix'
                      ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-800'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Mix ({activeBgSoundsList.length})
                  {activeBgSoundsList.length > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 bg-emerald-600/20 text-emerald-400 font-black rounded-full text-[10px]">
                      {activeBgSoundsList.length}
                    </span>
                  )}
                </button>
              </div>

              {/* TAB 1: ALL SOUNDS GRID WITH INDIVIDUAL VOLUME SLIDERS */}
              {bgTab === 'all' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                  {availableBgSounds.map((sound) => {
                    const isSelected = activeBgSounds[sound.id] !== undefined;
                    const soundVol = activeBgSounds[sound.id] ?? (sound.defaultVolume ?? 0.25);

                    return (
                      <div
                        key={sound.id}
                        className={`relative p-4 rounded-2xl border flex flex-col justify-between transition-all shadow-sm ${
                          isSelected
                            ? 'bg-emerald-600/10/50 border-2 border-emerald-400'
                            : 'bg-slate-900 hover:bg-slate-900 border-slate-800'
                        }`}
                      >
                        {/* Sound Item Main Toggle */}
                        <div
                          onClick={() => handleToggleBgSound(sound)}
                          className="cursor-pointer flex flex-col items-center text-center space-y-1.5"
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                              ✓
                            </div>
                          )}
                          <span className="text-3xl mb-1">{sound.icon}</span>
                          <span className="text-sm font-bold text-white truncate w-full">
                            {sound.name}
                          </span>
                          <span className="text-xs text-slate-400 truncate w-full">
                            {sound.bengaliName}
                          </span>
                        </div>

                        {/* Individual Volume Slider directly inside active card */}
                        {isSelected && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 pt-3 border-t border-emerald-500/50/30 space-y-2"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                              <span>Volume</span>
                              <span className="font-mono">{Math.round(soundVol * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.01}
                              value={soundVol}
                              onChange={(e) => handleSoundVolumeChange(sound.id, Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: MY MIX VIEW (ACTIVE SOUNDS LIST WITH VOLUME CONTROL) */}
              {bgTab === 'mix' && (
                <div className="py-2 overflow-y-auto flex-1 space-y-3 pr-1">
                  {activeBgSoundsList.length === 0 ? (
                    <div className="text-center py-12 px-4 space-y-4 bg-slate-900 rounded-2xl border border-slate-800">
                      <CloudRain className="w-12 h-12 text-slate-400 mx-auto" />
                      <p className="text-sm font-bold text-slate-400 leading-relaxed">
                        কোনো ব্যাকগ্রাউন্ড সাউন্ড সক্রিয় নেই।<br />'All Sounds' ট্যাব থেকে আপনার পছন্দের সাউন্ড চালু করুন।
                      </p>
                      <button
                        onClick={() => setBgTab('all')}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl cursor-pointer transition-all shadow-sm"
                      >
                        সাউন্ড সিলেক্ট করুন
                      </button>
                    </div>
                  ) : (
                    activeBgSoundsList.map((sound) => {
                      const soundVol = activeBgSounds[sound.id] ?? 0.25;

                      return (
                        <div
                          key={sound.id}
                          className="p-4 bg-slate-900 rounded-2xl border-2 border-emerald-500/50/20 flex items-center justify-between gap-4 shadow-sm"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <span className="text-3xl shrink-0 p-3 bg-emerald-600/10 rounded-2xl">{sound.icon}</span>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{sound.name}</h4>
                              <p className="text-xs text-slate-400 truncate mt-0.5">{sound.bengaliName}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="flex flex-col items-end gap-2 w-28 sm:w-36">
                              <span className="text-[11px] font-mono font-bold text-emerald-400">
                                Vol: {Math.round(soundVol * 100)}%
                              </span>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={soundVol}
                                onChange={(e) => handleSoundVolumeChange(sound.id, Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                              />
                            </div>

                            <button
                              onClick={() => handleToggleBgSound(sound)}
                              className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 hover:border-rose-500/20 border border-transparent transition-colors cursor-pointer"
                              title="বন্ধ করুন"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Bottom Footer Actions */}
              <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setIsBgMasterPaused(!isBgMasterPaused)}
                  disabled={activeBgSoundsList.length === 0}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    activeBgSoundsList.length === 0
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : isBgMasterPaused
                      ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {isBgMasterPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                  <span>{isBgMasterPaused ? 'সব প্লে করুন' : 'সব পজ করুন'}</span>
                </button>

                <button
                  onClick={() => setShowBgSoundSheet(false)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  সম্পন্ন (Done)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          VOICE STYLE / VOICE EFFECT BOTTOM SHEET MODAL
         ========================================================================= */}
      <AnimatePresence>
        {showVoiceStyleSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center sm:items-center p-0 sm:p-4"
            onClick={() => setShowVoiceStyleSheet(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-lg bg-slate-900 text-white rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 border-t sm:border border-slate-800 shadow-2xl flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                      <Mic className="w-6 h-6 text-emerald-400" />
                      <span>Voice Style / Voice Effect</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      ক্বারী সাহেবের স্বাভাবিক পুরুষ কণ্ঠ বজায় রেখে বিভিন্ন অডিও টিউনিং নির্বাচন করুন
                    </p>
                  </div>
                  <button
                    onClick={() => setShowVoiceStyleSheet(false)}
                    className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Effect Intensity / Strength Slider if non-natural voice selected */}
                {selectedVoiceStyle.id !== 'natural' && (
                  <div className="mt-4 p-4 bg-emerald-600/10/50 rounded-2xl border border-emerald-500/50/20 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>ইফেক্ট স্ট্রেংথ / মাত্রা (Effect Strength)</span>
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {Math.round(voiceEffectStrength * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={voiceEffectStrength}
                        onChange={(e) => {
                          const newVol = Number(e.target.value);
                          setVoiceEffectStrength(newVol);
                          if (voiceEffectProcessorRef.current) {
                            voiceEffectProcessorRef.current.applyStyle(selectedVoiceStyle, newVol);
                          }
                        }}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <button
                        onClick={() => {
                          setSelectedVoiceStyle(VOICE_STYLES_LIST[0]);
                          setVoiceEffectStrength(1.0);
                          if (voiceEffectProcessorRef.current) {
                            voiceEffectProcessorRef.current.applyStyle(VOICE_STYLES_LIST[0], 1.0);
                          }
                        }}
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-bold text-[11px] rounded-xl whitespace-nowrap cursor-pointer transition-all shadow-sm"
                      >
                        আসল কণ্ঠে রিসেট
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 15 Voice Styles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 overflow-y-auto flex-1 pr-1 scrollbar-thin my-1">
                {VOICE_STYLES_LIST.map((style) => {
                  const isSelected = selectedVoiceStyle.id === style.id;

                  return (
                    <motion.div
                      key={style.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setSelectedVoiceStyle(style);
                        if (!voiceEffectProcessorRef.current) {
                          voiceEffectProcessorRef.current = new VoiceEffectDSP();
                        }
                        if (audioRef.current) {
                          voiceEffectProcessorRef.current.init(audioRef.current);
                          voiceEffectProcessorRef.current.applyStyle(style, voiceEffectStrength);
                        }
                      }}
                      className={`relative p-4 rounded-2xl border flex flex-col items-center justify-between text-center cursor-pointer transition-all shadow-sm ${
                        isSelected
                          ? 'bg-emerald-600/10/50 border-2 border-emerald-400'
                          : 'bg-slate-900 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                          ✓
                        </div>
                      )}

                      <div className="flex flex-col items-center space-y-1.5 w-full">
                        <span className="text-3xl mb-1">{style.icon}</span>
                        <span className="text-sm font-bold text-white truncate w-full">
                          {style.name}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 truncate w-full">
                          {style.bengaliName}
                        </span>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1.5 leading-tight">
                          {style.description}
                        </p>
                      </div>

                      {style.badge && (
                        <span className="mt-3 px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                          {style.badge}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between shrink-0">
                <div className="text-sm text-slate-400 flex items-center gap-2 min-w-0">
                  <span className="text-2xl p-2 bg-emerald-600/10 rounded-2xl shrink-0">{selectedVoiceStyle.icon}</span>
                  <div className="truncate">
                    <span className="font-bold text-white block truncate">
                      {selectedVoiceStyle.name} ({selectedVoiceStyle.bengaliName})
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      {selectedVoiceStyle.id === 'natural' ? 'স্বাভাবিক কণ্ঠ' : `ইফেক্ট মাত্রা: ${Math.round(voiceEffectStrength * 100)}%`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowVoiceStyleSheet(false)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-md shrink-0 ml-3"
                >
                  সম্পন্ন (Done)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          SLEEP TIMER MODAL
         ========================================================================= */}
      <AnimatePresence>
        {showSleepTimerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowSleepTimerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-300" />
                  Sleep Timer (টাইমার)
                </h3>
                <button
                  onClick={() => setShowSleepTimerModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 my-4">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSleepTimerMinutes(mins);
                      setShowSleepTimerModal(false);
                    }}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      sleepTimerMinutes === mins
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <span>{mins} মিনিট ({mins} Minutes)</span>
                    {sleepTimerMinutes === mins && <Check className="w-4 h-4" />}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setSleepTimerMinutes(null);
                    setTimerRemainingSec(null);
                    setShowSleepTimerModal(false);
                  }}
                  className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-rose-900/60 hover:bg-rose-900 border border-rose-700/60 text-white transition-all cursor-pointer text-center"
                >
                  টাইমার বন্ধ করুন (Turn Off Timer)
                </button>
              </div>
            </motion.div>
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl flex flex-col my-auto text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQariModal(false)}
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-black text-white tracking-wide">
                    Top Reciters
                  </h3>
                </div>
                <button
                  onClick={() => setShowQariModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="pt-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reciters"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto py-2 space-y-4 flex-1 pr-1">
                <div className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1">
                  This month
                </div>

                {/* #1 Top Reciter Featured Card (Yasser Al-Dosari) */}
                {(() => {
                  const qari1 = QARI_LIST[0];
                  if (!qari1) return null;
                  const isSelected = selectedQari.id === qari1.id;
                  return (
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedQari(qari1);
                        setShowQariModal(false);
                        playSurah(selectedSurah, qari1);
                      }}
                      className={`relative overflow-hidden rounded-3xl p-4 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-950 border-2 ${
                        isSelected ? 'border-emerald-400 shadow-lg' : 'border-slate-800 shadow-md'
                      } flex items-center justify-between cursor-pointer transition-all text-white`}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                      <div className="relative z-15 flex items-center gap-4">
                        <div className="relative">
                          {renderQariAvatar(
                            qari1,
                            "w-20 h-20 rounded-full object-cover border-2 border-slate-800 shadow-xl p-0.5",
                            "w-20 h-20 rounded-full text-xl p-0.5"
                          )}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] shadow border border-slate-800">
                            1
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-white">
                            {qari1.name}
                          </h4>
                          <p className="text-xs text-emerald-400 font-bold">
                            {qari1.listens || '6.0M listens'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {qari1.country} • {qari1.arabicName}
                          </p>
                        </div>
                      </div>
                      <div className="relative z-15 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5 text-emerald-400" />
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Grid for Ranks 2 to 13 */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {QARI_LIST.slice(1).map((qari, idx) => {
                    const rank = idx + 2;
                    const isSelected = selectedQari.id === qari.id;
                    return (
                      <motion.div
                        key={qari.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedQari(qari);
                          setShowQariModal(false);
                          playSurah(selectedSurah, qari);
                        }}
                        className={`relative p-3 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-600/10 border-2 border-emerald-500/50 shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 shadow-sm'
                        }`}
                      >
                        {/* Avatar or Initials Badge */}
                        <div className="relative mb-2 mt-1">
                          {renderQariAvatar(
                            qari,
                            `w-16 h-16 rounded-full object-cover border-2 ${isSelected ? 'border-emerald-500/50' : 'border-slate-800'} shadow-sm`,
                            `w-16 h-16 rounded-full text-base ${qari.initials === 'MS' ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-800 border-amber-400/80' : 'bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-950 border-emerald-400/80'}`
                          )}
                          {/* Rank Badge */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-slate-900 border border-slate-800 text-white font-bold text-[10px] shadow">
                            {rank}
                          </div>
                        </div>

                        {/* Name */}
                        <h4 className="text-xs font-bold text-white truncate w-full mt-1">
                          {qari.name}
                        </h4>

                        {/* Listens */}
                        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5 truncate w-full">
                          {qari.listens || '1.0M listens'}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md max-h-[85vh] bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl flex flex-col"
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
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-500/20">
                          {juzNum}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">পারা / জুজ {juzNum}</h4>
                          <p className="text-xs text-slate-400">পবিত্র কুরআনের {juzNum}ম অংশ</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
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
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-500/20">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{surah.name}</h4>
                          <p className="text-xs text-slate-400">গত {idx + 1} দিন আগে শোনা হয়েছে</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
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
                      className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-slate-800">
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
                        <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
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
