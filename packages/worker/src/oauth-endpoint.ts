/**
 * Google OAuth endpoint handler
 * Handles OAuth code exchange and token storage
 */

import { extractToken } from './jwt';
import { logger } from './logger';

export async function handleGoogleOAuthEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID || '';
    const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET || '';
    const GOOGLE_REDIRECT_URI = env.GOOGLE_REDIRECT_URI || 'https://appointmentbooking-coza.houseofgr8ness.workers.dev/api/oauth/google/callback';

    try {
        // POST /api/oauth/google/callback - Exchange auth code for tokens
        if (path === '/api/oauth/google/callback' && request.method === 'POST') {
            const body = await request.json() as any;
            const { code, redirectUri } = body;

            if (!code) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Auth code required'
                }), { status: 400, headers: corsHeaders });
            }

            try {
                // Exchange code for tokens with Google
                const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        code,
                        client_id: GOOGLE_CLIENT_ID,
                        client_secret: GOOGLE_CLIENT_SECRET,
                        redirect_uri: redirectUri || GOOGLE_REDIRECT_URI,
                        grant_type: 'authorization_code'
                    }).toString()
                });

                if (!tokenResponse.ok) {
                    logger.error('Google token exchange failed', { status: tokenResponse.status });
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Token exchange failed'
                    }), { status: 400, headers: corsHeaders });
                }

                const tokens = await tokenResponse.json() as any;

                // Get user info from Google
                const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: { 'Authorization': `Bearer ${tokens.access_token}` }
                });

                if (!userResponse.ok) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'User info fetch failed'
                    }), { status: 400, headers: corsHeaders });
                }

                const googleUser = await userResponse.json() as any;

                // Get authenticated user from JWT
                const authHeader = request.headers.get('authorization');
                const token = extractToken(authHeader || undefined);

                if (!token) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Authorization required'
                    }), { status: 401, headers: corsHeaders });
                }

                // Verify JWT and get user
                const _jwtSecret = env.JWT_SECRET || 'dev-secret-key-change-in-production';
                let payload;
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) throw new Error('Invalid token');
                    let padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                    while (padded.length % 4) padded += '=';
                    const payloadStr = atob(padded);
                    payload = JSON.parse(payloadStr);
                } catch (e) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Invalid token'
                    }), { status: 401, headers: corsHeaders });
                }

                // Store OAuth tokens in database
                const googleOAuthId = `google_${payload.sub}_${Date.now()}`;
                await env.DB.prepare(`
                    INSERT OR REPLACE INTO google_oauth (
                        id, user_id, tenant_id, google_id, email, 
                        access_token, refresh_token, token_expiry, scopes, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    googleOAuthId,
                    payload.sub,
                    payload.tenantId,
                    googleUser.id,
                    googleUser.email,
                    tokens.access_token,
                    tokens.refresh_token || null,
                    tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
                    'calendar profile email',
                    Math.floor(Date.now() / 1000),
                    Math.floor(Date.now() / 1000)
                ).run();

                // Update user with Google info if needed
                await env.DB.prepare(`
                    UPDATE users SET 
                        google_id = ?, 
                        updated_at = ?
                    WHERE id = ?
                `).bind(
                    googleUser.id,
                    Math.floor(Date.now() / 1000),
                    payload.sub
                ).run();

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        googleId: googleUser.id,
                        email: googleUser.email,
                        name: googleUser.name,
                        picture: googleUser.picture,
                        tokenExpiry: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null
                    }
                }), { status: 200, headers: corsHeaders });

            } catch (error) {
                logger.error('Google OAuth callback error', { error });
                return new Response(JSON.stringify({
                    success: false,
                    error: 'OAuth callback failed'
                }), { status: 500, headers: corsHeaders });
            }
        }

        // GET /api/oauth/google/authorize - Get authorization URL
        if (path === '/api/oauth/google/authorize' && request.method === 'GET') {
            const scopes = url.searchParams.get('scopes') || 'calendar profile email';
            const redirectUri = url.searchParams.get('redirectUri') || GOOGLE_REDIRECT_URI;
            
            const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
            authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
            authUrl.searchParams.set('redirect_uri', redirectUri);
            authUrl.searchParams.set('response_type', 'code');
            authUrl.searchParams.set('scope', scopes);
            authUrl.searchParams.set('access_type', 'offline');
            authUrl.searchParams.set('prompt', 'consent');

            return new Response(JSON.stringify({
                success: true,
                data: {
                    authUrl: authUrl.toString()
                }
            }), { status: 200, headers: corsHeaders });
        }

        // GET /api/oauth/google/status - Check if user has Google OAuth connected
        if (path === '/api/oauth/google/status' && request.method === 'GET') {
            try {
                const authHeader = request.headers.get('authorization');
                const token = extractToken(authHeader || undefined);

                if (!token) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Authorization required'
                    }), { status: 401, headers: corsHeaders });
                }

                // Decode JWT
                let payload;
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) throw new Error('Invalid token');
                    let padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                    while (padded.length % 4) padded += '=';
                    const payloadStr = atob(padded);
                    payload = JSON.parse(payloadStr);
                } catch (e) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Invalid token'
                    }), { status: 401, headers: corsHeaders });
                }

                // Check if user has Google OAuth
                const oauth = await env.DB.prepare(`
                    SELECT id, google_id, email, token_expiry FROM google_oauth 
                    WHERE user_id = ? 
                    LIMIT 1
                `).bind(payload.sub).first();

                if (!oauth) {
                    return new Response(JSON.stringify({
                        success: true,
                        data: { connected: false }
                    }), { status: 200, headers: corsHeaders });
                }

                const isExpired = oauth.token_expiry && oauth.token_expiry < Math.floor(Date.now() / 1000);

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        connected: true,
                        googleId: oauth.google_id,
                        email: oauth.email,
                        isExpired,
                        needsRefresh: isExpired
                    }
                }), { status: 200, headers: corsHeaders });

            } catch (error) {
                logger.error('Google OAuth status check error', { error });
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Status check failed'
                }), { status: 500, headers: corsHeaders });
            }
        }

        return new Response(JSON.stringify({
            error: 'OAuth endpoint not found'
        }), { status: 404, headers: corsHeaders });

    } catch (error) {
        logger.error('Google OAuth endpoint error', { error, path });
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error'
        }), { status: 500, headers: corsHeaders });
    }
}
