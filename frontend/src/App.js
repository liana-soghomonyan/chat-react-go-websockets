import React, {Component} from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import AppBar from 'material-ui/AppBar';
import Badge from '@material-ui/core/Badge';
import WelcomeForm from './components/WelcomeForm';
import Typography from '@material-ui/core/Typography';
import ChatContainer from "./components/ChatContainer/ChatContainer";
import "./App.scss";
import {connect, sendMsg} from "./api";

export class App extends Component {
    state = {
        chatHistory: [],
        email: '',
        showWelcomePage: true,
    }

    componentDidMount() {
        connect(msg => {
            console.log("New message from server")
            this.setState(prevState => ({
                chatHistory: [...this.state.chatHistory, msg],
            }))
        });
    }

    createMessage(message, email) {
        return JSON.stringify(
            {
                body: message,
                email: email
            });
    }

    sendMessage = (message) => {
        console.log('Sending message to server:', message);
        sendMsg(this.createMessage(message, this.state.email));
    }
    joinChat = (email) => {
        sendMsg(this.createMessage('', email));
        this.setState({
            email: email,
            showWelcomePage: false
        });
    }

    exitChat = () => {
        this.setState({
            chatHistory: [],
            email: '',
            showWelcomePage: true,
        });
    }

    render() {
        return (
            <div className="App">
                <MuiThemeProvider>
                    <div>
                        <AppBar showMenuIconButton={false}
                                title="Chat Room">
                            {this.maybeRenderAppBarElements()}
                        </AppBar>
                        {this.maybeRenderWelcomeScreen()}
                        {this.maybeRenderErrorPage()}
                        {this.maybeRenderChat()}
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }

    maybeRenderChat() {
        if (!this.state.showWelcomePage) {
            return (
                <ChatContainer
                    chatHistory={this.state.chatHistory}
                    email={this.state.email}
                    sendMessage={this.sendMessage}
                    exitChat={this.exitChat}
                />
            )
        }
    }

    maybeRenderWelcomeScreen() {
        if (this.state.showWelcomePage) {
            return (
                <WelcomeForm joinChatFn={this.joinChat}/>
            )
        }
    }

    maybeRenderErrorPage() {
        if (!this.state.showWelcomePage && !this.state.chatHistory.length) {
            return (
                <Typography component="h3" variant="h5">
                    <div className="ErrorTypography">
                    Oops, broken connection...
                    </div>
                </Typography>
            )
        }
    }

    maybeRenderMessageCounter() {
        if (this.state.chatHistory.length) {
            return (
                <Badge
                    badgeContent={this.state.chatHistory.length}
                    className="AppBarElement"
                    color="secondary">
                    Message Count
                </Badge>
            );
        }
    }

    maybeRenderExitChatButton() {
        if (!this.state.showWelcomePage) {
            return (
                <Button
                    className="AppBarElement"
                    color="default"
                    onClick={this.exitChat}
                >Exit Chat
                </Button>
            )
        }
    }

    maybeRenderAppBarElements() {
        return (
            <div className="AppBarElementContainer">
                {this.maybeRenderMessageCounter()}
                {this.maybeRenderExitChatButton()}
            </div>
        )
    }
}

export default App;
