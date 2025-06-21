import styled, { css } from 'styled-components'

export const PaginationStyled = styled.div`
  ${css({
    row: {
      display: 'flex',
      flexDirection: 'row' as const,
      flexWrap: 'nowrap' as const,
      justifyContent: 'center',
      listStyle: 'none',
      padding: 0,
    },
    active: {
      background: '#ddd',
    },
    control: {},
    link: {
      padding: '3px 6px',
      border: '1px solid #ddd',
      marginLeft: 3,
      marginRight: 3,
      textDecoration: 'none',
      '&:hover': {
        background: '#dfdfdf',
      },
    },
  })}
`
