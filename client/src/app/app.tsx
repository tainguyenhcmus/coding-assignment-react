import { Routes, Route } from 'react-router-dom';
import Tickets from './tickets/tickets';
import TicketDetails from './ticket-details/ticket-details'
import TicketProvider from './context/TicketsContext';
import TicketDetailProvider from './context/TicketDetailContext';
import { SWRProvider } from './context/SWRContext';
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  return (
    <div className={'flex flex-col overflow-y-scroll h-screen bg-gradient-to-b from-purple-500 to-black h-80 p-8'}>
      <header className='relative top-5 w-1/2 mb-8 '>
        <div onClick={() => { navigate('/') }} className='shadow-white shadow-2xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 absolute left-1/2 flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2 text-white w-full text-5xl font-bold mb-4 justify-center'>
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-white from-slate-950">Ticketing App</span>
        </div>
      </header>
      <SWRProvider>
        <TicketProvider>
          <TicketDetailProvider>
            <Routes>
              <Route path="/" element={<Tickets />} />
              {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
              <Route path="/:id" element={<TicketDetails />} />
            </Routes>
          </TicketDetailProvider>
        </TicketProvider>
      </SWRProvider>
    </div >
  );
};

export default App;
