import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Container, Table, Button, Form } from "react-bootstrap";
import convertToLatex from "../utils/latex_convert";

export default function LatexSpreadsheet() {
  // Start with 3 rows and 3 columns as example
  const [rows, setRows] = useState(() => {
    // Try load from localStorage
    const saved = localStorage.getItem("latexSheet");
    if (saved) return JSON.parse(saved);
    return [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  });

  // Save on rows change
  useEffect(() => {
    localStorage.setItem("latexSheet", JSON.stringify(rows));
  }, [rows]);

  // To manage refs to inputs for focus control:
  const inputRefs = useRef({}); // keys: `${rowIndex}-${colIndex}`

  // Add row
  const addRow = () => {
    setRows((prev) => [...prev, Array(prev[0]?.length || 3).fill("")]);
  };

  // Add column
  const addColumn = () => {
    setRows((prev) =>
      prev.map((row) => [...row, ""])
    );
  };

  // Handle input change
  const handleChange = (rowIndex, colIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  // Handle Enter key: go down cell or add row if needed
  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextRowIndex = rowIndex + 1;
      if (nextRowIndex >= rows.length) {
        // Add new row
        addRow();
      }
      // Focus next row same column after slight delay to ensure row added
      setTimeout(() => {
        const key = `${nextRowIndex}-${colIndex}`;
        if (inputRefs.current[key]) {
          inputRefs.current[key].focus();
        }
      }, 10);
    }
  };

  // For LaTeX rendering, convert all cells in a row to latex for display (optional)
  const getLatex = (input) => {
    try {
      return convertToLatex(input);
    } catch {
      return "";
    }
  };

  return (
    <Container className="py-5">
      <h3>LaTeX Spreadsheet</h3>
      <p className="text-muted">
        Unlimited rows and columns. Press Enter to move down.
      </p>

      <Button className="me-2" onClick={addRow}>
        Add Row
      </Button>
      <Button className="me-2" onClick={addColumn}>
        Add Column
      </Button>

      <Table bordered hover responsive className="mt-3">
        <thead>
          <tr>
            {rows[0]?.map((_, colIndex) => (
              <th key={colIndex}>Col {colIndex + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                const latex = getLatex(cell);
                return (
                  <td key={colIndex} style={{ minWidth: "150px", verticalAlign: "top" }}>
                    <Form.Control
                      type="text"
                      value={cell}
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      ref={(el) => (inputRefs.current[`${rowIndex}-${colIndex}`] = el)}
                      placeholder="Type math expression"
                    />
                    {latex && (
                      <div style={{ marginTop: 5, color: "green" }}>
                        <BlockMath math={latex} />
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
