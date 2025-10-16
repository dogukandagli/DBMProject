import { RouterProvider } from "react-router";
import { router } from "./app/router/router";

function App() {
  return (
    <>
      <div style={{ height: "100vh" }}>
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            fontSize: "60px",
          }}
        >
          DBM PROJECT CLIENT
          <br />
          SAMIR VE TANER GARDASIMA SELAM OLSUN
        </h1>
      </div>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
