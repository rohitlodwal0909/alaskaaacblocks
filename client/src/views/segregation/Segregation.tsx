import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import SegregationTabledate from './SegregationComponent.tsx/SegregationTabledate';

const Segregation = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Segregation ", to: "/" }]}
        title="Segregation"/>
         <CardBox>
          <SegregationTabledate/>
        </CardBox>
        </>
  )
}

export default Segregation