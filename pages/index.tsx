import { NextPage } from 'next'
import Head from 'next/head'
import { Navbar } from '../components/navbar'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, Transaction, PublicKey } from '@solana/web3.js'

const Home: NextPage = () => {
  const { connection } = useConnection()
  const { publicKey, signTransaction, connected } = useWallet()

  const sendTX = async () => {
    if (!connected || !publicKey || !signTransaction) {
      return
    }

    const tx = new Transaction()
    // tx.add() // Don't forget to add some instructions!
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    tx.feePayer = publicKey

    let signed: Transaction | undefined = undefined

    try {
      signed = await signTransaction(tx)
    } catch (e) {
      console.log(e.message)
      return
    }

    let signature: string | undefined = undefined

    try {
      signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature, 'confirmed')
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <div>
      <Head>
        <title>Solana dApp</title>
        <meta name='description' content='Solana dApp Scaffold' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />

      <div className='container'>
        <h1>Connected to: {publicKey?.toBase58()}</h1>
        {connected && (
          <>
            <button className='text-black border-2 rounded border-blue' onClick={()=>sendTX()}>
              Send Signed Transaction
            </button>
          </>
        )}
      </div>

      <footer></footer>
    </div>
  )
}

export default Home
