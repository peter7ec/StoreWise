import * as React from "react";
import { useAuth } from "../services/authContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router";

function Header() {
  const { user, logout } = useAuth();

  const avatarContent = React.useMemo(() => {
    if (!user) {
      // Nincs bejelentkezve, ember ikon helyett is használhatod az Avatar-t default elemmel
      return <Avatar />;
    }

    if (
      user.providerData?.some((p) => p.providerId === "google.com") &&
      user.photoURL
    ) {
      // Google user: képet mutat
      return <Avatar alt={user.displayName || ""} src={user.photoURL} />;
    }

    // Email/password user, név alapján kezdőbetű
    const initial = user.displayName
      ? user.displayName.charAt(0).toUpperCase()
      : "";
    return <Avatar alt={user.displayName ?? undefined} children={initial} />;
  }, [user]);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const userMenuItems = !user
    ? [
        <MenuItem key="login" onClick={handleCloseUserMenu}>
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography sx={{ textAlign: "center" }}>Bejelentkezés</Typography>
          </Link>
        </MenuItem>,
        <MenuItem key="register" onClick={handleCloseUserMenu}>
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography sx={{ textAlign: "center" }}>Regisztráció</Typography>
          </Link>
        </MenuItem>,
      ]
    : [
        <MenuItem
          key="logout"
          onClick={() => {
            handleCloseUserMenu();
            logout();
          }}
        >
          <Typography sx={{ textAlign: "center" }}>Kijelentkezés</Typography>
        </MenuItem>,
      ];

  return (
    <AppBar position="static" sx={{ width: "100%" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            StoreWise
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem key={"lists"} onClick={handleCloseNavMenu}>
                <Link
                  to="/lists"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {"Listák"}
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem key={"newLists"} onClick={handleCloseNavMenu}>
                <Link
                  to="/new-list"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {"Új lista"}
                  </Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            StoreWise
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              key={"new-list"}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              <Link
                to="/new-list"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {"Új lista"}
              </Link>
            </Button>
            <Button
              key={"lists"}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              <Link
                to="/new-list"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {"Listák"}
              </Link>
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Fiók">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {avatarContent}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenuItems}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
