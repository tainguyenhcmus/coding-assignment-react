import { Dispatch } from 'react'

export interface ITicketDetail {
  id: number | null,
  description: string | null,
  assigneeId: number | string | undefined,
  completed: boolean
}

export interface IUser {
  id: string | number,
  name: string | null,
}


export interface ITicketDetailContext {
  ticketDetailContextState: ITicketDetail,
  dispatchTicketDetailAction: Dispatch<TicketDetailReducerAction>
}

export interface TicketsContextState {
  tickets: ITicketDetail[],
  selectedTicketId: number | null,
}

export interface ITicketsContext {
  ticketsContextState: TicketsContextState
  updateTicketsContextState: (
    updatedObj: Partial<TicketsContextState>
  ) => void
}

export enum TicketDetailReducerActionType {
  SetComplete = 'SetComplete',
  SetAssign = 'SetAssign',
  SetData = 'SetData',
}

export type TicketDetailReducerAction =
  | {
    type: TicketDetailReducerActionType.SetComplete
    payload: boolean
  }
  | {
    type: TicketDetailReducerActionType.SetAssign
    payload: number | string | undefined
  }
  | {
    type: TicketDetailReducerActionType.SetData
    payload: ITicketDetail
  }
