import { useDispatch } from "react-redux";
import "./App.css";
import RouterConfig from "./config/RouterConfig";
import { useEffect } from "react";
import { loadUser } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <div>
      <RouterConfig />
    </div>
  );
}

export default App;
