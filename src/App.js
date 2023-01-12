import {useState, useEffect} from "react";
import Routes from "./routes/routes";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";
import Sidebar from "./scenes/global/Sidebar";
import {useNavigate,useLocation} from "react-router-dom";
import axios from "axios";

function App() {
    const [theme, colorMode] = useMode();
    const {pathname} = useLocation();
    const [isAuth, setAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
        let token = localStorage.getItem("pet-token") ?? null;
        axios.get(process.env.REACT_APP_API_URL + "/api/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res.data.status === "Authenticated") {
                setAuth(true);
            } else {
                setAuth(false);
                navigate("/login");
            }
        }).catch((err) => {
            if (err) {
                setAuth(false);
                navigate("/login");
            }
        });
    }, [pathname]);
    window.onpopstate = (e) => {
        window.location.reload();
    };
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app">
                    {isAuth ? <Sidebar isSidebar={true}/> : null}
                    <main className="content">
                        <Routes auth={isAuth}/>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
