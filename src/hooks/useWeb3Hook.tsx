import { useWeb3 } from '@3rdweb/hooks'

const useWeb3Hooks = () => {
  const { address, connectWallet, provider } = useWeb3()

  const connect = async () => {
    await connectWallet('injected')
  }

  return { address, connect, provider }
}

export default useWeb3Hooks
