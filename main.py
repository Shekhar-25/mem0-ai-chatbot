from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from memory_store import add_memory, get_all_memories
from llm_interface import ask_llm

app = FastAPI()

# ✅ Enable CORS (important for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(data: dict):

    user_id = data.get("user_id")
    message = data.get("message")

    msg = message.lower()

    # 🔥 SPECIAL CASE: RETURN ALL CONVERSATIONS (NO AI USED)
    if (
        "show all" in msg
        or "all conversations" in msg
        or "previous conversations" in msg
        or "conversation history" in msg
    ):
        all_msgs = get_all_memories()

        output_lines = []

        for m in all_msgs:
            if m["role"] == "user":
                output_lines.append(f"You: {m['text']}")
            else:
                output_lines.append(f"AI: {m['text']}")

        return {"response": "\n".join(output_lines)}

    # ✅ NORMAL FLOW

    # Store user message
    add_memory(user_id, "user", message)

    # Get AI response
    response = ask_llm(message)

    # Store AI response
    add_memory(user_id, "ai", response)

    return {"response": response}