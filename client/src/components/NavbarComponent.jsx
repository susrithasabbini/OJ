import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Avatar,
  AvatarIcon,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

export default function NavbarComponent({ authLinks, user }) {
  const { logoutUser } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <Navbar disableAnimation isBordered>
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle className="text-gray-800" />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand onClick={() => navigate("/")} className="cursor-pointer">
          <p className="text-blue-500 font-bold text-xl">
            Code<span className="text-gray-700">Judge</span>
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarBrand onClick={() => navigate("/")} className="cursor-pointer">
          <p className="text-blue-500 font-bold text-xl">
            Code<span className="text-gray-700">Judge</span>
          </p>
        </NavbarBrand>
        <NavbarItem>
          <Link
            href="#"
            color="primary"
            className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Practice
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="#"
            color="primary"
            className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Compete
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="primary"
            href="#"
            className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Leaderboard
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {(authLinks || !user) && (
          <>
            <NavbarItem className="hidden md:flex">
              <Link href="login" color="foreground">
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
        {!authLinks && user && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <div className="flex items-center cursor-pointer">
                    <Avatar
                      icon={<AvatarIcon />}
                      classNames={{
                        base: "bg-gradient-to-br from-[#3b82f6] to-[#38bdf8]",
                        icon: "text-white",
                      }}
                    />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Logged in as,</p>
                    <p className="font-bold text-blue-500">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="account"
                    onClick={() => navigate(`/account/${user.username}`)}
                  >
                    Account
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={() => {
                      logoutUser();
                    }}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {!authLinks && (
          <>
            <NavbarItem>
              <Link
                href={`/account/${user?.username}`}
                color="primary"
                className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Account
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="#"
                color="primary"
                className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Practice
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="#"
                color="primary"
                className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Compete
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color="primary"
                href="#"
                className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Leaderboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color="danger"
                href="#"
                onClick={() => logoutUser()}
                className="font-semibold hover:underline hover:text-red-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Logout
              </Link>
            </NavbarItem>
          </>
        )}
        {authLinks && (
          <>
            <NavbarItem>
              <Link
                href="#"
                color="primary"
                className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Practice
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="#"
                color="primary"
                className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Compete
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color="primary"
                href="#"
                className="font-semibold hover:underline hover:text-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                Leaderboard
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
