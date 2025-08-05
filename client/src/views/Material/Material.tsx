import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import MaterialTable from './MaterialComponent.tsx/MaterialTable';

const Material = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Material ", to: "/" }]}
        title="Material"/>
         <CardBox>
          <MaterialTable/>
        </CardBox>
        </>
  )
}

export default Material