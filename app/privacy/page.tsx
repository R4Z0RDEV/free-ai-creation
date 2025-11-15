'use client';

import { AppShell } from '@/components/Layout/AppShell';
import { PageHero } from '@/components/Layout/PageHero';
import { Card } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <AppShell showAds={false}>
      <PageHero
        align="center"
        eyebrow="PRIVACY"
        title="Privacy Policy"
        description="We are committed to transparency about the data we collect and how we use it inside Free AI Studio."
      >
        <p className="text-sm text-white/60">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </PageHero>

      <section className="page-section max-w-4xl">
        <Card className="panel p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Free AI Studio ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-2">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Content Data:</strong> Prompts and settings you provide for content generation</li>
                <li><strong>Usage Data:</strong> Information about how you use our services, including generation history</li>
                <li><strong>Technical Data:</strong> Browser type, IP address, device information, and cookies</li>
                <li><strong>Local Storage:</strong> Project data and preferences stored in your browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-2">We use collected information to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide and maintain our AI generation services</li>
                <li>Process your content generation requests</li>
                <li>Improve and optimize our services</li>
                <li>Monitor usage patterns and prevent abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-2">
                Our service integrates with third-party providers:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>AI Model Providers:</strong> Your prompts are sent to AI services (OpenAI, Google Gemini) for content generation</li>
                <li><strong>Google AdSense:</strong> We use Google AdSense for advertising, which may collect data through cookies and similar technologies</li>
                <li><strong>Analytics:</strong> We may use analytics services to understand usage patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Advertising</h2>
              <p className="text-gray-300 leading-relaxed">
                We display advertisements through Google AdSense. Google and its partners may use cookies to
                serve ads based on your prior visits to our website or other websites. You can opt out of
                personalized advertising by visiting Google's Ads Settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your information only for as long as necessary to provide our services and comply with
                legal obligations. Generated content is typically not stored on our servers; it's delivered directly
                to your browser. Project data is stored locally in your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement reasonable security measures to protect your information. However, no method of
                transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">8. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Disable cookies through your browser settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">9. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13. If you believe we have collected such information,
                please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">11. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-blue-400 mt-2">privacy@freeaistudio.com</p>
            </section>
          </Card>
      </section>
    </AppShell>
  );
}
