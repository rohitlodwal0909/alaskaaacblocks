import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import CuttingTableDate from './CuttingComponent.tsx/CuttingTableDate';

const Cutting = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Cutting ", to: "/" }]}
        title="Cutting"/>
         <CardBox>
        <CuttingTableDate/>
        </CardBox>
        </>
  )
}

export default Cutting