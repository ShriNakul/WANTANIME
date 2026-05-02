import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import Card from "./Card";

const ListManager = ({ title, items, onRemove, onFinish, onBack }) => {
  const isFinishedView = title === "Finished Anime";

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
        <Row className="justify-content-center g-4">
          {items.map((anime) => (
            <Card key={anime.mal_id} anime={anime}>
              {!isFinishedView && (
                <>
                  <Button
                    size="sm"
                    variant="warning"
                    href={`https://www.google.com/search?q=where+to+watch+${encodeURIComponent(anime.title)}+anime`}
                    target="_blank"
                    className="fw-bold"
                  >
                    Watch Online
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onFinish(anime)}
                    className="fw-bold"
                  >
                    Mark Finished
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => onRemove(anime)}
                className="fw-bold"
              >
                Remove
              </Button>
            </Card>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ListManager;
