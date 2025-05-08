const numMap = {
    0: 'null', 1: 'eins', 2: 'zwei', 3: 'drei', 4: 'vier', 5: 'fünf',
    6: 'sechs', 7: 'sieben', 8: 'acht', 9: 'neun', 10: 'zehn',
    11: 'elf', 12: 'zwölf', 13: 'dreizehn', 14: 'vierzehn', 15: 'fünfzehn',
    16: 'sechzehn', 17: 'siebzehn', 18: 'achtzehn', 19: 'neunzehn',
    20: 'zwanzig', 30: 'dreißig', 40: 'vierzig', 50: 'fünfzig'
};

function numberToGerman(n) {
    if (numMap.hasOwnProperty(n)) {
        return numMap[n];
    }
    const tens = Math.floor(n / 10) * 10;
    const unit = n % 10;
    const unitWord = unit === 1 ? 'ein' : numMap[unit];
    return `${unitWord}und${numMap[tens]}`;
}

export function is24HourFormat(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (
    isNaN(hour) || isNaN(minute) ||
    hour < 0 || hour > 23 ||
    minute < 0 || minute > 59
  ) {
      return true
  }

  return hour === 0 || hour > 12;
}

export function getRandomTime(format = 'of') {
    let hour;
    if (format === 'co') {
        // Generate 1–12 directly
        hour = Math.floor(Math.random() * 12) + 1;
    } else {
        // 0–23 for 24-hour format
        hour = Math.floor(Math.random() * 24);
    }

    const minute = Math.floor(Math.random() * 60);

    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');

    return `${hourStr}:${minuteStr}`;
}

export function getOfficialTime(timeStr) {
    const [hStr, mStr] = timeStr.split(':');
    const hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr, 10);
    if (
        isNaN(hours) || isNaN(minutes) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59
    ) {
        throw new Error('Invalid time format');
    }

    // Hour: special-case “ein” (1 Uhr)
    let hourWord = numberToGerman(hours);
    if (hours === 1) hourWord = 'ein';

    // Minute
    const minuteWord = numberToGerman(minutes);

    return `${hourWord} Uhr ${minuteWord}`;
}

export function getUnofficialTime(timeStr) {
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const hrWord = numMap[h] || numberToGerman(h);
    const nextHr = h === 12 ? 1 : h + 1;
    const nextHrWord = numMap[nextHr] || numberToGerman(nextHr);
    const variants = new Set();

    // Rule A: exact hour
    if (m === 0) {
        variants.add(`${hrWord} Uhr`);
        variants.add(`genau ${hrWord} Uhr`);
        variants.add(`punkt ${hrWord}`);
        variants.add(`null Minuten nach ${hrWord}`);
    }

    // Helper for exact and minute phrases
    function exactMinAfter(min, roundWord) {
        const w = numberToGerman(min);
        variants.add(`${w} nach ${hrWord}`);
        variants.add(`${w} Minuten nach ${hrWord}`);
        if (roundWord) {
            variants.add(`${roundWord} nach ${hrWord}`);
        }
    }

    // Helper for before next hour
    function exactMinBefore(min, roundWord) {
        const w = numberToGerman(min);
        variants.add(`${w} vor ${nextHrWord}`);
        variants.add(`${w} Minuten vor ${nextHrWord}`);
        if (roundWord) {
            variants.add(`${roundWord} vor ${nextHrWord}`);
        }
    }

    if (m > 0 && m < 30) {
        // before half
        if (m <= 5) {
            // Rule B
            exactMinAfter(m, '');
            variants.add(`ungefähr ${numMap[0]} Minuten nach ${hrWord}`);
            variants.add(`ungefähr fünf nach ${hrWord}`);
            variants.add(`kurz nach ${hrWord}`);
        } else if (m < 10) {
            // Rule C-like
            exactMinAfter(m, 'zehn');
            variants.add(`ungefähr fünf nach ${hrWord}`);
            variants.add(`ungefähr zehn nach ${hrWord}`);
        } else if (m === 10) {
            // 10 past
            variants.add(`zehn nach ${hrWord}`);
            variants.add(`zehn Minuten nach ${hrWord}`);
        } else if (m < 15) {
            // between 10 and 15
            exactMinAfter(m, 'fünf');
            variants.add(`ungefähr zehn nach ${hrWord}`);
            variants.add(`ungefähr Viertel nach ${hrWord}`);
        } else if (m === 15) {
            variants.add(`fünfzehn nach ${hrWord}`);
            variants.add(`fünfzehn Minuten nach ${hrWord}`);
            variants.add(`Viertel nach ${hrWord}`);
        } else if (m < 20) {
            exactMinAfter(m, 'zwanzig');
            variants.add(`ungefähr Viertel nach ${hrWord}`);
            variants.add(`ungefähr zwanzig nach ${hrWord}`);
        } else if (m === 20) {
            variants.add(`zwanzig nach ${hrWord}`);
            variants.add(`zwanzig Minuten nach ${hrWord}`);
        } else if (m < 25) {
            exactMinAfter(m, 'fünf');
            variants.add(`ungefähr zwanzig nach ${hrWord}`);
            variants.add(`ungefähr fünfundzwanzig nach ${hrWord}`);
        } else if (m === 25) {
            variants.add(`fünfundzwanzig nach ${hrWord}`);
            variants.add(`fünfundzwanzig Minuten nach ${hrWord}`);
        } else {
            // 26-29: near half
            exactMinAfter(m, '');
            variants.add(`ungefähr halb ${nextHrWord}`);
            variants.add(`kurz vor halb ${nextHrWord}`);
            const diff = 30 - m;
            variants.add(`${numberToGerman(diff)} vor halb ${nextHrWord}`);
        }
    } else if (m === 30) {
        variants.add(`dreißig nach ${hrWord}`);
        variants.add(`dreißig Minuten nach ${hrWord}`);
        variants.add(`halb ${nextHrWord}`);
    } else {
        // after half
        const diff = 60 - m;
        if (diff <= 5) {
            // near next hour
            exactMinBefore(diff, '');
            variants.add(`kurz vor ${nextHrWord}`);
        } else if (diff < 10) {
            exactMinBefore(diff, 'zehn');
            variants.add(`ungefähr fünf vor ${nextHrWord}`);
            variants.add(`ungefähr zehn vor ${nextHrWord}`);
        } else if (diff === 10) {
            variants.add(`zehn vor ${nextHrWord}`);
            variants.add(`zehn Minuten vor ${nextHrWord}`);
        } else if (diff < 15) {
            exactMinBefore(diff, 'fünf');
            variants.add(`ungefähr zehn vor ${nextHrWord}`);
            variants.add(`ungefähr Viertel vor ${nextHrWord}`);
        } else if (diff === 15) {
            variants.add(`fünfzehn vor ${nextHrWord}`);
            variants.add(`fünfzehn Minuten vor ${nextHrWord}`);
            variants.add(`Viertel vor ${nextHrWord}`);
        } else if (diff < 20) {
            exactMinBefore(diff, 'zwanzig');
            variants.add(`ungefähr Viertel vor ${nextHrWord}`);
            variants.add(`ungefähr zwanzig vor ${nextHrWord}`);
        } else if (diff === 20) {
            variants.add(`zwanzig vor ${nextHrWord}`);
            variants.add(`zwanzig Minuten vor ${nextHrWord}`);
        } else if (diff < 25) {
            exactMinBefore(diff, 'fünf');
            variants.add(`ungefähr zwanzig vor ${nextHrWord}`);
            variants.add(`ungefähr fünfundzwanzig vor ${nextHrWord}`);
        } else {
            variants.add(`fünfundzwanzig vor ${nextHrWord}`);
            variants.add(`fünfundzwanzig Minuten vor ${nextHrWord}`);
        }
    }

    return Array.from(variants);
}
