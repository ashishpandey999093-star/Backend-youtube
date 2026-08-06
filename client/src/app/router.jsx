import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { HomePage } from "../features/home/HomePage.jsx";
import { LoginPage } from "../features/auth/LoginPage.jsx";
import { RegisterPage } from "../features/auth/RegisterPage.jsx";
import { WatchPage } from "../features/watch/WatchPage.jsx";
import { ChannelPage } from "../features/channel/ChannelPage.jsx";
import { UploadPage } from "../features/upload/UploadPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "watch/:videoId", element: <WatchPage /> },
      { path: "channel/:username", element: <ChannelPage /> }
    ]
  }
]);