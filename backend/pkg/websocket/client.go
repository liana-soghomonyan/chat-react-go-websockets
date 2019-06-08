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
    Type string `json:"type"`
    Body string `json:"body"`
}

type MessageBody struct {
    Email string `json:"email"`
    Content string `json:"content"`
}
func broadcastMessage(c * Client, msgBody MessageBody) Message{
  clientMessage := Message{Type: "CLIENT", Body: string(msgBody.Content)}
  c.Pool.Messages[msgBody.Email] = append(c.Pool.Messages[msgBody.Email], &clientMessage)
  c.Pool.Broadcast <- clientMessage
  return clientMessage;
}

func broadcastWelcomeBackReturningUser(c * Client, msgBody MessageBody) Message{
  clientMessage := Message{Type: "SERVER", Body: string(fmt.Sprintf("Welcome back, %s!", msgBody.Email))}
  c.Pool.Broadcast <- clientMessage
  for m := 0; m < len(c.Pool.Messages[msgBody.Email]); m++ {
    fmt.Printf("Message in array: %+v\n", *c.Pool.Messages[msgBody.Email][m])
    c.Pool.Broadcast <- *c.Pool.Messages[msgBody.Email][m]
  }
  return clientMessage;
}

func broadcastWelcomeNewUser(c * Client, msgBody MessageBody) Message{
  clientMessage := Message{Type: "SERVER", Body: string(fmt.Sprintf("Welcome to the chat, %s!", msgBody.Email))}
  c.Pool.Broadcast <- clientMessage
  return clientMessage;
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
        fmt.Printf("Message: %+v\n", string(p))

        var msgBody MessageBody
        errJson := json.Unmarshal(p, &msgBody)
        if errJson != nil {
          fmt.Println(errJson)
          return
        }

        var clientMessage Message
        if len(msgBody.Content) > 0 && len(msgBody.Email) > 0 {
          clientMessage = broadcastMessage(c, msgBody)
        } else if len(msgBody.Content) == 0 && len(c.Pool.Messages[msgBody.Email]) > 0 {
          clientMessage = broadcastWelcomeBackReturningUser(c, msgBody)
        } else if len(msgBody.Email) > 0 {
          clientMessage = broadcastWelcomeNewUser(c, msgBody)
        }    
        fmt.Printf("Message Received: %+v\n", clientMessage)
    }
}
