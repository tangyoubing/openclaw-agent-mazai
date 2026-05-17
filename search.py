import urllib.request, urllib.parse, json, re, sys

def search_google(query, num=5):
    url = "https://www.google.com/search?q=" + urllib.parse.quote(query) + "&num=" + str(num)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            titles = re.findall(r"<h3[^>]*>(.*?)</h3>", html)
            links = re.findall(r'<a href="/url\?q=([^"]+)"', html)
            results = []
            for i in range(min(len(titles), len(links))):
                t = re.sub(r"<[^>]+>", "", titles[i])
                l = urllib.parse.unquote(links[i].split("&")[0])
                results.append({"title": t, "url": l})
            return results
    except Exception as e:
        return [{"error": str(e)}]

queries = ["AI最新进展 2026", "AI代码能力优化 2026", "AI长期记忆管理优化 2026"]
for q in queries:
    print("=== Query:", q)
    r = search_google(q, 5)
    print(json.dumps(r, ensure_ascii=False, indent=2)[:1200])

print("DONE")
