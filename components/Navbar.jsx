import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import Logout from "./auth/Logout";

const Navbar = async ({ sideMenu }) => {
  const session = await auth();
  console.log(session);
  return (
    <nav>
      <Link href="/">
        <Image
          src="/download.png"
          alt="Stay Swift Logo"
          width={100}
          height={400}
        />
      </Link>
      {sideMenu && (
        <ul>
          <li>
            <Link href="/bookings">Bookings</Link>
          </li>
          <li>
            <Link href="#">Recommended Places</Link>
          </li>

          <li>
            <Link href="#">About Us</Link>
          </li>

          <li>
            <Link href="#">Contact us</Link>
          </li>

          <li>
            {session?.user ? (
              <idiv>
                <span className="mx-1"> {session?.user?.name} </span>
                <span> | </span>
                <Logout />
              </idiv>
            ) : (
              <Link href="/login" className="login">
                Login
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
