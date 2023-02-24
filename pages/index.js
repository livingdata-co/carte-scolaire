import {useContext, useMemo, useState} from 'react'

import DeviceContext from '@/contexts/device.js'

import Page from '@/layouts/main.js'
import {Desktop, Mobile} from '@/layouts/map.js'

const Homepage = () => {
  const {isMobileDevice} = useContext(DeviceContext)
  const [data, setData] = useState(null)

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])

  return (
    <Page>
      <Layout data={data} setData={setData} />
    </Page>
  )
}

export default Homepage
