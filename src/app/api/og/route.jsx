import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const hasTitle = searchParams.has('title');
        const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'TechStudy';
        const desc = searchParams.get('desc')?.slice(0, 150) || 'Browse and read Computer Science notes from GitHub repositories.';

        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        padding: '80px 120px',
                        fontFamily: 'sans-serif',
                        color: 'white',
                    }}
                >
                    {/* Background Glow */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-20%',
                            right: '-10%',
                            width: '800px',
                            height: '800px',
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)',
                            borderRadius: '50%',
                        }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                                <path d="M10 12h12M10 16h12M10 20h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '32px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                            TechStudy
                        </span>
                    </div>

                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 800,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            marginBottom: '24px',
                            color: '#ffffff',
                            maxWidth: '1000px',
                        }}
                    >
                        {title}
                    </div>
                    
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#94a3b8',
                            lineHeight: 1.4,
                            maxWidth: '900px',
                        }}
                    >
                        {desc}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                headers: {
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
                },
            }
        );
    } catch (e) {
        console.error('OG image generation failed:', e);
        return new Response(`Failed to generate image`, {
            status: 500,
        });
    }
}
