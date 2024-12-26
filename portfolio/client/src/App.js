import React, { useEffect } from "react";
import { useThemeStore } from "./store/themeStore";
import { About } from "./views";
import { NavigationBar } from "./components";

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  return (
    <NavigationBar>
      <About />
    </NavigationBar>
  );
};

export default App;
