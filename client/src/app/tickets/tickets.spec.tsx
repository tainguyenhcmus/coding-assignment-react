import { render, screen, fireEvent, waitFor, RenderOptions } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Tickets } from './Tickets';
import TicketsContextProvider from '../context/TicketsContext';
import React, { FC, ReactElement } from 'react';
import { SWRProvider } from '../context/SWRContext'
import TicketProvider from '../context/TicketsContext';
import TicketDetailProvider from '../context/TicketDetailContext';

const server = setupServer(
  rest.get('/api/tickets', (req, res, ctx) => {
    return res(ctx.json([
      {
        "id": 1,
        "description": "Install a monitor arm",
        "assigneeId": 1,
        "completed": false
      },
      {
        "id": 2,
        "description": "Move the desk to the new location",
        "assigneeId": 1,
        "completed": false
      }
    ]));
  }),
);
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


describe('Tickets', () => {
  beforeEach(async () => {
    await customRender(<Tickets />)
  });
  it('renders "Install a monitor arm"', () => {
    const element = screen.getByText('Install a monitor arm');
    expect(element).toBeInTheDocument();
  });
  // });
});

const AllTheProviders: FC<any> = ({ children }) => {
  return (
    // <SWRProvider>
    <TicketProvider>
      <TicketDetailProvider>
        {children}
      </TicketDetailProvider >
    </TicketProvider>
    // </SWRProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });
