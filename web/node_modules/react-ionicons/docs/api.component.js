import React, { Component } from 'react'
import styles from './api.css'

class Api extends Component {
  render() {
    const apiMethods = [
      {
          param: 'style',
          type: 'Object',
          description: 'Style to apply',
          example: 'icon={...your.style}'
      },
      {
        param: 'icon',
        type: 'String',
        description: 'Icon of ionicons.',
        example: 'icon="ion-home"'
      },
      {
        param: 'fontSize',
        type: 'String',
        description: 'Icon size. Allow all units (px, em, %, pt...).',
        example: 'fontSize="35px"'
      },
      {
        param: 'color',
        type: 'String',
        description: 'Icon color. Allow string (blue, red, cyan...), rgb, rgba and hexadecimal colors.',
        example: 'color="#C9C9C9"'
      },
      {
        param: 'rotate',
        type: 'Boolean',
        description: 'Apply rotate animation to icon',
        example: 'rotate={true}'
      },
      {
        param: 'shake',
        type: 'Boolean',
        description: 'Apply shake animation to icon',
        example: 'shake={true}'
      },
      {
          param: 'beat',
          type: 'Boolean',
          description: 'Apply beat animation to icon',
          example: 'beat={true}'
      },
      {
          param: 'onClick',
          type: 'Function',
          description: 'Pass a function to execute onClick',
          example: "onClick={() => console.log('Hi!')}"
      }
    ]
    return(
      <div className="api">
        <h2>API</h2>
        <table>
          <thead>
            <tr>
              <th>Param</th>
              <th>Type</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {apiMethods.map((method, index) => {
              return (
                <tr key={index}>
                  <td>{method.param}</td>
                  <td>{method.type}</td>
                  <td>{method.description}</td>
                  <td>{method.example}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Api
