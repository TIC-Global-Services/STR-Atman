import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface UpdateCardProps {
  img: string | StaticImageData;
  title: string;
  desc: string;
  slug?: string;
  isActive?: boolean;
}

const UpdateCard = ({ img, title, desc, slug, isActive }: UpdateCardProps) => {
  return (
    <Link href={slug ? slug : "#"}>
      <div className=" space-y-3">
        <Image
          src={img}
          alt={title}
          width={500}
          height={500}
          className=" aspect-square rounded-lg object-cover object-center "
        />
        {isActive && (
          <>
            <h1 className=" text-3xl capitalize ">{title}</h1>
            <p className=" text-[#505050] text-xl">{desc}</p>
          </>
        )}
      </div>
    </Link>
  );
};

export default UpdateCard;
