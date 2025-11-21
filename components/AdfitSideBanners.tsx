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
