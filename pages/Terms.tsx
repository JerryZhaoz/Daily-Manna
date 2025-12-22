import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Terms: React.FC<Props> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Home
        </button>
        
        <h1 className="font-serif text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-sm md:text-base space-y-4 text-slate-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">1. Agreement to Terms</h2>
          <p>By accessing or using Daily Grace, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">2. Content Disclaimer</h2>
          <p>The content provided in Daily Grace (including prayers, devotionals, and biblical principles) is for spiritual and informational purposes only. It is not intended to replace professional psychological, medical, or financial advice. While we strive for accuracy, we make no guarantees regarding the completeness or reliability of the content.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">3. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Daily Grace. The Bible verses used may be from public domain versions or used under fair use principles for commentary and education.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">4. User Conduct</h2>
          <p>You agree not to misuse the Service or help anyone else to do so. You must not attempt to interfere with the proper working of the Service.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">5. Limitation of Liability</h2>
          <p>In no event shall Daily Grace, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">6. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;