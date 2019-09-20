import styled, { keyframes, css } from 'styled-components'

const rotate = keyframes`
  100% {
    transform: rotate(360deg)
  }
`

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`
const beat = keyframes`
  0% {
    transform: scale(.75);
  }

  20% {
    transform: scale(1);
  }

  40% {
    transform: scale(.75);
  }

  60% {
    transform: scale(1);
  }

  80% {
    transform: scale(.75);
  }

  100% {
    transform: scale(.75);
  }
`

export default styled.svg`

  animation-iteration-count: infinite;
  animation-timing-function: linear;

  ${props => props.shake && css`
    animation-name: ${shake};
    animation-duration: 0.82s;
  `};

  ${props => props.rotate && css`
    animation-name: ${rotate};
    animation-duration: 2s;
  `};

  ${props => props.beat && css`
    animation-name: ${beat};
    animation-duration: 0.82s;
  `};
`
