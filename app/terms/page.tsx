'use client';

import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, Scale } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <AppShell showAds={false}>
      <div className="page-container pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/50 text-[#007AFF] ring-1 ring-black/5 shadow-sm backdrop-blur-md">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
            Terms of Use
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-black/60">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <GlassCard className="p-8 md:p-12">
            <div className="space-y-12">
              <section>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1d1d1f] mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] text-sm">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-black/70 leading-relaxed pl-11">
                  By accessing and using Free AI Studio, you accept and agree to be bound by these Terms of Use.
                  If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1d1d1f] mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] text-sm">2</span>
                  Service Description
                </h2>
                <p className="text-black/70 leading-relaxed pl-11">
                  Free AI Studio provides AI-powered content generation services including video generation,
                  image generation, and image upscaling. The service is provided "as is" without warranties of
                  any kind, either express or implied.
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1d1d1f] mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] text-sm">3</span>
                  User Responsibilities
                </h2>
                <div className="pl-11">
                  <ul className="space-y-3 text-black/70">
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#007AFF] flex-shrink-0" />
                      You are responsible for all content you generate using our services
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#007AFF] flex-shrink-0" />
                      You must not use the service for illegal, harmful, or abusive purposes
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#007AFF] flex-shrink-0" />
                      You must not generate content that infringes on intellectual property rights
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1d1d1f] mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] text-sm">4</span>
                  Prohibited Content
                </h2>
                <div className="pl-11 p-6 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="font-medium text-red-600 mb-3">You agree not to generate content that is:</p>
                  <ul className="space-y-2 text-black/70">
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Illegal, harmful, threatening, or abusive
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Infringing on intellectual property or privacy rights
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Explicit or adult content
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1d1d1f] mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] text-sm">5</span>
                  Intellectual Property
                </h2>
                <p className="text-black/70 leading-relaxed pl-11">
                  You retain ownership of content you generate. However, you grant us a license to use, store,
                  and process your inputs to provide and improve our services.
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1d1d1f] mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] text-sm">6</span>
                  Limitation of Liability
                </h2>
                <p className="text-black/70 leading-relaxed pl-11">
                  To the maximum extent permitted by law, Free AI Studio shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages resulting from your use of the service.
                </p>
              </section>

              <div className="pt-8 border-t border-black/5">
                <p className="text-center text-black/40 text-sm">
                  For questions about these Terms of Use, please contact us at legal@freeaistudio.com
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AppShell>
  );
}
