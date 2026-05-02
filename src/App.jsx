import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Button,
  Spinner,
  Row,
  Modal,
  Col,
} from "react-bootstrap";
import Card from "./components/Card";
import ListManager from "./components/ListManager";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const GENRE_MAP = {
  Popular: "popular",
  Action: 1,
  Fantasy: 10,
  "Slice of Life": 36,
  Comedy: 4,
  Sports: 30,
  Isekai: 62,
  "My picks": "custom",
};

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [view, setView] = useState("browse");
  const [selectedAnime, setSelectedAnime] = useState(null);

  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem("anime-list");
    return saved ? JSON.parse(saved) : [];
  });

  const [finishedList, setFinishedList] = useState(() => {
    const saved = localStorage.getItem("anime-finished");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("anime-list", JSON.stringify(myList));
    localStorage.setItem("anime-finished", JSON.stringify(finishedList));
  }, [myList, finishedList]);

  const fetchAnime = async (category) => {
    setLoading(true);
    try {
      if (category === "My picks") {
        const queries = [
          "Death Note",
          "JoJo's Bizarre Adventure",
          "Demon Slayer",
          "Jujutsu Kaisen",
          "Sakamoto Days",
          "One Piece",
        ];
        const results = await Promise.all(
          queries.map((q) =>
            fetch(
              `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`,
            ).then((res) => res.json()),
          ),
        );
        setAnimeList(results.map((r) => r.data[0]).filter(Boolean));
      } else if (category === "Popular") {
        const res = await fetch(`https://api.jikan.moe/v4/top/anime?limit=15`);
        const result = await res.json();
        setAnimeList(result.data);
      } else {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?genres=${GENRE_MAP[category]}&limit=20&order_by=score&sort=desc`,
        );
        const result = await res.json();
        setAnimeList(result.data.sort(() => 0.5 - Math.random()));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnime("Popular");
  }, []);

  const toggleList = (anime) => {
    setMyList((prev) =>
      prev.find((item) => item.mal_id === anime.mal_id)
        ? prev.filter((item) => item.mal_id !== anime.mal_id)
        : [...prev, anime],
    );
  };

  const markAsFinished = (anime) => {
    setMyList((prev) => prev.filter((item) => item.mal_id !== anime.mal_id));
    setFinishedList((prev) => [...prev, anime]);
  };

  const filteredList = (
    activeCategory === "My picks"
      ? animeList
      : animeList.filter(
          (anime) =>
            !myList.some((m) => m.mal_id === anime.mal_id) &&
            !finishedList.some((f) => f.mal_id === anime.mal_id),
        )
  ).slice(0, 6);

  return (
    <div className="bg-black min-vh-100 text-white pb-5 font-monospace">
      <Navbar
        bg="dark"
        variant="dark"
        className="py-3 border-bottom border-secondary mb-4"
      >
        <Container>
          <Navbar.Brand
            className="text-uppercase small"
            onClick={() => setView("browse")}
            style={{ cursor: "pointer" }}
          >
            WANTANIME: アニメを見たいんですよね？
          </Navbar.Brand>
          <div className="d-flex gap-2">
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => setView("list")}
            >
              My List ({myList.length})
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setView("finished")}
            >
              Finished ({finishedList.length})
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container>
        {view === "browse" ? (
          <>
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
              {Object.keys(GENRE_MAP).map((cat) => (
                <Button
                  key={cat}
                  variant="light"
                  className={`rounded-pill px-3 fw-bold ${activeCategory === cat ? "opacity-100" : "opacity-50"}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    fetchAnime(cat);
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>
            {loading ? (
              <div className="text-center mt-5">
                <Spinner animation="grow" variant="light" />
              </div>
            ) : (
              <Row className="justify-content-center g-4">
                {filteredList.map((anime) => (
                  <Card
                    key={anime.mal_id}
                    anime={anime}
                    onSelect={setSelectedAnime}
                    badgeButton={
                      <Button
                        variant={
                          myList.some((m) => m.mal_id === anime.mal_id)
                            ? "danger"
                            : "light"
                        }
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleList(anime);
                        }}
                      >
                        {myList.some((m) => m.mal_id === anime.mal_id)
                          ? "❤️"
                          : "♡"}
                      </Button>
                    }
                  />
                ))}
              </Row>
            )}
          </>
        ) : (
          <ListManager
            title={view === "list" ? "My Watch List" : "Finished Anime"}
            items={view === "list" ? myList : finishedList}
            onSelect={setSelectedAnime}
            onRemove={(anime) =>
              view === "list"
                ? toggleList(anime)
                : setFinishedList((prev) =>
                    prev.filter((i) => i.mal_id !== anime.mal_id),
                  )
            }
            onFinish={view === "list" ? markAsFinished : null}
            onBack={() => setView("browse")}
          />
        )}
      </Container>

      <Modal
        show={selectedAnime !== null}
        onHide={() => setSelectedAnime(null)}
        centered
        size="lg"
      >
        {selectedAnime && (
          <div className="modal-content">
            <Modal.Header closeButton closeVariant="white">
              <Modal.Title>{selectedAnime.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4}>
                  <img
                    src={selectedAnime.images.jpg.large_image_url}
                    className="img-fluid rounded shadow border border-light"
                    alt={selectedAnime.title}
                  />
                </Col>
                <Col md={8}>
                  <h5 className="text-warning">Synopsis</h5>
                  <p className="small opacity-75">
                    {selectedAnime.synopsis || "No description available."}
                  </p>
                  <hr className="bg-secondary" />
                  <div className="d-flex flex-wrap gap-3 small">
                    <div>
                      <strong>Score:</strong> ⭐ {selectedAnime.score || "N/A"}
                    </div>
                    <div>
                      <strong>Episodes:</strong> {selectedAnime.episodes || "?"}
                    </div>
                    <div>
                      <strong>Status:</strong> {selectedAnime.status}
                    </div>
                    <div>
                      <strong>Rank:</strong> #{selectedAnime.rank || "N/A"}
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-light"
                onClick={() => setSelectedAnime(null)}
              >
                Close
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
