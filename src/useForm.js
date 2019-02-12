import { useState } from "react";
import { omit, objEquals } from "./utils";

/**
 * useFrom is React hook for managing from state and actions.
 */

export default (initState, Schema) => {
  /*
   If validation Schema is not null then add empty object with the name
   errors to initialState.
  */
  const initFromState =
    Schema !== null ? { ...initState, errors: {} } : initState;

  /**
   * Use react hook useState to create state with $initFromstate object.
   */
  const [state, setState] = useState(initFromState);

  /**
   * setValue is a function to set the value of one field in the state by name.
   * @param {string} name
   * @param {any} value
   */
  const setValue = (name, value) => setState({ ...state, [name]: value });

  const setError = name => {
    const isValid = Schema[name].validate(state[name], {
      verbose: true,
      values: state
    });
    if (isValid === true) {
      setState({
        ...state,
        errors: omit(state.errors, name)
      });
    } else {
      setState({
        ...state,
        errors: { ...state.errors, [name]: isValid }
      });
    }
  };

  // Handlers

  const handlers = {
    handleChange: name => e =>
      setValue(name, e instanceof Event ? e.target.value : e),
    handleError: name => () => setError(name),
    // handler to reset the state
    handleReset: () => setState(initFromState),
    // Handler to reset errors
    handleResetErrors: () => setState({ ...state, errors: {} }),
    // Handler to reset error of one field
    handleResetError: name =>
      setState({ ...state, errors: omit(state.obj, name) }),
    handleSubmit: fun => () =>
      Schema.validate(state, { verbose: true, async: true })
        .then(data => fun(data))
        .catch(errors => setState({ ...state, errors }))
  };

  // Indicators

  const indicators = {
    isInitState: objEquals(
      initFromState,
      Schema ? { ...state, errors: {} } : state
    ),
    hasErrors: !objEquals(state.errors, {})
  };

  return [state, handlers, indicators];
};
