import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

// import ROwaterTable from './ROwaterComponent.tsx/ROwaterTable';

const ROwater = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "RO Water ", to: "/" }]}
        title="RO Water"/>
         <CardBox>
                  <></>   {/* <ROwaterTable/> */}
        </CardBox>
        </>
  )
}

export default ROwater