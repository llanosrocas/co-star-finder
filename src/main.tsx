import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { render } from 'preact';
import { App } from './app.tsx';

const theme = createTheme({});

render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <App />
  </MantineProvider>,
  document.getElementById('app')!,
);
