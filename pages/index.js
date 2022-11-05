import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'

export default function Home() {
  const handleOnBannerBtnClick = (e) => {
    e.target.innerHTML = 'Loading ...';
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Halal Stores</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText={'View stores nearby'} handleOnClick={handleOnBannerBtnClick} />
        <div className={styles.heroImage}>
          <Image src='/static/hero-image.png' alt='hero image' width={700} height={400} />
        </div>
      </main>

    </div>
  )
}
