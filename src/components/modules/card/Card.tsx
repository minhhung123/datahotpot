/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react";
import Link from "next/link";
import cn from "classnames";
import {TCard} from './types';
import styles from "./Card.module.sass";
import { Icon } from "../icon";
import Interpunct from "react-interpunct";
import { getFileSize } from "../../../../utils/getFileSize";

const Card: FC<TCard> = ({ className, item, text, isBuy }) => {
  console.log('card item', item);
  const href: string = (isBuy) ? ("/buy-details/" + item.itemId) : ("/sell-details/" + item.itemId);

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        <img 
          srcSet={item.thumbnailUrl} 
          src={item.thumbnailUrl}
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
              <div className={styles.files}>{item.fileName}</div>
              <Interpunct />
              <div className={styles.limitSize}>{getFileSize(item.fileSize)}</div>
            </div>
            <div className={styles.avatar}>
              <img 
                src={
                  (isBuy && item.sellerAvatar) ? 
                    item.sellerAvatar : 
                    ((item.ownerAvatar) ? 
                      item.ownerAvatar : 
                      ("/images/content/avatar-user.jpg")
                  )
                  } 
                alt="Avatar" />
            </div> 
        </div>
    </div>
  );
};

export default Card;
