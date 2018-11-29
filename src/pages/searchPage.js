import React, { Component } from 'react'
import {
  Divider,
  Grid,
  Header
} from 'semantic-ui-react'
import leadsTable from '../components/leadsTable.js';


export default class SearchPage extends Component {   
  render () {
    return (
      <div>
        <Divider hidden />
        <Grid stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={4} className='search-left-rail'>
              
            </Grid.Column>
            <Grid.Column width={12}>
              
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
