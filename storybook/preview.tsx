import type { Preview } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { theme } from 'src/theme'

// Создаем клиент Apollo для Storybook
const client = new ApolloClient({
  uri: 'http://localhost:3000/api', // URL для GraphQL API
  cache: new InMemoryCache(),
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <Story />
          </ThemeProvider>
        </ApolloProvider>
      )
    },
  ],
}

export default preview
