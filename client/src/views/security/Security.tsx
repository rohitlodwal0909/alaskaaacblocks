import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

// import SecurityTable from './SecurityComponent.tsx/SecurityTable';

const Security = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Security ", to: "/" }]}
        title="Security"/>
         <CardBox>
          <></>
          {/* <SecurityTable/> */}
        </CardBox>
        </>
  )
}

export default Security