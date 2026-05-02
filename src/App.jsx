import React, { useState, useEffect } from "react";
import { Navbar, Container, Button, Spinner, Row } from "react-bootstrap";
import Card from "./components/Card";
import Wishlist from "./components/Wishlist";
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
  const [view, setView] = useState("browse"); // "browse" or "wishlist"

  // Load wishlist from LocalStorage on mount
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("anime-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Save wishlist to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("anime-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const fetchAnime = async (category) => {
    setLoading(true);
    try {
      let url = "";
      if (category === "My picks") {
        const queries = ["Death Note", "Demon Slayer", "JoJo"];
        const results = await Promise.all(
          queries.map((q) =>
            fetch(`https://api.jikan.moe/v4/anime?q=${q}&limit=1`).then((res) =>
              res.json(),
            ),
          ),
        );
        setAnimeList(results.map((r) => r.data[0]));
      } else if (category === "Popular") {
        const res = await fetch(`https://api.jikan.moe/v4/top/anime?limit=3`);
        const result = await res.json();
        setAnimeList(result.data);
      } else {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?genres=${GENRE_MAP[category]}&limit=10&order_by=score&sort=desc`,
        );
        const result = await res.json();
        setAnimeList(result.data.sort(() => 0.5 - Math.random()).slice(0, 3));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnime("Popular");
  }, []);

  const toggleWishlist = (anime) => {
    setWishlist((prev) =>
      prev.find((item) => item.mal_id === anime.mal_id)
        ? prev.filter((item) => item.mal_id !== anime.mal_id)
        : [...prev, anime],
    );
  };

  return (
    <div className="bg-black min-vh-100 text-white pb-5 font-monospace">
      <Navbar
        bg="dark"
        variant="dark"
        className="py-3 border-bottom border-secondary mb-4"
      >
        <Container>
          <Navbar.Brand className="text-uppercase small">
            WANTANIME: アニメを見たいんですよね？You want to watch anime, right?
          </Navbar.Brand>
          <Button variant="outline-warning" onClick={() => setView("wishlist")}>
            Wishlist ({wishlist.length})
          </Button>
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
                {animeList.map((anime) => (
                  <Card
                    key={anime.mal_id}
                    anime={anime}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlist.some(
                      (item) => item.mal_id === anime.mal_id,
                    )}
                  />
                ))}
              </Row>
            )}
          </>
        ) : (
          <Wishlist
            wishlist={wishlist}
            onRemove={toggleWishlist}
            onBack={() => setView("browse")}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
