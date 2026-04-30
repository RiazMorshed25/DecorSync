import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminRoute from "./AdminRoute";
import UsersManagement from "../pages/Dashboard/UsersManagement/UsersManagement";
import serviceArea from "../pages/map/serviceArea";
import Profile from "../pages/Dashboard/Profile/Profile";
import Services from "../pages/services/Services";
import ServiceDetail from "../pages/services/ServiceDetail";
import ApproveDecorators from "../pages/Dashboard/ApproveDecorators/ApproveDecorators";
import Booking from "../pages/Booking/Booking";
import MyBookings from "../pages/Dashboard/MyBookings/MyBookings";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import Decorators from "../pages/Decorator/Decorators";
import AssignDecorators from "../pages/Dashboard/AssignDecorators/AssignDecorators";
import MyAssignProjects from "../pages/Dashboard/MyAssignProjects/MyAssignProjects";
import DecoratorEarningSummary from "../pages/Dashboard/DecoratorEarningSummary/DecoratorEarningSummary";
import Home from "../pages/Home/Home/Home";
import AddService from "../pages/Dashboard/AddService/AddService";
import GlobalErrorPage from "../pages/shared/GlobalErrorPage";
import Consultation from "../pages/Booking/Consultation";
import Appointments from "../pages/Dashboard/Appointments/Appointments";
import BookingSummaryAnalysis from "../pages/Dashboard/BookingSummaryAnalysis/BookingSummaryAnalysis";
import AddEditDecorator from "../pages/Dashboard/AddEditDecorator/AddEditDecorator";
import DecoratorProfile from "../pages/Dashboard/DecoratorProfile/DecoratorProfile";
import AllBookings from "../pages/Dashboard/AllBookings/AllBookings";
import RevenueTracking from "../pages/Dashboard/RevenueTracking/RevenueTracking";
import SetAvailability from "../pages/Dashboard/SetAvailability/SetAvailability";
import BrowseDecorators from "../pages/BrowseDecorators/BrowseDecorators";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "service-area",
        Component: serviceArea,
        loader: () => fetch("/serviceareas.json").then((res) => res.json()),
      },
      {
        path: "services",
        Component: Services
      },
      {
        path: "/service/:_id",
        element: <PrivateRoute><ServiceDetail></ServiceDetail></PrivateRoute> 
      },
      {
        path: "/booking",
        element: <PrivateRoute><Booking></Booking></PrivateRoute>,
        loader: () => fetch("/serviceareas.json").then((res) => res.json())
      },
      {
        path: "/decorator",
        element: <PrivateRoute><Decorators /></PrivateRoute>,
        loader: () => fetch("/serviceareas.json").then((res) => res.json()),
      },
      {
        path: '*',
        element: <GlobalErrorPage></GlobalErrorPage>
      },
      {
        path: "/consultation",
        element: <PrivateRoute><Consultation></Consultation></PrivateRoute>,
      },
      {
        path: "/browse-decorators",
        Component: BrowseDecorators,
      },
    ]
    
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'users-management',
        element: <AdminRoute><UsersManagement></UsersManagement></AdminRoute>
      },
      {
        path: 'add-service',
        element: <AdminRoute><AddService></AddService></AdminRoute>
      },
      {
        path: 'profile',
        Component: Profile
      },
      {
        path: 'approve-decorators',
        element: <AdminRoute><ApproveDecorators></ApproveDecorators></AdminRoute>
      },
      {
        path: 'appointments',
        element: <AdminRoute><Appointments></Appointments></AdminRoute>
      },
      {
        path: 'assign-decorators',
        element: <AdminRoute><AssignDecorators></AssignDecorators></AdminRoute>
      },
      {
        path: 'summary-analysis',
        element: <AdminRoute><BookingSummaryAnalysis></BookingSummaryAnalysis></AdminRoute>
      },
      {
        path: 'add-decorator',
        element: <AdminRoute><AddEditDecorator /></AdminRoute>,
        loader: () => fetch("/serviceareas.json").then((res) => res.json()),
      },
      {
        path: 'edit-decorator/:id',
        element: <AdminRoute><AddEditDecorator /></AdminRoute>,
        loader: () => fetch("/serviceareas.json").then((res) => res.json()),
      },
      {
        path: 'decorator-profile/:id',
        element: <AdminRoute><DecoratorProfile /></AdminRoute>,
      },
      {
        path: 'all-bookings',
        element: <AdminRoute><AllBookings /></AdminRoute>,
      },
      {
        path: 'revenue-tracking',
        element: <AdminRoute><RevenueTracking /></AdminRoute>,
      },
      {
        path: 'my-bookings',
        Component: MyBookings
      },
      {
        path: "payment/:_id",
        Component: Payment,
      },
      {
        path: 'payment-history',
        Component: PaymentHistory
      },
      {
        path: "payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "payment-cancelled",
        Component: PaymentCancelled,
      },
      {
        path: 'my-assign-projects',
        Component: MyAssignProjects
      },
      {
        path: 'set-availability',
        Component: SetAvailability
      },
      {
        path: 'earning-summary',
        Component: DecoratorEarningSummary
      }

    ]
  }
  
]);