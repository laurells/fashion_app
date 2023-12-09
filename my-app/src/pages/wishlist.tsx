import Link from "next/link";
import Image from "next/image";
// import { GetStaticProps } from "next";
// import { useTranslations } from "next-intl";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import LeftArrow from "../../public/icons/LeftArrow";
import Button from "../components/Buttons/Button";
import GhostButton from "../components/Buttons/GhostButton";
import { useCart } from "../context/cart/CartProvider";
import { useWishlist } from "../context/wishlist/WishlistProvider";

// let w = window.innerWidth;

const Wishlist = () => {
  const { addOne } = useCart();
  const { wishlist, deleteWishlistItem, clearWishlist } = useWishlist();

  let subtotal = 0;

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`Wishlist - Laurels Fashion`} />

      <main id="main-content">
        {/* ===== Heading & Continue Shopping */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 w-full border-t-2 border-gray-100">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-left mt-6 mb-2 animatee__animated animate__bounce">
            {("Wishlist")}
          </h1>
          <div className="mt-6 mb-3">
            <Link href="/"
               className="inline-block">
                <LeftArrow size="sm" extraClass="inline-block" />{" "}
                {("Continue shopping")}
              
            </Link>
          </div>
        </div>

        {/* ===== Wishlist Table Section ===== */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 flex flex-col lg:flex-row">
          <div className="h-full w-full">
            <table className="w-full mb-6">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-200">
                  <th className="font-normal hidden md:table-cell text-left sm:text-center py-2 xl:w-72">
                    {("Product Image")}
                  </th>
                  <th className="font-normal hidden md:table-cell text-left sm:text-center py-2 xl:w-72">
                    {("Product Name")}
                  </th>
                  <th className="font-normal md:hidden text-left sm:text-center py-2 xl:w-72">
                    {("Product Details")}
                  </th>
                  <th
                    className={`font-normal py-2 ${
                      wishlist.length === 0 ? "text-center" : "text-right"
                    }`}
                  >
                    {("Unit Price")}
                  </th>
                  <th className="font-normal hidden sm:table-cell py-2 max-w-xs">
                    {("Add")}
                  </th>
                  <th className="font-normal hidden sm:table-cell py-2 text-right w-10 whitespace-nowrap">
                    {("Remove")}
                  </th>
                  <th className="font-normal sm:hidden py-2 text-right w-10">
                    {("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {wishlist.length === 0 ? (
                  <tr className="w-full text-center h-60 border-b-2 border-gray-200">
                    <td colSpan={5}>{("wishlist is empty")}</td>
                  </tr>
                ) : (
                  wishlist.map((item) => {
                    subtotal += item.price * item.qty!;
                    return (
                      <tr className="border-b-2 border-gray-200" key={item.id}>
                        <td className="my-3 flex justify-center flex-col items-start sm:items-center">
                          <Link
                            href={`/products/${encodeURIComponent(item.id)}`}
                          >
                            
                              <Image
                                src={item.img1 as string}
                                alt={item.name}
                                width={95}
                                height={128}
                                className="h-32 xl:mr-4"
                              />
                            
                          </Link>
                          <span className="text-xs md:hidden">{item.name}</span>
                        </td>
                        <td className="text-center hidden md:table-cell">
                          {item.name}
                        </td>
                        <td className="text-right text-gray-400">
                          $ {item.price}
                        </td>
                        <td className="text-center hidden sm:table-cell max-w-xs text-gray-400">
                          <Button
                            value={("add to cart")}
                            extraClass="hidden sm:block m-auto"
                            onClick={() => addOne!(item)}
                          />
                        </td>
                        <td
                          className="text-right pl-8"
                          style={{ minWidth: "3rem" }}
                        >
                          <Button
                            value={("add")}
                            onClick={() => addOne!(item)}
                            extraClass="sm:hidden mb-4 whitespace-nowrap"
                          />
                          <button
                            onClick={() => deleteWishlistItem!(item)}
                            type="button"
                            className="outline-none text-gray-300 hover:text-gray-500 focus:outline-none text-4xl sm:text-2xl"
                          >
                            &#10005;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div>
              {/* @ts-ignore */}
              <GhostButton
                onClick={clearWishlist}
                extraClass="w-full sm:w-48 whitespace-nowrap"
              >
                {("clear wishlist")}
              </GhostButton>
            </div>
          </div>
        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   return {
//     props: {
//       messages: (await import(`../messages/common/${locale}.json`)).default,
//     },
//   };
// };

export default Wishlist;