import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import BoilerTable from './BoilerComponent.tsx/BoilerTable';

const Boiler = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Boiler ", to: "/" }]}
        title="Boiler"/>
         <CardBox>
       
          <BoilerTable/>
        </CardBox>
        </>
  )
}

export default Boiler