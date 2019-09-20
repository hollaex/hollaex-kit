import React, { Component } from 'react'
import styles from './examples.css'
import Paper from 'material-ui/Paper'
import Ionicon from 'react-ionicons'

class Examples extends Component {
  render() {
    const nodejsExample = `<Ionicon icon="logo-nodejs" onClick={() => alert('Hi!')} fontSize="60px" color="#43853d" />`
    const loadExample = `<Ionicon icon="ios-refresh" fontSize="60px" color="#347eff" rotate={true} />`
    const loadLoopExample = `<Ionicon icon="md-infinite" fontSize="60px" rotate={true} />`
    const heartExample = `<Ionicon icon="md-heart" fontSize="60px" color="red" beat={true} />`
    const bellExample = `<Ionicon icon="md-pizza" shake={true} fontSize="60px" color="orange" />`
    return(
      <div className="examples">
        <h2>Examples</h2>
        <div className="examplesContainer">
          <Paper className="example" zDepth={2}>
            <Ionicon icon="logo-nodejs" onClick={() => alert('Hi!')} fontSize="60px" color="#43853d" />
            <pre>
              {nodejsExample}
            </pre>
          </Paper>
          <Paper className="example" zDepth={2}>
            <Ionicon icon="ios-refresh" fontSize="60px" color="#347eff" rotate={true} />
            <pre>
              {loadExample}
            </pre>
          </Paper>
          <Paper className="example" zDepth={2}>
            <Ionicon icon="md-infinite" fontSize="60px" rotate={true} />
            <pre>
              {loadLoopExample}
            </pre>
          </Paper>
          <Paper className="example" zDepth={2}>
            <Ionicon icon="md-heart" fontSize="60px" color="red" beat={true} />
            <pre>
              {heartExample}
            </pre>
          </Paper>
          <Paper className="example" zDepth={2}>
            <Ionicon icon="md-pizza" shake={true} fontSize="60px" color="orange" />
            <pre>
              {bellExample}
            </pre>
          </Paper>
        </div>
      </div>
    )
  }
}

export default Examples
