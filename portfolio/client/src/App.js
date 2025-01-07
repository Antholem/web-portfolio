import React, { useEffect } from "react";
import { useThemeStore } from "./store/themeStore";
import { About, Features, Skills } from "./views";
import { NavigationBar } from "./components";

const App = () => {
  const { theme } = useThemeStore();

  const sections = [
    { component: <About />, id: "about" },
    { component: <Features />, id: "features" },
    { component: <Skills />, id: "skills" },
  ];

  useEffect(() => {
    // Set the theme classes for the body
    document.body.className =
      theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  return (
    <NavigationBar>
      {sections.map(({ id, component }, index) => {
        const paddingClasses =
          index === 0
            ? "pt-4 pb-12"
            : index === sections.length - 1
              ? "pt-12 pb-4"
              : "py-12";

        return (
          <section
            key={id}
            id={id}
            className={`flex flex-col items-stretch px-4 ${paddingClasses}`}
          >
            {component}
          </section>
        );
      })}
    </NavigationBar>
  );
};

export default App;
