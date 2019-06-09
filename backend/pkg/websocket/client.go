package websocket

import (
    "fmt"
    "log"
    "encoding/json"
    "github.com/gorilla/websocket"
)

type Client struct {
    Conn *websocket.Conn
    Pool *Pool
}

type Message struct {
    Type int `json:"type"`
    Body string `json:"body"`
}

type MessageBody struct {
    Email string `json:"email"`
    Body string `json:"body"`
}

func broadcastMessage(c * Client, msgBody MessageBody) {
  clientMessage := Message{Type: 0, Body: string(msgBody.Body)}
  c.Pool.Messages[msgBody.Email] = append(c.Pool.Messages[msgBody.Email], &clientMessage)
  c.Pool.Broadcast <- clientMessage
  fmt.Printf("Message Broadcasted: %+v\n", clientMessage)
}

func broadcastWelcomeBackReturningUser(c * Client, msgBody MessageBody) {
  for m := 0; m < len(c.Pool.Messages[msgBody.Email]); m++ {
    fmt.Printf("Message Broadcasted: %+v\n", *c.Pool.Messages[msgBody.Email][m])
    c.Pool.Broadcast <- *c.Pool.Messages[msgBody.Email][m]
  }
}

func broadcastWelcomeUser(c * Client, msgBody MessageBody) {
  broadcastWelcomeBackReturningUser(c, msgBody);
  messages := [2]Message {Message{Type: 1, Body: string(fmt.Sprintf("%s joined the chat", msgBody.Email))},
      Message{Type: 1, Body: string(fmt.Sprintf("Welcome to Mount Sinai! I’m your helper bot. Please send any questions you may have."))}}
    for _, message := range messages {
        c.Pool.Broadcast <- message
        fmt.Printf("Message Broadcasted: %+v\n", message)
    }
  }

func (c *Client) Read() {
    defer func() {
        c.Pool.Unregister <- c
        c.Conn.Close()
    }()

    for {
        _, p, err := c.Conn.ReadMessage()

        if err != nil {
            log.Println(err)
            return
        }
        fmt.Printf("Message Received: %+v\n", string(p))

        var msgBody MessageBody
        errJson := json.Unmarshal(p, &msgBody)
        if errJson != nil {
          fmt.Println(errJson)
          return
        }

        if len(msgBody.Body) > 0 && len(msgBody.Email) > 0 {
          broadcastMessage(c, msgBody)
        } else{
          broadcastWelcomeUser(c, msgBody)
        }
    }
}
