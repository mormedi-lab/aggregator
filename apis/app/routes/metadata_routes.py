from fastapi import APIRouter, HTTPException
import requests
from urllib.parse import urlparse as safe_urlparse
from bs4 import BeautifulSoup

from app.agents.summarize_url_agent import summarize_article
from app.models.summary import MetadataResponse

router = APIRouter()

@router.get("/metadata", response_model=MetadataResponse)
def get_url_for_metadata(url: str) -> MetadataResponse:
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

        return MetadataResponse(
            headline=title,
            summary=summary_text,
            publisher=domain
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch or summarize metadata: {str(e)}")
