import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AddQuestionForm from "./AddQuestionForm";
import { getSubjectDetails } from "../../../redux/actions/subjectAction";
import { setAlert } from "../../../redux/actions/alertAction";
import { addQuestionAction } from "../../../redux/actions/questionAction";

jest.mock("../../../redux/actions/subjectAction", () => ({
  getSubjectDetails: jest.fn(() => {
    return (dispatch) => {
      dispatch({ type: 'GET_SUBJECT_DETAILS' });
    };
  }),
}));

jest.mock("../../../redux/actions/alertAction", () => ({
  setAlert: jest.fn(),
}));

jest.mock("../../../redux/actions/questionAction", () => ({
  addQuestionAction: jest.fn(() => ({ type: 'ADD_QUESTION' }))
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {
  subjectDetails: {
    list: [
      { id: '1', subject: 'Math' },
      { id: '2', subject: 'Science' },
    ],
    retrived: false,
  },
};

const renderWithRedux = (component, { initialState, store = mockStore(initialState) } = {}) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("AddQuestionForm Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      subjectDetails: {
        list: [
          { id: 1, subject: 'Math' },
          { id: 2, subject: 'Science' }
        ],
        retrieved: true
      }
    });
    store.dispatch = jest.fn();
  });

  it('renders AddQuestionForm component correctly', () => {
    render(
      <Provider store={store}>
        <AddQuestionForm />
      </Provider>
    );

    expect(screen.getByText('Add Question')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter question')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter option a')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter option b')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter option c')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter option d')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter marks')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Answer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('enter explanation')).toBeInTheDocument();
  
  });


  test("dispatches getSubjectDetails if subjects are not retrieved", () => {
    renderWithRedux(<AddQuestionForm />);
    expect(getSubjectDetails).toHaveBeenCalled();
  });


  test("handles form input changes", async () => {
    const initialState = {
      subjectDetails: { list: [], retrieved: true },
      // Add other necessary initial state here
    };
  
    renderWithRedux(<AddQuestionForm />, { initialState });
    
    // Using waitFor to handle asynchronous rendering
     await waitFor(() => {
      expect(screen.getByPlaceholderText('enter question')).toBeInTheDocument();
    }); 
  
    fireEvent.change(screen.getByPlaceholderText('enter question'), { target: { value: 'What is 2+2?' } });
    expect(screen.getByPlaceholderText('enter question').value).toBe('What is 2+2?');
    
    fireEvent.change(screen.getByPlaceholderText('enter option a'), { target: { value: '3' } });
    expect(screen.getByPlaceholderText('enter option a').value).toBe('3');
  
    fireEvent.change(screen.getByPlaceholderText('enter option b'), { target: { value: '4' } });
    expect(screen.getByPlaceholderText('enter option b').value).toBe('4');
  
    fireEvent.change(screen.getByPlaceholderText('enter option c'), { target: { value: '5' } });
    expect(screen.getByPlaceholderText('enter option c').value).toBe('5');
  
    fireEvent.change(screen.getByPlaceholderText('enter option d'), { target: { value: '6' } });
    expect(screen.getByPlaceholderText('enter option d').value).toBe('6');
  
    fireEvent.change(screen.getByPlaceholderText('enter marks'), { target: { value: '2' } });
    expect(screen.getByPlaceholderText('enter marks').value).toBe('2');
  
    fireEvent.change(screen.getByPlaceholderText('enter explanation'), { target: { value: 'Because 2+2 equals 4' } });
    expect(screen.getByPlaceholderText('enter explanation').value).toBe('Because 2+2 equals 4');
  });

  test("handles form submission with correct data", async () => {
    const initialState = {
      subjectDetails: { list: [{ id: 1, subject: 'Math' }], retrieved: true },
      // Add other necessary initial state here
    };
  
    renderWithRedux(<AddQuestionForm />, { initialState });
    
    // Using waitFor to handle asynchronous rendering
     await waitFor(() => {
      expect(screen.getByPlaceholderText('enter question')).toBeInTheDocument();
    }); 

    fireEvent.change(screen.getByPlaceholderText('enter question'), { target: { value: 'What is 2+2?' } });
    fireEvent.change(screen.getByPlaceholderText('enter option a'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('enter option b'), { target: { value: '6' } });
    fireEvent.change(screen.getByPlaceholderText('enter option c'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('enter option d'), { target: { value: '4' } });
    fireEvent.change(screen.getByPlaceholderText('enter marks'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Answer'), { target: { value: '4' } });
    fireEvent.change(screen.getByPlaceholderText('enter explanation'), { target: { value: 'Because 2+2 equals 4' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(addQuestionAction).toHaveBeenCalledWith({
        body: 'What is 2+2?',
        options: ['3', '6', '5', '4'],
        subject: '1',
        answer: '4',
        marks: '2',
        explanation: 'Because 2+2 equals 4'
      });
    });
  });
/* 
  test("handles form submission with invalid data", async () => {
    renderWithRedux(<AddQuestionForm />);

    fireEvent.change(screen.getByLabelText('Question'), { target: { value: 'What is 2+2?' } });
    fireEvent.change(screen.getByLabelText('Option A'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('Option B'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Option C'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Option D'), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText('Marks'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Answer'), { target: { value: 'None' } }); // Invalid answer
    fireEvent.change(screen.getByLabelText('Explanation'), { target: { value: 'Because 2+2 equals 4' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(setAlert).toHaveBeenCalledWith({
        isAlert: true,
        type: 'error',
        title: 'invalid input',
        message: 'please select subject'
      });
    });

    expect(addQuestionAction).not.toHaveBeenCalled();
  }); */
});