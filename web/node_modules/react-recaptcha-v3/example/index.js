import React, { Component } from 'react'
import { ReCaptcha, loadRecaptcha } from 'react-recaptcha-v3'

const verifyCallback = token => {
  // Here you will get the final token!!!
  console.log(token, 'verifycallback')
}

class Example extends Component {
  componentDidMount () {
    loadRecaptcha('your_site_key')
  }

  render () {
    return (
      <div>
        <ReCaptcha
          action='main'
          sitekey='your_recapcha_key'
          verifyCallback={verifyCallback}
        />

        <h2>Google ReCaptcha with React </h2>

        <code>
          1. Add <strong>your site key</strong> in the ReCaptcha component. <br />
          2. Check <strong>console</strong> to see the token.
        </code>

        <header>
          <h1>Thanks for using `react-recaptcha-google`</h1>
        </header>
      </div>
    )
  }
}

export default Example
