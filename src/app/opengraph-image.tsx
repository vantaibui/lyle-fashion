import { ImageResponse } from 'next/og';

export const alt = 'LYLE Fashion';
export const contentType = 'image/png';
export const size = {
  height: 630,
  width: 1200,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#f6f0e7',
        color: '#171717',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        letterSpacing: '-0.03em',
        width: '100%',
      }}
    >
      <div
        style={{
          fontSize: 32,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
        }}
      >
        LYLE Fashion
      </div>
      <div
        style={{
          fontSize: 62,
          fontWeight: 700,
          marginTop: 24,
          maxWidth: 900,
          textAlign: 'center',
        }}
      >
        Thời trang tối giản cao cấp cho khách hàng Việt Nam
      </div>
    </div>,
    size,
  );
}
