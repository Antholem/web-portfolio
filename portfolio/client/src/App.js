import React, { useEffect } from "react";
import { useThemeStore } from "./stores/useTheme";
import { About, Contacts, Features, Footer, Projects, Skills } from "./pages";
import { NavigationBar, ToastProvider } from "./components";

const App = () => {
  const { theme } = useThemeStore();

  const sections = [
    { component: <About />, id: "about" },
    { component: <Features />, id: "features" },
    { component: <Skills />, id: "skills" },
    { component: <Projects />, id: "projects" },
    { component: <Contacts />, id: "contacts" },
  ];

  useEffect(() => {
    document.body.className =
      theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  return (
    <ToastProvider>
      <div className="w-full h-auto">
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
                className={`flex flex-col items-stretch px-2 ${paddingClasses}`}
              >
                {component}
              </section>
            );
          })}
        </NavigationBar>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;
