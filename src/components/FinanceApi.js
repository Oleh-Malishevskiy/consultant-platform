import React, { useEffect, useRef } from 'react';

function MarketOverviewWidget() {
  const widgetRef = useRef(null);

  useEffect(() => {
    const handlePostMessage = (event) => {
      const widget = widgetRef.current;
      if (!widget) return;

      const styles = event.data?.styles;
      if (styles) {
        Object.keys(styles).forEach(key => widget.style.setProperty(key, styles[key]));
      }
    };

    window.addEventListener('message', handlePostMessage);
    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  return (
    <iframe 
      ref={widgetRef}
      style={{ border: 'none', width: '100%', height: '100%' }}
      src="https://widget.darqube.com/market-overview?token=6640cf5c77d2178a99d956d2"
      id="MarketOverview-wv04o6l"
      title="Market Overview"
    ></iframe>
  );
}

export default MarketOverviewWidget;


  
  

