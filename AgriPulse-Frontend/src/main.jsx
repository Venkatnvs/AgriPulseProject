import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './themes/theme-provider.jsx'
import store from './store/store.jsx'
import { Provider } from 'react-redux'
import { LanguageProvider } from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
