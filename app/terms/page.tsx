'use client';

import { AppShell } from '@/components/Layout/AppShell';
import { PageHero } from '@/components/Layout/PageHero';
import { Card } from '@/components/ui/card';

export default function TermsOfUse() {
  return (
    <AppShell showAds={false}>
      <PageHero
        align="center"
        eyebrow="TERMS"
        title="Terms of Use"
        description="These terms describe what you can expect from Free AI Studio and what we expect from you."
      >
        <p className="text-sm text-white/60">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </PageHero>

      <section className="page-section max-w-4xl">
        <Card className="panel p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Free AI Studio, you accept and agree to be bound by these Terms of Use.
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Service Description</h2>
              <p className="text-gray-300 leading-relaxed">
                Free AI Studio provides AI-powered content generation services including video generation,
                image generation, and image upscaling. The service is provided "as is" without warranties of
                any kind, either express or implied.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>You are responsible for all content you generate using our services</li>
                <li>You must not use the service for illegal, harmful, or abusive purposes</li>
                <li>You must not generate content that infringes on intellectual property rights</li>
                <li>You must not attempt to circumvent any limitations or security measures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Prohibited Content</h2>
              <p className="text-gray-300 leading-relaxed mb-2">
                You agree not to generate or attempt to generate content that is:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Illegal, harmful, threatening, abusive, or otherwise objectionable</li>
                <li>Infringing on intellectual property or privacy rights</li>
                <li>Containing explicit or adult content</li>
                <li>Designed to harass, stalk, or harm others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Content Quality and Accuracy</h2>
              <p className="text-gray-300 leading-relaxed">
                AI-generated content may have quality or accuracy limitations. We do not guarantee the accuracy,
                reliability, or suitability of generated content for any particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                You retain ownership of content you generate. However, you grant us a license to use, store,
                and process your inputs to provide and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Service Modifications</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any aspect of the service at any time
                without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                To the maximum extent permitted by law, Free AI Studio shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">9. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these Terms of Use, please contact us at: legal@freeaistudio.com
              </p>
            </section>
          </Card>
      </section>
    </AppShell>
  );
}
