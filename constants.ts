import { DailyContent } from './types';

export const FALLBACK_VERSES: DailyContent[] = [
  {
    date: 'fallback-1',
    scriptureText: "Be still, and know that I am God.",
    reference: "Psalm 46:10",
    thought: "In the quiet moments, His presence is found."
  },
  {
    date: 'fallback-2',
    scriptureText: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
    thought: "Trust that you have everything you need for today."
  },
  {
    date: 'fallback-3',
    scriptureText: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28",
    thought: "Lay down your worries; He is ready to carry them."
  }
];

export const THEME_COLORS = {
  bg: 'bg-stone-50',
  text: 'text-stone-800',
  accent: 'text-emerald-700',
  button: 'bg-emerald-700 hover:bg-emerald-800',
  buttonText: 'text-white'
};
