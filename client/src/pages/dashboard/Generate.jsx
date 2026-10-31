import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiDownload, HiClipboard, HiShare, HiHeart, HiLightningBolt } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const STYLES = [
  { id: 'realistic', label: 'Realistic', emoji: '📷', desc: 'Photorealistic' },
  { id: 'anime', label: 'Anime', emoji: '🎌', desc: 'Manga style' },
  { id: '3d', label: '3D Render', emoji: '🎮', desc: 'CGI quality' },
  { id: 'cartoon', label: 'Cartoon', emoji: '🎨', desc: 'Colorful art' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '🌆', desc: 'Neon future' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🧙', desc: 'Magical world' },
  { id: 'abstract', label: 'Abstract', emoji: '🌀', desc: 'Surreal art' },
];

const PROMPT_SUGGESTIONS = [
  'A majestic dragon soaring over a crystal mountain at sunset',
  'Cyberpunk city street with neon signs and rain reflections',
  'Anime girl with flowing hair in a magical forest',
  'Futuristic space station orbiting a purple nebula',
  'Ancient temple ruins covered in glowing vines',
  'Portrait of a warrior in golden armor, epic lighting',
];

export default function Generate() {
  const { user, updateUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    if (user?.subscriptionPlan === 'free' && user?.credits <= 0) {
      toast.error('No credits remaining. Upgrade your plan!');
      return;
    }

    setGenerating(true);
    setGeneratedImage(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 500);

    try {
      const { data } = await api.post('/images/generate', { prompt, style });
      clearInterval(interval);
      setProgress(100);
      setGeneratedImage(data.image);
      updateUser({ credits: data.creditsRemaining });
      toast.success('Image generated successfully!');
    } catch (err) {
      clearInterval(interval);
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixora-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } catch {
      window.open(generatedImage.imageUrl, '_blank');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedImage?.prompt || prompt);
    toast.success('Prompt copied!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(generatedImage?.imageUrl || '');
    toast.success('Image URL copied!');
  };

  const handleFavorite = async () => {
    if (!generatedImage) return;
    try {
      await api.post(`/favorites/${generatedImage._id}`);
      toast.success('Added to favorites!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Generate Image</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Describe your vision and let AI bring it to life</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          {/* Prompt */}
          <div className="card p-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Your Prompt
              {user?.subscriptionPlan === 'free' && (
                <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">({user?.credits} credits left)</span>
              )}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              rows={4}
              className="input-field resize-none text-sm"
              maxLength={500}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-500">{prompt.length}/500</span>
            </div>

            {/* Suggestions */}
            <div className="mt-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.slice(0, 3).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(s)}
                    className="text-xs bg-slate-700/50 hover:bg-violet-500/20 text-slate-400 hover:text-violet-400 px-2 py-1 rounded-lg transition-all border border-slate-600/30 hover:border-violet-500/30"
                  >
                    {s.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style selector */}
          <div className="card p-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Art Style</label>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    style === s.id
                      ? 'border-violet-500/60 bg-violet-500/20 text-slate-900 dark:text-white'
                      : 'border-slate-300 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="text-xl mb-1">{s.emoji}</div>
                  <div className="text-xs font-medium">{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating... {Math.round(progress)}%
              </>
            ) : (
              <>
                <HiLightningBolt />
                Generate Image
              </>
            )}
          </button>

          {/* Progress bar */}
          {generating && (
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="card p-5">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Preview</h3>

          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/30 relative">
            {generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                  <HiSparkles className="absolute inset-0 m-auto text-violet-400 text-xl" />
                </div>
                <p className="text-slate-400 dark:text-slate-400 text-sm">Creating your masterpiece...</p>
              </div>
            )}

            <AnimatePresence>
              {generatedImage && !generating && (
                <motion.img
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={generatedImage.imageUrl}
                  alt={generatedImage.prompt}
                  className="w-full h-full object-cover"
                />
              )}
            </AnimatePresence>

            {!generatedImage && !generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <HiSparkles className="text-5xl mb-3" />
                <p className="text-sm">Your image will appear here</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">{generatedImage.prompt}</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: HiDownload, label: 'Download', action: handleDownload, color: 'violet' },
                  { icon: HiHeart, label: 'Favorite', action: handleFavorite, color: 'pink' },
                  { icon: HiClipboard, label: 'Copy Prompt', action: handleCopyPrompt, color: 'cyan' },
                  { icon: HiShare, label: 'Share', action: handleShare, color: 'green' },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-700/50 hover:bg-${btn.color}-500/20 text-slate-400 hover:text-${btn.color}-400 transition-all border border-slate-600/30 hover:border-${btn.color}-500/30`}
                  >
                    <btn.icon size={16} />
                    <span className="text-xs">{btn.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
