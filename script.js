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