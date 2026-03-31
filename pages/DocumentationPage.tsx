
import React from 'react';

const DocumentationPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-32">
      <h1 className="text-5xl font-serif font-bold text-luxury-charcoal mb-12">System Architecture</h1>
      
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-luxury-gold border-b pb-2">Technical Blueprint</h2>
        <div className="bg-zinc-900 p-8 rounded-2xl text-zinc-300 font-mono text-sm leading-relaxed shadow-2xl">
          <pre>{`
VISIONHAVEN ARCHITECTURE v2.0

[ Client Layer ]
React 18 + TSX
GSAP + Framer Motion (HUD VFX)
Gemini 3 SDK (Neural Engine)

[ Data Layer ]
Simulated PostgreSQL (DAL: authService.ts)
Schema Persistence: localStorage (Production Ready)
Encryption: Simulated hashing (Crypto API)

[ Auth Logic ]
1. Email/Pass (Vault Access)
2. Phone (SMS/MMS Simulation)
3. Social OAuth (Google ID Integration)

[ User Schema ]
User {
  id        UUID
  name      String
  email     String @unique
  phone     String @optional
  role      Enum(User, Vendor)
  createdAt DateTime
}
          `}</pre>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-luxury-gold border-b pb-2">Auth Logic & Persistence</h2>
        <div className="prose prose-zinc lg:prose-xl">
          <p>
            The <strong>Haven Database Protocol</strong> ensures all user credentials, room analyses, and design choices are persisted across sessions. 
          </p>
          <ul className="space-y-4">
            <li><strong>Database Schema:</strong> Designed for normalization, allowing a single user to manage multiple room visioning projects.</li>
            <li><strong>OAuth Flow:</strong> Securely bridges external identities (Google/Apple) into the Haven ecosystem.</li>
            <li><strong>Persistence:</strong> Uses a simulated server-side delay to mimic production API latency, ensuring UI loaders provide realistic feedback.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default DocumentationPage;
