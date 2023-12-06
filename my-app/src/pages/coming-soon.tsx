import Image from "next/image";
import Link from "next/link";
import AppHeader from "../components/Header/AppHeader";

const ComingSoon = () => {
  return (
    <>
      <AppHeader title="Coming Soon!" />
      <div className="flex flex-col h-screen justify-center items-center">
        <h1 className="text-3xl tracking-wider leading-10">
          {("coming soon...")}
        </h1>
        <h2 className="text-2xl text-gray-500 mt-2">
          {("Page not created")}
        </h2>
        <Image
          src="/images/coding.svg"
          alt="Not created yet"
          width={400}
          height={300}
        />
        <span className="text-gray-400">
          {("Go back to")}{" "}
          <Link href="/"
             className="underline font-bold hover:text-gray-500">Home Page
          </Link>
          ?
        </span>
      </div>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   return {
//     props: {
//       messages: (await import(`../messages/common/${locale}.json`)).default,
//     },
//   };
// };

export default ComingSoon;