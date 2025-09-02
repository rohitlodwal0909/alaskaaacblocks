import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import SecurityTableDate from './SecurityComponent/SecurityTableDate';

const Security = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Security ", to: "/" }]}
        title="Security"/>
      <CardBox>
        <SecurityTableDate/>
        </CardBox>
        </>
  )
}

export default Security