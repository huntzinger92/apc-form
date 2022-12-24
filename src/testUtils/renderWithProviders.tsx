import { render as pureRender } from "@testing-library/react";
import { ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const render = (component: ReactNode) =>
  pureRender(
    <Router>
      <>
        <ToastContainer />
        {component}
      </>
    </Router>
  );
