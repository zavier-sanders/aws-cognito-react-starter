import React, { Component } from 'react'

export default class Private extends Component {
  render () {
    return (
      <div>
        This is private content.
        You can only see this page after you have signed in.
      </div>
    )
  }
}
