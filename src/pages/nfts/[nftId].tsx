/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header'
import useWeb3Hooks from '../../hooks/useWeb3Hook'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { useRouter } from 'next/router'
import NFTImage from '../../components/NFTImage'

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`
}

export default function NftPage() {
  const { provider } = useWeb3Hooks()
  const [selectedNft, setSelectedNft] = useState(null)
  const [, setListings] = useState([])

  const router = useRouter()

  const nftModule = useMemo(() => {
    if (!provider) return
    const sdk = new ThirdwebSDK(
      provider.getSigner(), // @ts-ignore
      'https://eth-rinkeby.alchemyapi.io/v2/Pvb60G-muS35O-8v836Cl1lhi-h6DDO9'
    )
    return sdk.getNFTModule('0x726ff056130C6511fbfFc3a7286812588FF4B4D1')
  }, [provider])

  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()
      const selectedNftItem = nfts.find((nft) => {
        return nft.id === router.query.nftId
      })
      console.log(selectedNftItem)
      setSelectedNft(selectedNftItem)
    })()
  }, [nftModule, router.query.nftId])

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
      setListings(listings)
    })()
  }, [marketPlaceModule])

  return (
    <>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              {selectedNft && <NFTImage selectedNft={selectedNft} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
