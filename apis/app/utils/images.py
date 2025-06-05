import requests
from bs4 import BeautifulSoup
from typing import Optional

def extract_image_url(url: str) -> Optional[str]:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, timeout=6, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # 1. Try Open Graph image
        og = soup.find("meta", property="og:image")
        if og and og.get("content"):
            return og["content"]

        # 2. Try Twitter image
        twitter = soup.find("meta", attrs={"name": "twitter:image"})
        if twitter and twitter.get("content"):
            return twitter["content"]

        # 3. Try first large, relevant <img> in <article>, <main>, or body
        candidates = []
        for container in ["article", "main", "body"]:
            tag = soup.find(container)
            if tag:
                candidates.extend(tag.find_all("img"))
        
        # 4. Filter out bad images
        for img in candidates:
            src = img.get("src") or img.get("data-src") or ""
            if src.startswith("//"):
                src = "https:" + src
            if src.startswith("http") and not is_ad_or_logo(src):
                return src

    except Exception as e:
        print(f"⚠️ Failed image extraction from {url}: {e}")

    return None

def is_ad_or_logo(src: str) -> bool:
    blacklist = ["logo", "icon", "sprite", "ads", "advert", "tracker", ".svg", ".gif"]
    return any(bad in src.lower() for bad in blacklist)
