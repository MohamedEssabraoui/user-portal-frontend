import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import StudentRegisterForm from './studentRegisterForm'; // adjust the import path accordingly
import * as registerActions from '../../../redux/actions/registerStudentAction'; // adjust the import path accordingly
import * as alertActions from '../../../redux/actions/alertAction'; // adjust the import path accordingly

// Create a mock store with thunk middleware
const mockStore = configureStore([thunk]);
const store = mockStore({});

// Mock the registerStudentAction and setAlert modules
jest.mock('../../../redux/actions/registerStudentAction', () => ({
  ...jest.requireActual('../../../redux/actions/registerStudentAction'),
  registerStudentAction: jest.fn(),
}));

jest.mock('../../../redux/actions/alertAction', () => ({
  ...jest.requireActual('../../../redux/actions/alertAction'),
  setAlert: jest.fn(),
}));

test('handles form input changes and submit', () => {
  // Mock the registerStudentAction to return a function (thunk)
  registerActions.registerStudentAction.mockReturnValue(jest.fn());
  alertActions.setAlert.mockReturnValue(jest.fn());

  // Render the component
  render(
    <Provider store={store}>
      <StudentRegisterForm />
    </Provider>
  );

  // Change input values
  fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
  expect(screen.getByPlaceholderText(/Username/i).value).toBe('testuser');

  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'testuser@example.com' } });
  expect(screen.getByPlaceholderText(/Email/i).value).toBe('testuser@example.com');

  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
  expect(screen.getByPlaceholderText(/Password/i).value).toBe('password123');

  fireEvent.change(screen.getByPlaceholderText(/enter PWD again/i), { target: { value: 'password123' } });
  expect(screen.getByPlaceholderText(/enter PWD again/i).value).toBe('password123');

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Register/i }));

  // Check if the actions are called with the correct arguments
  expect(registerActions.registerStudentAction).toHaveBeenCalledWith({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  });

  // Change confirm password to not match password
  fireEvent.change(screen.getByPlaceholderText(/enter PWD again/i), { target: { value: 'wrongpassword' } });
  expect(screen.getByPlaceholderText(/enter PWD again/i).value).toBe('wrongpassword');

  // Submit the form again
  fireEvent.click(screen.getByRole('button', { name: /Register/i }));

  // Check if setAlert action is called with the correct arguments
  expect(alertActions.setAlert).toHaveBeenCalledWith({
    isAlert: false,
    type: "error",
    title: 'Invalid Input',
    message: 'Confirm Password does not match',
  });
});