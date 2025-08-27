import Menu from '@components/Menu.tsx';




const Header = () => {
    const myStyle = {
        color: "white",
        backgroundColor: "lightgreen",
        padding: "10px",
        fontFamily: "Sans-Serif"
    };
   
    return (
        <header>
            <h3 style={myStyle }>{import.meta.env.VITE_SERVER_ClubName}</h3>
            <Menu  />
        </header>
    )
}

export default Header;