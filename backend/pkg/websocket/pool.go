package websocket

import (
    "fmt"
  )

type Pool struct {
    Register   chan *Client
    Unregister chan *Client
    Client     *Client
    Broadcast  chan Message
    Messages   map[string][]*Message
}

func NewPool() *Pool {
    return &Pool{
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
        Client:    new(Client),
        Broadcast:  make(chan Message),
        Messages:   make(map[string][]*Message),
    }
}

func (pool *Pool) Start() {
    for {
        select {
        case client := <-pool.Register:
            pool.Client = client
            fmt.Println(client)
            break
        case message := <-pool.Broadcast:
            fmt.Println("Sending message to client", message)
            if err := pool.Client.Conn.WriteJSON(message); err != nil {
                fmt.Println(err)
                return
            }
        }
    }  }
