import { useState, useEffect } from "react";
import Routes from "./routes/routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Sidebar from "./scenes/global/Sidebar";
import { useNavigate } from "react-router-dom";
function App() {
  const [theme, colorMode] = useMode();
  const [isAuth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
    let token = localStorage.getItem("pet-token") ?? null;
    if (token) {
      setAuth(true);
      // navigate("/");
    } else {
      setAuth(false);
      navigate("/login");
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuth ? <Sidebar isSidebar={true} /> : null}
          <main className="content">
            <Routes auth={isAuth} />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
