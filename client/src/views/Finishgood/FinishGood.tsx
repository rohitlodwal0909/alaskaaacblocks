import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import FinishGoodTable from './FinishGoodComponent.tsx/FinishGoodTable';

const FinishGood = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Finish Good ", to: "/" }]}
        title="Finish Good"/>
         <CardBox>
          <></>
          <FinishGoodTable/>
        </CardBox>
        </>
  )
}

export default FinishGood