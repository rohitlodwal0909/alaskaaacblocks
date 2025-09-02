import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import AutoclaveTableDate from './AutoclaveComponent.tsx/AutoClaveTableDate';

const AutoClave = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Autoclave", to: "/" }]}
        title="Autoclave"/>
         <CardBox>
          <AutoclaveTableDate/>
        </CardBox>
        </>
  )
}

export default AutoClave