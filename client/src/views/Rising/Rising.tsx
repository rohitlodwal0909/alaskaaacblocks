import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import RisingTable from './RisingComponent.tsx/RisingTable';
import CardBox from 'src/components/shared/CardBox';

const Rising = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Rising ", to: "/" }]}
        title="Rising"/>
      <CardBox>
        <RisingTable/>
        </CardBox>
        </>
  )
}

export default Rising