import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ClientLayout } from '../layouts/ClientLayout';
import { OwnerLayout } from '../layouts/OwnerLayout';
import { StaffLayout } from '../layouts/StaffLayout';

// Public pages
import { Home } from '../pages/public/Home';
import { RestaurantDetail } from '../pages/public/RestaurantDetail';
import { NotFound } from '../pages/public/NotFound';

// Auth pages
import { Register } from '../pages/auth/Register';
import { Login } from '../pages/auth/Login';
import { StaffLogin } from '../pages/auth/StaffLogin';
import { SetPassword } from '../pages/auth/SetPassword';

// Client pages
import { ClientDashboard } from '../pages/client/ClientDashboard';
import { OrderTracking } from '../pages/client/OrderTracking';
import { OrderHistory } from '../pages/client/OrderHistory';
import { Profile } from '../pages/client/Profile';
import { Favourites } from '../pages/client/Favourites';
import { ClientIssues } from '../pages/client/Issues';

// Owner pages
import { OwnerDashboard } from '../pages/owner/OwnerDashboard';
import { RestaurantList } from '../pages/owner/RestaurantList';
import { RestaurantSetup } from '../pages/owner/RestaurantSetup';
import { RestaurantProfile } from '../pages/owner/RestaurantProfile';
import { OwnerReports } from '../pages/owner/Reports';
import { Approvals } from '../pages/owner/Approvals';
import { IssuesHub } from '../pages/owner/Issues';

// Deputy pages
import { DeputyDashboard } from '../pages/deputy/DeputyDashboard';
import { StaffOverview } from '../pages/deputy/StaffOverview';
import { DeputyApprovals } from '../pages/deputy/Approvals';
import { DeputyReports } from '../pages/deputy/Reports';
import { DeputyIssuesPage } from '../pages/deputy/Issues';

// HR pages
import { HRDashboard } from '../pages/hr/HRDashboard';
import { StaffList } from '../pages/hr/StaffList';
import { CreateStaff } from '../pages/hr/CreateStaff';
import { BulkEnrollment } from '../pages/hr/BulkEnrollment';
import { StaffDetail } from '../pages/hr/StaffDetail';

// Finance pages
import { FinanceDashboard } from '../pages/finance/FinanceDashboard';
import { RevenueReport } from '../pages/finance/RevenueReport';
import { SubmitReport } from '../pages/finance/SubmitReport';

// Kitchen pages
import { KitchenDashboard } from '../pages/kitchen/KitchenDashboard';
import { MenuManagement } from '../pages/kitchen/MenuManagement';
import { OperationsReport } from '../pages/kitchen/OperationsReport';

// Chef pages
import { ChefBoard } from '../pages/chef/ChefBoard';
import { ChefOrderDetail } from '../pages/chef/OrderDetail';
import { ChefMessages } from '../pages/chef/Messages';

// Waiter pages
import { WaiterBoard } from '../pages/waiter/WaiterBoard';
import { PlaceOrder } from '../pages/waiter/PlaceOrder';
import { WaiterOrderDetail } from '../pages/waiter/OrderDetail';
import { WaiterMessages } from '../pages/waiter/Messages';

// Staff layout nav configs
const deputyNav = [
  { name: 'Dashboard', path: '/staff/deputy/dashboard' },
  { name: 'Staff', path: '/staff/deputy/staff' },
  { name: 'Approvals', path: '/staff/deputy/approvals' },
  { name: 'Reports', path: '/staff/deputy/reports' },
  { name: 'Issues', path: '/staff/deputy/issues' },
];

const hrNav = [
  { name: 'Dashboard', path: '/staff/hr/dashboard' },
  { name: 'Staff List', path: '/staff/hr/staff' },
  { name: 'Enrollment', path: '/staff/hr/enrollment' },
];

const financeNav = [
  { name: 'Dashboard', path: '/staff/finance/dashboard' },
  { name: 'Revenue', path: '/staff/finance/revenue' },
  { name: 'Submit Report', path: '/staff/finance/reports/new' },
];

const kitchenNav = [
  { name: 'Dashboard', path: '/staff/kitchen/dashboard' },
  { name: 'Menu', path: '/staff/kitchen/menu' },
  { name: 'Reports', path: '/staff/kitchen/reports' },
];

const chefNav = [
  { name: 'Board', path: '/staff/chef/board' },
  { name: 'Messages', path: '/staff/chef/messages' },
];

const waiterNav = [
  { name: 'Board', path: '/staff/waiter/board' },
  { name: 'New Order', path: '/staff/waiter/order/new' },
  { name: 'Messages', path: '/staff/waiter/messages' },
];

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Public Routes ===== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants/:slug" element={<RestaurantDetail />} />
        </Route>

        {/* ===== Auth Routes ===== */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/staff" element={<StaffLogin />} />
          <Route path="/auth/set-password" element={<SetPassword />} />
        </Route>

        {/* ===== Client Routes ===== */}
        <Route path="/client" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
          <Route index element={<ClientDashboard />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="orders/:id" element={<OrderTracking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="issues" element={<ClientIssues />} />
        </Route>

        {/* ===== Owner Routes ===== */}
        <Route path="/owner" element={<ProtectedRoute><RoleRoute roles={['OWNER']}><OwnerLayout /></RoleRoute></ProtectedRoute>}>
          <Route index element={<OwnerDashboard />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="restaurants" element={<RestaurantList />} />
          <Route path="restaurants/new" element={<RestaurantSetup />} />
          <Route path="restaurants/:id" element={<RestaurantProfile />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="reports" element={<OwnerReports />} />
          <Route path="issues" element={<IssuesHub />} />
        </Route>

        {/* ===== Deputy Manager Routes ===== */}
        <Route path="/staff/deputy" element={<ProtectedRoute><RoleRoute roles={['DEPUTY_MANAGER']}><StaffLayout rolePrefix="deputy" navItems={deputyNav} /></RoleRoute></ProtectedRoute>}>
          <Route path="dashboard" element={<DeputyDashboard />} />
          <Route path="staff" element={<StaffOverview />} />
          <Route path="approvals" element={<DeputyApprovals />} />
          <Route path="reports" element={<DeputyReports />} />
          <Route path="issues" element={<DeputyIssuesPage />} />
        </Route>

        {/* ===== HR Manager Routes ===== */}
        <Route path="/staff/hr" element={<ProtectedRoute><RoleRoute roles={['HR_MANAGER']}><StaffLayout rolePrefix="hr" navItems={hrNav} /></RoleRoute></ProtectedRoute>}>
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/new" element={<CreateStaff />} />
          <Route path="staff/bulk" element={<BulkEnrollment />} />
          <Route path="staff/:id" element={<StaffDetail />} />
          <Route path="enrollment" element={<BulkEnrollment />} />
        </Route>

        {/* ===== Finance Manager Routes ===== */}
        <Route path="/staff/finance" element={<ProtectedRoute><RoleRoute roles={['FINANCE_MANAGER']}><StaffLayout rolePrefix="finance" navItems={financeNav} /></RoleRoute></ProtectedRoute>}>
          <Route path="dashboard" element={<FinanceDashboard />} />
          <Route path="revenue" element={<RevenueReport />} />
          <Route path="reports/new" element={<SubmitReport />} />
        </Route>

        {/* ===== Kitchen Manager Routes ===== */}
        <Route path="/staff/kitchen" element={<ProtectedRoute><RoleRoute roles={['KITCHEN_MANAGER']}><StaffLayout rolePrefix="kitchen" navItems={kitchenNav} /></RoleRoute></ProtectedRoute>}>
          <Route path="dashboard" element={<KitchenDashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="reports" element={<OperationsReport />} />
        </Route>

        {/* ===== Chef Routes ===== */}
        <Route path="/staff/chef" element={<ProtectedRoute><RoleRoute roles={['CHEF']}><StaffLayout rolePrefix="chef" navItems={chefNav} /></RoleRoute></ProtectedRoute>}>
          <Route path="board" element={<ChefBoard />} />
          <Route path="orders/:id" element={<ChefOrderDetail />} />
          <Route path="messages" element={<ChefMessages />} />
        </Route>

        {/* ===== Waiter Routes ===== */}
        <Route path="/staff/waiter" element={<ProtectedRoute><RoleRoute roles={['WAITER']}><StaffLayout rolePrefix="waiter" navItems={waiterNav} /></RoleRoute></ProtectedRoute>}>
          <Route path="board" element={<WaiterBoard />} />
          <Route path="order/new" element={<PlaceOrder />} />
          <Route path="orders/:id" element={<WaiterOrderDetail />} />
          <Route path="messages" element={<WaiterMessages />} />
        </Route>

        {/* ===== 404 ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
