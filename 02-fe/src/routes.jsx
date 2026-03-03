import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout    from './layout/AdminLayout';
import UserLayout     from './layout/UserLayout';

import Login          from './pages/auth/Login';
import Register       from './pages/auth/Register';

import Home           from './pages/user/Home';
import Profile        from './pages/user/Profile';
import StoryList      from './pages/user/StoryList';
import StoryDetail    from './pages/user/StoryDetail';
import ReadChapter    from './pages/user/ReadChapter';
import CategoryPage   from './pages/user/CategoryPage';
import SearchPage     from './pages/user/SearchPage';

import Dashboard         from './pages/admin/Dashboard';
import ManageStories     from './pages/admin/story/ManageStories';
import AddStory          from './pages/admin/story/AddStory';
import EditStory         from './pages/admin/story/EditStory';
import StoryDetailAdmin  from './pages/admin/story/StoryDetailAdmin';
import AddChapter        from './pages/admin/chapter/AddChapter';
import EditChapter       from './pages/admin/chapter/EditChapter';
import ManageCategories  from './pages/admin/category/ManageCategories';
import ManageUsers       from './pages/admin/user/ManageUsers';
import ManageComments    from './pages/admin/comment/ManageComments';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<UserLayout />}>
        <Route path="/home"                                   element={<Home />} />
        <Route path="/profile"                                element={<Profile />} />
        <Route path="/stories"                                element={<StoryList />} />
        <Route path="/stories/:storyid/read"                  element={<ReadChapter />} />
        <Route path="/stories/:storyid/chapters/:chapterid"   element={<ReadChapter />} />
        <Route path="/stories/:storyid"                       element={<StoryDetail />} />
        <Route path="/categories"                             element={<CategoryPage />} />
        <Route path="/search"                                 element={<SearchPage />} />
      </Route>

      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"   element={<Dashboard />} />
        <Route path="stories"     element={<ManageStories />} />
        <Route path="stories/add" element={<AddStory />} />
        <Route path="stories/edit"   element={<EditStory />} />
        <Route path="stories/detail" element={<StoryDetailAdmin />} />
        <Route path="chapters/add"   element={<AddChapter />} />
        <Route path="chapters/edit"  element={<EditChapter />} />
        <Route path="categories"  element={<ManageCategories />} />
        <Route path="users"       element={<ManageUsers />} />
        <Route path="comments"    element={<ManageComments />} />
      </Route>
    </Routes>
  );
}
