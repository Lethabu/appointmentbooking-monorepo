/**
 * JWT utilities for token signing and verification
 * Uses Web Crypto API (available in Cloudflare Workers)
 */

export interface JWTPayload {
    sub: string; // subject (user ID)
    email: string;
    role: 'user' | 'staff' | 'admin';
    tenantId: string;
    iat: number; // issued at
    exp: number; // expiration
}

interface JWTHeader {
    alg: string;
    typ: string;
}

/**
 * Secret key - in production should come from environment
 * Format: base64url encoded
 */
let JWT_SECRET: string = '';

export function setJWTSecret(secret: string) {
    JWT_SECRET = secret;
}

/**
 * Base64url encode
 */
function base64urlEncode(data: string): string {
    const encoded = btoa(data);
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64url decode
 */
function base64urlDecode(encoded: string): string {
    let padded = encoded.replace(/\-/g, '+').replace(/_/g, '/');
    while (padded.length % 4) {
        padded += '=';
    }
    try {
        return atob(padded);
    } catch (e) {
        throw new Error('Invalid base64url encoding');
    }
}

/**
 * Sign a JWT token using HMAC-SHA256
 */
export async function signJWT(payload: JWTPayload, secret?: string): Promise<string> {
    const actualSecret = secret || JWT_SECRET;
    if (!actualSecret) {
        throw new Error('JWT_SECRET not configured');
    }

    const header: JWTHeader = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const headerEncoded = base64urlEncode(JSON.stringify(header));
    const payloadEncoded = base64urlEncode(JSON.stringify(payload));
    const message = `${headerEncoded}.${payloadEncoded}`;

    // Create HMAC signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(actualSecret);
    const messageData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const signatureArray = Array.from(new Uint8Array(signature));
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
    const signatureEncoded = signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    return `${message}.${signatureEncoded}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string, secret?: string): Promise<JWTPayload> {
    const actualSecret = secret || JWT_SECRET;
    if (!actualSecret) {
        throw new Error('JWT_SECRET not configured');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

    // Verify signature
    const message = `${headerEncoded}.${payloadEncoded}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(actualSecret);
    const messageData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    // Decode signature
    let paddedSignature = signatureEncoded.replace(/\-/g, '+').replace(/_/g, '/');
    while (paddedSignature.length % 4) {
        paddedSignature += '=';
    }
    const signatureBytes = new Uint8Array(atob(paddedSignature).split('').map(c => c.charCodeAt(0)));

    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, messageData);
    if (!isValid) {
        throw new Error('Invalid signature');
    }

    // Decode payload
    const payloadStr = base64urlDecode(payloadEncoded);
    const payload = JSON.parse(payloadStr) as JWTPayload;

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
    }

    return payload;
}

/**
 * Create a new JWT token for a user
 */
export async function createToken(
    userId: string,
    email: string,
    role: 'user' | 'staff' | 'admin',
    tenantId: string,
    expiresIn: number = 86400 * 7, // 7 days in seconds
    secret?: string
): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
        sub: userId,
        email,
        role,
        tenantId,
        iat: now,
        exp: now + expiresIn
    };

    return signJWT(payload, secret);
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
}
