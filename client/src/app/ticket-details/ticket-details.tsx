/* eslint-disable-next-line */
import { useTicketDetailContext } from '../context/TicketDetailContext'
import { useTicketsContext } from '../context/TicketsContext';
import { useSWRContext } from '../context/SWRContext';
import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { TicketDetailReducerActionType, IUser } from '../types';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

type StatusType = 'complete' | 'in_complete';

export const Badge = ({ status }: { status: StatusType }) => {
  if (status === 'complete') return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
    Completed
  </span>

  return <span className="relative inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
    In completed
  </span>
}


export function TicketDetails() {
  const { id: ticketId } = useParams();
  const { useSWR } = useSWRContext();
  const {
    ticketsContextState,
    updateTicketsContextState
  } = useTicketsContext()

  const {
    ticketDetailContextState: { id, description, assigneeId, completed },
    dispatchTicketDetailAction
  } = useTicketDetailContext()

  const { data: ticketDetail, error } = useSWR(`/api/tickets/${ticketId}`);
  const { data: users, error: usersError } = useSWR(`/api/users`);

  useEffect(() => {
    ticketId && updateTicketsContextState({ selectedTicketId: +ticketId })
  }, [ticketId])

  useEffect(() => {
    if (ticketDetail) {
      dispatchTicketDetailAction({
        type: TicketDetailReducerActionType.SetData,
        payload: ticketDetail
      })
    }
  }, [ticketDetail])

  const handleAssignUser = async (isAssign: boolean, e?: React.ChangeEvent<HTMLSelectElement>) => {
    if (isAssign) {
      try {
        const userId = e?.target.value
        const res = await axios.put(`/api/tickets/${ticketId}/assign/${userId}`);
        dispatchTicketDetailAction({
          type: TicketDetailReducerActionType.SetAssign,
          payload: userId
        })
      } catch (error) {
        console.log("🚀 ~ file: ticket-details.tsx:61 ~ handleAssignUser ~ error:", error)
      }
    } else {
      try {
        const res = await axios.put(`/api/tickets/${ticketId}/unassign`);
        dispatchTicketDetailAction({
          type: TicketDetailReducerActionType.SetAssign,
          payload: 0
        })
      } catch (error) {
        console.log("🚀 ~ file: ticket-details.tsx:61 ~ handleAssignUser ~ error:", error)
      }
    }
  }

  const assignUser = () => {
    return <div className='w-full mt-8'>
      <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Assign to an user:</label>
      <div className='flex items-center justify-center'>
        <select
          value={assigneeId}
          onChange={(e) => handleAssignUser(true, e)}
          id="countries" className="w-6/12 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value={0} selected>Choose a user</option>
          {users && users.map((user: IUser) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        {!!assigneeId && <button onClick={(e) => { handleAssignUser(false) }} className='ml-3 text-gray-900 dark:text-white'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>}
      </div>
    </div >

  }

  const handleOnChangeStatus = async () => {
    try {
      let res;
      if (completed) {
        res = await axios.delete(`/api/tickets/${id}/complete`);
      } else {
        res = await axios.put(`/api/tickets/${id}/complete`);
      }
      dispatchTicketDetailAction({
        type: TicketDetailReducerActionType.SetComplete,
        payload: !completed
      })

    } catch (error: any) {
      console.log(error.response);
      return error.response;
    }
  }

  const renderStatus = () => {
    return <>
      <div className='text-center'>
        <span className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
          <span>Status: {completed ? <Badge status='complete' /> : <Badge status='in_complete' />}</span>
        </span>
      </div>
      <label className="mt-4 relative inline-flex items-center ml-5 cursor-pointer">
        <input type="checkbox" onChange={handleOnChangeStatus} className="sr-only peer" checked={completed} />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Switch to {completed ? 'in_completed' : 'completed'}
        </span>
      </label>
    </>
  }

  return (
    <div className={'relative top-8'}>
      {ticketDetail ?
        <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white"><p>Description: {description}</p></h5>
          <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Ticket ID: {id}</p>
          <div className="w-full">
            {renderStatus()}
            {assignUser()}
          </div>
        </div>
        : <Loader2 className='justify-cent h-6 w-6 animate-spin' />
      }
    </div>
  );
}

export default TicketDetails;
