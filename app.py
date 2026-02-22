from fastapi import FastAPI
from anthropic import Anthropic
import os

app = FastAPI()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

@app.get("/api/generate")
async def generate(prompt: str):
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"response": response.content[0].text}

