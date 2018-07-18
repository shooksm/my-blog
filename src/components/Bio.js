import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.png'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Matthew Shooks`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Matthew Shooks</strong> who is a front-end developer and a Michigan fan living in the Buckeye state.{' '}
          <a href="https://twitter.com/matthewshooks">
            You should follow him on Twitter
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
