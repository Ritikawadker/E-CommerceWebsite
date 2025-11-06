
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { useState } from 'react';


function App() {
    const [searchbar,setSearchbar] = useState("");
    // console.log("r")

  return (
    <>
    <BrowserRouter>
    <Header searchbar = {searchbar} setSearchbar={setSearchbar}/>
    <Routes>
        <Route path="/" element={<Home searchbar={searchbar}/>}/>
        <Route path="/product/:id" element={<Product/>}/>
    </Routes>
    <Footer/> 
    </BrowserRouter>      
    </>
  )
}

export default App  