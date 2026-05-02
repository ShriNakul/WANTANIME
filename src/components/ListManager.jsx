import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const ListManager = ({ title, items, onRemove, onFinish, onBack }) => {
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-uppercase fw-bold m-0">{title}</h2>
        <Button variant="outline-light" onClick={onBack}>
          ← Back
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-center opacity-50">Nothing here yet.</p>
      ) : (
        <Row className="g-4">
          {items.map((anime) => (
            <Col key={anime.mal_id} xs={6} md={3}>
              <Card className="bg-dark text-white border-secondary h-100 shadow-sm">
                <Card.Img
                  src={anime.images.jpg.image_url}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body className="p-2 d-flex flex-column justify-content-between text-center">
                  <div className="small fw-bold mb-2 text-truncate">
                    {anime.title}
                  </div>
                  <div className="d-grid gap-1">
                    <Button
                      size="sm"
                      variant="warning"
                      href={`https://www.google.com/search?q=where+to+watch+${encodeURIComponent(anime.title)}+anime`}
                      target="_blank"
                    >
                      Watch
                    </Button>
                    {onFinish && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => onFinish(anime)}
                      >
                        Finished
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => onRemove(anime)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ListManager;
