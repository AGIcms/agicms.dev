import styled from 'styled-components'

export const GridCell = styled.div`
  padding: 3px 5px;
  border: 1px solid #ddd;
`

export const GridCellHeader = styled(GridCell)`
  font-weight: bold;
  font-size: 1.2rel;
`

export const GridRow = styled.div`
  display: contents;
`

export const GridTable = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: auto;
`
