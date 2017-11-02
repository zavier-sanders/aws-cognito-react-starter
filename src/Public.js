import React, { Component } from 'react'
import {
  Divider,
  Grid,
  Header
} from 'semantic-ui-react'

export default class Public extends Component {
  render () {
    return (
      <div>
        <Divider hidden />
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as='h3' style={{ fontSize: '2em' }}>This page is public.</Header>
              <p style={{ fontSize: '1.33em' }}>
                Anyone can see this page.
              </p>

              <Divider />

              <Header as='h3'>We Help Companies and Companions</Header>
              <p>
                We can give your company superpowers to do things that they never thought possible. Let us delight
                your customers and empower your needs... through pure data analytics.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
