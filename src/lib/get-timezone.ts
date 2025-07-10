export function getClientUTCOffset(): string {
    const offset = -new Date().getTimezoneOffset() / 60;
    return (offset >= 0 ? "+" : "") + offset.toString();
}
