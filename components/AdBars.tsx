export function AdsBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-gray-900/90 backdrop-blur border-t border-gray-800 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Advertisement</div>
        <div className="text-sm text-gray-400">Bottom Banner Ad – Google AdSense Placeholder</div>
      </div>
    </div>
  );
}

export function AdsLeftBar() {
  return (
    <div className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-30 w-32 h-[600px] bg-gray-900/80 backdrop-blur border border-gray-800 rounded-r-lg">
      <div className="h-full flex items-center justify-center">
        <div className="text-center px-2 -rotate-90 whitespace-nowrap">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ad</div>
          <div className="text-xs text-gray-400">Left Banner</div>
        </div>
      </div>
    </div>
  );
}

export function AdsRightBar() {
  return (
    <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-30 w-32 h-[600px] bg-gray-900/80 backdrop-blur border border-gray-800 rounded-l-lg">
      <div className="h-full flex items-center justify-center">
        <div className="text-center px-2 rotate-90 whitespace-nowrap">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ad</div>
          <div className="text-xs text-gray-400">Right Banner</div>
        </div>
      </div>
    </div>
  );
}
