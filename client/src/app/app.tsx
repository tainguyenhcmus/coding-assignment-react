import { Routes, Route } from 'react-router-dom';
import Tickets from './tickets/tickets';
import TicketDetails from './ticket-details/ticket-details'
import TicketProvider from './context/TicketsContext';
import TicketDetailProvider from './context/TicketDetailContext';
import { SWRProvider } from './context/SWRContext';

const App = () => {

  return (
    <div className={'flex flex-col overflow-y-scroll h-screen bg-gradient-to-b from-purple-500 to-black h-80 p-8'}>
      <header className='relative top-5 w-full'>
        <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2 text-white w-full text-2xl font-bold mb-4 justify-center'>
          Ticketing App
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
