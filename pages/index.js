import {useContext, useMemo} from 'react'

import DeviceContext from '@/contexts/device.js'

import Page from '@/layouts/main.js'
import {Desktop, Mobile} from '@/layouts/map.js'

const Homepage = () => {
  const {isMobileDevice} = useContext(DeviceContext)

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])

  return (
    <Page>
      <Layout />
    </Page>
  )
}

export default Homepage
