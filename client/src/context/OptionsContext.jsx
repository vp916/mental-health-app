import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const OptionsContext = createContext(null);

// Loads the fixed lists (circles, emotions, check-ins ...) from /api/options once for the whole app.
// options is null until they arrive.
export function OptionsProvider({ children }) {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    api.get("/options").then(({ data }) => setOptions(data));
  }, []);

  return <OptionsContext.Provider value={options}>{children}</OptionsContext.Provider>;
}

export function useOptions() {
  return useContext(OptionsContext);
}
