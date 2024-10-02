import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store ,persistor} from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './components/ThemeProvider';

//after refreshing page , we can still able to see content in store using persist....
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>  
      <ThemeProvider>
        <App />
      </ThemeProvider> 
    
    </PersistGate>
  </Provider>
)
