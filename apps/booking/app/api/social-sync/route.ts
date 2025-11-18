import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase';
import { fetchInstagramMedia } from '../../../services/social/instagram';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { tenantId } = await request.json();

    // Fetch Instagram media
    const igMedia = await fetchInstagramMedia();

    // Store in database
    for (const media of igMedia.media || []) {
      await supabase.from('social_media_posts').upsert({
        tenant_id: tenantId,
        platform: 'instagram',
        external_id: (media as any).id || 'unknown',
        caption: (media as any).caption || '',
        media_url: (media as any).mediaUrl || '',
        permalink: (media as any).permalink || '',
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      synced: igMedia.media?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Social sync failed',
      },
      { status: 500 },
    );
  }
}
