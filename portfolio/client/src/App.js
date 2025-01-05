import React, { useEffect } from "react";
import { useThemeStore } from "./store/themeStore";
import { About, Features } from "./views";
import { NavigationBar } from "./components";

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  return (
    <NavigationBar>
      <About />
      <Features />
    </NavigationBar>
  );
};

export default App;
