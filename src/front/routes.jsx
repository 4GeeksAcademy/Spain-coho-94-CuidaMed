// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import EmergencyContact from "./pages/EmergencyContact";
import LandingPage from "./pages/LandingPage";
import GlucoseRecords from "./pages/GlucoseRecords";
import BloodPressureRecords from "./pages/BloodPressureRecords";
import PulseRecords from "./pages/PulseRecords";
import WeightRecords from "./pages/WeightRecords";
import AllergyRecords from "./pages/AllergyRecords";
import MedicalHistoryRecords from "./pages/MedicalHistoryRecords";
import PersonalAntecedentRecords from "./pages/PersonalAntecedent";
import MedicationRecords from "./pages/MedicationRecords";
import HeightRecords from "./pages/HeightRecords";
import Login from "./pages/Login";
import OptionalForm from "./pages/OptionalForm";
import Dashboard from "./pages/Dashboard";
import { LayoutPrivate } from "./pages/LayoutPrivate";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Gallery from "./pages/Gallery";
import MedicalDataChart from "./pages/MedicalDataChart";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.
    <>
      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
      </Route>

      <Route path="/" element={<LayoutPrivate />}>
        <Route path="/emergencycontact" element={<EmergencyContact />} />
        <Route path="/records/glucose" element={<GlucoseRecords />} />
        <Route
          path="/records/bloodpressure"
          element={<BloodPressureRecords />}
        />
        <Route path="/records/pulse" element={<PulseRecords />} />
        <Route path="/records/weight" element={<WeightRecords />} />
        <Route path="/records/height" element={<HeightRecords />} />
        <Route path="/records/allergies" element={<AllergyRecords />} />
        <Route
          path="/records/familyhistory"
          element={<MedicalHistoryRecords />}
        />
        <Route
          path="/records/personalhistory"
          element={<PersonalAntecedentRecords />}
        />
        <Route path="/records/medication" element={<MedicationRecords />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path= "/statistics/:dataType" element={<MedicalDataChart />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword/>}/>
      <Route path="/optionalform" element={<OptionalForm />} />
      <Route path="/*" element={<NotFound/>} />
    </>
  )
);
