import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <>
      <nav>
        <NavLink to={"/"}>
          <img
            src="/7020109.png"
            alt="Kiwi project logo"
            width="50"
            height="50"
          />
        </NavLink>
        <div className={styles.spacer}>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            Survey
          </NavLink>
          <NavLink
            to={"/about"}
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            About
          </NavLink>
          <NavLink
            to={"/login"}
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            Login
          </NavLink>
          <NavLink
            to={"/submissions"}
            className={({ isActive }) =>
              isActive ? styles.active : styles.inactive
            }
          >
            Submissions
          </NavLink>
        </div>
      </nav>
    </>
  );
}
export default Header;
