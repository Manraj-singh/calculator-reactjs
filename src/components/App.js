import Digits from "./Digits";
import Operations from "./Operations";
import { useCustomReducer, ACTIONS, formatOperand } from "../hooks/reducer";

function App() {
  const { previousOperand, currentOperand, operation, dispatch } =
    useCustomReducer();
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <Operations operation="÷" dispatch={dispatch} />
      <Digits digit="1" dispatch={dispatch} />
      <Digits digit="2" dispatch={dispatch} />
      <Digits digit="3" dispatch={dispatch} />
      <Operations operation="*" dispatch={dispatch} />
      <Digits digit="4" dispatch={dispatch} />
      <Digits digit="5" dispatch={dispatch} />
      <Digits digit="6" dispatch={dispatch} />
      <Operations operation="+" dispatch={dispatch} />
      <Digits digit="7" dispatch={dispatch} />
      <Digits digit="8" dispatch={dispatch} />
      <Digits digit="9" dispatch={dispatch} />
      <Operations operation="-" dispatch={dispatch} />
      <Digits digit="." dispatch={dispatch} />
      <Digits digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
