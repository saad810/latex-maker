import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import convertToLatex from "../utils/latex_convert";

export default function LatexRenderer() {
  const [input, setInput] = useState("");
  const [latex, setLatex] = useState("");

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Math to LaTeX Converter</Card.Title>
              <Form>
                <Form.Group controlId="mathInput">
                  <Form.Label>Enter Math Expression</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="e.g., lim x->0 (sin x)/x"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => setLatex(convertToLatex(input))}
                >
                  Convert to LaTeX
                </Button>
              </Form>
              {latex && (
                <div className="mt-4">
                  <h5>Rendered Output:</h5>
                  <BlockMath math={latex} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}