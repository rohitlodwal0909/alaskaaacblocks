import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import SegregationTable from './SegregationComponent.tsx/SegregationTable';

const Segregation = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Segregation ", to: "/" }]}
        title="Segregation"/>
         <CardBox>
          <SegregationTable/>
        </CardBox>
        </>
  )
}

export default Segregation