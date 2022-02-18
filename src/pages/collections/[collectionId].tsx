/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { client } from '../../lib/sanityClient'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
// import Card from '../../components/Card'
import Header from '../../components/Header'

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`
}

interface CollectionProps {
  allOwners: any[]
  bannerImageUrl: string
  contractAddress: string
  createdBy: { _ref: string; _type: string }
  creator: string
  description: string
  floorPrice: number
  imageUrl: string
  title: string
  volumeTraded: number
}

export default function Collection() {
  const router = useRouter()
  const { provider } = useWeb3()
  const { collectionId } = router.query

  const [collection, setCollection] = useState<CollectionProps>(
    {} as CollectionProps
  )
  const [nfts, setNfts] = useState([])
  const [, setListings] = useState([])

  const nftModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner(), // @ts-ignore
      'https://eth-rinkeby.alchemyapi.io/v2/Pvb60G-muS35O-8v836Cl1lhi-h6DDO9'
    )

    return sdk.getNFTModule(String(collectionId))
  }, [collectionId, provider])

  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()
      console.log(nfts)
      setNfts(nfts)
    })()
  }, [nftModule])

  const marketPlaceModule = useMemo(() => {
    if (!provider) return
    const sdk = new ThirdwebSDK(
      provider.getSigner(), // @ts-ignore
      'https://eth-rinkeby.alchemyapi.io/v2/Pvb60G-muS35O-8v836Cl1lhi-h6DDO9'
    )
    return sdk.getMarketplaceModule(
      '0xaA75b56B7043D1F6be3a4270BA89C8992935Ed1A'
    )
  }, [provider])

  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      const listings = await marketPlaceModule.getAllListings()
      console.log(listings)
      setListings(listings)
    })()
  }, [marketPlaceModule])

  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}"] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title,
      floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)
    console.log(collectionData)
    setCollection(collectionData[0])
  }

  useEffect(() => {
    if (!collectionId) return
    fetchCollectionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId])
  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          src={collection.bannerImageUrl ?? 'https://via.placeholder.com/200'}
          alt=""
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={collection?.imageUrl ?? 'https://via.placeholder.com/200'}
            alt="profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{' '}
            <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>Items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {collection?.allOwners?.length ?? ''}
              </div>
              <div className={style.statName}>Owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                />
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>Floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                />
                {collection?.volumeTraded}k
              </div>
              <div className={style.statName}>Volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
    </div>
  )
}
