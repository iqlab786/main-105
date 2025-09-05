from fastapi import FastAPI
from routes import auth, db_connection, ingest, metadata
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.responses import FileResponse


app = FastAPI(title="Metadata Catalog API")

app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or use ["http://localhost"] for more security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html") 

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")


app.include_router(auth.router)
app.include_router(db_connection.router)
app.include_router(ingest.router)
app.include_router(metadata.router)


@app.get("/")
def health_check():
    return {"status": "ok"}
