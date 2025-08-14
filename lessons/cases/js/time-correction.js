export function evaluateTimeAnswer(correctAnswers, userStr) {
  // Grade weights (higher = better)
  const gradeValues = { A: 3, B: 2, C: 1, D: 0 };

  // Determine grade between one correct answer and the user string
  function getGrade(correct, user) {
    if (correct === user) return 'A';
    if (correct.toLowerCase() === user.toLowerCase()) return 'B';

    function normalize(str) {
      return str
        .toLowerCase()
        .replace(/ue/g, 'ü')
        .replace(/oe/g, 'ö')
        .replace(/ae/g, 'ä')
        .replace(/o/g, 'ö')
        .replace(/u/g, 'ü')
        .replace(/nn/g, 'n')      // remove double‐n noise
        .replace(/ss/g, 'ß')
        .replace(/sz/g, 'ß')
        .replace(/z/g, 'ß')
        .replace(/s/g, 'ß')
        .replace(/veir/g, 'vier')
        .replace(/drie/g, 'drei')
        .replace(/funf/g, 'fünf');
    }

    const a = normalize(correct);
    const b = normalize(user);
    if (a === b) return 'C';
    return 'D';
  }

  // If no correct answers, automatically worst grade
  if (correctAnswers.length === 0) {
    return { grade: 'D', match: null };
  }

  // Phase 1: grade all candidates
  const ranked = correctAnswers.map(ans => ({
    answer: ans,
    grade: getGrade(ans, userStr),
    score: gradeValues[getGrade(ans, userStr)]
  }));

  // Phase 2: sort descending by score
  ranked.sort((a, b) => b.score - a.score);

  // Best‐scoring candidate
  const { grade, answer: match } = ranked[0];

  return { grade, match };
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
