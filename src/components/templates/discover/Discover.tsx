import React, { useState, FC } from "react";
import cn from "classnames";
import styles from "./Discover.module.sass";
import { Icon } from "../../modules/icon";
import { Card } from "../../modules/card";
import Slider from "react-slick";
import { TSlide, IDiscovery } from "./types";
import { buyNFT } from "../../../../pages/api/contracts/buyNFT";
import { TNFTItem } from "../../../../types/NFTItem";

const SlickArrow: FC<TSlide> = ({children, ...props }) => (
  <button {...props}>{children}</button>
);
const dateOptions = ["Newest", "Oldest"];
const likesOptions = ["Most liked", "Least liked"];
const categoryOptions = ["Music", "Movie", "University", "Education", "NLP"];
const creatorOptions = ["Verified only", "All", "Most liked"];

const Discovery: FC<IDiscovery> = ({ dataNFTs }) => {

  const [search, setSearch] = useState("");

  const handleSubmit = (e:string) => {
    alert();
  };

  const handleBuyItem = async (item: TNFTItem) => {
    const res = await buyNFT(item);
    console.log('buy res', res);
  }

  //setting for slider show
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: (
        <SlickArrow>
            <Icon name="arrow-next" size="14" />
        </SlickArrow>
    ),
    prevArrow: (
        <SlickArrow>
            <Icon name="arrow-prev" size="14" />
        </SlickArrow>
    ),
    responsive: [
        {
          breakpoint: 1179,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 1023,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            infinite: true,
          },
        },
      ],
  };

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.top}>
          <div className={styles.title}>Find Your Datasets</div>
          <form
            className={styles.search}
            action=""
            onSubmit={() => console.log('a')}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search ..."
              required
            />
            <button className={styles.result}>
              <Icon name="search" size="16" />
            </button>
          </form>
        </div>
        <div className={styles.wrapper}> 
            <div className={styles.arow}>
                <div className={styles.tag}>
                  <Icon name="lightning" size="20" />
                  <div>All Categories</div>
                </div>
                <Slider className="popular-slider" {...settings}>
                    {dataNFTs?.map((x, index) => (
                        <Card 
                          className={styles.card} 
                          text="Buy"
                          item={x} 
                          key={index} 
                          isBuy={true}
                        />
                    ))}
                </Slider>
            </div>
            {categoryOptions.map((category, index) => (
                <div key={index} className={styles.arow}>
                    <div className={styles.tag}>
                      <Icon name="lightning" size="20" />
                      <div>{category}</div>
                    </div>
                    <Slider className="popular-slider" {...settings}>
                      {
                        dataNFTs?.filter((nft) => nft.tags.includes(category))
                          .map((x, index) => (
                            <Card 
                              className={styles.card} 
                              text="Buy"
                              item={x} 
                              key={index} 
                              isBuy={true}
                            />
                        ))
                      }
                    </Slider>
                </div>
            ))}
            <div className={styles.btns}>
              <button className={cn("button-stroke", styles.button)}>
                <span>Load more</span>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Discovery;
