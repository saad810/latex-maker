// import { useState } from "react";
// import { BlockMath } from "react-katex";
// import "katex/dist/katex.min.css";
// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

// function convertFunctionsAndLimitsToLatex(input) {
//   let latex = input.trim();

//   // 1. Replace common math functions
//   latex = latex.replace(/\blog\b/gi, '\\log');
//   latex = latex.replace(/\bsin\b/gi, '\\sin');
//   latex = latex.replace(/\bcos\b/gi, '\\cos');
//   latex = latex.replace(/\btan\b/gi, '\\tan');
//   latex = latex.replace(/\bln\b/gi, '\\ln');

//   // 2. Function definitions (e.g., f(x) = ...)
//   latex = latex.replace(/([a-z])\(([^)]*)\)\s*=\s*/gi, '$1($2) = ');

//   // 3. Limits
//   latex = latex.replace(/lim\s*([a-z])\s*->\s*([a-zA-Z0-9∞+\-]+)/gi, '\\lim_{$1 \\to $2}');

//   // 4. Fractions
//   latex = latex.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '\\frac{$1}{$2}');

//   // Optional basic fraction like 1/2 → \frac{1}{2} when not in brackets
//   latex = latex.replace(/\b(\d+)\/(\d+)\b/g, '\\frac{$1}{$2}');

//   // 5. Exponents
//   latex = latex.replace(/([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '{$1}^{$2}');

//   // 6. Derivatives
//   latex = latex.replace(/d\/d([a-zA-Z])\s*\(([^)]+)\)/gi, '\\frac{d}{d$1}($2)');
//   latex = latex.replace(/d([a-zA-Z])\/d([a-zA-Z])/gi, '\\frac{d$1}{d$2}');

//   // 7. Integrals
//   latex = latex.replace(/∫_([^\^]+)\^([^\s]+)\s+(.+?)\s*d([a-zA-Z])/gi, '\\int_{$1}^{$2} $3 \\, d$4');
//   latex = latex.replace(/∫\s*(.+?)\s*d([a-zA-Z])/gi, '\\int $1 \\, d$2');

//   // 8. Infinity and ellipsis
//   latex = latex.replace(/\b(inf|∞)\b/gi, '\\infty');
//   latex = latex.replace(/\.{3}/g, '\\ldots');

//   // 9. Interval notation: [3,6), (-∞, ∞]
//   latex = latex.replace(/\[([^\],]+),\s*([^\]]+)\]/g, '\\left[$1, $2\\right]');
//   latex = latex.replace(/\(([^\),]+),\s*([^\)]+)\)/g, '\\left($1, $2\\right)');

//   // Add spacing around + and -
//   latex = latex.replace(/\+/g, ' + ');
//   latex = latex.replace(/-/g, ' - ');

//   return latex;
// }


// function LatexRenderer() {
//   const [input, setInput] = useState("");
//   const [latex, setLatex] = useState("");

//   return (
//     <Container className="py-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <Card.Title className="mb-3">Math to LaTeX Converter</Card.Title>
//               <Form>
//                 <Form.Group controlId="mathInput">
//                   <Form.Label>Enter Math Expression</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={4}
//                     placeholder="e.g., lim x->0 (sin x)/x"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                   />
//                 </Form.Group>
//                 <Button
//                   variant="primary"
//                   className="mt-3"
//                   onClick={() => setLatex(convertFunctionsAndLimitsToLatex(input))}
//                 >
//                   Convert to LaTeX
//                 </Button>
//               </Form>
//               {latex && (
//                 <div className="mt-4">
//                   <h5>Rendered Output:</h5>
//                   <BlockMath math={latex} />
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// const App = () => {
//   return <LatexRenderer />;
// };

// export default App;
import React, { useState } from 'react';
import Papa from 'papaparse';

function App() {
  const [originalData, setOriginalData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        const cols = results.meta.fields;
        setOriginalData(data);
        setHeaders(cols);
      }
    });
  };

  const handleColumnSelection = (col) => {
    setSelectedColumns(prev =>
      prev.includes(col)
        ? prev.filter(c => c !== col)
        : [...prev, col]
    );
  };

  const processData = () => {
    const newData = originalData.map(row => {
      const updatedRow = { ...row };
      selectedColumns.forEach(col => {
        if (updatedRow[col]) {
          updatedRow[col] = updatedRow[col].toUpperCase(); // example processing
        }
      });
      return updatedRow;
    });

    setProcessedData(newData);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(processedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "processed_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CSV Column Processor</h1>

      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {headers.length > 0 && (
        <>
          <h3>Select Columns to Process</h3>
          {headers.map((col) => (
            <label key={col} style={{ display: "block", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => handleColumnSelection(col)}
              />{" "}
              {col}
            </label>
          ))}

          <button onClick={processData} style={{ marginTop: 10 }}>
            Process
          </button>
        </>
      )}

      {processedData.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Download Updated CSV</h3>
          <button onClick={downloadCSV}>Download</button>
        </div>
      )}
    </div>
  );
}

export default App;
