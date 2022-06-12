import {
  HomeRounded as HomeOutlined, 
  InboxRounded as InboxOutlined,
  FavoriteRounded as Favorite,
  PersonRounded as Person
} from "@material-ui/icons";
const Navigation = () => {
    // const icons = document.querySelector('.navicons').childNodes;
    // icons.forEach((icon) => {
    //     icon.onhover = () => {
            
    //     }
    // })
  return (
    <nav>
      <div className="navhead">
        <div>Instagram</div>
      </div>
      <div className="navinput">
        <input type="text" placeholder="Search" />
      </div>
      <div className="navicons">
        <HomeOutlined></HomeOutlined>
        <InboxOutlined></InboxOutlined>
        <Favorite></Favorite>
        <Person></Person>
      </div>
    </nav>
  );
};

export default Navigation;
