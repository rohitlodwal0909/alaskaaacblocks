import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import SecurityList from './SecurityComponent/SecurityTable';

const Security = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Security ", to: "/" }]}
        title="Security"/>
      <CardBox>
        <SecurityList/>
        </CardBox>
        </>
  )
}

export default Security