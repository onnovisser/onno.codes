import { css } from '@emotion/core'
import reset from './reset'
import base from './base'

const global = theme => css`
  ${reset}
  ${base(theme)}
`

export default global
