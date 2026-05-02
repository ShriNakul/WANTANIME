import React from "react";
import { Col, Button } from "react-bootstrap";

const Card = ({ anime, onToggleWishlist, isWishlisted }) => {
  return (
    <Col xs={12} md={4} className="d-flex justify-content-center">
      <div className="text-center">
        <div
          className="position-relative"
          style={{ width: "240px", height: "340px" }}
        >
          <img
            src={anime?.images.jpg.large_image_url}
            className="rounded-5 shadow-lg"
            style={{
              border: "5px solid #fff",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt={anime?.title}
          />
          <Button
            variant={isWishlisted ? "danger" : "light"}
            className="position-absolute rounded-circle d-flex align-items-center justify-content-center shadow"
            style={{
              top: "15px",
              right: "15px",
              width: "40px",
              height: "40px",
              padding: "0",
              fontSize: "1.2rem",
              zIndex: "10",
              border: "2px solid white",
            }}
            onClick={() => onToggleWishlist(anime)}
          >
            {isWishlisted ? "❤️" : "♡"}
          </Button>
        </div>
        <div
          className="mt-3 fw-bold text-uppercase small text-white"
          style={{ maxWidth: "240px" }}
        >
          {anime?.title}
        </div>
      </div>
    </Col>
  );
};

export default Card;
