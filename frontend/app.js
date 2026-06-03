let threads = {}
let currentThread = null

// CREATE THREAD
function createThread() {

    let id = "thread" + Object.keys(threads).length

    threads[id] = []

    currentThread = id

    renderThreads()
    renderMessages()
}

// RENDER THREAD LIST
function renderThreads() {

    let html = ""

    for (let t in threads) {

        let activeClass = t === currentThread ? "active" : ""

        html += `
        <div class="thread ${activeClass}"
             onclick="selectThread('${t}')">

             💬 ${t}

        </div>
        `
    }

    document.getElementById("threadList").innerHTML = html

    let counter = document.getElementById("threadCount")

    if(counter){
        counter.innerText = Object.keys(threads).length
    }
}

// SELECT THREAD
function selectThread(t) {

    currentThread = t

    renderThreads()
    renderMessages()
}

// RENDER MESSAGES
function renderMessages() {

    let msgs = threads[currentThread] || []

    let html = ""

    msgs.forEach(m => {

        html += `
        <div class="user-message">
            <strong>You</strong><br>
            ${m.user}
        </div>
        `

        html += `
        <div class="ai-message">
            <strong>AI Assistant</strong><br>
            ${m.ai}
        </div>
        `
    })

    document.getElementById("messages").innerHTML = html

    let msgBox = document.getElementById("messages")
    msgBox.scrollTop = msgBox.scrollHeight

    let counter = document.getElementById("threadCount")

    if(counter){
        counter.innerText = Object.keys(threads).length
    }
}

// SEND MESSAGE
async function sendMessage() {

    let input = document.getElementById("messageInput")
    let msg = input.value.trim()

    if (!msg || !currentThread) return

    try {

        let res = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: currentThread,
                message: msg
            })
        })

        if (!res.ok) {
            throw new Error("Server error: " + res.status)
        }

        let data = await res.json()

        console.log("DEBUG RESPONSE:", data)

        let aiReply = data?.response || "No response from AI"

        threads[currentThread].push({
            user: msg,
            ai: aiReply
        })

        renderMessages()

        input.value = ""

    } catch (err) {

        console.error("ERROR:", err)

        threads[currentThread].push({
            user: msg,
            ai: "⚠️ Error connecting to backend"
        })

        renderMessages()
    }
}

// ENTER KEY SUPPORT
document.addEventListener("DOMContentLoaded", () => {

    let input = document.getElementById("messageInput")

    if(input){
        input.addEventListener("keypress", function(e){

            if(e.key === "Enter"){
                sendMessage()
            }

        })
    }

})

// INITIAL THREAD
createThread()