import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Privacy: React.FC<Props> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Home
        </button>
        
        <h1 className="font-serif text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-sm md:text-base space-y-4 text-slate-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">1. Introduction</h2>
          <p>Welcome to Daily Grace ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Daily Grace.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">2. Information We Collect</h2>
          <p>We do not require you to create an account to use our application. However, we may collect certain information automatically:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Usage Data:</strong> We may collect information about your interaction with our app, such as pages visited and time spent.</li>
            <li><strong>Device Information:</strong> We may collect information about the device you use to access the app, including IP address, browser type, and operating system.</li>
            <li><strong>Local Storage:</strong> We use your browser's local storage to save your preferences (e.g., devotional history, settings). This data remains on your device and is not sent to our servers.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-6">3. Cookies and Web Beacons</h2>
          <p>We use cookies and similar tracking technologies to track the activity on our service and hold certain information.</p>
          <p><strong>Google AdSense:</strong> We use Google AdSense to display ads. Google and its partners use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to our website or other websites on the internet. You may opt-out of the use of the DoubleClick cookie for interest-based advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Google Ads Settings</a>.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">4. Third-Party Services</h2>
          <p>We may use third-party service providers to monitor and analyze the use of our Service, such as Google Analytics.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">5. Changes to This Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us via our Contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;