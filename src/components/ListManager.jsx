import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

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
            <Col
              key={anime.mal_id}
              xs={12}
              md={4}
              className="d-flex justify-content-center"
            >
              <div className="text-center">
                {/* MATCHING IMAGE STYLE FROM CARD.JSX */}
                <div
                  className="position-relative shadow-lg"
                  style={{
                    width: "240px",
                    height: "340px",
                    border: "5px solid #fff",
                    borderRadius: "2rem", // This matches rounded-5
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      anime.images.jpg.large_image_url ||
                      anime.images.jpg.image_url
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt={anime.title}
                  />
                </div>

                {/* TITLE & ACTIONS */}
                <div
                  className="mt-3 fw-bold text-uppercase small text-white"
                  style={{ maxWidth: "240px" }}
                >
                  <div className="mb-2 text-truncate">{anime.title}</div>

                  <div className="d-grid gap-2">
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
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ListManager;
