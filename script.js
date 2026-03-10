const cfg = window.copyflixconfig || {};

async function fetchFromApi(endpoints, params = {}) {
    if(!cfg.baseUrl || !cfg.apikey) {
        console.warn(
            "[copyflix] configure 'baseUrl' em confing.js para buscar dados reais da API."
        );
        return null;
    }

    const url = new URL(endpoint, cfg.baseUrl);
  const search = url.searchParams;
    
  if (cfg.apiKey) {
    search.set("api_key", cfg.apiKey);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) search.set(key, value);
  });

  try {
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error("Erro na requisição: " + res.status);
    return await res.json();
  } catch (err) {
    console.error("[Copyflix] Erro ao buscar dados da API:", err);
    return null;
  }
}

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (!cfg.imageBaseUrl) return path;
  return cfg.imageBaseUrl.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

let heroItems = [];
let heroIndex = 0;
let heroTimerId = null;

function renderHero() {
  const item = heroItems[heroIndex];
  const titleEl = document.getElementById("hero-title");
  const overviewEl = document.getElementById("hero-overview");
  const backgroundEl = document.getElementById("hero-background");
  const paginationEl = document.getElementById("hero-pagination");

  if (!item) {
    titleEl.textContent = "Nenhum destaque disponível";
    overviewEl.textContent =
      "Configure a API em config.js para carregar filmes reais.";
    backgroundEl.style.backgroundImage =
      "linear-gradient(120deg, #111 0%, #222 50%, #000 100%)";
    paginationEl.innerHTML = "";
    return;
  }

  titleEl.textContent = item.title || item.name || "Título desconhecido";
  overviewEl.textContent =
    item.overview ||
    item.description ||
    "Sem sinopse disponível. Conecte a API para ver mais detalhes.";

  const backdrop =
    item.backdrop_path || item.poster_path || item.image || item.banner;
  const bgUrl = getImageUrl(backdrop);
  backgroundEl.style.backgroundImage = bgUrl
    ? `url("${bgUrl}")`
    : "linear-gradient(120deg, #111 0%, #222 50%, #000 100%)";

  // Paginação (bolinhas)
  paginationEl.innerHTML = "";
  heroItems.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot" + (idx === heroIndex ? " active" : "");
    dot.type = "button";
    dot.addEventListener("click", () => {
      heroIndex = idx;
      restartHeroTimer();
      renderHero();
    });
    paginationEl.appendChild(dot);
  });
}

function nextHero() {
  if (heroItems.length === 0) return;
  heroIndex = (heroIndex + 1) % heroItems.length;
  renderHero();
}

function restartHeroTimer() {
  if (heroTimerId) clearInterval(heroTimerId);
  heroTimerId = setInterval(nextHero, 8000);
}
