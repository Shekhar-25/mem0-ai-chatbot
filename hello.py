from mem0 import Memory

# initialize memory
memory = Memory()

# add a memory
memory.add("My name is Shekhar", user_id="1")

# search memory
result = memory.search("What is my name?", user_id="1")

print(result)