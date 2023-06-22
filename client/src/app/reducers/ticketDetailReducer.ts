import {
  ITicketDetail,
  TicketDetailReducerAction,
  TicketDetailReducerActionType
} from '../types'

export const ticketDetailReducer = (
  state: ITicketDetail,
  { type, payload }: TicketDetailReducerAction
): ITicketDetail => {
  switch (type) {
    case TicketDetailReducerActionType.SetAssign:
      return {
        ...state,
        assigneeId: payload
      }

    case TicketDetailReducerActionType.SetComplete:
      return {
        ...state,
        completed: payload
      }
    case TicketDetailReducerActionType.SetData:
      return {
        ...state,
        ...payload
      }

    default:
      return state
  }
}
