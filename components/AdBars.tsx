import { useEffect } from 'react';

export function AdsBottomBar() {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-gray-900/90 backdrop-blur border-t border-gray-800">
      <div className="py-2">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3621018373095111"
          data-ad-slot="9468351971"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

export function AdsLeftBar() {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-30 w-[160px] h-[600px] bg-gray-900/80 backdrop-blur border border-gray-800 rounded-r-lg">
      <div className="h-full flex items-center justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3621018373095111"
          data-ad-slot="9276780283"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

export function AdsRightBar() {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-30 w-[160px] h-[600px] bg-gray-900/80 backdrop-blur border border-gray-800 rounded-l-lg">
      <div className="h-full flex items-center justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3621018373095111"
          data-ad-slot="5739207562"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
