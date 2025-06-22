import styled from 'styled-components'
import { GridCell, GridTable } from 'src/Grid/styles'

export const ActivitiesViewTable = styled(GridTable)`
  grid-template-columns: min-content max-content min-content auto auto;

  ${GridCell} {
    max-height: 300px;
    overflow: auto;
  }
`

export const ActivitiesViewStyled = styled.div`
  height: 100%;

  pre {
    white-space: pre-line;
  }
`
