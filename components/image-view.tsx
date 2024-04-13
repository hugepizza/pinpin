"use client";

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { useEffect, useState } from "react";

function ImageView({ images }: { images: string[] }) {
  const [imageDetails, setImageDetails] = useState<
    {
      src: string;
      w: number;
      h: number;
    }[]
  >([]);
  useEffect(() => {
    const loadImageDetails = async (imageSrc: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            src: imageSrc,
            w: img.width,
            h: img.height,
          });
        };
        img.src = imageSrc;
      });
    };
    const loadAllImages = async () => {
      const promises = images.map((imgSrc) => loadImageDetails(imgSrc));
      const details = await Promise.all(promises);
      setImageDetails(details as any);
    };

    loadAllImages();
  });
  return (
    <div className="text-primary flex flex-row">
      <Gallery options={{ showHideOpacity: true }}>
        {imageDetails.map((img, index) => (
          <Item key={index} original={img.src} width={img.w} height={img.h}>
            {({ ref, open }) =>
              index === 0 ? (
                <a
                  className="flex items-center space-x-1 underline shrink-0"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    open(e);
                  }}
                  ref={ref}
                >
                  <span className="icon-[solar--link-minimalistic-2-outline]" />
                  <span>查看凭证({images.length})</span>
                </a>
              ) : (
                <span ref={ref}></span>
              )
            }
          </Item>
        ))}
        <br />
      </Gallery>
    </div>
  );
}

export default ImageView;
