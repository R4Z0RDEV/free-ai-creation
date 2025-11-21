'use client';

export function AdfitSideBanners() {
  return (
    <>
      {/* Left side banner */}
      <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit="DAN-kekHIkV5BCBXa0hp"
          data-ad-width="160"
          data-ad-height="600"
        />
      </div>

      {/* Right side banner */}
      <div className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 z-40">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit="DAN-J52LUeCnWsswOekL"
          data-ad-width="160"
          data-ad-height="600"
        />
      </div>
    </>
  );
}

export function AdfitBottomBanner() {
  return (
    <div className="hidden xl:block fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit="DAN-8QkwSveRcbFBbZ1n"
        data-ad-width="728"
        data-ad-height="90"
      />
    </div>
  );
}
