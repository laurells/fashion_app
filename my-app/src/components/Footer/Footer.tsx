import Link from "next/link";
import FacebookLogo from "../../../public/icons/FacebookLogo";
import InstagramLogo from "../../../public/icons/InstagramLogo";
import Button from "../Buttons/Button";
import Input from "../Input/Input";
import styles from "./Footer.module.css";

export default function Footer() {

  return (
    <>
      <div className={styles.footerContainer}>
        <div className={`app-max-width app-x-padding ${styles.footerContents}`}>
          <div>
            <h3 className={styles.footerHead}>Company</h3>
            <div className={styles.column}>
              <Link href="example">About us</Link>
              <Link href="example">Contact us</Link>
              <Link href="example">Store location</Link>
              <Link href="example">Careers</Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>Help</h3>
            <div className={styles.column}>
              <Link href="example">Order tracking</Link>
              <Link href="example">FAQs</Link>
              <Link href="example">Privacy policy</Link>
              <Link href="example">Terms conditions</Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>Store</h3>
            <div className={styles.column}>
              <Link href={`/product-category/women`}>
                Women
              </Link>
              <Link href={`/product-category/men`}>
                Men
              </Link>
              <Link href={`/product-category/bags`}>
                Bags
              </Link>
            </div>
          </div>
          <div>
            <h3 className={styles.footerHead}>Keep in touch</h3>
            <div className={styles.column}>
              <span>
                Rivers State
                <br />
                Stadium road
                <br />
                Port Harcourt
              </span>
              
              <span>+2348077591629</span>
              <span>laurels.echichinwo@stu.cu.edu.ng</span>
              <span>
                open all days <br />- 8:00am to 9:00pm
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pb-16">
        <h4 className="text-3xl mb-4">Newsletter</h4>
        <span className="px-6 text-center">Our newsletter</span>
        <div className="mt-5 px-6 flex w-full sm:w-auto flex-col sm:flex-row">
          <Input
            label="Newsletter Input Box"
            name="email"
            type="email"
            extraClass=" w-full sm:w-auto"
          />{" "}
          <Button
            size="lg"
            value='send'
            extraClass="ml-0 mt-4 sm:mt-0 tracking-widest sm:tracking-normal sm:mt-0 sm:ml-4 w-auto w-full sm:w-auto"
          />
        </div>
      </div>
      <div className={styles.bottomFooter}>
        <div className="app-max-width app-x-padding w-full flex justify-between">
          <span className="">@2023 Laurels. all rights reserved</span>
          <span className="flex items-center">
            <span className="hidden sm:block">
              follow us on social media:
            </span>{" "}
            <a
              href="www.facebook.com"
              aria-label="Facebook Page for Laurels Fashion"
            >
              <FacebookLogo />
            </a>
            <a
              href="www.ig.com"
              aria-label="Instagram Account for Laurels Fashion"
            >
              <InstagramLogo />
            </a>
          </span>
        </div>
      </div>
    </>
  );
}