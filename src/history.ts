const HISTORY_KEY = "keybot_history";

export function getHistory() {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToHistory(item: {
  type: "keyword" | "image" | "competitor";
  query: string;
}) {
  const history = getHistory();

  history.unshift({
    ...item,
    date: new Date().toISOString(),
  });

  // Keep last 20 entries
  const trimmed = history.slice(0, 20);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
