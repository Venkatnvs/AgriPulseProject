import AnalysisDetails from "./pages/Analytics/AnalysisDetails";
import MainAnalytics from "./pages/Analytics/MainAnalytics";
import MainDashBoard from "./pages/DashBoard/MainDashBoard";
import AddNewDevice from "./pages/Devices/AddNewDevice";
import DeviceConfigurePage from "./pages/Devices/DeviceConfigurePage";
import DeviceDetails from "./pages/Devices/DeviceDetails";
import DeviceList from "./pages/Devices/DeviceList";
import AddNewField from "./pages/Fields/AddNewField";
import FieldDetails from "./pages/Fields/FieldDetails";
import FieldList from "./pages/Fields/FieldList";
import MainProfilePage from "./pages/Profile/MainProfilePage";

const routes = [
  {
    name: 'root',
    path: '/dashboard',
    element: MainDashBoard,
  },
  {
    name: 'analytics',
    path: '/dashboard/analytics',
    element: MainAnalytics,
  },
  {
    name: 'analysis-details',
    path: '/dashboard/analytics/:id',
    element: AnalysisDetails,
  },
  {
    name: 'fields',
    path: '/dashboard/fields',
    element: FieldList,
  },
  {
    name: 'field-create',
    path: '/dashboard/fields/create',
    element: AddNewField,
  },
  {
    name: "field-details",
    path: '/dashboard/fields/:id',
    element: FieldDetails,
  },
  {
    name: 'devices-list',
    path: '/dashboard/devices',
    element: DeviceList,
  },
  {
    name: 'device-create',
    path: '/dashboard/devices/create',
    element: AddNewDevice,
  },
  {
    name: 'device-details',
    path: '/dashboard/devices/:id',
    element: DeviceDetails,
  },
  {
    name: 'device-config',
    path: '/dashboard/devices/:id/configure',
    element: DeviceConfigurePage,
  },
  {
    name: 'profile',
    path: '/dashboard/profile',
    element: MainProfilePage,
  }
];

export default routes;
