import React from 'react'
import { Table } from 'semantic-ui-react'

const LeadsTable = () => (
  <Table celled fixed striped sortable selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Date</Table.HeaderCell>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Email</Table.HeaderCell>
        <Table.HeaderCell>Phone</Table.HeaderCell>
        <Table.HeaderCell>Source</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>1/25/2018</Table.Cell>
        <Table.Cell>John Doe</Table.Cell>
        <Table.Cell>jdoe@gmail.com&nbsp;
          <a syle="margin-left: 10px" className='ui green small label'>
            <i aria-hidden='true' className='mail icon' />
            Verified
          </a>
        </Table.Cell>
        <Table.Cell>555-555-5555&nbsp;
          <a className='ui green small label'>
            <i aria-hidden='true' className='phone icon' />
            Verified
          </a>
        </Table.Cell>
        <Table.Cell>Facebook Messenger</Table.Cell>
      </Table.Row>
      <Table.Row>
      <Table.Cell>1/25/2018</Table.Cell>
        <Table.Cell>John Doe</Table.Cell>
        <Table.Cell>jdoe@gmail.com</Table.Cell>
        <Table.Cell>555-555-5555</Table.Cell>
        <Table.Cell>Facebook Messenger</Table.Cell>
      </Table.Row>
      <Table.Row>
      <Table.Cell>1/25/2018</Table.Cell>
        <Table.Cell>John Doe</Table.Cell>
        <Table.Cell>jdoe@gmail.com</Table.Cell>
        <Table.Cell>555-555-5555</Table.Cell>
        <Table.Cell>Facebook Messenger</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

export default LeadsTable