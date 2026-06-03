import time

chat_db = {}

def add_memory(user_id, role, text):
    if user_id not in chat_db:
        chat_db[user_id] = []

    chat_db[user_id].append({
        "role": role,
        "text": text,
        "timestamp": time.time()
    })


def get_all_memories():
    all_msgs = []

    for user in chat_db:
        all_msgs.extend(chat_db[user])

    # sort strictly by time
    all_msgs.sort(key=lambda x: x["timestamp"])

    return all_msgs