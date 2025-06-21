import styled from 'styled-components'
import { GridCell, GridTable } from 'src/Grid/styles'

export const ActivitiesViewTable = styled(GridTable)`
  grid-template-columns: max-content max-content min-content auto;

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
