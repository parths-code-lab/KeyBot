from fastapi import FastAPI
from serpapi import GoogleSearch
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from bs4 import BeautifulSoup as bs
import re
from fake_useragent import UserAgent as ua
from pydantic import BaseModel
import base64
import os

api_key = os.getenv("SERPAPI_KEY")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/trending_now")
def trending(category: str | None = None):
    with open("trending.json", "r",encoding="utf-8") as f:
        data_json = json.load(f)

    fields = data_json["trending_searches"]
    data = []
    
    
    for item in fields:
        if int(item["increase_percentage"]) >= 100:
            trend_val = "up"
        else:
            trend_val = "down"
        categories = item["categories"]
        category_name = categories[0]["name"] if categories else None

        if category and category != category_name:
            continue
        keyword = str(item["query"])
        data.append({
            "keyword": keyword.title(),
            "searches": item["search_volume"],
            "change": str(item["increase_percentage"]) + " %",
            "trend": trend_val,
            "category": category_name
        })

    return data



@app.get("/import")
def import_values():
    # fetch data 
    params = {
        "engine" : "google_trends_trending_now",
        "geo" : "IN",
        "api_key" : api_key
    }

    # store it into data variable
    data = GoogleSearch(params).get_dict()


    # import data into json file
    with open("trending.json", "w",encoding="utf-8") as f:
        json.dump(data, f, indent = 2, ensure_ascii=False)


@app.get("/competitor_analysis")
def fetch_web(url : str):
    commonWords = {
        "the", "and", "for", "you", "your", "with", "from", "that", "this","are", "was", "were", "has", "have", "had", "not", "but", "can","will", "just", "into", "out", "about", "over", "under", "again","more", "most", "some", "such", "only", "own", "same", "than","too", "very", "get", "use", "used", "using", "make", "made","like", "want", "need", "also", "how", "why", "what", "when","where", "who", "which", "all", "any", "each", "few", "other","because", "while", "if", "then", "so", "than", "it", "its","is", "in", "on", "at", "by", "an", "be", "as", "or", "of","to", "we", "they", "he", "she", "them", "his", "her"
    }

    uselessWords = {
        "click","download","open","welcome","free","easy","latest","new","start","started","get","use"
    }

    headers = {
    "User-Agent": ua().random,
    "Accept-Language" : "en-US,en;q=0.9",
    "Accept-Encoding" : "gzip, deflate, br, zstd",
    "Connection" : "keep-alive",
    "Referer" : "https://www.bing.com/",

    }

    
    s = requests.session()
    html = s.get(url, headers = headers).text
    soup = bs(html, "html.parser")

    keywords = set()

    if soup.title:
        keywords.update(soup.title.text.lower().split())

    meta = soup.find("meta", attrs={"name": "keywords"})
    if meta:
        keywords.update(meta["content"].lower().split())

    for tag in soup.find_all(["h1","h2","h3"]):
        keywords.update(tag.text.lower().split())

    keywords = {re.sub(r'[^a-zA-Z0-9]', '', w) for w in keywords}
    keywords = {w for w in keywords if len(w) > 2 and w not in commonWords and w not in uselessWords}

    return {
        "keywords": list(keywords)
    }



#image screen
class ImageRequest(BaseModel):
    image: str  # base64 image

@app.post("/analyze-image")
def analyze_image(request: ImageRequest):
    # Remove base64 header
    image_data = request.image.split(",")[1]

    
    vision_url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB5FiQIBAGf8DwGbl1LLUKcMTIx_0KtV_s"

    payload = {
        "requests": [
            {
                "image": {
                    "content": image_data
                },
                "features": [
                    {"type": "LABEL_DETECTION", "maxResults": 10}
                ]
            }
        ]
    }
    
    response = requests.post(vision_url, json=payload)
    result = response.json()
    
    if "responses" not in result:
        print("VISION ERROR:", result)
        return {"keywords": [], "error": result}

    labels = result["responses"][0].get("labelAnnotations", [])

    keywords = [
        {
            "keyword": label["description"],
            "confidence": int(label["score"] * 100),
        }
        for label in labels
    ]
    
    return {"keywords": keywords}


# Data Bridge for Keyword Search Screen

@app.get("/search_value")
def trending(q: str):
    params = {
        "engine": "google_trends",
        "geo": "IN",
        "q": q,
        "data_type": "RELATED_QUERIES",
        "api_key": api_key
    }

    data_json = GoogleSearch(params).get_dict()
    fields = data_json.get("related_queries", {}).get("rising", [])

    data = []
    for item in fields:
        
        volume = f'{item["extracted_value"] / 1000:.1f} K'
        data.append({
            "term": item["query"],
            "volume": volume,
            "score": item["extracted_value"],
            "strength": item["value"]
        })

    return data
