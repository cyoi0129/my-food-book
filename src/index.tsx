import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { UpdateDialog } from "./components";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

serviceWorkerRegistration.register({
  onUpdate: registration => {
    if (registration.waiting) {
      ReactDOM.render(<UpdateDialog registration={registration} />,
        document.querySelector('.SW-update-dialog')
      );
    }
  }
});