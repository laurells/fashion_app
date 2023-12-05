import React from "react";
import Head from "next/head";

type Props = {
  title?: string;
  desc?: string;
  keywords?: string;
};

// "Discover affordable and fashionable men's and women's clothing online at laurels Fashion. Free Returns ✓ 1000+ New Arrivals Dropped Daily."
const defaultDesc =
  "Laurels Fashion e-commerce developed with Next.JS. Coded be Laurels Echichinwo.";
const defaultKeywords =
  "Laurels Fashion, Online Shop, E-commerce, Laurels Echichinwo, NextJS";

const AppHeader: React.FC<Props> = ({
  title = "Laurels Fashion",
  desc = defaultDesc,
  keywords = defaultKeywords,
}) => {
  return (
    <Head>
      <title>{title}</title>

      <meta content={desc} name="description" key="description" />
      <meta content={keywords} name="keywords" key="keywords" />
      <meta property="og:description" content={desc} key="og_description" />
      <meta property="og:title" content={title} key="og_title" />
      <meta name="twitter:title" content={title} key="twitter_title" />
      <meta
        name="twitter:description"
        content={desc}
        key="twitter_description"
      />
    </Head>
  );
};

export default AppHeader;