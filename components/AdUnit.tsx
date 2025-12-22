import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string; // For In-feed ads
  style?: React.CSSProperties;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ 
  slotId, 
  format = 'auto', 
  layoutKey,
  style = { display: 'block' },
  className = ''
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Check if the ad has already been loaded in this specific container to prevent duplicates in strict mode
      if (adRef.current && adRef.current.innerHTML === "") {
         (window as any).adsbygoogle = (window as any).adsbygoogle || [];
         (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className={`ad-container w-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2498147373862127"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layoutKey && { "data-ad-layout-key": layoutKey })}
      />
    </div>
  );
};

export default AdUnit;