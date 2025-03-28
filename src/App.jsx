import React, { useState, useEffect, useMemo, useCallback } from "react";
import FetchService from "@/services/fetcher";
import Logger from "@/services/logger";
import Icon from "@/components/Icon";
import { debounce, formatDate, generateUUID } from "@/utils";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useI18n } from "@/hooks/useI18n";
import "@/styles/index.css";

const newsLogger = new Logger({
  type: import.meta.env.VITE_LOGGER_TYPE || "console",
});

const NewsExplorer = () => {
  const { t, changeLocale, locale } = useI18n();
  const [query, setQuery] = useState("react");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchService = useMemo(() => {
    return new FetchService({
      defaultOptions: {
        headers: {
          "User-Agent":
            "BunForge News Explorer (https://github.com/cptnwinky/BunForge)",
        },
      },
    });
  }, []);

  // Debounced search function to fetch articles from Hacker News
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchArticles = useCallback(
    debounce(async (searchQuery) => {
      setLoading(true);
      newsLogger.log("info", `Searching articles for query: ${searchQuery}`);
      try {
        const response = await fetchService.get(
          `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await response.json();
        newsLogger.log("info", `Fetched ${data.hits.length} articles.`);
        setArticles(data.hits);
        setError(null);
      } catch (err) {
        newsLogger.log("error", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500),
    [fetchService]
  );

  // Effect to trigger search on query change.
  useEffect(() => {
    fetchArticles(query);
  }, [query, fetchArticles]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>{t("error_occurred", "Error Occurred")}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>{t("title", "Hacker News Explorer")}</h1>
        <Icon
          iconSet="fa"
          iconName="FaNewspaper"
          size={48}
          style={{ color: "#4287f5" }}
        />
        {/* Language switcher */}
        <button onClick={() => changeLocale(locale === "en" ? "es" : "en")}>
          {t("change_language", "Change Language")}
        </button>
      </header>
      <section className="search-section">
        <h2>{t("search_articles", "Search Articles")}</h2>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder={t("search_placeholder", "Enter search term...")}
          style={{ padding: "0.5rem", width: "100%", maxWidth: "400px" }}
        />
      </section>
      <main className="main">
        {loading ? (
          <div className="loading-container">
            <h2>{t("loading_articles", "Loading Articles...")}</h2>
          </div>
        ) : articles.length > 0 ? (
          <ul className="articles-list">
            {articles.map((article) => (
              <li key={generateUUID()} className="article-item">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <h3>{article.title || t("no_title", "No title")}</h3>
                </a>
                <p>
                  <strong>{t("author", "Author")}:</strong> {article.author} |{" "}
                  <strong>{t("published", "Published")}:</strong>{" "}
                  {article.created_at
                    ? formatDate(article.created_at, "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("no_articles", `No articles found for "${query}".`)}</p>
        )}
      </main>
      {/* New Section: Row of Simple Icons linking to their projects */}
      <section
        className="projects-icons"
        style={{ padding: "1rem", textAlign: "center" }}
      >
        <h2>{t("tech_stack", "Our Technology Stack")}</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <a href="https://bun.sh/" target="_blank" rel="noopener noreferrer">
            <Icon iconSet="si" iconName="SiBun" size={32} title="Bun" />
          </a>
          <a
            href="https://vitejs.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon iconSet="si" iconName="SiVite" size={32} title="Vite" />
          </a>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon iconSet="si" iconName="SiReact" size={32} title="React" />
          </a>
          <a
            href="https://sentry.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon iconSet="si" iconName="SiSentry" size={32} title="Sentry" />
          </a>
          <a
            href="https://eslint.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon iconSet="si" iconName="SiEslint" size={32} title="ESLint" />
          </a>
          <a
            href="https://prettier.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              iconSet="si"
              iconName="SiPrettier"
              size={32}
              title="Prettier"
            />
          </a>
        </div>
      </section>
      {/* Link to GitHub repository */}
      <section
        className="github-link"
        style={{
          textAlign: "center",
          marginTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <a
          href="https://github.com/Dave-Wagner/BunForge"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("github_link", "Visit our GitHub Repository")}
        </a>
      </section>
      <footer className="footer">
        <p>{t("api_data", "Data provided by the Hacker News Algolia API.")}</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <NewsExplorer />
    </ErrorBoundary>
  );
}
