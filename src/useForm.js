import { useState } from "react";

/**
 * useFrom is React hook for managing from state and actions.
 */

export default (initState, Schema = null) => {
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
    // handler to reset the state
    handleReset: () => setState(initFromState)
  };

  // Indicators

  const indicators = {
    isChange:
      JSON.stringify(initFromState) !==
      JSON.stringify(Schema ? { ...state, errors: {} } : state)
  };

  return [state, handlers, indicators];
};
