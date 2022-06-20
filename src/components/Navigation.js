import {
  HomeRounded as HomeOutlined,
  InboxRounded as InboxOutlined,
  FavoriteRounded as Favorite,
  PersonRounded as Person,
} from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
const Navigation = () => {
  // const icons = document.querySelector('.navicons').childNodes;
  // icons.forEach((icon) => {
  //     icon.onhover = () => {

  //     }
  // })
  const navigate = useNavigate();
  return (
    <nav>
      <div className="navhead" onClick={() => navigate("/")}>
        <div>Instagram</div>
      </div>
      <div className="navinput">
        <input type="text" placeholder="Search" />
      </div>
      <div className="navicons">
        <HomeOutlined onClick={() => navigate("/")}></HomeOutlined>
        <InboxOutlined></InboxOutlined>
        <Favorite></Favorite>
        <Person onClick={() => navigate("/profile")}></Person>
      </div>
    </nav>
  );
};

export default Navigation;
