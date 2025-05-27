const greekMap = {
  alpha: '\\alpha', beta: '\\beta', gamma: '\\gamma', delta: '\\delta', epsilon: '\\epsilon',
  zeta: '\\zeta', eta: '\\eta', theta: '\\theta', iota: '\\iota', kappa: '\\kappa',
  lambda: '\\lambda', mu: '\\mu', nu: '\\nu', xi: '\\xi', pi: '\\pi', rho: '\\rho',
  sigma: '\\sigma', tau: '\\tau', upsilon: '\\upsilon', phi: '\\phi', chi: '\\chi',
  psi: '\\psi', omega: '\\omega',
  Gamma: '\\Gamma', Delta: '\\Delta', Theta: '\\Theta', Lambda: '\\Lambda',
  Xi: '\\Xi', Pi: '\\Pi', Sigma: '\\Sigma', Phi: '\\Phi', Psi: '\\Psi', Omega: '\\Omega'
};

export default function convertToLatex(input) {
  let latex = input.trim();

  // Basic functions
  latex = latex.replace(/\blog\b/gi, '\\log')
               .replace(/\bsin\b/gi, '\\sin')
               .replace(/\bcos\b/gi, '\\cos')
               .replace(/\btan\b/gi, '\\tan')
               .replace(/\bln\b/gi, '\\ln');

  // Limits
  latex = latex.replace(/lim\s*([a-z])\s*->\s*([a-zA-Z0-9∞+\-]+)/gi, '\\lim_{$1 \\to $2}');

  // Fractions
  latex = latex.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\frac{$1}{$2}')
               .replace(/\b(\d+)\/(\d+)\b/g, '\\frac{$1}{$2}');

  // Exponents
  latex = latex.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '{$1}^{$2}');

  // Derivatives
  latex = latex.replace(/d\/d([a-zA-Z])\s*\(([^)]+)\)/gi, '\\frac{d}{d$1}($2)')
               .replace(/d([a-zA-Z])\/d([a-zA-Z])/gi, '\\frac{d$1}{d$2}');

  // Integrals
  latex = latex.replace(/∫_([^\^]+)\^([^\s]+)\s+(.+?)\s*d([a-zA-Z])/gi, '\\int_{$1}^{$2} $3 \\, d$4')
               .replace(/∫\s*(.+?)\s*d([a-zA-Z])/gi, '\\int $1 \\, d$2');

  // Infinity, ellipsis
  latex = latex.replace(/\b(inf|∞)\b/gi, '\\infty')
               .replace(/\.{3}/g, '\\ldots');

  // Interval Notation
  latex = latex.replace(/\[([^\],]+),\s*([^\]]+)\]/g, '\\left[$1, $2\\right]')
               .replace(/\(([^\),]+),\s*([^\)]+)\)/g, '\\left($1, $2\\right)');

  // Spacing
  latex = latex.replace(/\s*\+\s*/g, ' + ')
               .replace(/\s*-\s*/g, ' - ');

  // Roots
  latex = latex.replace(/\bsqrt\(([^)]+)\)/gi, '\\sqrt{$1}')
               .replace(/\broot\((\d+)\)\(([^)]+)\)/gi, '\\sqrt[$1]{$2}');

  // Greek letters
  for (const [word, latexCmd] of Object.entries(greekMap)) {
    latex = latex.replace(new RegExp(`\\b${word}\\b`, 'g'), latexCmd);
  }

  return latex;
}
