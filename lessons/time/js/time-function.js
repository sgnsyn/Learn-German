export function getRandomTime(format = '24hr') {
  let hour = Math.floor(Math.random() * (format === '12hr' ? 12 : 24));
  let minute = Math.floor(Math.random() * 60);

  // Ensure 12hr format has hour 1–12, not 0–11
  if (format === '12hr') {
    hour = hour === 0 ? 12 : hour;
  }

  // Format hour and minute with leading zero if needed
  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minute.toString().padStart(2, '0');

  return `${hourStr}:${minuteStr}`;
}

export function getOfficialTime(timeStr) {
  // Helper: convert number (0-59) to German words
  function numberToGerman(n) {
    const units = [
      'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun',
      'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
    ];
    const tens = [null, null, 'zwanzig', 'dreißig', 'vierzig', 'fünfzig'];

    if (n < 20) return units[n];
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return tens[t];

    // For compound numbers (21-99 non-round tens)
    let unitWord = units[u];
    if (u === 1) unitWord = 'ein';
    return `${unitWord}und${tens[t]}`;
  }

  const [hStr, mStr] = timeStr.split(':');
  const hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time format');
  }

  // Convert hours and minutes
  let hourWord = numberToGerman(hours);
  // Use 'ein' for 1 o'clock for precision
  if (hours === 1) {
    hourWord = 'ein';
  }
  const minuteWord = numberToGerman(minutes);

  return `${hourWord} uhr ${minuteWord}`;
}


