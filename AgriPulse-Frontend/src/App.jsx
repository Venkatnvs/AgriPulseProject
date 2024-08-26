import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import routes from "./router";
import PrivateRoute from "./components/PrivateRoute";
import SignUp from "./pages/Auth/SignUp";
import { Toaster } from "./components/ui/toaster";
import AuthRoute from "./components/AuthRoute";
import MainHome from "./pages/Home/MainHome";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainHome  />} />
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
          </Route>
          <Route element={<PrivateRoute />}>
            {routes.map((route) => {
              return (
                <Route
                  key={route.name}
                  path={route.path}
                  element={<route.element />}
                />
              );
            })}
          </Route>
          <Route
            path="*"
            element={<p className="text-white-1">404 Not Found</p>}
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
};

export default App;
