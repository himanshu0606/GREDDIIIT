import './App.css';
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Profile from './components/Profile';
import Follower from './components/Follower';
import Following from './components/Following';
import NoPage from './components/NoPage';
import EditProfile from './components/EditProfile';
import MySubgreddiit from './components/MySubgreddiit';
import Subgreddiits from './components/Subgreddiits';
import SubgreddiitsProfile from './components/SubgreddiitsProfile';
import SavedPost from './components/SavedPost';
import LoadingBar from 'react-top-loading-bar'
import { useEffect, useState } from 'react';
import MySubgrediitProfile from './components/MySubgrediitProfile';
import MySubgrediitJoin from './components/MySubgrediitJoin';
import MySubgrediitReport from './components/MySubgrediitReport';
import MySubgrediitStat from './components/MySubgrediitStat';
import Chat from './components/Chat';
import Google from './components/Google';
import CAS from './components/CAS';

function App() {
  const [progress, setProgress] = useState(0);

  return (
    <>
      <Router>
        <LoadingBar
          color='#f11946'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Routes>
          <Route path="/" element={<Login setProgress={setProgress} />} />
          <Route path="/google" element={<Google setProgress={setProgress} />} />
          <Route path="/cas/:id" element={<CAS />} />
          <Route path="/profile" element={<Profile setProgress={setProgress} />} />
          <Route path="/follower" element={<Follower setProgress={setProgress} />} />
          <Route path="/following" element={<Following setProgress={setProgress} />} />
          <Route path="/editprofile" element={<EditProfile setProgress={setProgress} />} />
          <Route path="/mysubgreddiit" element={<MySubgreddiit setProgress={setProgress} />} />
          <Route path="/subgreddiits" element={<Subgreddiits setProgress={setProgress} />} />
          <Route path="/subgreddiits/:sub" element={<SubgreddiitsProfile setProgress={setProgress} />} />
          <Route path="/mysubgrediits/:mysub" element={<MySubgrediitProfile setProgress={setProgress} />} />
          <Route path="/mysubgrediits/:mysub/joinrequest" element={<MySubgrediitJoin setProgress={setProgress} />} />
          <Route path="/mysubgrediits/:mysub/reports" element={<MySubgrediitReport setProgress={setProgress} />} />
          <Route path="/mysubgrediits/:mysub/stats" element={<MySubgrediitStat setProgress={setProgress} />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/savedPost" element={<SavedPost />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router >
    </>
  );
}

export default App;
