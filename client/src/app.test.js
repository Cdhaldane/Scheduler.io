import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from "./Components/Providers/Provider";
import '@testing-library/jest-dom';
import App from './App';

// Tests the app component aka home page, without logins
describe('App', () => {
    test('renders App component without crashing', () => {
        render(
            <AppProviders>
                <App />
            </AppProviders>, 
            { wrapper: MemoryRouter }
        );
    });

    test('renders Navbar and home page components', () => {
        render(
            <AppProviders>
                <App />
            </AppProviders>, 
            { wrapper: MemoryRouter }
        );
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('navbar-logo')).toBeInTheDocument();
        expect(screen.getByTestId('login-header-button')).toBeInTheDocument();
    });

    test('renders Footer', () => {
        render(
            <AppProviders>
                <App />
            </AppProviders>, 
            { wrapper: MemoryRouter }
        );
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders Calendar and components', () => {
        render(
            <AppProviders>
                <App />
            </AppProviders>, 
            { wrapper: MemoryRouter }
        );
        expect(screen.getByTestId('calendar')).toBeInTheDocument();
        expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
        expect(screen.getByTestId('calendar-current-page')).toBeInTheDocument();
        expect(screen.getByTestId('calendar-next-page')).toBeInTheDocument();
    });

    // DEBUG TEST checks for routing employee and admin buttons
    test('renders admin and employee debugging buttons', () => {
        render(
            <AppProviders>
                <App />
            </AppProviders>, 
            { wrapper: MemoryRouter }
        );
        expect(screen.getByTestId('admin-button')).toBeInTheDocument();
        expect(screen.getByTestId('employee-button')).toBeInTheDocument();
    });

    test('renders DevTools', () => {
        render(
            <AppProviders>
                <App />
            </AppProviders>, 
            { wrapper: MemoryRouter }
        );

        expect(screen.getByTestId('dev-tools')).toBeInTheDocument();
    });
});