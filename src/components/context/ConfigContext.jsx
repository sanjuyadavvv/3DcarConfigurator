// src/context/ConfigContext.jsx
import { createContext, useContext, useState } from "react";

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [configuration, setConfiguration] = useState({
    bodyColor: null,
    wheelColor: "#c0c0c0",
    glassColor: "#87ceeb",
    view: "default",
    paintType: "glossy",
    doorOpen: false,
    hoodOpen: false,
    trunkOpen: false,
    roofOpen: false,
    lightsOn:false,
  });


  return (
    <ConfigContext.Provider value={{ configuration, setConfiguration }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside <ConfigProvider>");
  return ctx;
}