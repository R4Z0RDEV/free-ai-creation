'use client';

import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Server } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-black/60">
            We are committed to transparency about the data we collect and how we use it.
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
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Data Collection & Usage</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-black/5 border border-black/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                        <Database className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-[#1d1d1f]">What We Collect</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-black/70">
                      <li>• Content Data (Prompts, settings)</li>
                      <li>• Usage Data (Generation history)</li>
                      <li>• Technical Data (Browser, IP)</li>
                      <li>• Local Storage (Preferences)</li>
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/5 border border-black/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                        <Eye className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-[#1d1d1f]">How We Use It</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-black/70">
                      <li>• Provide AI services</li>
                      <li>• Process generation requests</li>
                      <li>• Improve service quality</li>
                      <li>• Prevent abuse</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Third-Party Services</h2>
                <p className="text-black/70 leading-relaxed mb-6">
                  Our service integrates with trusted third-party providers to deliver AI capabilities:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-black/5 transition-colors">
                    <Server className="w-5 h-5 text-[#007AFF] mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1d1d1f]">AI Model Providers</h3>
                      <p className="text-sm text-black/60">Your prompts are sent to services like Replicate for content generation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-black/5 transition-colors">
                    <Shield className="w-5 h-5 text-[#007AFF] mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1d1d1f]">Google AdSense</h3>
                      <p className="text-sm text-black/60">We use AdSense for advertising, which may use cookies to serve relevant ads.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Data Retention</h2>
                <p className="text-black/70 leading-relaxed">
                  We retain your information only for as long as necessary to provide our services.
                  Generated content is typically not stored on our servers; it's delivered directly
                  to your browser. Project data is stored locally in your browser.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Your Rights</h2>
                <div className="pl-4 border-l-2 border-[#007AFF]/20 space-y-2 text-black/70">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Access your personal information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Disable cookies via browser settings</li>
                  </ul>
                </div>
              </section>

              <div className="pt-8 border-t border-black/5">
                <p className="text-center text-black/40 text-sm">
                  Questions? Contact us at privacy@freeaistudio.com
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AppShell>
  );
}
