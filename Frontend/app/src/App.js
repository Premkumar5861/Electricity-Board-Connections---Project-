import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './components/Screens/Home';
import Header from './components/Screens/Header';
import EditApplicant from './components/Screens/EditApplicant';
import Stats from './components/Screens/Stats';
import LogineScreen from './components/Screens/LogineScreen';


function App() {
  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route exact path="/" element={<Home/>}></Route>
    
    
      <Route exact path='/editApplicant/:id' element={<EditApplicant/>}></Route>

      <Route exact path='/StatisticsCollection/' element={<Stats/>}></Route>
      <Route exect path='/login/' element={<LogineScreen/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App