import {useState, useContext, useMemo} from 'react'

import DeviceContext from '@/contexts/device.js'

import Popup from '@/components/popup.js'
import Page from '@/layouts/main.js'
import {Desktop, Mobile} from '@/layouts/map.js'

const Homepage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true)
  const {isMobileDevice} = useContext(DeviceContext)

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])

  return (
    <Page>
      {isPopupOpen && <Popup handleClose={() => setIsPopupOpen(false)} />}
      <Layout />
    </Page>
  )
}

export default Homepage
