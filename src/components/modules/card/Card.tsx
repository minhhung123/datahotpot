/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react";
import Link from "next/link";
import cn from "classnames";
import { CustomLink } from "../customLink/index";
import {TCard} from './types';
import styles from "./Card.module.sass";
import { Icon } from "../icon";
import Interpunct from "react-interpunct";

const Card: FC<TCard> = ({ className, item, text }) => {
  const href: string = "/buy-details/" + item.itemId;

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        <img 
          srcSet={`/images/content/card-pic-1@2x.jpg 2x`} 
          src="/images/content/card-pic-1.jpg" 
          alt="Card" 
        />
        <div className={styles.control}>
          <Link href={href}>
            <button 
              className={cn("button-small", styles.button)}
            >
              <span>{text}</span>
              <Icon name="scatter-up" size="16" />
            </button>
          </Link>
          <div className={styles.category}>
          <button 
            className={cn("button-small", styles.button)}
          >
            <span>View Detail</span>
            <Icon name="scatter-up" size="16" />
          </button>
        </div>
        </div>
      </div>
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.name}</div>
            <div className={styles.price}>{item.price} FIL</div>
          </div>
          <div className={styles.line}/>
        </div>
        <div className={styles.foot}>
            <div className = {styles.line2}>
              <div className={styles.files}>1 file (CSV)</div>
              <Interpunct></Interpunct>
              <div className={styles.limitSize}>3 MB</div>
            </div>
            <div className={styles.avatar}>
              <img src="/images/content/avatar-1.jpg" alt="Avatar" />
            </div> 
        </div>
    </div>
  );
};

export default Card;
