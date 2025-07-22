
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const SECRET_PASSPHRASE = "create-a-strong-passphrase"

async function getKey() {
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(SECRET_PASSPHRASE),
        "PBKDF2",
        false,
        ["deriveKey"]
    )

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("some-salt"),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )
}

export async function encrypt(data: string): Promise<string> {
    const key = await getKey()
    const iv = window.crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(data)
    )

    const encryptedBytes = new Uint8Array(encrypted)
    const result = new Uint8Array(iv.length + encryptedBytes.length)
    result.set(iv)
    result.set(encryptedBytes, iv.length)

    return btoa(String.fromCharCode(...result))
}

export async function decrypt(cipherText: string): Promise<string> {
    const rawData = atob(cipherText)
    const dataBytes = new Uint8Array([...rawData].map(c => c.charCodeAt(0)))
    const iv = dataBytes.slice(0, 12)
    const data = dataBytes.slice(12)

    const key = await getKey()
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
    )

    return decoder.decode(decrypted)
}
