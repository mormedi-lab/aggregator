from fastapi import APIRouter
import requests
from urllib.parse import urlparse as safe_urlparse
from bs4 import BeautifulSoup

from app.agents.summarize_url_agent import summarize_article
from app.models.summary import SummaryResponse

router = APIRouter()

@router.get("/metadata")
def get_url_for_metadata(url: str):
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "lxml")
        title = soup.title.string.strip() if soup.title else "Untitled Page"
        domain = safe_urlparse(url).netloc.replace("www.", "")

        paragraphs = soup.find_all("p")
        full_text = " ".join(p.get_text() for p in paragraphs).strip()
        if not full_text:
            raise ValueError("No readable text found.")

        summary_text = summarize_article(full_text)
        if summary_text is None:
            raise ValueError("Summary generation failed.")

        summary = SummaryResponse(summary=summary_text)

        return {
            "headline": title,
            "summary": summary.summary,
            "publisher": domain
        }
        

    except Exception as e:
        return {"error": f"Could not fetch or summarize metadata: {str(e)}"}
