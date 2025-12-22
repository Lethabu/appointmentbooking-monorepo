// packages/worker/src/helpers.ts

export function escapeHtml(input: any) {
    if (!input && input !== 0) return '';
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function formatPrice(priceCents: number | null | undefined, currency: string | null | undefined) {
    try {
        const cents = Number(priceCents) || 0;
        const cur = currency || 'ZAR';
        // assume priceCents stored as integer cents, convert to decimal
        const amount = (cents / 100).toFixed(2);
        return `${cur} ${amount}`;
    } catch (e) {
        return '';
    }
}
