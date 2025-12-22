import React, { useEffect } from 'react';
import { ArrowLeft, Mail, Heart } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Contact: React.FC<Props> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Home
        </button>
        
        <h1 className="font-serif text-3xl font-bold mb-6">About & Contact</h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 font-serif">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
                Daily Grace was created to provide a quiet digital sanctuary for daily reflection, prayer, and renewal. In a noisy world, we believe in the power of pausing to "wait on the Lord" (Isaiah 40:31).
            </p>
            <p className="text-slate-600 leading-relaxed">
                This project is independently developed and maintained. We hope it brings a moment of peace to your day.
            </p>
        </div>

        <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-900 mb-4 font-serif">Get in Touch</h2>
            <p className="text-slate-700 mb-6">
                Have questions, suggestions, or just want to share how the app has helped you? We'd love to hear from you.
            </p>
            
            <div className="flex items-center space-x-3 text-indigo-700">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Mail size={20} />
                </div>
                <a href="mailto:support@dailygrace.app" className="font-medium hover:underline">
                    support@dailygrace.app
                </a>
            </div>
            <p className="text-xs text-indigo-400 mt-6">
                * Please allow 2-3 business days for a response.
            </p>
        </div>
        
        <div className="mt-12 text-center text-slate-400 text-sm">
             <Heart size={16} className="inline-block mx-1 text-slate-300" />
             <p>Soli Deo Gloria</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;