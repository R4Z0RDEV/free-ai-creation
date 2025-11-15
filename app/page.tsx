'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Video, Image as ImageIcon, Maximize, Check, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/Layout/AppShell';

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const tools = [
  {
    icon: Video,
    title: 'AI Video Studio',
    description: 'Generate cinematic clips with Seedance Lite on Replicate.',
    href: '/studio/video',
  },
  {
    icon: ImageIcon,
    title: 'AI Image Lab',
    description: 'Create concept art, thumbnails, and key visuals.',
    href: '/studio/image',
  },
  {
    icon: Maximize,
    title: 'AI Upscaling',
    description: 'Sharpen and enhance low-resolution footage and images.',
    href: '/studio/upscale',
  },
];

const benefits = [
  {
    title: 'No login, ever',
    description: 'Open the studio and start creating immediately. No account, no friction.',
  },
  {
    title: 'Completely free',
    description: 'All tools are free to use, supported by banner and rewarded ads.',
  },
  {
    title: 'Modern AI models',
    description: 'Seedance Lite and more – picked and wired for creators, not just demos.',
  },
];

export default function Home() {
  return (
    <AppShell>
      {/* HERO */}
      <section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden bg-[#050508]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.7]"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg?auto=compress&cs=tinysrgb&w=1920')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/80 to-[#050508] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(147,51,234,0.45),_transparent_55%)]" />

        <div className="relative z-10 w-full">
        <div className="page-container flex flex-col gap-10 py-20 sm:py-24 lg:py-28">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="space-y-6 text-center"
            >
              <motion.div variants={fadeIn}>
                <span className="eyebrow text-xs font-semibold tracking-[0.2em] text-white/60">
                  AI VIDEO · AI IMAGE · FREE
                </span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="headline-xl text-balance font-serif text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
              >
                Completetly free AI
                <br />
                creation studio.
              </motion.h1>

            <motion.p
              variants={fadeIn}
              className="body-lg mx-auto max-w-2xl text-sm sm:text-base text-gray-300"
            >
              Generate cinematic video, images, and upscaled media in one place. Built on Seedance
              Lite and more – completely free to use, no sign-up required.
            </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-wrap items-center justify-center gap-4 pt-2"
              >
                <Link
                  href="/studio/video"
                  className="pill-primary"
                >
                  Start Free Now
                </Link>
                <Link
                  href="/studio/video"
                  className="pill-outline"
                >
                  Explore AI Video
                </Link>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex flex-wrap items-center justify-center gap-3 pt-6 text-[11px]"
              >
                <span className="rounded-full bg-black/50 px-3 py-1 text-white/55">
                  Powered by
                </span>
                <span className="rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-white/80">
                  Seedance Lite
                </span>
                <span className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-white/60">
                  More models coming soon
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* bottom fade into content */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050508] via-[#050508] to-transparent" />
      </section>

      {/* TOOLS */}
      <section className="relative bg-[#050508] py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 max-w-xl rounded-full bg-[#4c1d95]/40 blur-[120px]" />
        <div className="relative page-container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeIn} className="headline-lg mb-3 font-serif text-white">
              Your complete AI media studio.
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="body-lg mx-auto max-w-2xl text-sm sm:text-base text-[#b0b0b0]"
            >
              Three focused tools for creators who care about images, motion, and detail – all in one
              place.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: 'easeOut',
                  }}
                  className={index === 0 ? 'lg:col-span-2' : ''}
                >
                  <Link href={tool.href} className="group block h-full">
                    <div className="shell-card flex h-full flex-col overflow-hidden p-7">
                      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c4b5fd] via-[#a855f7] to-[#7c3aed] text-white shadow-[0_0_30px_rgba(124,58,237,0.7)] group-hover:scale-105 transition-transform">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-white">
                        {tool.title}
                      </h3>
                      <p className="mb-5 flex-1 text-sm text-[#b0b0b0]">
                        {tool.description}
                      </p>
                      <span className="flex items-center text-sm font-medium text-[#c4b5fd] group-hover:gap-2 transition-all">
                        Open studio
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#050508] py-20 sm:py-24">
        <div className="page-container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeIn} className="headline-lg mb-3 font-serif text-white">
              Why creators choose Free AI Creation.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="rounded-3xl border border-white/10 bg-[#090911] p-7 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#a855f7]/15">
                  <Check className="h-6 w-6 text-[#c4b5fd]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{benefit.title}</h3>
                <p className="text-sm text-[#b0b0b0]">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#050508] py-24 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/6898852/pexels-photo-6898852.jpeg?auto=compress&cs=tinysrgb&w=1920')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-[#050508]/95 to-[#050508]" />

        <div className="relative mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6 text-center"
          >
            <h2 className="headline-lg font-serif text-white">
              Ready to bring your next shot to life?
            </h2>
            <p className="body-lg mx-auto max-w-2xl text-sm sm:text-base text-[#d0d0d0]">
              Open the video studio, type a prompt, and see your idea turn into motion – entirely for
              free.
            </p>
            <Link
              href="/studio/video"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#c4b5fd] via-[#a855f7] to-[#7c3aed] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-transform hover:-translate-y-[2px]"
            >
              Start Free Now
            </Link>
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}