import {useRouter} from 'next/router'

export default function Collection() {
  const router = useRouter()
 const {collectionId} = router.query
  return (
    <div>{collectionId}</div>
  )
}
