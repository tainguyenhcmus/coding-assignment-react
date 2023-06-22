// import { useTicketsContext } from '../context/TicketsContext'
import { useEffect, useState } from 'react';
import { useTicketsContext } from '../context/TicketsContext';
import { useNavigate } from "react-router-dom";
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { Badge } from '../ticket-details/ticket-details';
import { Loader2 } from 'lucide-react';
import Toast from '../components/Toast'
import { useLocation } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TicketsProps {
}

interface FilterType {
  type: 'all' | 'complete' | 'incomplete',
}

enum FilterEnum {
  all = 'all',
  complete = 'complete',
  inComplete = 'incomplete',
}

export function Tickets(props: TicketsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>({ type: 'all' })
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('Default message');
  const [statusToast, setStatusToast] = useState<"success" | "warning" | "danger">('success');
  const {
    ticketsContextState: { tickets },
    updateTicketsContextState
  } = useTicketsContext()

  // const { data: tickets, error } = useSWR('/api/tickets');
  const handleOnClickTicket = (id: number | null) => {
    updateTicketsContextState({
      selectedTicketId: id
    })
    navigate(`/${id}`)
  }

  const triggerReloadData = async () => {
    try {
      const { data } = await axios.get('/api/tickets');
      mutate('/api/tickets', data); // Trigger re-fetch
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    triggerReloadData()
  }, [location])

  const handleAddTicket = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!inputValue || inputValue.length <= 0) {
      setMessageToast('Please input a ticket description...');
      setStatusToast('warning');
      setShowToast(true);
      return;
    }
    const { data } = await axios.post('/api/tickets', { description: inputValue });
    // Update the local data with the newly created ticket
    mutate('/api/tickets', [...tickets, data], false);

    // Clear the input field
    setInputValue('');
    setMessageToast('Create ticket successfully!');
    setStatusToast('success');
    setShowToast(true);
  }

  const addTicketForm = () => {
    return <div className="py-8">
      <label
        htmlFor="search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        add
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className=" text-gray-500 dark:text-gray-400 w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </div>
        <input
          type="string"
          id="addTicket"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Type a description"
          required
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <button
          onClick={handleAddTicket}
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          ADD
        </button>
      </div>
    </div>
  }

  const renderFilter = () => {
    const type = selectedFilter.type;
    const sltClassName = 'inline-block p-4 border-b-2';
    const normalClassName = 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
    return <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" >
        <li className="mr-2">
          <button onClick={() => setSelectedFilter({ type: FilterEnum.all })} className={type === FilterEnum.all ? sltClassName : normalClassName} type="button">All</button>
        </li>
        <li className="mr-2">
          <button onClick={() => setSelectedFilter({ type: FilterEnum.complete })} className={type === FilterEnum.complete ? sltClassName : normalClassName}>Completed</button>
        </li>
        <li className="mr-2">
          <button onClick={() => setSelectedFilter({ type: FilterEnum.inComplete })} className={type === FilterEnum.inComplete ? sltClassName : normalClassName}>Incomplete</button>
        </li>
      </ul>
    </div >
  }

  const renderListTicket = () => {
    const filterType = selectedFilter.type;
    const isComplete = filterType === FilterEnum.complete ? true : false;
    const ticketsByType = filterType === FilterEnum.all ? tickets : tickets.filter(item => item.completed === isComplete);
    return <ul>
      {ticketsByType.map((t, i) => (
        <li
          className='hover:scale-110 transition ease-in-out delay-150 hover:-translate-y-2 my-8 bg-indigo-500 shadow-indigo-500/50 shadow-2xl cursor-pointer grid grid-cols-2 px-5 py-4 hover:text-white rounded-lg cursor-pointer'
          key={t.id}
          onClick={() => handleOnClickTicket(t.id)}
        >
          <span>Ticket: {t.id}, {t.description}</span>
          <div className='text-center'>
            <span className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
              <span>Status: {t.completed ? <Badge status='complete' /> : <Badge status='in_complete' />}</span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  }

  return (
    <div className='relative top-8'>
      {addTicketForm()}
      <h2>Tickets</h2>
      {renderFilter()}
      <div className='flex flex-col space-y-1 pb-28'>
        {tickets ? (
          renderListTicket()
        ) : (
          <Loader2 className='justify-cent h-6 w-6 animate-spin' />
        )}
      </div>
      {showToast && (
        <Toast status={statusToast} message={messageToast} duration={3000} onClose={() => setShowToast(false)} />
      )}

    </div>
  );
}

export default Tickets;
