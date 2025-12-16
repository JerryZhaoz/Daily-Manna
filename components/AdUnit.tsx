import React, { useEffect } from 'react';

interface AdUnitProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string; // For In-feed ads
  className?: string;
  style?: React.CSSProperties;
}

export const AdUnit: React.FC<AdUnitProps> = ({ 
  slotId, 
  format = 'auto', 
  layoutKey,
  className = '',
  style = { display: 'block' }
}) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container w-full overflow-hidden ${className}`}>
        {/* REPLACE 'ca-pub-XXXXXXXXXXXXXXXX' with your actual Publisher ID in client prop */}
        <ins
            className="adsbygoogle"
            style={style}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
            {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />
    </div>
  );
};