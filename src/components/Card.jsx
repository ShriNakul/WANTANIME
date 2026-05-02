import React from "react";
import { Col } from "react-bootstrap";

const Card = ({ anime, children, badgeButton }) => {
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
          {badgeButton}
        </div>

        <div
          className="mt-3 fw-bold text-uppercase small text-white"
          style={{ maxWidth: "240px" }}
        >
          <div className="mb-2 text-truncate">{anime?.title}</div>
          <div className="d-grid gap-2">{children}</div>
        </div>
      </div>
    </Col>
  );
};

export default Card;
