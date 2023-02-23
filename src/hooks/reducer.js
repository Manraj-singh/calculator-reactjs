import { useReducer } from "react";

//setting up actions
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
//for formatting out large number,for better readability
export const formatOperand = (operand) => {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};
export const useCustomReducer = () => {
  //here we use useReducer for state ,it takes
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  // this is reducer function which we passed on useReducer hook .
  //whenever we use dispatch reducer gets called with the passed arguments ,i.e, state and action(type and payload)
  function reducer(state, { type, payload }) {
    //depending on type we are using switch here
    switch (type) {
      //?FOR ADDING DIGITS
      case ACTIONS.ADD_DIGIT:
        //if we hve overwrite flag as true that means we have clicked on equal button and clicked on new digit so to prevent concat in the result:
        if (state.overwrite) {
          return {
            ...state,
            currentOperand: payload.digit,
            overwrite: false,
          };
        }
        //to prevent adding multiple zeros if there is no current operand ,,i.e, to prevent 0000 as only one 0 is enough.
        if (payload.digit === "0" && state.currentOperand === "0") {
          return state;
        }
        //to ensure we only have one '.' in our operand for decimal as multiple decimals in same no. is not valid
        if (payload.digit === "." && state.currentOperand.includes(".")) {
          return state;
        }

        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        };
      //? FOR CHOOSING OPERATION WE WANT TO PERFORM
      case ACTIONS.CHOOSE_OPERATION:
        //if we dont have anything in current or previous state we return same state
        if (state.currentOperand == null && state.previousOperand == null) {
          return state;
        }
        //if we have previous operand but current oprand is null and we want to change our operation
        // lets say + to * then we change operation  in state
        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          };
        }

        //if we have current operand but previous oprand is null
        if (state.previousOperand == null) {
          //here we swap current and previoud oprands so that currently typed no is set to previous and we put operation after it .
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          };
        }
        //this is default return where we evaluate the result of current expression adn set to previous operand
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        };

      //?FOR CLEARING THE SCREEN : WE JUST RETURN EMPTY STATE
      case ACTIONS.CLEAR:
        return {};

      //?FOR DELETE BUTTON (to delete digits)
      case ACTIONS.DELETE_DIGIT:
        //if we are in overwrite state clear the whole screen
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null,
          };
        }
        //if we dont hv curr operand we cant delete anthing
        if (state.currentOperand == null) return state;
        if (state.currentOperand.length === 1) {
          return { ...state, currentOperand: null };
        }

        return {
          ...state,
          //deletes last digit
          currentOperand: state.currentOperand.slice(0, -1),
        };

      //?FOR EQUAL BUTTON :WE JUST EVALUATE THE EXPRESSION WE HAVE AND WE HAVE CREATED EVALUATE FUNCTION FOR IT
      case ACTIONS.EVALUATE:
        //we dont have all info we need(prev or curr or operation) we return curr state
        if (
          state.operation == null ||
          state.currentOperand == null ||
          state.previousOperand == null
        ) {
          return state;
        }
        //here prev and operation becomes null curr becomes result.
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        };

      default:
        return state;
    }
  }
  //this is a evaluate function to find output of current expression before adding another
  //eg we do 2+2 and if we add smthing again we first evaluate so it becomes 4 + x and so on like in phone calculator
  function evaluate({ currentOperand, previousOperand, operation }) {
    //converts a string to floating point num
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    //if prev or  curr doesnt exist we return empty string
    if (isNaN(prev) || isNaN(current)) return "";
    let computation = "";
    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      default:
        break;
    }

    return computation.toString();
  }
  return {
    currentOperand,
    previousOperand,
    operation,
    dispatch,
  };
};
