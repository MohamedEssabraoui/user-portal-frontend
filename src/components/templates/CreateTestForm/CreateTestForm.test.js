import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import getSubjectDetails from '../../../redux/actions/subjectAction';
import setAlert from '../../../redux/actions/alertAction';
import createTestAction from '../../../redux/actions/teacherTestAction';
import CreateTestForm from './CreateTestForm';

const mockStore = configureStore([thunk]);

const renderWithRedux = (component, { initialState, store = mockStore(initialState) } = {}) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

// Mock actions
jest.mock('../../../redux/actions/subjectAction', () => ({
  getSubjectDetails: jest.fn(() => ({ type: 'GET_SUBJECT_DETAILS_SUCCESS', payload: { list: [{ id: 1, subject: 'Math' }], retrieved: true } }))
}));

jest.mock('../../../redux/actions/alertAction', () => ({
  setAlert: jest.fn(() => ({ type: 'SET_ALERT' }))
}));

jest.mock('../../../redux/actions/teacherTestAction', () => ({
  createTestAction: jest.fn(() => ({ type: 'CREATE_TEST' }))
}));

test('handles form input changes', async () => {
    const initialState = {
      subjectDetails: { list: [{ id: 1, subject: 'Math' }], retrieved: true },
      // Add other necessary initial state here
    };
  
    renderWithRedux(<CreateTestForm />, { initialState });
  
    await waitFor(() => {
      expect(screen.getByPlaceholderText('enter title')).toBeInTheDocument();
    });
  
    fireEvent.change(screen.getByPlaceholderText('enter title'), { target: { value: 'Math Test' } });
    expect(screen.getByPlaceholderText('enter title').value).toBe('Math Test');
  
    fireEvent.change(screen.getByPlaceholderText('enter marks'), { target: { value: '50' } });
    expect(screen.getByPlaceholderText('enter marks').value).toBe('50');
  
    fireEvent.change(screen.getByLabelText(/Registration Start Time/i), { target: { value: '2022-06-01T10:00' } });
    expect(screen.getByLabelText(/Registration Start Time/i).value).toBe('2022-06-01T10:00');
  
    fireEvent.change(screen.getByLabelText(/Registration End Time/i), { target: { value: '2022-06-09T10:00' } });
    expect(screen.getByLabelText(/Registration End Time/i).value).toBe('2022-06-09T10:00');
  
    fireEvent.change(screen.getByLabelText(/Test Start Time/i), { target: { value: '2022-06-10T10:00' } });
    expect(screen.getByLabelText(/Test Start Time/i).value).toBe('2022-06-10T10:00');
  
    fireEvent.change(screen.getByLabelText(/Test End Time/i), { target: { value: '2022-06-10T12:00' } });
    expect(screen.getByLabelText(/Test End Time/i).value).toBe('2022-06-10T12:00');
  
    fireEvent.change(screen.getByLabelText(/Test Duration/i), { target: { value: '01:30' } });
    expect(screen.getByLabelText(/Test Duration/i).value).toBe('01:30');

    fireEvent.change(screen.getByLabelText(/Result Time/i), { target: { value: '2022-06-11T10:00' } });
    expect(screen.getByLabelText(/Result Time/i).value).toBe('2022-06-11T10:00');
  });

   test('handles form submission with correct data', async () => {
    const initialState = {
      subjectDetails: { list: [{ id: 1, subject: 'Math' }], retrieved: true },
      // Add other necessary initial state here
    };
  
    const { store } = renderWithRedux(<CreateTestForm />, { initialState });
  
    await waitFor(() => {
      expect(screen.getByPlaceholderText('enter title')).toBeInTheDocument();
    });
  
    fireEvent.change(screen.getByPlaceholderText('enter title'), { target: { value: 'Math Test' } });
    fireEvent.change(screen.getByPlaceholderText('enter marks'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Test Start Time/i), { target: { value: '2022-06-10T10:00' } });
    fireEvent.change(screen.getByLabelText(/Test End Time/i), { target: { value: '2022-06-10T12:00' } });
    fireEvent.change(screen.getByLabelText(/Registration Start Time/i), { target: { value: '2022-06-01T10:00' } });
    fireEvent.change(screen.getByLabelText(/Registration End Time/i), { target: { value: '2022-06-09T10:00' } });
    fireEvent.change(screen.getByLabelText(/Result Time/i), { target: { value: '2022-06-11T10:00' } });
    fireEvent.change(screen.getByLabelText(/Test Duration/i), { target: { value: '01:30' } });
  
    fireEvent.click(screen.getByText('Create test'));
  
    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'SET_ALERT' });
  });