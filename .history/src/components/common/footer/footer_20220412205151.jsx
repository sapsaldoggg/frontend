import React from 'react';
import styles from './footer.module.css';
import { BiHomeAlt } from 'react-icons/bi';
import { BsList } from 'react-icons/bs';
import { Link, NavLink } from 'react-router-dom';
const Footer = (props) => (
  <footer>
    <nav className={styles.nav}>
      <NavLink
        to='/'
        className={({ isActive }) =>
          isActive ? styles.actived : styles.unActived
        }
      >
        <div className={styles.navItem}>
          <BiHomeAlt fontSize='2rem' />
          <span className={styles.navItem__text}>홈</span>
        </div>
      </NavLink>
      <NavLink
        to='/1'
        className={({ isActive }) => (isActive ? styles.test1 : styles.test2)}
      >
        <div className={styles.navItem}>
          <BsList fontSize='2rem' />
          <span className={styles.navItem__text}>홈</span>
        </div>
      </NavLink>
    </nav>
  </footer>
);

export default Footer;
