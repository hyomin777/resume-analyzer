import re
from qdrant_client import QdrantClient
from config import Config

VECTOR_DB_CLIENT = QdrantClient(
    url=Config.QDRANT_URL,
    api_key=Config.QDRANT_API_KEY
)

def get_vector_db_client():
    return VECTOR_DB_CLIENT


def get_embedding(client, text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    text = re.sub(r'\s+', ' ', text).strip()
    return client.embeddings.create(input = [text], model=model).data[0].embedding


def load_vector_db(client: QdrantClient):
    if not client.collection_exists(collection_name="feedback"):
        client.create_collection(
            collection_name="feedback",
            vectors_config={"size": Config.HIDDEN_DIM, "distance": "Cosine"}
        )

def add_embedding(client: QdrantClient, id: int, embedding, payload):
    client.upsert(
        collection_name="feedback",
        points=[
            {
                "id": id,
                "vector": embedding,
                "payload": payload
            }
        ]
    )

def search_embedding(vector_db_client: QdrantClient, llm_client, collection_name:str, query: str):
    query_emb = get_embedding(query, llm_client)

    results = vector_db_client.search(
        collection_name=collection_name,
        query_vector=query_emb,
        limit=3,
        with_payload=True
    )

    return [{
                "id": result.id,
                "score": result.score,
                "payload": result.payload
            } for result in results]


def retrieve_similar_examples(query_text, llm_client, vector_db_client, collection="feedback"):
    results = search_embedding(vector_db_client, llm_client, collection, query_text)
    return results