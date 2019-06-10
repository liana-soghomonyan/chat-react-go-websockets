import React from 'react';
import PropTypes from 'prop-types';
import {Paper, TextField, IconButton} from "material-ui"
import ContentSend from 'material-ui/svg-icons/content/send';
import './ChatContainer.scss';

export default class ChatContainer extends React.Component {
    static propTypes = {
        chatHistory: PropTypes.array,
        email: PropTypes.string.isRequired,
        exitChat: PropTypes.func.isRequired,
        sendMessage: PropTypes.func.isRequired,
    }

    state = {
        message: '',
    }

    messagesEndRef = React.createRef();

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    getConversations() {
        if (!this.props.chatHistory.length) {
            return;
        }

        const listItems = this.props.chatHistory.map((c, index) => {
            const message = JSON.parse(c.data);
            let bubbleClass = 'me';
            let bubbleDirection = '';

            if (message.type === 0) {
                bubbleClass = 'you';
                bubbleDirection = "bubble-direction-reverse";
            }
            return (
                <div className={`bubble-container ${bubbleDirection}`} key={index}>
                    <div className={`bubble ${bubbleClass}`}>{message.body}</div>
                </div>
            );
        });
        return listItems;
    }

    render() {
        return (
            <div className="chatContainer">
                <div>
                    <Paper className="paper" zDepth={2}>
                        <Paper className="chatHistory">
                            <div className="chat-list">
                                {this.getConversations()}
                                <div ref={this.messagesEndRef} />
                            </div>
                        </Paper>
                        <div className="chatInput">
                            <TextField
                                id="input"
                                value={this.state.message}
                                onChange={event => {
                                    this.setState({message: event.target.value})
                                }}
                                onKeyDown={event => {
                                    if (event.keyCode === 13) this.sendMessage()
                                }}
                                hintText="Type here"
                                fullWidth={true}
                            />
                            <IconButton
                                onClick={_ => this.sendMessage()}
                            >
                                <ContentSend/>
                            </IconButton>
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }

    sendMessage = () => {
        if (this.state.message) {
            this.props.sendMessage(this.state.message);
            this.setState({message: ''});
        }
    }
}
