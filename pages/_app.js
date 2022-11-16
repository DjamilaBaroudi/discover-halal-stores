import { createContext, useReducer } from 'react'
import '../styles/globals.css'

const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LATLONG: 'SET_LATLONG',
  SET_HALAL_STORES: 'SET_HALAL_STORES'
  
}

const storeReducer = (state, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_LATLONG: {
      return {...state, latLong: action.payload.latLong}
    } 
    case ACTION_TYPES.SET_HALAL_STORES: {
      return {...state, halalStores: action.payload.halalStores}
    }
    default:
      throw new Error(`Unhandeled action type ${action.type}`);
  }
}
const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    halalStores: [],
  }
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return <StoreContext.provider value={{ state, dispatch }}>
    {children}
  </StoreContext.provider>
}
function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  )
}



export default MyApp
