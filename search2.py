import urllib.request, urllib.parse, json, re

def search_ddg(query, max_results=5):
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            snippets = re.findall(r'class="result__snippet"[^>]*>(.*?)</a>', html, re.DOTALL)
            titles = re.findall(r'class="result__title"[^>]*>.*?<a[^>]*>(.*?)</a>', html, re.DOTALL)
            links = re.findall(r'class="result__title"[^>]*>.*?<a[^>]*href="([^"]+)"', html)
            results = []
            for i in range(min(len(titles), len(links), max_results)):
                t = re.sub(r"<[^>]+>", "", titles[i]).strip()
                l = links[i]
                s = re.sub(r"<[^>]+>", "", snippets[i]).strip() if i < len(snippets) else ""
                results.append({"title": t, "url": l, "snippet": s[:200]})
            return results
    except Exception as e:
        return [{"error": str(e)}]

queries = [
    ("AI最新进展 2026", 3),
    ("AI代码能力优化 2026", 2),
    ("AI长期记忆管理优化 2026", 2),
]
for q, n in queries:
    print(f"=== Query: {q}")
    r = search_ddg(q, n)
    print(json.dumps(r, ensure_ascii=False, indent=2)[:1500])
    print()

print("DONE")