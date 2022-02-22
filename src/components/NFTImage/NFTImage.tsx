/* eslint-disable @next/next/no-img-element */
import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'

const style = {
  topBar: `bg-[#303339] p-2 rounded-t-lg border-[#151c22] border`,
  topBarContent: `flex items-center`,
  likesCounter: `flex-1 flex items-center justify-end`
}

export default function NFTImage({ selectedNft }) {
  return (
    <div>
      <div className={style.topBar}>
        <div className={style.topBarContent}>
          <IoMdSnow />
          <div className={style.likesCounter}>
            <AiOutlineHeart />
            2.3k
          </div>
        </div>
      </div>
      <div>
        <img src={selectedNft?.image} alt={selectedNft?.name} />
      </div>
    </div>
  )
}
