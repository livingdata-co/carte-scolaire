import Image from 'next/image'

import colors from '@/styles/colors'

const Header = () => (
  <header>
    <Image src='/images/logo-ld-short.png' width={50} height={56} />
    <div className='head-title-container'>
      <h1>Carte scolaire</h1>
    </div>

    <style jsx>{`
      header {
        margin: 0;
        padding: 1.5em 0em 1.5em 3em;
        color: ${colors.white};
        background: ${colors.darkGrey};
        display: flex;
        gap: 3em;
      }

      .head-title-container {
        display: flex;
        align-items: center;
        height: 56px;
        border-left: 4px solid rgba(255, 255, 255, 0.33);
        padding-left: 10px;
      }
    `}</style>
  </header>
)

export default Header
