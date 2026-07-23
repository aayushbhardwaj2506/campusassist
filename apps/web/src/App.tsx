import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@core/auth';
import { AppRouter } from '@core/router/AppRouter';
import { ThemeProvider } from '@core/theme';

/**
 * Root component. ThemeProvider wraps everything (so login/register also
 * respect the stored theme, not just the authenticated shell); AuthProvider
 * sits inside the router so route guards can read live auth state.
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
