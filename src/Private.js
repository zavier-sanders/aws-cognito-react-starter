import React, { Component } from 'react'
import {
  Divider,
  Grid,
  Header
} from 'semantic-ui-react'



export default class Private extends Component {   
  render () {
    return (
      <div>
        <Divider hidden />
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as='h3' style={{ fontSize: '2em' }}>This is your watch list</Header>
              {/* <p style={{ fontSize: '1.33em' }}>
                This page is shown to user only when they login.
              </p> */}

              <Divider />

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
