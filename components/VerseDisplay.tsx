import React from 'react';
import { DailyContent } from '../types';
import { THEME_COLORS } from '../constants';
import { BookOpen } from 'lucide-react';

interface VerseDisplayProps {
  content: DailyContent;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({ content }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className={`mb-6 p-3 rounded-full bg-stone-200/50 ${THEME_COLORS.accent}`}>
        <BookOpen size={24} />
      </div>
      
      <h2 className="font-serif text-2xl md:text-4xl leading-relaxed text-stone-800 mb-4 max-w-2xl">
        "{content.scriptureText}"
      </h2>
      
      <p className={`text-sm md:text-base font-medium tracking-wider uppercase mb-8 ${THEME_COLORS.accent}`}>
        {content.reference}
      </p>

      <div className="max-w-md w-full border-t border-stone-200 pt-6">
        <p className="text-stone-500 italic font-serif text-lg">
          {content.thought}
        </p>
      </div>
    </div>
  );
};
