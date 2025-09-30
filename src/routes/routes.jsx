import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../pages/Main/MainPage';
import NichesPage from '../pages/Niches/NichesMainPage';
import TopicDetailPage from '../pages/Topics/TopicDetailPage';
import EssentialGrowthMainPage from '../pages/Essential_Growth/EssentialGrowthMainPage';
import PlayCreativityPage from '../pages/Essential_Growth/PlayCreativityPage';
import CognitiveSkillsPage from '../pages/Essential_Growth/CognitiveSkillsPage';
import ActivityDetailPage from '../pages/Essential_Growth/ActivityDetailPage';
import LayoutComparison from '../pages/LayoutComparison';
import PlansMainPage from '../pages/Plans/Plans.jsx';

import DynamicNichePage from '../pages/Niches/DynamicNichePage';
import DynamicTopicPage from '../pages/Niches/DynamicTopicPage';
import UnifiedDashboard from '../pages/UnifiedDashboard/UnifiedDashboard';
import LearningProgressTracker from '../components/LearningProgressTracker';

// New pages
import Learning from '../pages/Learning/Learning';
import Settings from '../pages/Settings/Settings';
import ActivityLogs from '../pages/ActivityLogs/ActivityLogs';
import Help from '../pages/Help/Help';

import Navbar from '../components/Navbar';
import AuthForm from '../components/AuthForm';

import Home from '../components/Home';
import ChildProfilePage from '../components/forms/ProfileForm';
import CustomisedWeeklyPlan from "../components/CustomisedWeeklyPlan";

import PasswordReset from '../components/auth/PasswordReset';
import FirebaseConnectivityTest from '../components/auth/FirebaseConnectivityTest';
import UserProfile from '../components/profile/UserProfile';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminPanel from '../components/admin/AdminPanel';
import BillingDashboard from '../components/billing/BillingDashboard';
// Removed direct founder dashboard route usage; founder view is merged into Admin
import OrderManagement from '../components/admin/OrderManagement';
import CustomerJourney from '../components/CustomerJourney';
import AdminTracker from '../pages/Admin/AdminTracker';
import AdminSchedule from '../pages/Admin/AdminSchedule';
import ContentManagement from '../pages/Admin/ContentManagement';
import ContentManagementMain from '../pages/Admin/ContentManagementMain';
import ExistingContentAnalytics from '../pages/Admin/ExistingContentAnalytics';
import ContentInventory from '../pages/Admin/ContentInventory';
import ChildProgressDashboard from '../pages/Admin/ChildProgressDashboard';
import ProgressDashboard from '../pages/ProgressDashboard';
import About from '../pages/About';
import WhatWeDoPage from '../pages/WhatWeDo/WhatWeDoPage';
import FAQ from '../pages/FAQ';
import Contact from '../pages/Contact';
import AdminProjects from '../pages/Admin/AdminProjects';
import AdminLaunch from '../pages/Admin/AdminLaunch';
import AgentReporting from '../pages/Admin/AgentReporting';
import StreamlinedAgentDashboard from '../pages/Admin/StreamlinedAgentDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ChildActivityDashboard from '../pages/Admin/ChildActivityDashboard';
import UltimateAdminDashboard from '../pages/Admin/UltimateAdminDashboard';
import ParentDeliveryPortal from '../components/inventory/ParentDeliveryPortal';
import GamificationDashboard from '../pages/Admin/GamificationDashboard';
import PersonalizationDashboard from '../pages/Admin/PersonalizationDashboard';
import SecurityDashboard from '../pages/Admin/SecurityDashboard';
import ComplianceDashboard from '../pages/Admin/ComplianceDashboard';
import PerformanceDashboard from '../pages/Admin/PerformanceDashboard';
import InnovationDashboard from '../pages/Admin/InnovationDashboard';
import MLDashboard from '../pages/Admin/MLDashboard';
import BusinessIntelligenceDashboard from '../pages/Admin/BusinessIntelligenceDashboard';
import IntegrationDashboard from '../pages/Admin/IntegrationDashboard';
import MonitoringDashboard from '../pages/Admin/MonitoringDashboard';
import InfrastructureDashboard from '../pages/Admin/InfrastructureDashboard';
import LaunchDashboard from '../pages/Admin/LaunchDashboard';
import PostLaunchOptimizationDashboard from '../pages/Admin/PostLaunchOptimizationDashboard';
import GlobalExpansionDashboard from '../pages/Admin/GlobalExpansionDashboard';
import EnterpriseDashboard from '../pages/Admin/EnterpriseDashboard';
import AdvancedSecurityDashboard from '../pages/Admin/AdvancedSecurityDashboard';
import BackButtonTestPage from '../pages/BackButtonTest';

// Legal pages
import TermsOfService from '../pages/Legal/TermsOfService';
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import DataProtection from '../pages/Legal/DataProtection';

const RoutesComponent = () => {
  console.log('🚀 RoutesComponent rendering...');
  
  try {
    return (
      <>
        <Routes>
        {/* Public Routes - WITH NAVBAR */}
        <Route path="/" element={
          <>
            <Navbar />
            <MainPage />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <AuthForm />
          </>
        } />
        <Route path="/password-reset" element={
          <>
            <Navbar />
            <PasswordReset />
          </>
        } />
        <Route path="/progress" element={<Navigate to="/dashboard" replace />} />
        <Route path="/about" element={
          <>
            <Navbar />
            <About />
          </>
        } />
        <Route path="/what-we-do" element={
          <>
            <Navbar />
            <WhatWeDoPage />
          </>
        } />
        <Route path="/faq" element={
          <>
            <Navbar />
            <FAQ />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <Contact />
          </>
        } />
        <Route path="/terms" element={
          <>
            <Navbar />
            <TermsOfService />
          </>
        } />
        <Route path="/privacy" element={
          <>
            <Navbar />
            <PrivacyPolicy />
          </>
        } />
        <Route path="/data-protection" element={
          <>
            <Navbar />
            <DataProtection />
          </>
        } />
        <Route path="/firebase-test" element={<FirebaseConnectivityTest />} />
        <Route path="/niche" element={
          <>
            <Navbar />
            <NichesPage />
          </>
        } />
        <Route path="/topic/:id" element={
          <>
            <Navbar />
            <TopicDetailPage />
          </>
        } />
        <Route path="/essential-growth" element={
          <>
            <Navbar />
            <EssentialGrowthMainPage />
          </>
        } />
        <Route path="/essential-growth/play-creativity" element={
          <>
            <Navbar />
            <PlayCreativityPage />
          </>
        } />
        <Route path="/essential-growth/play-creativity/:ageGroup/:category/:activitySlug" element={
          <>
            <Navbar />
            <ActivityDetailPage />
          </>
        } />
        <Route path="/essential-growth/cognitive-skills" element={
          <>
            <Navbar />
            <CognitiveSkillsPage />
          </>
        } />
        <Route path="/essential-growth/cognitive-skills/:ageGroup/:category/:activitySlug" element={
          <>
            <Navbar />
            <ActivityDetailPage />
          </>
        } />
        <Route path="/layout-comparison" element={
          <>
            <Navbar />
            <LayoutComparison />
          </>
        } />
        
        {/* Back Button Test Page */}
        <Route path="/back-button-test" element={
          <>
            <Navbar />
            <BackButtonTestPage />
          </>
        } />
        <Route path="/plans" element={
          <>
            <Navbar />
            <PlansMainPage />
          </>
        } />
        <Route path="/niche/:nicheSlug" element={
          <>
            <Navbar />
            <DynamicNichePage />
          </>
        } />
        <Route path="/niche/:nicheName/:topicSlug" element={
          <>
            <Navbar />
            <DynamicTopicPage />
          </>
        } />
        
        {/* Customer Journey Route - WITH NAVBAR */}
        <Route path="/customer-journey" element={
          <>
            <Navbar />
            <CustomerJourney />
          </>
        } />
        
        {/* Legacy Founder routes redirected to Admin */}
        <Route path="/founder" element={<Navigate to="/admin" replace />} />
        <Route path="/founder/dashboard" element={<Navigate to="/admin" replace />} />
        
        {/* Legacy Enhanced Dashboard redirected to Learning */}
        <Route path="/enhanced-dashboard" element={<Navigate to="/dashboard/learning" replace />} />
        
        {/* Legacy Learning route redirected to Dashboard Learning */}
        <Route path="/learning" element={<Navigate to="/dashboard/learning" replace />} />
        
        {/* Protected Routes - WITH NAVBAR */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <Home />
            </>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <UserProfile />
            </>
          </ProtectedRoute>
        } />
        
        {/* New Protected Routes */}
        <Route path="/dashboard/learning" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <Learning />
            </>
          </ProtectedRoute>
        } />
        <Route path="/activity-logs" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <ActivityLogs />
            </>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <Settings />
            </>
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <Help />
            </>
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <BillingDashboard />
            </>
          </ProtectedRoute>
        } />
        
        {/* TEMPORARILY REMOVED AUTH FOR TESTING - Module 2 Routes - WITH NAVBAR */}
        <Route path="/child-profile" element={
          <>
            <Navbar />
            <ChildProfilePage />
          </>
        } />
        <Route path="/customised-weekly-plan" element={
          <>
            <Navbar />
            <CustomisedWeeklyPlan />
          </>
        } />

        
        <Route path="/progress-tracker" element={
          <ProtectedRoute requireAuth={true} redirectTo="/login">
            <>
              <Navbar />
              <LearningProgressTracker />
            </>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes - No Authentication Required */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/dashboard" element={<AdminPanel />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/admin/orders" element={<AdminPanel />} />
        <Route path="/admin/tracker" element={<AdminTracker />} />
        <Route path="/admin/schedule" element={<AdminSchedule />} />
        <Route path="/admin/content" element={<ContentManagementMain />} />
        <Route path="/admin/content-library" element={<ContentManagement />} />
        <Route path="/admin/content-analytics" element={<ExistingContentAnalytics />} />
        <Route path="/admin/content-inventory" element={<ContentInventory />} />
        <Route path="/admin/progress" element={<ChildProgressDashboard />} />
        <Route path="/admin/agents" element={<AgentReporting />} />
        <Route path="/admin/agents-streamlined" element={<StreamlinedAgentDashboard />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/launch" element={<AdminLaunch />} />
        <Route path="/admin/comprehensive" element={<AdminDashboard />} />
        <Route path="/admin/child-activity" element={<ChildActivityDashboard />} />
        <Route path="/admin/ultimate" element={<UltimateAdminDashboard />} />
        <Route path="/admin/gamification" element={<GamificationDashboard />} />
<Route path="/admin/personalization" element={<PersonalizationDashboard />} />
<Route path="/admin/security" element={<SecurityDashboard />} />
<Route path="/admin/compliance" element={<ComplianceDashboard />} />
<Route path="/admin/performance" element={<PerformanceDashboard />} />
<Route path="/admin/innovation" element={<InnovationDashboard />} />
<Route path="/admin/ml" element={<MLDashboard />} />
<Route path="/admin/business-intelligence" element={<BusinessIntelligenceDashboard />} />
<Route path="/admin/integration" element={<IntegrationDashboard />} />
<Route path="/admin/monitoring" element={<MonitoringDashboard />} />
<Route path="/admin/infrastructure" element={<InfrastructureDashboard />} />
<Route path="/admin/launch" element={<LaunchDashboard />} />
        <Route path="/admin/post-launch" element={<PostLaunchOptimizationDashboard />} />
        <Route path="/admin/global-expansion" element={<GlobalExpansionDashboard />} />
        <Route path="/admin/enterprise" element={<EnterpriseDashboard />} />
        <Route path="/admin/advanced-security" element={<AdvancedSecurityDashboard />} />
        <Route path="/deliveries" element={<ParentDeliveryPortal />} />
              </Routes>
      </>
    );
  } catch (error) {
    console.error('🚀 Error in RoutesComponent:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🚨 Routes Error</h2>
        <p>Error in routing component: {error.message}</p>
      </div>
    );
  }
};

export default RoutesComponent;
