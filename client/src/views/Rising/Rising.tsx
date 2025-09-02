import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import RisingTableDate from './RisingComponent.tsx/RisingTableDate';

const Rising = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Rising ", to: "/" }]}
        title="Rising"/>
      <CardBox>
        <RisingTableDate/>
        </CardBox>
        </>
  )
}

export default Rising