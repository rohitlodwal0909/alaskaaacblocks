import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import CuttingTable from './CuttingComponent.tsx/CuttingTable';

const Cutting = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Cutting ", to: "/" }]}
        title="Cutting"/>
         <CardBox>
        <CuttingTable/>
        </CardBox>
        </>
  )
}

export default Cutting