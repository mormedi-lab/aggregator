import requests
from bs4 import BeautifulSoup
from typing import Optional
from PIL import Image
from io import BytesIO

def extract_image_url(url: str) -> Optional[str]:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, timeout=6, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # 1. Check Open Graph and Twitter Card
        for prop in ["og:image", "twitter:image"]:
            meta = soup.find("meta", property=prop) or soup.find("meta", attrs={"name": prop})
            if meta and meta.get("content") and is_large_image(meta["content"]):
                return meta["content"]

        # 2. Find images within specific containers
        containers = soup.find_all(['article', 'main', 'section', 'div'], class_=lambda x: x and 'content' in x)
        for container in containers:
            images = container.find_all('img')
            for img in images:
                src = img.get('src') or img.get('data-src')
                if src and src.startswith(('http', '//')) and not is_ad_or_logo(src):
                    if src.startswith('//'):
                        src = 'https:' + src
                    if is_large_image(src):
                        return src

        # 3. Fallback: search all images
        images = soup.find_all('img')
        for img in images:
            src = img.get('src') or img.get('data-src')
            if src and src.startswith(('http', '//')) and not is_ad_or_logo(src):
                if src.startswith('//'):
                    src = 'https:' + src
                if is_large_image(src):
                    return src

    except Exception as e:
        print(f"⚠️ Error in extract_image_url: {e}")

    return None

def is_ad_or_logo(src: str) -> bool:
    blacklist = ["logo", "icon", "sprite", "ads", "advert", "tracker", ".svg", ".gif"]
    return any(bad in src.lower() for bad in blacklist)

def is_large_image(src: str, min_width: int = 300, aspect_ratio_range: tuple = (0.5, 2.5)) -> bool:
    try:
        response = requests.get(src, timeout=5)
        img = Image.open(BytesIO(response.content))
        width, height = img.size
        aspect = width / height if height != 0 else 0
        return width >= min_width and aspect_ratio_range[0] <= aspect <= aspect_ratio_range[1]
    except Exception:
        return False
