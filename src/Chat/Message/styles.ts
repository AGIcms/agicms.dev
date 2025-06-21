import styled, { css } from 'styled-components'

type AiMessageItemContentStyledProps = {
  direction: 'in' | 'out'
}

export const AiMessageItemStyled = styled.div<AiMessageItemContentStyledProps>`
  padding: 10px 30px;
  word-wrap: break-word;

  ${({ direction }) =>
    direction === 'out'
      ? css`
          max-width: 70%;
          border-radius: 12px;
          background-color: #f1f1f1;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          margin-left: auto;
        `
      : undefined}
`
