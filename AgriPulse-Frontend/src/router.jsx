import MainDashBoard from "./pages/DashBoard/MainDashBoard";
import AddNewField from "./pages/Fields/AddNewField";
import FieldList from "./pages/Fields/FieldList";

const routes = [
  {
    name: 'root',
    path: '/dashboard',
    element: MainDashBoard,
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
  }
];

export default routes;
