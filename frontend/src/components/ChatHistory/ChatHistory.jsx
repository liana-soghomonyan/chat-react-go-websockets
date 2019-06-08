import React, { Component } from "react";
import "./ChatHistory.scss";

class ChatHistory extends Component {
  getMessageFromJson(msgJson){
    const data = JSON.parse(msgJson.data);
    return data.body;
  }
  render() {
    const messages = this.props.chatHistory.map((msg, index) => (
      <div className="Message" key={index}>{this.getMessageFromJson(msg)}</div>
    ));

    return (
      <div className="ChatHistory">
        <h2>Chat History</h2>
        {messages}
      </div>
    );
  }
}

export default ChatHistory;
