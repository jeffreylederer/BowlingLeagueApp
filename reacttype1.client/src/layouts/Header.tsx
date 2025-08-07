import Menu from '@components/Menu.tsx';
import LeagueClass from "@components/LeagueClass";
import UserClass from "@components/UserClass";



const Header = () => {
    const myStyle = {
        color: "white",
        backgroundColor: "lightgreen",
        padding: "10px",
        fontFamily: "Sans-Serif"
    };
    const user = new UserClass();
    const league = new LeagueClass();
    return (
        <header>
            <h3 style={myStyle }>{import.meta.env.VITE_SERVER_ClubName}</h3>
            <Menu league={league} user={user} />
        </header>
    )
}

export default Header;