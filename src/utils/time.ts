/**
 * Parses a time string in HH:MM:SS or MM:SS format to seconds.
 * @param timeStr - The time string to parse.
 * @returns The time in seconds.
 */
export const parseTimeToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    let seconds = 0;
    if (parts.length === 3) {
        seconds += parseInt(parts[0]) * 3600;
        seconds += parseInt(parts[1]) * 60;
        seconds += parseFloat(parts[2]);
    } else if (parts.length === 2) {
        seconds += parseInt(parts[0]) * 60;
        seconds += parseFloat(parts[1]);
    }
    return seconds;
};

/**
 * Formats seconds to a time string in HH:MM:SS or MM:SS format.
 * @param seconds - The time in seconds.
 * @returns The formatted time string.
 */
export const formatTimeFromSeconds = (seconds: number): string => {
    if (!seconds) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');

    if (h > 0) {
        return `${h}:${mStr}:${sStr}`;
    }
    return `${mStr}:${sStr}`;
};