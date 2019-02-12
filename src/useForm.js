import { useState } from "react";

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
        errors: { ...state.errors, [name]: undefined }
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
    /**
     * change is an handler callback for changing the value of one field of
     * the state.
     * @param {value | target | name} first
     * @param {name} second
     */
    // eslint-disable-next-line consistent-return
    handleChange: (first, second) => {
      if (first instanceof Event) {
        /**
         * first is an Event so then the value and the name is in target
         * attribute.
         * - Example: <input onChange={change}/>
         */
        setValue(first.target.name, first.target.value);
      } else if (second === undefined) {
        /**
         * first is not Event and second argument is undefined then
         * the first argument is the name of the field we return function
         * to get the event.
         * - Example : <input onChange={change('username')} />
         */
        return e => setValue(first, e.target.value);
      }
      if (first && second) {
        /**
         * the first & the second argument have value then
         * first is the value and second is the name.
         * - Example : <inputText onChange={change}/>
         */
        setValue(second, first);
      }
    },
    // eslint-disable-next-line consistent-return
    handleError: element => {
      // Only handle Error if schema is available
      if (Schema !== undefined) {
        // check if element variable is an event
        if (element instanceof Event) {
          // get element name from target
          setError(element.target.name);
        } else {
          // the the element is the name
          return () => setError(element);
        }
      }
    },
    // handler to reset the state
    handleReset: () => setState(initFromState),
    // Handler to reset errors
    handleResetErrors: () => setState({ ...state, errors: {} }),
    // Handler to reset error of one field
    handleResetError: name =>
      setState({
        ...state,
        errors: { ...state.errors, [name]: undefined }
      }),
    handleSubmit: fun => () =>
      Schema.validate(state, { verbose: true, async: true })
        .then(data => fun(data))
        .catch(errors => setState({ ...state, errors }))
  };

  // Indicators

  const indicators = {
    isChange:
      JSON.stringify(initFromState) !==
      JSON.stringify(Schema ? { ...state, errors: {} } : state)
  };

  return [state, handlers, indicators];
};
