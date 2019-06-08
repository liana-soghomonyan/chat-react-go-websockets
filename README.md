# Chat application with Go and React

The chat prototype uses Golang and Websockets for backend server and React for its frontend. When user connects to the chat client via React UI the Welcome screen asks for an email for joining the chat room. Upon successful email validation a Websocket connection is initiated with the Golang server and the chat interface is then maintained by the server and socket communication. No database layer is used for this excersice and application state is restarted when the server or client are restarted. The server keeps track of the messages per client identified by the email addredd entered. So if the same email address is used to join a chat the chat history is shown after successful join. 
For UI side using create-react-app<https://reactjs.org/docs/create-a-new-react-app.html> bootstrapper is used.

### Usage

* Collects one input field, email and offers “Join chat!” button.
* Opens a Chat Room with chat
* System automatically emits a welcome message
* Shows message counter at top increments up as each message is added live.
* User can type any number of other messages that append to the window chat room
* If User rejoined to the chat room with the same email address, system welcomes them back and shows the history of messages

### Prerequisites

* npm installed
* npx installed (npm install -g npx)
* Go 1.11+ installed


### Start the Server

* export GOPATH
* cd GOPATH/src/chat-react-go-websockets/backend
* go get github.com/gorilla/websocket
* $ cd backend
* $ go run main.go from the chat-react-go-websockets/backend
* The output in terminal should be "Simple Chat App with Websockets"


### Start the Client
* $ cd frontend
* npm install
* npm start
* Go to localhost:3000

![Alt text](/Users/lsoghomonyan/Downloads/Screen Shot 2019-06-08 at 6.04.36 PM.png?raw=true "First and Returning Welcomes")

