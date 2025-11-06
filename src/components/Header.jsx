import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import image from "../assets/logo.png.jpg"; 
import "../styles/Header.css";

const Header = ({searchbar,setSearchbar}) => {
  return (
    <header className="header">
      <div className="logo-section">
        <img src={image} alt="Website Logo" className="logo" />
       <i> <h1 className="site-name"> E-Shop platform</h1></i>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Enter product name or category" value={searchbar} onChange={(e)=>setSearchbar(e.target.value)} />
        <SearchIcon className="search-icon" />
      </div>
      <div className="icon-section">
        <ShoppingCartIcon className="icon" />
        <NotificationsIcon className="icon" />
        <AccountCircleIcon className="icon" />
      </div>
    </header>
  );
};

export default Header;
