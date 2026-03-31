import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-32 min-h-screen bg-[#FDFBF7] px-8 lg:px-16 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-luxury-charcoal mb-12">Privacy <span className="italic text-luxury-gold">Protocol</span></h1>
        <div className="prose prose-zinc max-w-none text-zinc-600 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-luxury-charcoal mb-4 uppercase tracking-widest">Data Collection</h2>
            <p>
              VisionHaven AI collects minimal data necessary to provide our high-luxury spatial analysis services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usage Data: Interactions with our design tools and gallery.</li>
              <li>User Content: Photos and videos uploaded for analysis (processed securely and not linked to identity).</li>
              <li>Identifiers: Device IDs for app functionality and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-luxury-charcoal mb-4 uppercase tracking-widest">Data Usage</h2>
            <p>
              Your data is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our AI-driven interior design recommendations.</li>
              <li>Analyze app performance and diagnostics.</li>
              <li>Deliver curated design trends and updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-luxury-charcoal mb-4 uppercase tracking-widest">Security Protocol</h2>
            <p>
              We employ industry-standard encryption and security protocols to protect your data. Images are processed using the Haven Neural Engine and are not stored permanently unless saved to your personal Vault.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-luxury-charcoal mb-4 uppercase tracking-widest">Third-Party Disclosure</h2>
            <p>
              We do not sell your personal data. We may share anonymized usage data with analytics partners to improve our services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
