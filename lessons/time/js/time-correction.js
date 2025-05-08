export function evaluateTimeAnswer(correctStr, userStr) {
  if (correctStr === userStr) return 'A';
  if (correctStr.toLowerCase() === userStr.toLowerCase()) return 'B';

  // Normalize umlauts and handle common typos
function normalize(str) {
    return str
      .toLowerCase()
      .replace(/ue/g, 'ü')
      .replace(/oe/g, 'ö')
      .replace(/o/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/u/g, 'ü') // catch "funf" -> "fünf"
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/veir/g, 'vier')
      .replace(/drie/g, 'drei')
      .replace(/funf/g, 'fünf')
      .replace(/ss/g, 'ß')
      .replace(/sz/g, 'ß')
      .replace(/z/g, 'ß')
      .replace(/s/g, 'ß');
  }

  const normalizedCorrect = normalize(correctStr);
  const normalizedUser = normalize(userStr);

  if (normalizedCorrect === normalizedUser) return 'C';

  return 'D';
}

export function compareStringsAndHighlight(str1, str2, el, severity) {
  const m = str1.length, n = str2.length;
  // 1) Build LCS table
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 2) Backtrack to collect which indices in str1 are matched
  const matched = new Set();
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      matched.add(i - 1);
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  // 3) Build highlighted HTML
  let html = '';
  for (let k = 0; k < m; k++) {
    let cls;
    if (matched.has(k)) {
      cls = 'error-msg error-green';
    } else {
      cls = (severity === 'D')
        ? 'error-msg error-red'
        : 'error-msg error-yellow';
    }
    html += `<span class="${cls}">${str1[k]}</span>`;
  }

  // 4) Inject into the element
  el.innerHTML = html;
}
