import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Segment, Button, Form, Grid, Header, Message } from 'semantic-ui-react/dist/commonjs'

export default class Robinhood extends Component {
  renderErrorMessage (message) {
    return (
      <Message negative style={{textAlign: 'left'}}>
        Error: { message }
      </Message>
    )
  }

  handleSkip () {
    return window.location = "/private";
  }

  render () {
    return (
      <div>
        <Grid
          textAlign='center'
          style={{ marginTop: 120 }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ width: 450 }} verticalAlign='middle'>
            { this.props.errorMessage && this.renderErrorMessage(this.props.errorMessage) }
            <Form size='large'>
              <Segment padded='very' style={{backgroundColor: '#fafafa'}}>
                <Header as='h4' textAlign='left'>
                  Please link your Robinhood account:
                </Header>
                
                <Form.Input
                  fluid
                  icon='mail'
                  iconPosition='left'
                  placeholder='E-mail address'
                  name='email'
                  onChange={this.props.setEmail}
                />

                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password'
                  onChange={this.props.setPassword}
                />  

                <Button color='blue' fluid onClick={this.props.onValidate}>Submit</Button>
                {/* <Button color='white' fluid onClick={this.handleSkip}>Skip</Button> */}
                
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
