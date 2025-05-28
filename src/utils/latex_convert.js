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

    // Inverse trig
    latex = latex.replace(/\b(sin|cos|tan|sec|csc|cot)\s*\^\s*-1\b/gi, (_, fn) => `\\${fn.toLowerCase()}^{-1}`);

    // Trig/log/ln functions
    const funcs = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'log', 'ln'];
    funcs.forEach(fn => {
        const regex = new RegExp(`(?<!\\\\)(?<![a-zA-Z])${fn}(?=\\(|[a-zA-Z])`, 'gi');
        latex = latex.replace(regex, `\\${fn}`);
    });

    // Function definitions (f(x) = ...)
    latex = latex.replace(/([a-z])\(([^)]*)\)\s*=\s*/gi, '$1($2) = ');

    // Limits
    latex = latex.replace(/lim\s*([a-z])\s*->\s*([a-zA-Z0-9∞+\-]+)/gi, '\\lim_{$1 \\to $2}');

    // Summation
    latex = latex.replace(/Σ\s*([a-z])=([^\^]+)\^([^\s]+)\s+(.+?)(?=\s|$)/gi, '\\sum_{$1=$2}^{$3} $4');

    // Derivatives
    latex = latex.replace(/∂([a-zA-Z])\/∂([a-zA-Z])/g, '\\frac{\\partial $1}{\\partial $2}');
    latex = latex.replace(/d\/d([a-zA-Z])\s*\(([^)]+)\)/gi, '\\frac{d}{d$1}($2)');
    latex = latex.replace(/d([a-zA-Z])\/d([a-zA-Z])/gi, '\\frac{d$1}{d$2}');

    // Fractions
    latex = latex.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\frac{$1}{$2}');
    latex = latex.replace(/([a-zA-Z]+\([^)]*\))\/([a-zA-Z]+\([^)]*\))/g, '\\frac{$1}{$2}');
    latex = latex.replace(/\b(\d+)\/(\d+)\b/g, '\\frac{$1}{$2}');
    latex = latex.replace(/([a-zA-Z0-9^+\-*/]+)\/([a-zA-Z0-9^+\-*/]+)/g, '\\frac{$1}{$2}');

    // Exponents
    latex = latex.replace(/([a-zA-Z0-9]+)\^\(([^)]+)\)/g, '{$1}^{$2}');
    latex = latex.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '{$1}^{$2}');

    // Integrals
    latex = latex.replace(/∫_([^\^]+)\^([^\s]+)\s+(.+?)\s*d([a-zA-Z])/gi, '\\int_{$1}^{$2} $3 \\, d$4');
    latex = latex.replace(/∫\s*(.+?)\s*d([a-zA-Z])/gi, '\\int $1 \\, d$2');

    // Infinity and ellipsis
    latex = latex.replace(/\b(inf|∞)\b/gi, '\\infty');
    latex = latex.replace(/\.{3}/g, '\\ldots');

    // Intervals
    latex = latex.replace(/\[([^\],]+),\s*([^\]]+)\]/g, '\\left[$1, $2\\right]');
    latex = latex.replace(/\(([^\),]+),\s*([^\)]+)\)/g, '\\left($1, $2\\right)');

    // Roots
    latex = latex.replace(/\bsqrt\(([^)]+)\)/gi, '\\sqrt{$1}');
    latex = latex.replace(/\broot\((\d+)\)\(([^)]+)\)/gi, '\\sqrt[$1]{$2}');

    // Matrices
    latex = latex.replace(/\[\s*([^\[\];]+);([^\[\];]+)\s*\]/g, (_, row1, row2) => {
        const formatRow = r => r.split(',').map(x => x.trim()).join(' & ');
        return `\\begin{bmatrix} ${formatRow(row1)} \\\\ ${formatRow(row2)} \\end{bmatrix}`;
    });

    // Greek letters
    for (const [word, latexCmd] of Object.entries(greekMap)) {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        latex = latex.replace(regex, latexCmd);
    }

    // Absolute value
    latex = latex.replace(/\babs\(([^)]+)\)/gi, '\\left|$1\\right|');

    // Factorials
    latex = latex.replace(/([0-9a-zA-Z]+)!/g, '{$1}!');

    // Add space around + and - (optional)
    latex = latex.replace(/(?<=\S)\+(?=\S)/g, ' + ');
    latex = latex.replace(/(?<=\S)-(?=\S)/g, ' - ');

    return latex;
}
