import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import TopNav from "./TopNav";
import WhistlistIcon from "../../../public/icons/WhistlistIcon";
import UserIcon from "../../../public/icons/UserIcon";
import AuthForm from "../Auth/AuthForm";
import SearchForm from "../SearchForm/SearchForm";
import CartItem from "../CartItem/CartItem";
import Menu from "../Menu/Menu";
import AppHeader from "./AppHeader";
import { useWishlist } from "../../context/wishlist/WishlistProvider";

import styles from "./Header.module.css";

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title }) => {
  //@ts-ignore
  const { wishlist } = useWishlist();
  const [animate, setAnimate] = useState("");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [didMount, setDidMount] = useState<boolean>(false); // to disable Can't perform a React state Warning

  // Calculate Number of Wishlist
  let noOfWishlist = wishlist.length;

  // Animate Wishlist Number
  const handleAnimate = useCallback(() => {
    if (noOfWishlist === 0) return;
    setAnimate("animate__animated animate__headShake");
  }, [noOfWishlist, setAnimate]);

  // Set animate when no of wishlist changes
  useEffect(() => {
    handleAnimate();
    setTimeout(() => {
      setAnimate("");
    }, 1000);
  }, [handleAnimate]);

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 30) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [setScrolled]);

  useEffect(() => {
    setDidMount(true);
    window.addEventListener("scroll", handleScroll);
    return () => setDidMount(false);
  }, [handleScroll]);

  if (!didMount) {
    return null;
  }
  return (
    <>
      {/* ===== <head> section ===== */}
      <AppHeader title={title} />

      {/* ===== Skip to main content button ===== */}
      <Link
        href="#main-content"
        className="whitespace-nowrap absolute z-50 left-4 opacity-90 rounded-md bg-white px-4 py-3 transform -translate-y-40 focus:translate-y-0 transition-all duration-300"
      >
        skip to main content
      </Link>

      {/* ===== Top Navigation ===== */}
      <TopNav />

      {/* ===== Main Navigation ===== */}
      <nav
        className={`${
          scrolled ? "bg-white sticky top-0 shadow-md z-50" : "bg-transparent"
        } w-full z-50 h-20 relative`}
      >
        <div className="app-max-width w-full">
          <div
            className={`flex justify-between align-baseline app-x-padding ${styles.mainMenu}`}
          >
            {/* Hamburger Menu and Mobile Nav */}
            <div className="flex-1 lg:flex-0 lg:hidden">
              <Menu />
            </div>

            {/* Left Nav */}
            <ul className={`flex-0 lg:flex-1 flex ${styles.leftMenu}`}>
              <li>
                <Link href={`/product-category/men`}>
                  Men
                </Link>
              </li>
              <li>
                <Link href={`/product-category/women`}>
                  Women
                </Link>
              </li>
              <li>
                <Link href="/product-category/bags">
                  Bags
                </Link>
              </li>
              <li>
                <Link href="/coming-soon">
                  Blogs
                </Link>
              </li>
            </ul>

        
            <div className="flex-1 flex justify-center items-center cursor-pointer">
              <div className="w-32 h-auto">
                <Link href="/">
                  
                <h1 className="text-4xl font-bold tracking-wide text-center text-purple-700">
  <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600
 text-transparent bg-clip-text">
    LAURELS
  </span>
</h1>

            
                </Link>
              </div>
            </div>

            {/* Right Nav */}
            <ul className={`flex-1 flex justify-end ${styles.rightMenu}`}>
              <li>
                <SearchForm />
              </li>
              <li>
                <AuthForm>
                  <UserIcon />
                </AuthForm>
              </li>
              <li>
                <Link href="/wishlist" passHref>
                  {/* <a className="relative" aria-label="Wishlist"> */}
                  <button
                    type="button"
                    className="relative"
                    aria-label="Wishlist"
                  >
                    <WhistlistIcon />
                    {noOfWishlist > 0 && (
                      <span
                        className={`${animate} absolute text-xs -top-3 -right-3 bg-gray-500 text-gray-100 py-1 px-2 rounded-full`}
                      >
                        {noOfWishlist}
                      </span>
                    )}
                  </button>
                  {/* </a> */}
                </Link>
              </li>
              <li>
                <CartItem />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;