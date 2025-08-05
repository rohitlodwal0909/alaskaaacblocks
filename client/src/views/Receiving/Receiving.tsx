import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import ReceivingTable from './ReceivingComponent.tsx/ReceivingTable';

const Receiving = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Receiving Stock ", to: "/" }]}
        title="Receiving Stock"/>
         <CardBox>
          <ReceivingTable />
        </CardBox>
        </>
  )
}

export default Receiving