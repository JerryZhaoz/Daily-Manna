import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const CookiePolicy: React.FC<Props> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Home
        </button>
        
        <h1 className="font-serif text-3xl font-bold mb-6">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none text-sm md:text-base space-y-4 text-slate-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-6">1. What Are Cookies</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-6">2. How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> We use Google Analytics to understand how visitors engage with our website. It tracks visitor volume, location, and other metrics to help us improve the service.</li>
            <li><strong>Advertising Cookies:</strong> We use Google AdSense to serve ads. These cookies are used to personalize the ads you see and measure the effectiveness of the advertising.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-6">3. Managing Cookies</h2>
          <p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">www.allaboutcookies.org</a>.</p>
          
          <p>To opt out of being tracked by Google Analytics across all websites, visit <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">http://tools.google.com/dlpage/gaoptout</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;