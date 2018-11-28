import React, { Component } from 'react'
import {
  Divider,
  Grid,
  Header
} from 'semantic-ui-react'
import leadsTable from '../components/leadsTable.js';


export default class LeadsPage extends Component {   
  render () {
    return (
      <div>
        <br />
        <Divider hidden />
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as='h3' style={{ fontSize: '2em' }}>Leads</Header>
              <Divider />
                {leadsTable()}

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
