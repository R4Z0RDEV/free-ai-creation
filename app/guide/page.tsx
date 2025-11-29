'use client';

import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Book, Video, Image as ImageIcon, Maximize2, Shield, HelpCircle, FileText } from 'lucide-react';

export default function GuidePage() {
  return (
    <AppShell>
      <div className="page-container pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/50 text-[#007AFF] ring-1 ring-black/5 shadow-sm backdrop-blur-md">
            <Book className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
            User Guide
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-black/60">
            Everything you need to know about creating with Free AI Studio.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 max-w-7xl mx-auto">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 lg:sticky lg:top-32 h-fit"
          >
            <GlassCard className="p-6">
              <nav className="space-y-1">
                <a href="#introduction" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#1d1d1f] rounded-lg bg-black/5">
                  <Book className="w-4 h-4 text-[#007AFF]" />
                  Introduction
                </a>
                <a href="#video-studio" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black/60 hover:text-[#1d1d1f] hover:bg-black/5 rounded-lg transition-colors">
                  <Video className="w-4 h-4" />
                  Video Studio
                </a>
                <a href="#image-generation" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black/60 hover:text-[#1d1d1f] hover:bg-black/5 rounded-lg transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  Image Generation
                </a>
                <a href="#upscaling" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black/60 hover:text-[#1d1d1f] hover:bg-black/5 rounded-lg transition-colors">
                  <Maximize2 className="w-4 h-4" />
                  Upscaling
                </a>
                <a href="#watermark-ads" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black/60 hover:text-[#1d1d1f] hover:bg-black/5 rounded-lg transition-colors">
                  <Shield className="w-4 h-4" />
                  Watermarks & Ads
                </a>
                <a href="#faq" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black/60 hover:text-[#1d1d1f] hover:bg-black/5 rounded-lg transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </a>
              </nav>
            </GlassCard>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-9 space-y-12"
          >
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-32">
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">1. Service Introduction</h2>
                <div className="space-y-6 text-black/70 leading-relaxed">
                  <p>
                    Free AI Studio is a web-based creative platform that allows anyone to easily
                    generate and edit videos and images using cutting-edge artificial intelligence
                    technology. We provide access to proven AI models without complex installation
                    processes or expensive hardware.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-[#007AFF]/5 border border-[#007AFF]/10">
                      <h3 className="font-semibold text-[#007AFF] mb-2">Completely Free</h3>
                      <p className="text-sm">No premium plans or hidden costs. Accessible to everyone.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#007AFF]/5 border border-[#007AFF]/10">
                      <h3 className="font-semibold text-[#007AFF] mb-2">No Login Required</h3>
                      <p className="text-sm">Start creating immediately. Projects are saved locally.</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>

            {/* Video Studio */}
            <section id="video-studio" className="scroll-mt-32">
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                    <Video className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1d1d1f]">2. AI Video Studio</h2>
                </div>
                <div className="space-y-6 text-black/70 leading-relaxed">
                  <p>
                    Create cinematic videos from text descriptions. Our advanced motion engine
                    understands complex scenes and camera movements.
                  </p>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#1d1d1f]">How to use:</h3>
                    <ol className="list-decimal list-inside space-y-3 ml-2">
                      <li>Click <span className="font-medium text-[#1d1d1f]">Add Clip</span> to start a new project.</li>
                      <li>Enter a descriptive prompt (e.g., "A cinematic drone shot of a futuristic city").</li>
                      <li>Adjust duration (2-5s) and aspect ratio.</li>
                      <li>Click <span className="font-medium text-[#1d1d1f]">Generate</span> and wait for the magic.</li>
                    </ol>
                  </div>
                </div>
              </GlassCard>
            </section>

            {/* Image Generation */}
            <section id="image-generation" className="scroll-mt-32">
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1d1d1f]">3. AI Image Generation</h2>
                </div>
                <div className="space-y-6 text-black/70 leading-relaxed">
                  <p>
                    Generate stunning visuals in various styles, from photorealistic to anime and digital art.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-[#1d1d1f] mb-3">Styles</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>Photorealistic</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>Anime & Illustration</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>Digital Art</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>Cinematic</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1d1d1f] mb-3">Tips</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>Be specific with lighting</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>Use negative prompts</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>Experiment with steps</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>

            {/* Upscaling */}
            <section id="upscaling" className="scroll-mt-32">
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1d1d1f]">4. AI Upscaling</h2>
                </div>
                <div className="space-y-6 text-black/70 leading-relaxed">
                  <p>
                    Enhance resolution and clarity of your images up to 4x their original size using
                    Real-ESRGAN technology.
                  </p>
                  <div className="p-4 rounded-xl bg-black/5 border border-black/5">
                    <h3 className="font-semibold text-[#1d1d1f] mb-2">Face Enhancement</h3>
                    <p className="text-sm">
                      Enable "Face Enhance" for portraits to specifically restore facial details
                      and remove artifacts.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </section>

            {/* Watermark & Ads */}
            <section id="watermark-ads" className="scroll-mt-32">
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1d1d1f]">5. Watermarks & Ads</h2>
                </div>
                <div className="space-y-6 text-black/70 leading-relaxed">
                  <p>
                    To keep our service free, we include a small watermark on generated content.
                    You can remove this watermark by watching a short ad.
                  </p>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#007AFF]/5 border border-[#007AFF]/10">
                    <div className="p-2 rounded-full bg-[#007AFF]/10 text-[#007AFF] mt-1">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1d1d1f] mb-1">Why Ads?</h3>
                      <p className="text-sm">
                        Running high-end AI models is expensive. Ads help us cover server costs
                        so we can keep providing these tools for free to everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-32">
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1d1d1f]">6. FAQ</h2>
                </div>
                <div className="grid gap-4">
                  {[
                    {
                      q: "Is there a daily limit?",
                      a: "No strict daily limits, but we may rate-limit excessive usage to ensure fair access for everyone."
                    },
                    {
                      q: "Can I use content commercially?",
                      a: "Generally yes, but please check the specific license of the AI model used (Stable Diffusion, etc.)."
                    },
                    {
                      q: "Is my data private?",
                      a: "Yes. Generated content is temporarily stored for delivery and then deleted. We don't sell your data."
                    }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl hover:bg-black/5 transition-colors border border-transparent hover:border-black/5">
                      <h3 className="font-semibold text-[#1d1d1f] mb-2">{item.q}</h3>
                      <p className="text-sm text-black/60">{item.a}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </section>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
