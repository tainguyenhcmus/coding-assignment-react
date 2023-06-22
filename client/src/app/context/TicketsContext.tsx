import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { useSWRContext } from './SWRContext';

import { ITicketsContext, TicketsContextState } from '../types'

const defaultTicketsContextState: TicketsContextState = {
  tickets: [],
  selectedTicketId: null
}

export const TicketsContext = createContext<ITicketsContext>({
  ticketsContextState: defaultTicketsContextState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateTicketsContextState: () => { }
})

export const useTicketsContext = () => useContext(TicketsContext)

const TicketsContextProvider = ({ children }: { children: ReactNode }) => {
  const { useSWR } = useSWRContext();
  const [ticketsContextState, setTicketsContextState] = useState(
    defaultTicketsContextState
  )

  // Fetch data using SWR
  const { data: tickets, error } = useSWR('/api/tickets');

  const updateTicketsContextState = (
    updatedObj: Partial<TicketsContextState>
  ) => {
    setTicketsContextState(previousTicketsContextState => ({
      ...previousTicketsContextState,
      ...updatedObj
    }))
  }

  useEffect(() => {
    updateTicketsContextState({ tickets })
  }, [tickets])

  const TicketsContextProviderData = {
    ticketsContextState,
    updateTicketsContextState
  }

  return (
    <TicketsContext.Provider value={TicketsContextProviderData}>
      {children}
    </TicketsContext.Provider>
  )
}

export default TicketsContextProvider
