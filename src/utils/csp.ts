"use client";

export function getNonce(): string {
    // Check for global nonce first (most reliable)
    if (typeof window !== 'undefined' && window.__nonce) {
        return window.__nonce;
    }

    // Fallback to meta tag
    if (typeof document !== 'undefined') {
        // Try data attribute on body first
        const bodyNonce = document.body.getAttribute('data-nonce');
        if (bodyNonce) {
            return bodyNonce;
        }

        // Then try meta tag
        const nonceMetaTag = document.querySelector('meta[name="csp-nonce"]');
        const nonce = nonceMetaTag?.getAttribute('content') || '';

        return nonce;
    }

    return '';
}