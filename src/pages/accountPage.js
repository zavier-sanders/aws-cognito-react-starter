import React, { Component } from 'react'
import {
  Divider,
  Grid,
  Header
} from 'semantic-ui-react'
import { getCurrentUser } from '../auth/auth'


export default class AccountPage extends Component {   
  constructor(props) {
    super(props)

    this.state = {
      account: {}
    }

    this.renderAccountDetails = this.renderAccountDetails.bind(this);
  }

  componentDidMount() {
    getCurrentUser((err, account) => {
      if (!err) {
        this.setState({ account })
        return;
      }

      console.log('err ', err);
      return;
      
    })
  }

  renderAccountDetails(data) {

    return (
      <div>
        <p>Name: {data.name}</p>
        <p>Email: {data.email}</p>
        <p>API Key: {data['custom:accountId']}</p>
      </div>
    )
  }

  render () {
    let { account } = this.state;

    return (
      <div>
        <Divider hidden />
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as='h3' style={{ fontSize: '2em' }}>Account</Header>
              <Divider />
                { Object.keys(account).length !== 0 ? this.renderAccountDetails(account) : '' }

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
