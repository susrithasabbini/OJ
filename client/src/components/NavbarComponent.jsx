import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function NavbarComponent({ authLinks }) {
  const menuItems = ["Login", "Logout"];
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <Navbar disableAnimation isBordered>
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle className="text-gray-800" />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand onClick={goToHome} className="cursor-pointer">
          <p className="font-bold text-inherit text-violet-800 text-lg">Code</p>
          <p className="font-bold text-inherit text-gray-500 text-lg">Judge</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand onClick={goToHome} className="cursor-pointer">
          <p className="font-bold text-inherit text-violet-800 text-lg">Code</p>
          <p className="font-bold text-inherit text-gray-500 text-lg">Judge</p>
        </NavbarBrand>
        {/* <NavbarItem>
          <Link color="foreground" href="#">
            
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page" color="warning">
            
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            
          </Link>
        </NavbarItem> */}
      </NavbarContent>

      <NavbarContent justify="end">
        {authLinks && (
          <>
            <NavbarItem className="hidden md:flex">
              <Link href="login" color="foreground">
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="secondary" href="signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full font-semibold"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
