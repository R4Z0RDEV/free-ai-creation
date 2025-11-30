'use client';

import Link from 'next/link';
import { Video, Image as ImageIcon, Maximize, Check, ArrowRight, Music, Mic, Scissors, Eraser, Sparkles, PenTool } from 'lucide-react';
import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const tools = [
  {
    icon: ImageIcon,
    title: 'AI Image Lab',
    description: 'Create stunning concept art and visuals.',
    href: '/studio/image',
    span: 'col-span-1 md:col-span-2 lg:col-span-2',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Video,
    title: 'AI Video Studio',
    description: 'Generate cinematic clips.',
    href: '/studio/video',
    span: 'col-span-1',
    gradient: 'from-sky-500/20 to-blue-500/20',
  },
  {
    icon: Music,
    title: 'AI Audio FX',
    description: 'Generate sound effects.',
    href: '/studio/audio',
    span: 'col-span-1',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: Music,
    title: 'AI Song Creator',
    description: 'Compose full songs with lyrics.',
    href: '/studio/song',
    span: 'col-span-1 md:col-span-2',
    gradient: 'from-cyan-500/20 to-sky-500/20',
  },
  {
    icon: Maximize,
    title: 'AI Upscaling',
    description: 'Enhance resolution.',
    href: '/studio/upscale',
    span: 'col-span-1',
    gradient: 'from-blue-400/20 to-cyan-400/20',
  },
  {
    icon: Mic,
    title: 'AI TTS',
    description: 'Lifelike speech synthesis.',
    href: '/studio/tts',
    span: 'col-span-1',
    gradient: 'from-sky-500/20 to-indigo-500/20',
  },
  {
    icon: Scissors,
    title: 'Remove BG',
    description: 'Instant transparency.',
    href: '/studio/remove-bg',
    span: 'col-span-1',
    gradient: 'from-gray-500/20 to-slate-500/20',
  },
  {
    icon: Eraser,
    title: 'Magic Eraser',
    description: 'Remove objects.',
    href: '/studio/eraser',
    span: 'col-span-1',
    gradient: 'from-slate-500/20 to-gray-500/20',
  },
  {
    icon: PenTool,
    title: 'AI Vectorizer',
    description: 'Convert to SVG.',
    href: '/studio/vector',
    span: 'col-span-1',
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
];

const benefits = [
  {
    title: 'No Login Required',
    description: 'Start creating immediately without any friction.',
  },
  {
    title: 'Completely Free',
    description: 'Access all premium AI tools at no cost.',
  },
  {
    title: 'Pro-Grade Models',
    description: 'Powered by state-of-the-art AI technology.',
  },
];

export default function Home() {
  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Free AI Creation",
            "description": "The best free AI creative suite for video generation, image upscaling, and audio synthesis. No login required.",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web",
            "inLanguage": "en-US",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <div className="page-container relative z-10 pb-20 pt-32">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-black/5 bg-white/50 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="mr-2 h-4 w-4 text-[#007AFF]" />
              <span className="text-sm font-medium text-black/70">
                Next-Gen AI Creative Studio
              </span>
            </div>
            <h1 className="mb-8 text-6xl font-bold tracking-tight text-[#1d1d1f] sm:text-8xl">
              Unleash Your <br />
              <span className="bg-gradient-to-r from-[#007AFF] to-[#5856D6] bg-clip-text text-transparent">
                Creative Potential
              </span>
              <br />
              with AI
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-black/60">
              Generate cinematic videos, music, and art with our professional AI tools.
              Free, unlimited, and designed for creators. No account required.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/studio/video">
                <Button size="lg" className="px-8 py-4 text-lg rounded-full bg-[#007AFF] hover:bg-[#0066CC] text-white">
                  Start Creating for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg" className="px-8 py-4 text-lg rounded-full border border-black/5 bg-white/50 text-[#1d1d1f] hover:bg-white/80">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Showcase Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <GlassCard className="relative h-[400px] w-full overflow-hidden flex items-center justify-center bg-white/40">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none" />

            <div className="relative grid grid-cols-3 gap-6 p-8 w-full max-w-5xl opacity-90 scale-95 hover:scale-100 transition-transform duration-700">
              {/* Mock UI Elements - Dashboard Collage */}
              <div className="col-span-2 h-72 rounded-2xl bg-white/60 border border-white/40 shadow-2xl backdrop-blur-xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/4 space-y-3">
                    <div className="h-8 rounded-lg bg-black/5" />
                    <div className="h-4 w-2/3 rounded bg-black/5" />
                    <div className="h-4 w-1/2 rounded bg-black/5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-32 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-black/5" />
                    <div className="h-4 w-full rounded bg-black/5" />
                    <div className="h-4 w-3/4 rounded bg-black/5" />
                  </div>
                </div>
              </div>
              <div className="col-span-1 h-72 rounded-2xl bg-white/60 border border-white/40 shadow-2xl backdrop-blur-xl p-6 flex flex-col gap-4">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-black/5 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-teal-500/40" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full rounded bg-black/5" />
                  <div className="h-4 w-2/3 rounded bg-black/5" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 text-center">
              <p className="text-xs font-semibold text-black/30 uppercase tracking-[0.2em]">Interactive Studio Preview</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tools Grid (Bento Grid) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              className={tool.span}
            >
              <Link
                href={tool.href}
                className={cn('group block h-full')}
              >
                <GlassCard className="relative h-full overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className={cn(
                    "absolute -right-10 -top-10 h-64 w-64 rounded-full bg-gradient-to-br opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-30",
                    tool.gradient
                  )} />

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-5 flex justify-start bg-transparent p-0">
                        <tool.icon className="h-20 w-20 text-[#1d1d1f] stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-[#1d1d1f]">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-black/60">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center text-sm font-medium text-[#007AFF] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                      Try Now <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <section className="page-section relative z-10 pb-32">
        <div className="page-container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/50 text-[#007AFF] ring-1 ring-black/5">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[#1d1d1f]">{benefit.title}</h3>
                <p className="text-black/50">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="page-section relative z-10 pb-32">
        <div className="page-container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Frequently Asked Questions</h2>
            <p className="text-black/60">Everything you need to know about Free AI Creation.</p>
          </div>

          <div className="grid gap-6">
            {[
              {
                q: "Is it really free?",
                a: "Yes, Free AI Creation allows you to generate videos, images, and audio completely for free without any hidden costs."
              },
              {
                q: "Do I need to sign up?",
                a: "No account is needed. You can start creating immediately without logging in or providing credit card details."
              },
              {
                q: "Can I use the generated content commercially?",
                a: "Yes, you own the rights to the content you generate. Please refer to our terms for specific model licenses."
              },
              {
                q: "How does the AI Upscaler work?",
                a: "Our AI enhances image resolution up to 4K by filling in missing details, making your photos crisp and clear instantly."
              }
            ].map((faq, index) => (
              <GlassCard key={index} className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-[#1d1d1f] mb-3">{faq.q}</h3>
                <p className="text-black/60 leading-relaxed">{faq.a}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}