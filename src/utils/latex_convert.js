// const greekMap = {
//   alpha: '\\alpha', beta: '\\beta', gamma: '\\gamma', delta: '\\delta', epsilon: '\\epsilon',
//   zeta: '\\zeta', eta: '\\eta', theta: '\\theta', iota: '\\iota', kappa: '\\kappa',
//   lambda: '\\lambda', mu: '\\mu', nu: '\\nu', xi: '\\xi', pi: '\\pi', rho: '\\rho',
//   sigma: '\\sigma', tau: '\\tau', upsilon: '\\upsilon', phi: '\\phi', chi: '\\chi',
//   psi: '\\psi', omega: '\\omega',
//   Gamma: '\\Gamma', Delta: '\\Delta', Theta: '\\Theta', Lambda: '\\Lambda',
//   Xi: '\\Xi', Pi: '\\Pi', Sigma: '\\Sigma', Phi: '\\Phi', Psi: '\\Psi', Omega: '\\Omega'
// };

// export default function convertToLatex(input) {
//   let latex = input.trim();

//   // Basic functions
//   latex = latex.replace(/\blog\b/gi, '\\log')
//                .replace(/\bsin\b/gi, '\\sin')
//                .replace(/\bcos\b/gi, '\\cos')
//                .replace(/\btan\b/gi, '\\tan')
//                .replace(/\bln\b/gi, '\\ln');

//   // Limits
//   latex = latex.replace(/lim\s*([a-z])\s*->\s*([a-zA-Z0-9∞+\-]+)/gi, '\\lim_{$1 \\to $2}');

//   // Fractions
//   latex = latex.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\frac{$1}{$2}')
//                .replace(/\b(\d+)\/(\d+)\b/g, '\\frac{$1}{$2}');

//   // Exponents
//   latex = latex.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '{$1}^{$2}');

//   // Derivatives
//   latex = latex.replace(/d\/d([a-zA-Z])\s*\(([^)]+)\)/gi, '\\frac{d}{d$1}($2)')
//                .replace(/d([a-zA-Z])\/d([a-zA-Z])/gi, '\\frac{d$1}{d$2}');

//   // Integrals
//   latex = latex.replace(/∫_([^\^]+)\^([^\s]+)\s+(.+?)\s*d([a-zA-Z])/gi, '\\int_{$1}^{$2} $3 \\, d$4')
//                .replace(/∫\s*(.+?)\s*d([a-zA-Z])/gi, '\\int $1 \\, d$2');

//   // Infinity, ellipsis
//   latex = latex.replace(/\b(inf|∞)\b/gi, '\\infty')
//                .replace(/\.{3}/g, '\\ldots');

//   // Interval Notation
//   latex = latex.replace(/\[([^\],]+),\s*([^\]]+)\]/g, '\\left[$1, $2\\right]')
//                .replace(/\(([^\),]+),\s*([^\)]+)\)/g, '\\left($1, $2\\right)');

//   // Spacing
//   latex = latex.replace(/\s*\+\s*/g, ' + ')
//                .replace(/\s*-\s*/g, ' - ');

//   // Roots
//   latex = latex.replace(/\bsqrt\(([^)]+)\)/gi, '\\sqrt{$1}')
//                .replace(/\broot\((\d+)\)\(([^)]+)\)/gi, '\\sqrt[$1]{$2}');

//   // Greek letters
//   for (const [word, latexCmd] of Object.entries(greekMap)) {
//     latex = latex.replace(new RegExp(`\\b${word}\\b`, 'g'), latexCmd);
//   }

//   return latex;
// }

const greekMap = {
  alpha: '\\alpha', beta: '\\beta', gamma: '\\gamma', delta: '\\delta',
  epsilon: '\\epsilon', zeta: '\\zeta', eta: '\\eta', theta: '\\theta',
  iota: '\\iota', kappa: '\\kappa', lambda: '\\lambda', mu: '\\mu',
  nu: '\\nu', xi: '\\xi', pi: '\\pi', rho: '\\rho', sigma: '\\sigma',
  tau: '\\tau', upsilon: '\\upsilon', phi: '\\phi', chi: '\\chi',
  psi: '\\psi', omega: '\\omega',
  Gamma: '\\Gamma', Delta: '\\Delta', Theta: '\\Theta', Lambda: '\\Lambda',
  Xi: '\\Xi', Pi: '\\Pi', Sigma: '\\Sigma', Phi: '\\Phi', Psi: '\\Psi',
  Omega: '\\Omega'
};

export default function convertToLatex(input) {
  let latex = input.trim();

  // Functions
  latex = latex.replace(/\blog\b/gi, '\\log');
  latex = latex.replace(/\bsin\b/gi, '\\sin');
  latex = latex.replace(/\bcos\b/gi, '\\cos');
  latex = latex.replace(/\btan\b/gi, '\\tan');
  latex = latex.replace(/\bln\b/gi, '\\ln');

  // Inverse trig (e.g., sin^-1 → \sin^{-1})
  latex = latex.replace(/\b(sin|cos|tan|sec|csc|cot)\^-\s*1\b/gi, (_, fn) => `\\${fn.toLowerCase()}^{-1}`);

  // Function definitions
  latex = latex.replace(/([a-z])\(([^)]*)\)\s*=\s*/gi, '$1($2) = ');

  // Limits
  latex = latex.replace(/lim\s*([a-z])\s*->\s*([a-zA-Z0-9∞+\-]+)/gi, '\\lim_{$1 \\to $2}');

  // Summation (Σ from a to b)
  latex = latex.replace(/Σ\s*([a-z])=([^\^]+)\^([^\s]+)\s+(.+?)(?=\s|$)/gi, '\\sum_{$1=$2}^{$3} $4');

  // Partial derivatives
  latex = latex.replace(/∂([a-zA-Z])\/∂([a-zA-Z])/g, '\\frac{\\partial $1}{\\partial $2}');

  // Derivatives
  latex = latex.replace(/d\/d([a-zA-Z])\s*\(([^)]+)\)/gi, '\\frac{d}{d$1}($2)');
  latex = latex.replace(/d([a-zA-Z])\/d([a-zA-Z])/gi, '\\frac{d$1}{d$2}');

  // Fractions
  latex = latex.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\frac{$1}{$2}');
  latex = latex.replace(/\b(\d+)\/(\d+)\b/g, '\\frac{$1}{$2}');

  // Exponents
  latex = latex.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '{$1}^{$2}');

  // Integrals
  latex = latex.replace(/∫_([^\^]+)\^([^\s]+)\s+(.+?)\s*d([a-zA-Z])/gi, '\\int_{$1}^{$2} $3 \\, d$4');
  latex = latex.replace(/∫\s*(.+?)\s*d([a-zA-Z])/gi, '\\int $1 \\, d$2');

  // Infinity and ellipsis
  latex = latex.replace(/\b(inf|∞)\b/gi, '\\infty');
  latex = latex.replace(/\.{3}/g, '\\ldots');

  // Interval notation
  latex = latex.replace(/\[([^\],]+),\s*([^\]]+)\]/g, '\\left[$1, $2\\right]');
  latex = latex.replace(/\(([^\),]+),\s*([^\)]+)\)/g, '\\left($1, $2\\right)');

  // Square roots and nth roots
  latex = latex.replace(/\bsqrt\(([^)]+)\)/gi, '\\sqrt{$1}');
  latex = latex.replace(/\broot\((\d+)\)\(([^)]+)\)/gi, '\\sqrt[$1]{$2}');

  // Matrices (simple [a,b; c,d])
  latex = latex.replace(/\[\s*([^\[\];]+);([^\[\];]+)\s*\]/g, (_, row1, row2) => {
    const formatRow = r => r.split(',').map(x => x.trim()).join(' & ');
    return `\\begin{bmatrix} ${formatRow(row1)} \\\\ ${formatRow(row2)} \\end{bmatrix}`;
  });

  // Greek letters
  for (const [word, latexCmd] of Object.entries(greekMap)) {
    latex = latex.replace(new RegExp(`\\b${word}\\b`, 'g'), latexCmd);
  }

  // Custom spacing for + and -
  latex = latex.replace(/\+/g, ' + ');
  latex = latex.replace(/-/g, ' - ');

  return latex;
}
