import React, {Component} from "react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import * as EmailValidator from 'email-validator';
import './WelcomeForm.scss'

export default class WelcomeForm extends Component {
    static propTypes = {
        joinChatFn: PropTypes.func.isRequired,
    }

    state = {
        email: '',
        joinButtonDisabled: true,
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <div className="PaperWrapper">
                    <Typography component="h3" variant="h5" className="Typography">
                        Welcome to Mount Sinai chat.
                    </Typography>
                    <Typography component="h4" className="Typography">
                        Please enter your email to get started
                    </Typography>
                    <div className="FormWrapper">
                        <div>
                            <TextField
                                autoComplete="email"
                                autoFocus
                                fullWidth
                                label="Email Address"
                                margin="normal"
                                name="email"
                                required
                                variant="outlined"
                                onChange={this.validateEmail}
                            />
                        </div>
                        <div>
                            <Button
                                disabled={this.state.joinButtonDisabled}
                                type="submit"
                                fullWidth
                                variant="contained"
                                className="JoinButton"
                                onClick={(_) => this.props.joinChatFn(this.state.email)}>
                                Join Chat
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    validateEmail = (event) => {
        event.persist();
        if (EmailValidator.validate(event.target.value))
            this.setState({
                joinButtonDisabled: false,
                email: event.target.value
            });
        else {
            this.setState({
                joinButtonDisabled: true,
                email: ''
            });
        }
    }

}

