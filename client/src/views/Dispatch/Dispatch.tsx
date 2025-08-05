import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import DispatchTable from './DispatchComponent.tsx/DispatchTable';

const Dispatch = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Dispatch ", to: "/" }]}
        title="Dispatch"/>
         <CardBox>
          <DispatchTable/>
        </CardBox>
        </>
  )
}

export default Dispatch