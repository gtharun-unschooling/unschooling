import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/Main/MainPage';
import NichesPage from '../pages/Niches/NichesMainPage';
import TopicDetailPage from '../pages/Topics/TopicDetailPage';
import EssentialGrowthMainPage from '../pages/Essential_Growth/EssentialGrowthMainPage';
import PlansMainPage from '../pages/Plans/Plans.jsx';

import DynamicNichePage from '../pages/Niches/DynamicNichePage';
import DynamicTopicPage from '../pages/Niches/DynamicTopicPage';

// import Navbar from '../components/Navbar';
import AuthForm from '../components/AuthForm';
import FirestoreTest from '../components/FirestoreTest';
import Home from '../components/Home';
import ChildProfilePage from '../components/forms/ProfileForm';
import CustomisedWeeklyPlan from "../components/CustomisedWeeklyPlan";
import DatabaseViewer from "../components/DatabaseViewer";



const RoutesComponent = () => (
  <>
    {/* <Navbar /> */}
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/firestore" element={<FirestoreTest />} />
      <Route path="/child-profile" element={<ChildProfilePage />} />
      <Route path="/customised-weekly-plan" element={<CustomisedWeeklyPlan />} />
      <Route path="/database-viewer" element={<DatabaseViewer />} />
      <Route path="/niche" element={<NichesPage />} />
      <Route path="/topic/:id" element={<TopicDetailPage />} />
      <Route path="/essential-growth" element={<EssentialGrowthMainPage />} />
      <Route path="/plans" element={<PlansMainPage />} />
      <Route path="/niche/:nicheSlug" element={<DynamicNichePage />} />
      <Route path="/niche/:nicheName/:topicSlug" element={<DynamicTopicPage />} />
    </Routes>
  </>
);

export default RoutesComponent;
