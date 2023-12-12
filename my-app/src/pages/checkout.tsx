import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Buttons/Button";
import { roundDecimal } from "../components/Util/utilFunc";
import { useCart } from "../context/cart/CartProvider";
import Input from "../components/Input/Input";
import { itemType } from "../context/wishlist/wishlist-type";
import { useAuth } from "../context/AuthContext";

// let w = window.innerWidth;
type PaymentType = "CASH_ON_DELIVERY" | "BANK_TRANSFER";
type DeliveryType = "STORE_PICKUP" | "YANGON" | "OTHERS";

type Order = {
  orderNumber: number;
  customerId: number;
  shippingAddress: string;
  township?: null | string;
  city?: null | string;
  state?: null | string;
  zipCode?: null | string;
  orderDate: string;
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  totalPrice: number;
  deliveryDate: string;
};

const ShoppingCart = () => {
  const { cart, clearCart } = useCart();
  const auth = useAuth();
  const [deli, setDeli] = useState<DeliveryType>("STORE_PICKUP");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentType>("CASH_ON_DELIVERY");

  // Form Fields
  const [name, setName] = useState(auth.user?.fullname || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [phone, setPhone] = useState(auth.user?.phone || "");
  const [password, setPassword] = useState("");
  const [diffAddr, setDiffAddr] = useState(false);
  const [address, setAddress] = useState(auth.user?.shippingAddress || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  const products = cart.map((item) => ({
    id: item.id,
    quantity: item.qty,
  }));

  useEffect(() => {
    if (!isOrdering) return;

    setErrorMsg("");

    // if not logged in, register the user
    const registerUser = async () => {
      const regResponse = await auth.register!(
        email,
        name,
        password,
        address,
        phone
      );
      if (!regResponse.success) {
        setIsOrdering(false);
        if (regResponse.message === "alreadyExists") {
          setErrorMsg("email already exists");
        } else {
          setErrorMsg("error_occurs");
        }
        return false;
      }
    };
    if (!auth.user) registerUser();

    const makeOrder = async () => {
      const res = await axios.post(
        'http://localhost:5050/api/v1/orders',
        {
          customerId: auth!.user!.id,
          shippingAddress: shippingAddress ? shippingAddress : address,
          totalPrice: subtotal,
          deliveryDate: new Date().setDate(new Date().getDate() + 7),
          paymentType: paymentMethod,
          deliveryType: deli,
          products,
          sendEmail,
        }
      );
      if (res.data.success) {
        setCompletedOrder(res.data.data);
        clearCart!();
        setIsOrdering(false);
      } else {
        setOrderError("An error occured");
      }
    };
    if (auth.user) makeOrder();
  }, [isOrdering, completedOrder, auth.user]);

  useEffect(() => {
    if (auth.user) {
      setName(auth.user.fullname);
      setEmail(auth.user.email);
      setAddress(auth.user.shippingAddress || "");
      setPhone(auth.user.phone || "");
    } else {
      setName("");
      setEmail("");
      setAddress("");
      setPhone("");
    }
  }, [auth.user]);

  let disableOrder = true;

  if (!auth.user) {
    disableOrder =
      name !== "" &&
      email !== "" &&
      phone !== "" &&
      address !== "" &&
      password !== ""
        ? false
        : true;
  } else {
    disableOrder =
      name !== "" && email !== "" && phone !== "" && address !== ""
        ? false
        : true;
  }

  let subtotal: number | string = 0;

  subtotal = roundDecimal(
    cart.reduce(
      (accumulator: number, currentItem: itemType) =>
        accumulator + currentItem.price * currentItem!.qty!,
      0
    )
  );

  let deliFee = 0;
  if (deli === "YANGON") {
    deliFee = 2.0;
  } else if (deli === "OTHERS") {
    deliFee = 7.0;
  }

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`Shopping Cart - Laurels Fashion`} />

      <main id="main-content">
        {/* ===== Heading & Continue Shopping */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 w-full border-t-2 border-gray-100">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-left mt-6 mb-2 animatee__animated animate__bounce">
            {("Checkout")}
          </h1>
        </div>

        {/* ===== Form Section ===== */}
        {!completedOrder ? (
          <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 flex flex-col lg:flex-row">
            <div className="h-full w-full lg:w-7/12 mr-8">
              {errorMsg !== "" && (
                <span className="text-red text-sm font-semibold">
                  - {(errorMsg)}
                </span>
              )}
              <div className="my-4">
                <label htmlFor="name" className="text-lg">
                  {("Name")}
                </label>
                <Input
                  name="name"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray-400"
                  value={name}
                  onChange={(e) =>
                    setName((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>

              <div className="my-4">
                <label htmlFor="email" className="text-lg mb-1">
                  {("Email address")}
                </label>
                <Input
                  name="email"
                  type="email"
                  readOnly={auth.user ? true : false}
                  extraClass={`w-full mt-1 mb-2 ${
                    auth.user ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  border="border-2 border-gray-400"
                  value={email}
                  onChange={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>

              {!auth.user && (
                <div className="my-4">
                  <label htmlFor="password" className="text-lg">
                    {("password")}
                  </label>
                  <Input
                    name="password"
                    type="password"
                    extraClass="w-full mt-1 mb-2"
                    border="border-2 border-gray-400"
                    value={password}
                    onChange={(e) =>
                      setPassword((e.target as HTMLInputElement).value)
                    }
                    required
                  />
                </div>
              )}

              <div className="my-4">
                <label htmlFor="phone" className="text-lg">
                  {("Phone")}
                </label>
                <Input
                  name="phone"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray-400"
                  value={phone}
                  onChange={(e) =>
                    setPhone((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>

              <div className="my-4">
                <label htmlFor="address" className="text-lg">
                  {("Address")}
                </label>
                <textarea
                  aria-label="Address"
                  className="w-full mt-1 mb-2 border-2 border-gray-400 p-4 outline-none"
                  rows={4}
                  value={address}
                  onChange={(e) =>
                    setAddress((e.target as HTMLTextAreaElement).value)
                  }
                />
              </div>

              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  checked={diffAddr}
                  onChange={() => setDiffAddr(!diffAddr)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
              <label htmlFor="toggle" className="text-xs text-gray-700">
                {("Different shipping address")}
              </label>

              {diffAddr && (
                <div className="my-4">
                  <label htmlFor="shipping_address" className="text-lg">
                    {("Shipping address")}
                  </label>
                  <textarea
                    id="shipping_address"
                    aria-label="shipping address"
                    className="w-full mt-1 mb-2 border-2 border-gray-400 p-4 outline-none"
                    rows={4}
                    value={shippingAddress}
                    onChange={(e) =>
                      setShippingAddress(
                        (e.target as HTMLTextAreaElement).value
                      )
                    }
                  />
                </div>
              )}

              {!auth.user && (
                <div className="text-sm text-gray-400 mt-8 leading-6">
                  {("form_note")}
                </div>
              )}
            </div>
            <div className="h-full w-full lg:w-5/12 mt-10 lg:mt-4">
              {/* Cart Totals */}
              <div className="border border-gray-500 p-6 divide-y-2 divide-gray-200">
                <div className="flex justify-between">
                  <span className="text-base uppercase mb-3">
                    {("product")}
                  </span>
                  <span className="text-base uppercase mb-3">
                    {("subtotal")}
                  </span>
                </div>

                <div className="pt-2">
                  {cart.map((item) => (
                    <div className="flex justify-between mb-2" key={item.id}>
                      <span className="text-base font-medium">
                        {item.name}{" "}
                        <span className="text-gray-400">x {item.qty}</span>
                      </span>
                      <span className="text-base">
                        $ {roundDecimal(item.price * item!.qty!)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="py-3 flex justify-between">
                  <span className="uppercase">{("subtotal")}</span>
                  <span>$ {subtotal}</span>
                </div>

                <div className="py-3">
                  <span className="uppercase">{("delivery")}</span>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="radio"
                          name="deli"
                          value="STORE_PICKUP"
                          id="pickup"
                          checked={deli === "STORE_PICKUP"}
                          onChange={() => setDeli("STORE_PICKUP")}
                        />{" "}
                        <label htmlFor="pickup" className="cursor-pointer">
                          {("store pickup")}
                        </label>
                      </div>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="radio"
                          name="deli"
                          value="YANGON"
                          id="ygn"
                          checked={deli === "YANGON"}
                          onChange={() => setDeli("YANGON")}
                          // defaultChecked
                        />{" "}
                        <label htmlFor="ygn" className="cursor-pointer">
                          {("within yangon")}
                        </label>
                      </div>
                      <span>$ 2.00</span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="radio"
                          name="deli"
                          value="OTHERS"
                          id="others"
                          checked={deli === "OTHERS"}
                          onChange={() => setDeli("OTHERS")}
                        />{" "}
                        <label htmlFor="others" className="cursor-pointer">
                          {("other cities")}
                        </label>
                      </div>
                      <span>$ 7.00</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between py-3">
                    <span>{("grand_total")}</span>
                    <span>$ {roundDecimal(+subtotal + deliFee)}</span>
                  </div>

                  <div className="grid gap-4 mt-2 mb-4">
                    <label
                      htmlFor="plan-cash"
                      className="relative flex flex-col bg-white p-5 rounded-lg shadow-md border border-gray-300 cursor-pointer"
                    >
                      <span className="font-semibold text-gray-500 text-base leading-tight capitalize">
                        {("cash on delivery")}
                      </span>
                      <input
                        type="radio"
                        name="plan"
                        id="plan-cash"
                        value="CASH_ON_DELIVERY"
                        className="absolute h-0 w-0 appearance-none"
                        onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      />
                      <span
                        aria-hidden="true"
                        className={`${
                          paymentMethod === "CASH_ON_DELIVERY"
                            ? "block"
                            : "hidden"
                        } absolute inset-0 border-2 border-gray-500 bg-opacity-10 rounded-lg`}
                      >
                        <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                    </label>
                    <label
                      htmlFor="plan-bank"
                      className="relative flex flex-col bg-white p-5 rounded-lg shadow-md border border-gray-300 cursor-pointer"
                    >
                      <span className="font-semibold text-gray-500 leading-tight capitalize">
                        {("bank transfer")}
                      </span>
                      <span className="text-gray400 text-sm mt-1">
                        {("bank transfer desc")}
                      </span>
                      <input
                        type="radio"
                        name="plan"
                        id="plan-bank"
                        value="BANK_TRANSFER"
                        className="absolute h-0 w-0 appearance-none"
                        onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      />
                      <span
                        aria-hidden="true"
                        className={`${
                          paymentMethod === "BANK_TRANSFER" ? "block" : "hidden"
                        } absolute inset-0 border-2 border-gray-500 bg-opacity-10 rounded-lg`}
                      >
                        <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="my-8">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        name="send-email-toggle"
                        id="send-email-toggle"
                        checked={sendEmail}
                        onChange={() => setSendEmail(!sendEmail)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="send-email-toggle"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                    <label
                      htmlFor="send-email-toggle"
                      className="text-xs text-gray-700"
                    >
                      {("Send order email")}
                    </label>
                  </div>
                </div>

                <Button
                  value={("Place order")}
                  size="xl"
                  extraClass={`w-full`}
                  onClick={() => setIsOrdering(true)}
                  disabled={disableOrder}
                />
              </div>

              {orderError !== "" && (
                <span className="text-red text-sm font-semibold">
                  - {orderError}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 mt-6">
            <div className="text-gray-400 text-base">{("Thank you for shopping with us!")}</div>

            <div className="flex flex-col md:flex-row">
              <div className="h-full w-full md:w-1/2 mt-2 lg:mt-4">
                <div className="border border-gray-500 p-6 divide-y-2 divide-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base uppercase mb-3">
                      {("Order id")}
                    </span>
                    <span className="text-base uppercase mb-3">
                      {completedOrder.orderNumber}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{("email address")}</span>
                      <span className="text-base">{auth.user?.email}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{("order date")}</span>
                      <span className="text-base">
                        {new Date(
                          completedOrder.orderDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{("delivery date")}</span>
                      <span className="text-base">
                        {new Date(
                          completedOrder.deliveryDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="py-3">
                    <div className="flex justify-between mb-2">
                      <span className="">{("payment method")}</span>
                      <span>{completedOrder.paymentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="">{("delivery method")}</span>
                      <span>{completedOrder.deliveryType}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between mb-2">
                    <span className="text-base uppercase">{("total")}</span>
                    <span className="text-base">
                      $ {completedOrder.totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-full w-full md:w-1/2 md:ml-8 mt-4 md:mt-2 lg:mt-4">
                <div>
                  {("Your order has been received!")}
                  {completedOrder.paymentType === "BANK_TRANSFER" &&
                    ("Bank transfer completed")}
                  {completedOrder.paymentType === "CASH_ON_DELIVERY" &&
                    completedOrder.deliveryType !== "STORE_PICKUP" &&
                    (" Cash delivered")}
                  {completedOrder.deliveryType === "STORE_PICKUP" &&
                    (" Pick up your delivery at our store.")}
                  {(" Thank you")}
                </div>

                {completedOrder.paymentType === "BANK_TRANSFER" ? (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold">
                      {("our banking details")}
                    </h2>
                    <span className="uppercase block my-1">Laurels Echichinwo :</span>

                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">Zenith Bank</span>
                      <span className="text-base">0012345678</span>
                    </div>
                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">UBA Bank</span>
                      <span className="text-base">23456780959</span>
                    </div>
                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">OPay</span>
                      <span className="text-base">095096051</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-56">
                    <div className="w-3/4">
                    <h1 className="text-4xl font-bold tracking-wide text-center text-purple-700">
  <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600
 text-transparent bg-clip-text">
    LAURELS
  </span>
</h1>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   return {
//     // props: {
//     //   messages,
//     // },
//   };
// };

export default ShoppingCart;