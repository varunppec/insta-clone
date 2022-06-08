import { HomeOutlined, InboxOutlined, FavoriteBorder as Favorite, PersonOutline as Person } from "@material-ui/icons";
const Navigation = () => {
    
    return <nav>
        <div className="navhead">
            <div>Instagram</div>
        </div>
        <div className="navinput">
            <input type="text" placeholder="Search"/>
        </div>
        <div className="navicons">
            <HomeOutlined></HomeOutlined>
            <InboxOutlined></InboxOutlined>
            <Favorite></Favorite>
            <Person></Person>
        </div>
    </nav>
}

export default Navigation;