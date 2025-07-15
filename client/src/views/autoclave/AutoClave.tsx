import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import AutoClaveTable from './AutoclaveComponent.tsx/AutoClaveTable';

const AutoClave = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Autoclave ", to: "/" }]}
        title="Autoclave"/>
         <CardBox>
          <AutoClaveTable/>
        </CardBox>
        </>
  )
}

export default AutoClave