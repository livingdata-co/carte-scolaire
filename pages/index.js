import {useContext, useMemo, useState} from 'react'

import DeviceContext from '@/contexts/device.js'

import Page from '@/layouts/main.js'
import {Desktop, Mobile} from '@/layouts/map.js'

const Homepage = () => {
  const {isMobileDevice} = useContext(DeviceContext)
  const [selectedAdresse, setSelectedAdresse] = useState(null)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [collegeFeature, setCollegeFeature] = useState(null)
  const [collegeItineraire, setCollegeItineraire] = useState(null)

  const Layout = useMemo(() => isMobileDevice ? Mobile : Desktop, [isMobileDevice])

  return (
    <Page>
      <Layout
        selectedAdresse={selectedAdresse}
        selectedCollege={selectedCollege}
        collegeFeature={collegeFeature}
        collegeItineraire={collegeItineraire}
        onSelectAdresse={setSelectedAdresse}
        onSelectCollege={setSelectedCollege}
        onSelectCollegeFeature={setCollegeFeature}
        onSelectCollegeItineraire={setCollegeItineraire}
      />
    </Page>
  )
}

export default Homepage
