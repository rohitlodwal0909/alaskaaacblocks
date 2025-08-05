import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import DieselTable from './DieselComponent.tsx/DieselTable';

const Diesel = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Diesel Fuel ", to: "/" }]}
        title="Diesel Fuel"/>
         <CardBox>
          <></>
          <DieselTable/>
        </CardBox>
        </>
  )
}

export default Diesel