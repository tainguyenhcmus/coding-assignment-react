import {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect
} from 'react'
import { ticketDetailReducer } from '../reducers/ticketDetailReducer'
import { ITicketDetail, ITicketDetailContext, TicketDetailReducerActionType } from '../types'

const defaultTicketDetailState: ITicketDetail = {
  id: null,
  description: null,
  assigneeId: undefined,
  completed: false
}

export const TicketDetailContext = createContext<ITicketDetailContext>({
  ticketDetailContextState: defaultTicketDetailState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatchTicketDetailAction: () => { }
})

export const useTicketDetailContext = () => useContext(TicketDetailContext)

const TicketDetailContextProvider = ({ children }: { children: ReactNode }) => {
  const [ticketDetailContextState, dispatchTicketDetailAction] = useReducer(
    ticketDetailReducer,
    defaultTicketDetailState
  )

  const ticketDetailProviderData = {
    ticketDetailContextState,
    dispatchTicketDetailAction
  }

  return (
    <TicketDetailContext.Provider value={ticketDetailProviderData}>
      {children}
    </TicketDetailContext.Provider>
  )
}

export default TicketDetailContextProvider
